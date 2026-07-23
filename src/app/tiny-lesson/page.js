"use client";
import Image from "next/image";
import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const languages = [
  { value: "english", label: "English" },
  { value: "spanish", label: "Español" },
  { value: "french", label: "Français" },
  { value: "portuguese", label: "Português brasileiro" },
  { value: "arabic", label: "Arabic" },
  { value: "chinese_cn", label: "Chinese (China)" },
  { value: "chinese_hk", label: "Chinese (Hong Kong)" },
  { value: "chinese_tw", label: "Chinese (Taiwan)" },
  { value: "english_au", label: "English (AU)" },
  { value: "english_uk", label: "English (UK)" },
  { value: "english_us", label: "English (US)" },
  { value: "french_ca", label: "French (Canada)" },
  { value: "french_fr", label: "French (France)" },
  { value: "german", label: "German" },
  { value: "greek", label: "Greek" },
  { value: "hebrew", label: "Hebrew" },
  { value: "hindi", label: "Hindi" },
  { value: "italian", label: "Italian" },
  { value: "japanese", label: "Japanese" },
  { value: "korean", label: "Korean" },
  { value: "portuguese_br", label: "Portuguese (Brazil)" },
  { value: "portuguese_pt", label: "Portuguese (Portugal)" },
  { value: "russian", label: "Russian" },
  { value: "spanish_la", label: "Spanish (LatAm)" },
  { value: "spanish_sp", label: "Spanish (Spain)" },
  { value: "turkish", label: "Turkish" },
];

const purposeOptions = [
  "going on a first date",
  "ordering food",
  "taking a taxi",
  "booking a hotel room",
  "shopping at a market",
  "visiting a doctor",
  "making a phone call",
  "asking for directions",
  "attending a meeting",
  "introducing yourself",
];

function getRandomItem(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

export default function TinyLessonPage() {
  const [purpose, setPurpose] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState("");
  const router = useRouter();

  // Memoize random placeholder so it doesn't change on every keystroke
  const purposePlaceholder = useMemo(() => getRandomItem(purposeOptions), []);

  const handleGenerate = (e) => {
    e.preventDefault();
    const finalPurpose = purpose.trim() || purposePlaceholder;

    // Find the language label based on the selected value
    const selectedLanguageObject = languages.find(
      (lang) => lang.value === selectedLanguage
    );
    const finalLanguage = selectedLanguageObject
      ? selectedLanguageObject.label
      : selectedLanguage;

    // For now, just log the values
    console.log({
      language: finalLanguage,
      purpose: finalPurpose,
    });
    // Navigate to the result page with query parameters
    router.push(
      `/tiny-lesson/result?language=${encodeURIComponent(
        finalLanguage
      )}&purpose=${encodeURIComponent(finalPurpose)}`
    );
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-[#0a0e1a] text-white pb-16 font-sans">
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
          100% { transform: translateY(0px); }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
      `}} />
      {/* Heading */}
      <header className="w-full text-center py-6 bg-white/5 backdrop-blur-xl border-b border-white/10 mb-8">
        <h2 className="text-2xl font-medium tracking-tight text-white">Tiny Lesson</h2>
      </header>
      
      {/* Main Content */}
      <main className="flex flex-col items-center w-full max-w-xl mx-auto px-4 mt-4 animate-in fade-in slide-in-from-bottom-4 duration-1000">
        <Image
          src="/hand-ladybug.png"
          alt="Tiny Lesson"
          width={180}
          height={180}
          className="mb-6 animate-float drop-shadow-2xl"
        />
        <span className="text-xs tracking-widest text-cyan-400 font-mono font-semibold mb-3 block">
          EXPERIMENT NO. 001
        </span>
        <h1
          className="text-6xl font-black mb-4 text-center bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-500"
          style={{ fontFamily: "inherit", lineHeight: 1.1 }}
        >
          Tiny Lesson
        </h1>
        <p className="text-gray-400 text-lg text-center mb-10 max-w-md">
          Find relevant vocabulary, phrases, and grammar tips for any situation.
        </p>
        
        {/* Form */}
        <form
          className="w-full flex flex-col items-center gap-8 bg-white/5 backdrop-blur-md border border-white/10 p-8 rounded-3xl shadow-2xl"
          onSubmit={handleGenerate}
        >
          <div className="w-full flex flex-col gap-6">
            {/* Language */}
            <div className="flex flex-col gap-2 w-full">
              <label className="text-xs font-semibold text-gray-400 mb-1 uppercase tracking-wider">
                Language
              </label>
              <Select
                value={selectedLanguage}
                onValueChange={setSelectedLanguage}
              >
                <SelectTrigger className="w-full rounded-xl bg-white/10 border border-white/10 px-6 py-6 text-lg font-medium text-white shadow-none focus:ring-2 focus:ring-cyan-500/50 outline-none">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent className="bg-[#0f1523] border border-white/10 text-white">
                  {languages.map((lang) => (
                    <SelectItem key={lang.value} value={lang.value} className="focus:bg-white/10 focus:text-white cursor-pointer">
                      {lang.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {/* Purpose or Theme */}
            <div className="flex flex-col gap-2 w-full">
              <label className="text-xs font-semibold text-gray-400 mb-1 uppercase tracking-wider">
                Purpose or Theme
              </label>
              <input
                type="text"
                className="w-full rounded-xl bg-white/10 px-6 py-4 text-lg font-medium border border-white/10 text-white shadow-none placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all"
                placeholder={purposePlaceholder}
                value={purpose}
                onChange={(e) => setPurpose(e.target.value)}
              />
            </div>
          </div>
          <Button
            className="w-full rounded-full py-7 text-lg font-semibold bg-gradient-to-r from-cyan-500 to-blue-600 text-white hover:from-cyan-400 hover:to-blue-500 shadow-lg shadow-cyan-500/20 transition-all border-0 mt-2"
            type="submit"
            disabled={!selectedLanguage}
          >
            Generate ✨
          </Button>
        </form>
      </main>
    </div>
  );
}
