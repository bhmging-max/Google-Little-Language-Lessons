import { NextResponse } from "next/server";

const MAX_TEXT_LENGTH = 500;
const MAX_RETRIES = 1;

/**
 * Fetch audio from Google TTS with retry logic
 */
async function fetchWithRetry(url, retries = 0) {
  try {
    const response = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
      },
    });

    if (!response.ok) {
      if (retries < MAX_RETRIES) {
        console.warn(\`TTS fetch failed (\${response.status}), retrying...\`);
        return await fetchWithRetry(url, retries + 1);
      }
      throw new Error(\`Failed to fetch TTS: \${response.statusText} (\${response.status})\`);
    }

    return response;
  } catch (error) {
    if (retries < MAX_RETRIES) {
      console.warn(\`TTS fetch error: \${error.message}, retrying...\`);
      return await fetchWithRetry(url, retries + 1);
    }
    throw error;
  }
}

/**
 * Route handler for Text-to-Speech proxy
 * This avoids CORS issues by proxying requests through the server
 */
export async function GET(request) {
  try {
    // Parse URL and get search params
    const { searchParams } = new URL(request.url);

    // Required parameters
    const text = searchParams.get("text");
    const lang = searchParams.get("lang") || "en";

    // Optional parameters
    const slow = searchParams.get("slow") === "true";

    // Validate text parameter
    if (!text) {
      return NextResponse.json(
        { error: "Missing required parameter: text" },
        { status: 400 }
      );
    }

    // Check text length
    if (text.length > MAX_TEXT_LENGTH) {
      return NextResponse.json(
        { error: \`Text must be \${MAX_TEXT_LENGTH} characters or less\` },
        { status: 400 }
      );
    }

    // Create Google TTS URL
    const googleTTSParams = new URLSearchParams({
      ie: "UTF-8",
      q: text,
      tl: lang,
      total: "1",
      idx: "0",
      textlen: text.length.toString(),
      client: "tw-ob",
      prev: "input",
      ttsspeed: slow ? "0.24" : "1",
    });

    const googleTTSUrl = \`https://translate.google.com/translate_tts?\${googleTTSParams.toString()}\`;

    // Fetch audio from Google TTS
    const response = await fetchWithRetry(googleTTSUrl);

    // Get audio data
    const audioBuffer = await response.arrayBuffer();

    // Return the audio with appropriate headers
    return new NextResponse(audioBuffer, {
      headers: {
        "Content-Type": "audio/mpeg",
        "Content-Length": audioBuffer.byteLength.toString(),
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch (error) {
    console.error("TTS Proxy Error:", error);
    return NextResponse.json(
      { error: "Failed to process TTS request", details: error.message },
      { status: 500 }
    );
  }
}
