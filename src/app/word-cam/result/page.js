"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Volume2, RefreshCw, X, ArrowLeft, Loader2, Sparkles, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { generateImageVocabulary } from "../api";
import { speakText, getLanguageCode } from "@/utils/tts";

function ResultContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const language = searchParams.get('language') || 'Spanish';
  
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [vocabData, setVocabData] = useState(null);
  const [error, setError] = useState(false);

  const analyze = async (imgBase64) => {
    setLoading(true);
    setError(false);
    try {
      const data = await generateImageVocabulary(language, imgBase64);
      setVocabData(data);
    } catch (err) {
      console.error("Failed to analyze image:", err);
      setError(true);
      setVocabData({ items: [] });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const storedImg = sessionStorage.getItem('wordCamImage');
    if (!storedImg) {
      router.push('/word-cam');
      return;
    }
    setImage(storedImg);
    analyze(storedImg);
  }, [language, router]);

  const handlePlayAudio = (text) => {
    const langCode = getLanguageCode(language);
    speakText(text, langCode);
  };

  const handleRefresh = () => {
    if (image) {
      analyze(image);
    }
  };

  const categories = vocabData?.items ? Array.from(new Set(vocabData.items.map(i => i.category || 'Other'))) : [];

  return (
    <div className="min-h-screen bg-[#0a0e1a] text-white p-6 font-sans">
      <div className="max-w-4xl mx-auto space-y-8">
        <header className="flex items-center justify-between py-4">
          <Button variant="ghost" onClick={() => router.push('/word-cam')} className="text-gray-400 hover:text-white hover:bg-white/10 rounded-xl">
            <ArrowLeft className="w-5 h-5 mr-2" /> Back
          </Button>
          <div className="flex items-center gap-2">
            <span className="text-2xl">📸</span>
            <span className="font-bold tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">WORD CAM</span>
          </div>
          <Button variant="ghost" onClick={() => router.push('/word-cam')} className="text-gray-400 hover:text-white hover:bg-white/10 rounded-xl">
            <X className="w-5 h-5" />
          </Button>
        </header>

        {image && (
          <div className="relative w-full max-w-sm mx-auto rounded-3xl overflow-hidden border border-white/10 shadow-[0_0_40px_rgba(0,0,0,0.5)]">
            <img src={image} alt="Analyzed scene" className="w-full h-auto max-h-64 object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0a0e1a] to-transparent opacity-60"></div>
            <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
              <span className="bg-black/60 backdrop-blur-md px-3 py-1 rounded-lg text-xs font-medium border border-white/10 shadow-lg text-white">
                Target: {language}
              </span>
              {!loading && (
                <Button size="sm" onClick={handleRefresh} className="bg-purple-500/80 hover:bg-purple-500 backdrop-blur-md text-white rounded-lg shadow-lg border-none h-8 px-3">
                  <RefreshCw className="w-3.5 h-3.5 mr-1.5" /> Retry
                </Button>
              )}
            </div>
          </div>
        )}

        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center space-y-6">
            <div className="relative">
              <div className="w-20 h-20 border-4 border-purple-500/20 rounded-full animate-spin"></div>
              <div className="absolute inset-0 border-4 border-t-cyan-400 rounded-full animate-spin [animation-duration:1.5s]"></div>
              <Sparkles className="w-8 h-8 text-purple-400 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse" />
            </div>
            <div className="text-center">
              <h3 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-purple-500">Scanning Image...</h3>
              <p className="text-gray-400 text-sm mt-2">Identifying objects in {language}</p>
            </div>
          </div>
        ) : (
          <div className="space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-700">
            {categories.map((category) => (
              <div key={category} className="space-y-6">
                <div className="flex items-center gap-3">
                  <h2 className="text-xl font-bold text-white uppercase tracking-wider">{category}</h2>
                  <div className="h-px bg-gradient-to-r from-white/20 to-transparent flex-1"></div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {vocabData?.items?.filter(item => (item.category || 'Other') === category).map((item, idx) => (
                    <Card key={idx} className="bg-white/5 border-white/10 backdrop-blur-lg hover:bg-white/10 transition-all duration-300 group overflow-hidden">
                      <CardContent className="p-6 relative">
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                          <ImageIcon className="w-24 h-24 text-white" />
                        </div>
                        <div className="flex items-start justify-between relative z-10">
                          <div className="space-y-1">
                            <h3 className="text-2xl font-black text-cyan-300 drop-shadow-md">
                              {item.object}
                            </h3>
                            <p className="text-purple-300/80 font-mono text-sm tracking-wide">/{item.pronunciation}/</p>
                          </div>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => handlePlayAudio(item.object)}
                            className="text-white hover:text-cyan-300 hover:bg-white/10 rounded-full h-10 w-10 shrink-0"
                          >
                            <Volume2 className="w-5 h-5" />
                          </Button>
                        </div>
                        <div className="mt-4 relative z-10">
                          <p className="text-lg text-white font-medium">{item.translation}</p>
                          <div className="mt-4 pt-4 border-t border-white/10 space-y-1">
                            <p className="text-sm text-gray-300 leading-relaxed italic">"{item.sentence}"</p>
                            <p className="text-xs text-gray-500">{item.sentenceTranslation}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            ))}
            
            {(!vocabData?.items || vocabData.items.length === 0) && !loading && (
              <div className="text-center py-12">
                <p className="text-gray-400">No objects identified. Try another image.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default function ResultPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#0a0e1a] flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-purple-500" /></div>}>
      <ResultContent />
    </Suspense>
  );
}
