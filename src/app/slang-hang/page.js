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

export default function SlangHangPage() {
  const [selectedLanguage, setSelectedLanguage] = useState("");
  const router = useRouter();

  const handleGenerate = (e) => {
    e.preventDefault();

    // Find the language label based on the selected value
    const selectedLanguageObject = languages.find(
      (lang) => lang.value === selectedLanguage
    );
    const finalLanguage = selectedLanguageObject
      ? selectedLanguageObject.label
      : selectedLanguage;

    // Log the values
    console.log({
      language: finalLanguage,
    });

    // Navigate to the result page with query parameters
    router.push(
      `/slang-hang/result?language=${encodeURIComponent(finalLanguage)}`
    );
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-[#0a0e1a] px-4 pb-16">
      <style dangerouslySetInnerHTML={{
        __html: `
        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
          100% { transform: translateY(0px); }
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fadeIn 0.8s ease-out forwards;
        }
      `}} />
      
      {/* Heading */}
      <header className="w-full text-center py-6 bg-white/5 backdrop-blur-xl border-b border-white/10 mb-2">
        <h2 className="text-2xl font-medium tracking-tight text-white">Slang Hang</h2>
      </header>
      
      {/* Main Content */}
      <main className="flex flex-col items-center w-full max-w-xl mx-auto mt-8 animate-fade-in">
        <div className="animate-float">
          <Image
            src="/mouth-slang.png"
            alt="Slang Hang"
            width={180}
            height={180}
            className="mb-6 drop-shadow-[0_0_15px_rgba(168,85,247,0.4)]"
          />
        </div>
        <span className="text-xs tracking-widest text-purple-400 font-mono font-semibold mb-3 block">
          EXPERIMENT NO. 002
        </span>
        <h1
          className="text-6xl font-black mb-4 text-center bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent"
          style={{ fontFamily: "inherit", lineHeight: 1.1 }}
        >
          Slang Hang
        </h1>
        <p className="text-gray-400 text-lg text-center mb-10 max-w-md">
          Learn expressions, idioms, and regional slang from a generated
          conversation between native speakers.
        </p>
        
        {/* Form */}
        <form
          className="w-full flex flex-col items-center gap-6"
          onSubmit={handleGenerate}
        >
          <div className="w-full flex flex-col gap-5">
            {/* Language */}
            <div className="flex flex-col gap-2 w-full">
              <label className="text-xs font-semibold text-gray-400 mb-1 uppercase tracking-wider">
                Language
              </label>
              <Select
                value={selectedLanguage}
                onValueChange={setSelectedLanguage}
              >
                <SelectTrigger className="w-full rounded-xl bg-white/10 border border-white/10 text-white px-6 py-4 text-lg font-medium hover:bg-white/15 transition-colors shadow-none">
                  <SelectValue placeholder="Select a language" />
                </SelectTrigger>
                <SelectContent className="bg-[#12182b] border-white/10 text-white rounded-xl">
                  {languages.map((lang) => (
                    <SelectItem key={lang.value} value={lang.value} className="focus:bg-white/10 focus:text-white">
                      {lang.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <Button
            className="rounded-full px-12 py-6 text-lg font-semibold bg-gradient-to-r from-purple-500 to-pink-600 text-white mt-4 hover:shadow-[0_0_20px_rgba(168,85,247,0.4)] transition-all disabled:opacity-50 disabled:hover:shadow-none border-0"
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
