import { NextResponse } from 'next/server';
import { lessonSchema, prompt } from '@/app/tiny-lesson/api';

export async function POST(req) {
  try {
    const body = await req.json();
    const { topic, targetLanguage, nativeLanguage, skillLevel } = body;

    const systemPrompt = prompt.system(targetLanguage, nativeLanguage, skillLevel);
    const userPrompt = prompt.user(topic);

    // Strategy 1: Cloudflare Worker AI (OpenAI compatible)
    try {
      console.log('Attempting Cloudflare Worker AI for lesson generation...');
      const response = await fetch(`${process.env.AI_BASE_URL}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.AI_API_KEY}`
        },
        body: JSON.stringify({
          model: process.env.AI_MODEL_NAME || 'gemini-2.0-flash',
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt }
          ],
          response_format: { type: 'json_object' }
        })
      });

      if (response.ok) {
        const data = await response.json();
        const content = data.choices[0].message.content;
        const parsed = JSON.parse(content);
        const validated = lessonSchema.safeParse(parsed);
        if (validated.success) {
          return NextResponse.json(validated.data);
        } else {
          console.warn('Cloudflare validation failed, falling back...');
        }
      } else {
         console.warn(`Cloudflare failed with status: ${response.status}, falling back...`);
      }
    } catch (e) {
      console.warn('Cloudflare request error:', e.message);
    }

    // Strategy 2: Direct Gemini API
    try {
      console.log('Attempting Direct Gemini API for lesson generation...');
      const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`;
      const response = await fetch(geminiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          contents: [{
            parts: [{ text: `${systemPrompt}\n\n${userPrompt}` }]
          }],
          generationConfig: {
            responseMimeType: 'application/json'
          }
        })
      });

      if (response.ok) {
        const data = await response.json();
        const content = data.candidates[0].content.parts[0].text;
        const parsed = JSON.parse(content);
        const validated = lessonSchema.safeParse(parsed);
        if (validated.success) {
          return NextResponse.json(validated.data);
        } else {
           console.warn('Gemini validation failed, falling back to demo...');
        }
      } else {
         console.warn(`Gemini failed with status: ${response.status}, falling back to demo...`);
      }
    } catch (e) {
      console.warn('Gemini request error:', e.message);
    }

    // Strategy 3: Fallback demo data
    console.log('Returning fallback demo lesson...');
    const demoLesson = {
      title: "Ordering Food in French",
      topic: "Ordering at a Restaurant",
      introduction: "Welcome to this essential French lesson! Knowing how to order food confidently is a key step to enjoying the rich culinary culture of France. Let's learn the basic vocabulary and expressions you'll need for a great dining experience.",
      vocabulary: [
        { word: "la carte", translation: "the menu", pronunciation: "lah kahrt" },
        { word: "l'addition", translation: "the bill", pronunciation: "lah-dee-syohn" },
        { word: "je voudrais", translation: "I would like", pronunciation: "zhuh voo-dray" },
        { word: "s'il vous plaît", translation: "please", pronunciation: "seel voo play" },
        { word: "de l'eau", translation: "some water", pronunciation: "duh loh" },
        { word: "un verre", translation: "a glass", pronunciation: "uhn vair" },
        { word: "délicieux", translation: "delicious", pronunciation: "day-lee-syuh" },
        { word: "le serveur", translation: "the waiter", pronunciation: "luh sair-vuhr" }
      ],
      phrases: [
        {
          target: "Bonjour, je voudrais une table pour deux.",
          translation: "Hello, I would like a table for two.",
          explanation: "A standard greeting when entering a restaurant."
        },
        {
          target: "Puis-je avoir la carte, s'il vous plaît ?",
          translation: "May I have the menu, please?",
          explanation: "Polite way to ask for the menu."
        },
        {
          target: "Je vais prendre le poulet rôti.",
          translation: "I will have the roast chicken.",
          explanation: "'Je vais prendre' is the most common way to state your order."
        },
        {
          target: "L'addition, s'il vous plaît.",
          translation: "The bill, please.",
          explanation: "Used at the end of the meal to ask to pay."
        },
        {
          target: "Une carafe d'eau, s'il vous plaît.",
          translation: "A jug of tap water, please.",
          explanation: "In France, tap water is free and it's very common to ask for a 'carafe'."
        },
        {
          target: "C'était très bon, merci.",
          translation: "It was very good, thank you.",
          explanation: "A polite compliment to the chef/restaurant."
        }
      ],
      tips: [
        {
          title: "Service is included",
          content: "In France, service is legally included in the price of your meal. You don't have to leave a tip, though leaving a few coins for excellent service is appreciated."
        },
        {
          title: "Bread is endless",
          content: "Restaurants usually serve a basket of baguette with your meal, and it's generally free to ask for a refill!"
        }
      ],
      practice: "Try reading the phrases aloud 3 times, focusing on the pronunciation. Imagine you are sitting at a Parisian cafe. Next time you eat out, try translating your real order into French in your head."
    };

    return NextResponse.json(demoLesson);

  } catch (error) {
    console.error('Error generating lesson:', error);
    return NextResponse.json({ error: 'Failed to process request' }, { status: 500 });
  }
}
