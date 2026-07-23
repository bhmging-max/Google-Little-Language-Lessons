import { NextResponse } from 'next/server';
import { conversationSchema, prompt } from '@/app/slang-hang/api';

export async function POST(req) {
  try {
    const body = await req.json();
    const { topic, targetLanguage, nativeLanguage, skillLevel } = body;

    const systemPrompt = prompt.system(targetLanguage, nativeLanguage, skillLevel);
    const userPrompt = prompt.user(topic);

    // Strategy 1: Cloudflare Worker AI (OpenAI compatible)
    try {
      console.log('Attempting Cloudflare Worker AI for conversation generation...');
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
        const validated = conversationSchema.safeParse(parsed);
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
      console.log('Attempting Direct Gemini API for conversation generation...');
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
        const validated = conversationSchema.safeParse(parsed);
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
    console.log('Returning fallback demo conversation...');
    const demoConversation = {
      title: "Tacos al Pastor",
      context: {
        setting: "A bustling street taco stand in Mexico City late at night.",
        speakers: [
          { name: "Mateo", role: "Local resident, hungry after a long day." },
          { name: "Don Luis", role: "The taquero, friendly and fast." }
        ],
        scenario: "Mateo is ordering his favorite tacos and having a quick chat with the taquero."
      },
      messages: [
        {
          speaker: "Mateo",
          text: "¡Qué onda, Don Luis! ¿Cómo anda la cosa?",
          translation: "What's up, Don Luis! How are things going?",
          notes: "'¿Qué onda?' is a very common informal greeting in Mexico, like 'What's up?'"
        },
        {
          speaker: "Don Luis",
          text: "¡Quiúbole, Mateo! Aquí nomás, dándole duro. ¿Te sirvo lo de siempre?",
          translation: "Hey Mateo! Right here, working hard. Shall I serve you the usual?",
          notes: "'Quiúbole' is another friendly slang greeting. 'Dándole duro' means working hard."
        },
        {
          speaker: "Mateo",
          text: "Simón. Ponme cinco al pastor, bien doraditos, porfa.",
          translation: "Yeah. Give me five al pastor, nice and crispy, please.",
          notes: "'Simón' is slang for 'yes'. 'Doraditos' means slightly toasted or crispy."
        },
        {
          speaker: "Don Luis",
          text: "Sale y vale. ¿Con todo o le quitamos algo?",
          translation: "Alrighty. With everything or should we take something off?",
          notes: "'Sale y vale' means okay/alright. 'Con todo' usually means cilantro and onion."
        },
        {
          speaker: "Mateo",
          text: "Con todo, jefe. Y que piquen, que ando crudo.",
          translation: "With everything, boss. And make them spicy, I'm hungover.",
          notes: "'Jefe' is a respectful but casual way to address someone. 'Crudo' means hungover."
        },
        {
          speaker: "Don Luis",
          text: "Híjole, pues te voy a echar de la roja que pica sabroso. Aguanta un ratito.",
          translation: "Oh man, well I'm going to give you the red one that has a tasty kick. Hold on a bit.",
          notes: "'Híjole' expresses surprise or emphasis. 'Aguanta' means to hold on or wait."
        },
        {
          speaker: "Mateo",
          text: "Chido. Oye, ¿has visto al Güero últimamente?",
          translation: "Cool. Hey, have you seen 'El Güero' lately?",
          notes: "'Chido' means cool or good. 'Güero' is a common nickname for someone light-skinned or blonde."
        },
        {
          speaker: "Don Luis",
          text: "Nel, lleva días sin asomarse. Creo que anda chambeando fuera.",
          translation: "Nope, he hasn't shown up in days. I think he's working out of town.",
          notes: "'Nel' is a slang word for 'no'. 'Chambeando' means working."
        },
        {
          speaker: "Don Luis",
          text: "Aquí tienes, mijo. Cuidado que el plato quema.",
          translation: "Here you go, son. Be careful, the plate is hot.",
          notes: "'Mijo' is an affectionate term (from 'mi hijo', my son)."
        },
        {
          speaker: "Mateo",
          text: "¡Órale, huelen brutal! Gracias, Don Luis. Ahorita te pago.",
          translation: "Wow, they smell amazing! Thanks, Don Luis. I'll pay you in a bit.",
          notes: "'Órale' is versatile; here it expresses excitement. 'Brutal' is slang for awesome/amazing."
        }
      ],
      slangTerms: [
        {
          term: "¿Qué onda?",
          meaning: "What's up? / How are you?",
          usage: "Very common informal greeting used among friends or acquaintances in Mexico."
        },
        {
          term: "Simón",
          meaning: "Yes / Yeah",
          usage: "A casual, colloquial way to say 'yes', often used in relaxed conversations."
        },
        {
          term: "Chido",
          meaning: "Cool / Nice / Good",
          usage: "Used to describe something positive or to express agreement."
        },
        {
          term: "Chambear",
          meaning: "To work",
          usage: "Informal verb for working. Noun form is 'chamba' (job/work)."
        },
        {
          term: "Órale",
          meaning: "Wow / Alright / Come on / Okay",
          usage: "A very versatile Mexican expression used to encourage, agree, or show surprise."
        }
      ]
    };

    return NextResponse.json(demoConversation);

  } catch (error) {
    console.error('Error generating conversation:', error);
    return NextResponse.json({ error: 'Failed to process request' }, { status: 500 });
  }
}
