"use client";

// Browser-compatible implementation based on @sefinek/google-tts-api and Web Speech API
// Map language names to Google TTS language codes (BCP-47)
const languageCodeMap = {
  // Language labels with BCP-47 codes
  English: "en",
  "English (US)": "en-US",
  "English (UK)": "en-GB",
  "English (AU)": "en-AU",
  Español: "es-ES",
  Spanish: "es-ES",
  "Spanish (Spain)": "es-ES",
  "Spanish (LatAm)": "es-419",
  Français: "fr-FR",
  French: "fr-FR",
  "French (France)": "fr-FR",
  "French (Canada)": "fr-CA",
  "Português brasileiro": "pt-BR",
  Portuguese: "pt-PT",
  "Portuguese (Brazil)": "pt-BR",
  "Portuguese (Portugal)": "pt-PT",
  Arabic: "ar-XA",
  Chinese: "zh",
  "Chinese (China)": "zh-CN",
  "Chinese (Hong Kong)": "zh-HK",
  "Chinese (Taiwan)": "zh-TW",
  German: "de-DE",
  Greek: "el-GR",
  Hebrew: "he-IL",
  Hindi: "hi-IN",
  Italian: "it-IT",
  Japanese: "ja-JP",
  Korean: "ko-KR",
  Russian: "ru-RU",
  Turkish: "tr-TR",
  Dutch: "nl-NL",
  Indonesian: "id-ID",
  Polish: "pl-PL",
  Thai: "th-TH",
  Vietnamese: "vi-VN",
  Czech: "cs-CZ",
  Danish: "da-DK",
  Finnish: "fi-FI",
  Norwegian: "no-NO",
  Swedish: "sv-SE",
  Bengali: "bn-IN",
  Bulgarian: "bg-BG",
  Croatian: "hr-HR",
  Filipino: "fil-PH",
  Hungarian: "hu-HU",
  Latvian: "lv-LV",
  Lithuanian: "lt-LT",
  Romanian: "ro-RO",
  Serbian: "sr-RS",
  Slovak: "sk-SK",
  Slovenian: "sl-SI",
  Ukrainian: "uk-UA",
  Malay: "ms-MY",
  Estonian: "et-EE",
  Afrikaans: "af-ZA",
  Albanian: "sq-AL",
  Amharic: "am-ET",
  Armenian: "hy-AM",
  Azerbaijani: "az-AZ",
  Basque: "eu-ES",
  Bosnian: "bs-BA",
  Catalan: "ca-ES",
  Georgian: "ka-GE",
  Gujarati: "gu-IN",
  Icelandic: "is-IS",
  Kannada: "kn-IN",
  Kazakh: "kk-KZ",
  Khmer: "km-KH",
  Macedonian: "mk-MK",
  Malayalam: "ml-IN",
  Marathi: "mr-IN",
  Nepali: "ne-NP",
  Persian: "fa-IR",
  Punjabi: "pa-IN",
  Sinhala: "si-LK",
  Swahili: "sw-KE",
  Tamil: "ta-IN",
  Telugu: "te-IN",
  Urdu: "ur-PK",
  Zulu: "zu-ZA",

  // Language values (lowercase) mapped to BCP-47 codes
  english: "en-US",
  english_us: "en-US",
  english_uk: "en-GB",
  english_au: "en-AU",
  spanish: "es-ES",
  spanish_sp: "es-ES",
  spanish_la: "es-419",
  french: "fr-FR",
  french_fr: "fr-FR",
  french_ca: "fr-CA",
  portuguese: "pt-PT",
  portuguese_br: "pt-BR",
  portuguese_pt: "pt-PT",
  arabic: "ar-XA",
  chinese: "zh",
  chinese_cn: "zh-CN",
  chinese_hk: "zh-HK",
  chinese_tw: "zh-TW",
  german: "de-DE",
  greek: "el-GR",
  hebrew: "he-IL",
  hindi: "hi-IN",
  italian: "it-IT",
  japanese: "ja-JP",
  korean: "ko-KR",
  russian: "ru-RU",
  turkish: "tr-TR",
  dutch: "nl-NL",
  indonesian: "id-ID",
  polish: "pl-PL",
  thai: "th-TH",
  vietnamese: "vi-VN",
  czech: "cs-CZ",
  danish: "da-DK",
  finnish: "fi-FI",
  norwegian: "no-NO",
  swedish: "sv-SE",
  bengali: "bn-IN",
  bulgarian: "bg-BG",
  croatian: "hr-HR",
  filipino: "fil-PH",
  hungarian: "hu-HU",
  latvian: "lv-LV",
  lithuanian: "lt-LT",
  romanian: "ro-RO",
  serbian: "sr-RS",
  slovak: "sk-SK",
  slovenian: "sl-SI",
  ukrainian: "uk-UA",
  malay: "ms-MY",
  estonian: "et-EE",
  afrikaans: "af-ZA",
  albanian: "sq-AL",
  amharic: "am-ET",
  armenian: "hy-AM",
  azerbaijani: "az-AZ",
  basque: "eu-ES",
  bosnian: "bs-BA",
  catalan: "ca-ES",
  georgian: "ka-GE",
  gujarati: "gu-IN",
  icelandic: "is-IS",
  kannada: "kn-IN",
  kazakh: "kk-KZ",
  khmer: "km-KH",
  macedonian: "mk-MK",
  malayalam: "ml-IN",
  marathi: "mr-IN",
  nepali: "ne-NP",
  persian: "fa-IR",
  punjabi: "pa-IN",
  sinhala: "si-LK",
  swahili: "sw-KE",
  tamil: "ta-IN",
  telugu: "te-IN",
  urdu: "ur-PK",
  zulu: "zu-ZA",
};

let voicesCache = null;
let currentAudio = null;

/**
 * Check if Web Speech API is supported
 * @returns {boolean}
 */
export function isSpeechSupported() {
  return typeof window !== "undefined" && "speechSynthesis" in window;
}

/**
 * Load voices asynchronously
 * @returns {Promise<SpeechSynthesisVoice[]>}
 */
function loadVoices() {
  return new Promise((resolve) => {
    if (!isSpeechSupported()) {
      resolve([]);
      return;
    }

    if (voicesCache && voicesCache.length > 0) {
      resolve(voicesCache);
      return;
    }

    const voices = window.speechSynthesis.getVoices();
    if (voices.length > 0) {
      voicesCache = voices;
      resolve(voices);
      return;
    }

    window.speechSynthesis.onvoiceschanged = () => {
      voicesCache = window.speechSynthesis.getVoices();
      resolve(voicesCache);
    };
    
    // Fallback if event doesn't fire
    setTimeout(() => {
      voicesCache = window.speechSynthesis.getVoices();
      resolve(voicesCache);
    }, 1000);
  });
}

/**
 * Find the best quality voice available for a language
 * @param {string} langCode - Language code (e.g., 'en-US')
 * @returns {Promise<SpeechSynthesisVoice|null>}
 */
export async function getBestVoice(langCode) {
  if (!isSpeechSupported()) return null;

  const voices = await loadVoices();
  if (!voices || voices.length === 0) return null;

  const baseLang = langCode.split('-')[0];
  
  const matchingVoices = voices.filter(voice => {
    return voice.lang === langCode || 
           voice.lang.replace('_', '-') === langCode ||
           voice.lang.startsWith(baseLang);
  });

  if (matchingVoices.length === 0) return null;

  // Score voices based on quality keywords
  const scoreVoice = (voice) => {
    let score = 0;
    const name = voice.name.toLowerCase();
    
    // High priority: Neural and Natural voices
    if (name.includes('neural') || name.includes('natural')) score += 10;
    
    // Medium priority: Premium, Enhanced
    if (name.includes('premium') || name.includes('enhanced')) score += 5;
    
    // Default high-quality voices from major vendors
    if (name.includes('google')) score += 3;
    if (name.includes('microsoft')) score += 2;
    if (name.includes('siri')) score += 2;
    
    // Default system voices
    if (voice.default) score += 1;
    
    return score;
  };

  matchingVoices.sort((a, b) => scoreVoice(b) - scoreVoice(a));

  return matchingVoices[0];
}

/**
 * Stop any current speech
 */
export function stopSpeaking() {
  if (isSpeechSupported()) {
    window.speechSynthesis.cancel();
  }
  
  if (currentAudio) {
    currentAudio.pause();
    currentAudio.currentTime = 0;
    currentAudio = null;
  }
}

/**
 * Split long text into array of shorter strings
 * @param {string} text - Text to split
 * @param {object} options - Options
 * @param {number} options.maxLength - Maximum length of each chunk
 * @param {string} options.splitPunct - Additional punctuation to split on
 * @returns {string[]} - Array of text chunks
 */
export function splitLongText(text, { maxLength = 200, splitPunct = "" } = {}) {
  // Define space and punctuation regex
  const spaceAndPunct =
    " \uFEFF\xA0!\"#$%&'()*+,-./:;<=>?@[\\]^_`{|}~" + splitPunct;

  // Helper function to check if character is space or punctuation
  const isSpaceOrPunct = (s, i) => {
    return spaceAndPunct.includes(s.charAt(i));
  };

  // Find last index of space or punctuation in a range
  const lastIndexOfSpaceOrPunct = (s, left, right) => {
    for (let i = right; i >= left; i--) {
      if (isSpaceOrPunct(s, i)) return i;
    }
    return -1; // not found
  };

  const result = [];
  let start = 0;

  while (true) {
    if (text.length - start <= maxLength) {
      result.push(text.slice(start));
      break;
    }

    let end = start + maxLength - 1;
    if (isSpaceOrPunct(text, end) || isSpaceOrPunct(text, end + 1)) {
      result.push(text.slice(start, end + 1));
      start = end + 1;
      continue;
    }

    end = lastIndexOfSpaceOrPunct(text, start, end);
    if (end === -1) {
      result.push(text.slice(start, start + maxLength));
      start += maxLength;
    } else {
      result.push(text.slice(start, end + 1));
      start = end + 1;
    }
  }

  return result.filter(chunk => chunk.trim().length > 0);
}

/**
 * Generate TTS audio URL using our proxy API
 * @param {string} text - Text to convert to speech (max 500 chars)
 * @param {object} options - Options
 * @returns {string} - Audio URL
 */
export function getAudioUrl(text, { lang = "en", slow = false } = {}) {
  if (typeof text !== "string" || text.length === 0) {
    throw new TypeError("text should be a string");
  }

  if (text.length > 500) {
    throw new RangeError(
      \`text length (\${text.length}) should be less than 500 characters. Use getAllAudioUrls for long text.\`
    );
  }

  const params = new URLSearchParams({
    text: text,
    lang: lang,
    slow: slow ? "true" : "false",
  });

  return \`/api/tts?\${params.toString()}\`;
}

/**
 * Split long text and generate multiple audio URLs
 * @param {string} text - Text to convert to speech
 * @param {object} options - Options
 * @returns {Array<{shortText: string, url: string}>} - List of text chunks and URLs
 */
export function getAllAudioUrls(
  text,
  { lang = "en", slow = false, splitPunct = "" } = {}
) {
  if (typeof text !== "string" || text.length === 0) {
    throw new TypeError("text should be a string");
  }

  return splitLongText(text, { maxLength: 500, splitPunct }).map((shortText) => ({
    shortText,
    url: getAudioUrl(shortText, { lang, slow }),
  }));
}

/**
 * Get the appropriate language code for Google TTS
 * @param {string} language - The language name or code
 * @returns {string} - The language code
 */
export function getLanguageCode(language) {
  return languageCodeMap[language] || "en-US";
}

/**
 * Get the audio URL for text-to-speech
 * @param {string} text - The text to convert to speech
 * @param {string} language - The language name or code
 * @returns {string} - The audio URL
 */
export function getTextToSpeechUrl(text, language) {
  try {
    if (!text || text.trim() === "") {
      return null;
    }

    const langCode = getLanguageCode(language);

    if (text.length > 500) {
      const results = getAllAudioUrls(text, { lang: langCode });
      return results[0]?.url;
    }

    return getAudioUrl(text, { lang: langCode });
  } catch (error) {
    console.error("Error generating TTS URL:", error);
    return null;
  }
}

/**
 * Play text as speech using Web Speech API with fallback to Google TTS
 * @param {string} text - The text to speak
 * @param {string} language - The language name or code
 * @returns {Promise<void>}
 */
export async function speakText(text, language) {
  if (!text || text.trim() === "") {
    return Promise.resolve();
  }

  stopSpeaking();

  const langCode = getLanguageCode(language);

  // Try Web Speech API first
  if (isSpeechSupported()) {
    const voice = await getBestVoice(langCode);
    
    if (voice) {
      return new Promise((resolve, reject) => {
        // Split text for Speech Synthesis to avoid length limits on some browsers
        const chunks = splitLongText(text, { maxLength: 200 });
        let currentIndex = 0;
        
        const speakNextChunk = () => {
          if (currentIndex >= chunks.length) {
            resolve();
            return;
          }
          
          const chunkText = chunks[currentIndex];
          const utterance = new SpeechSynthesisUtterance(chunkText);
          utterance.voice = voice;
          utterance.lang = voice.lang || langCode;
          utterance.rate = 0.9;
          utterance.pitch = 1.0;
          
          utterance.onend = () => {
            currentIndex++;
            speakNextChunk();
          };
          
          utterance.onerror = (e) => {
            console.error('SpeechSynthesis error:', e);
            // Fallback to proxy API for remaining chunks
            const remainingText = chunks.slice(currentIndex).join(' ');
            speakTextFallback(remainingText, langCode).then(resolve).catch(reject);
          };
          
          window.speechSynthesis.speak(utterance);
        };
        
        speakNextChunk();
      });
    }
  }

  // Fallback to Proxy
  return speakTextFallback(text, langCode);
}

/**
 * Fallback mechanism using Audio element
 */
function speakTextFallback(text, langCode) {
  return new Promise((resolve, reject) => {
    if (text.length > 500) {
      const results = getAllAudioUrls(text, { lang: langCode });
      if (!results.length) {
        resolve();
        return;
      }
      playAudioSequence(results, 0, resolve, reject);
      return;
    }

    const audioUrl = getAudioUrl(text, { lang: langCode });
    if (!audioUrl) {
      resolve();
      return;
    }

    currentAudio = new Audio(audioUrl);
    
    currentAudio.onended = () => {
      currentAudio = null;
      resolve();
    };
    
    currentAudio.onerror = (err) => {
      console.error("Error playing fallback audio:", err);
      currentAudio = null;
      reject(err);
    };
    
    currentAudio.play().catch((err) => {
      console.error("Error starting fallback audio playback:", err);
      currentAudio = null;
      reject(err);
    });
  });
}

/**
 * Play a sequence of audio segments
 */
function playAudioSequence(segments, index, resolve, reject) {
  if (index >= segments.length) {
    resolve();
    return;
  }

  currentAudio = new Audio(segments[index].url);

  currentAudio.onended = () => {
    playAudioSequence(segments, index + 1, resolve, reject);
  };

  currentAudio.onerror = (err) => {
    console.error("Error playing audio segment:", err);
    // Continue with next segment rather than failing completely
    playAudioSequence(segments, index + 1, resolve, reject);
  };

  currentAudio.play().catch((err) => {
    console.error("Error starting audio playback:", err);
    playAudioSequence(segments, index + 1, resolve, reject);
  });
}
