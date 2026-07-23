import { NextResponse } from 'next/server';
import { prompt } from '@/app/word-cam/prompt';

const fallbackData = {
  items: [
    { object: "Silla", translation: "Chair", pronunciation: "see-yah", sentence: "La silla es cómoda.", sentenceTranslation: "The chair is comfortable.", category: "Furniture" },
    { object: "Mesa", translation: "Table", pronunciation: "meh-sah", sentence: "El libro está en la mesa.", sentenceTranslation: "The book is on the table.", category: "Furniture" },
    { object: "Ventana", translation: "Window", pronunciation: "ven-tah-nah", sentence: "Abre la ventana, por favor.", sentenceTranslation: "Open the window, please.", category: "House" },
    { object: "Puerta", translation: "Door", pronunciation: "pwer-tah", sentence: "Cierra la puerta.", sentenceTranslation: "Close the door.", category: "House" },
    { object: "Libro", translation: "Book", pronunciation: "lee-bro", sentence: "Me gusta leer este libro.", sentenceTranslation: "I like to read this book.", category: "Study" },
    { object: "Bolígrafo", translation: "Pen", pronunciation: "bo-lee-grah-fo", sentence: "Necesito un bolígrafo para escribir.", sentenceTranslation: "I need a pen to write.", category: "Study" },
    { object: "Taza", translation: "Cup", pronunciation: "tah-sah", sentence: "Una taza de café caliente.", sentenceTranslation: "A hot cup of coffee.", category: "Kitchen" },
    { object: "Lámpara", translation: "Lamp", pronunciation: "lahm-pah-rah", sentence: "Enciende la lámpara.", sentenceTranslation: "Turn on the lamp.", category: "Furniture" }
  ]
};

export async function POST(req) {
  try {
    const { language, image } = await req.json();

    if (!image) {
      return NextResponse.json({ error: "No image provided" }, { status: 400 });
    }

    // Try Cloudflare AI first
    const cfAiUrl = process.env.CLOUDFLARE_AI_URL;
    if (cfAiUrl) {
      try {
        const cfResponse = await fetch(cfAiUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            messages: [
              { role: "system", content: prompt + `\nThe target language is ${language}.` },
              { role: "user", content: "Analyze this image and identify the objects in it. Reply ONLY with the requested JSON format." }
            ],
            image: image
          }),
        });
        
        if (cfResponse.ok) {
          const cfData = await cfResponse.json();
          const textResponse = cfData?.result?.response || cfData.text || "{}";
          const jsonMatch = textResponse.match(/```json\n([\s\S]*?)\n```/) || textResponse.match(/\{[\s\S]*\}/);
          if (jsonMatch) {
            const parsed = JSON.parse(jsonMatch[1] || jsonMatch[0]);
            if (parsed.items && Array.isArray(parsed.items)) {
              return NextResponse.json(parsed);
            }
          }
        }
      } catch (e) {
        console.error("Cloudflare AI error:", e);
      }
    }

    // Try Gemini if CF fails
    const geminiKey = process.env.GEMINI_API_KEY;
    if (geminiKey) {
      try {
        const base64Data = image.replace(/^data:image\/\w+;base64,/, "");
        const mimeType = image.match(/^data:(image\/\w+);base64,/)?.[1] || "image/jpeg";
        
        const geminiResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${geminiKey}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            system_instruction: {
              parts: [{ text: prompt + `\nThe target language is ${language}. Reply ONLY with JSON.` }]
            },
            contents: [{
              parts: [
                { text: "Analyze this image and list the objects according to the system instructions." },
                { inline_data: { mime_type: mimeType, data: base64Data } }
              ]
            }],
            generationConfig: {
              response_mime_type: "application/json",
            }
          })
        });

        if (geminiResponse.ok) {
          const geminiData = await geminiResponse.json();
          const textResponse = geminiData.candidates?.[0]?.content?.parts?.[0]?.text;
          if (textResponse) {
            const parsed = JSON.parse(textResponse);
            if (parsed.items && Array.isArray(parsed.items)) {
              return NextResponse.json(parsed);
            }
          }
        }
      } catch (e) {
        console.error("Gemini AI error:", e);
      }
    }

    // Fallback if both fail
    return NextResponse.json(fallbackData);
  } catch (error) {
    console.error("Analyze image route error:", error);
    return NextResponse.json(fallbackData);
  }
}
