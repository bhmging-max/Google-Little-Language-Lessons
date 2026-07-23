import { z } from "zod";
import { prompt } from "./prompt";

export const wordCamSchema = z.object({
  items: z.array(z.object({
    object: z.string(),
    translation: z.string(),
    pronunciation: z.string(),
    sentence: z.string(),
    sentenceTranslation: z.string(),
    category: z.string(),
  })),
});

export async function generateImageVocabulary(language, imageBase64) {
  const response = await fetch('/api/analyze-image', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ language, image: imageBase64 }),
  });

  if (!response.ok) {
    throw new Error('Failed to analyze image');
  }

  const data = await response.json();
  return data;
}

export { prompt };
