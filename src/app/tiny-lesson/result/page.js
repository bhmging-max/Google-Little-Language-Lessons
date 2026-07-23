"use client";
import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Volume2, Edit2, RefreshCw, X } from "lucide-react";
import { generateLessonData } from "../api";
import { speakText, getLanguageCode } from "@/utils/tts";

const testData = {
  vocabulary: [
    { word: "taxi", translation: "taxi" },
    { word: "cab", translation: "taxi" },
    { word: "fare", translation: "the fare" },
    { word: "meter", translation: "meter" },
    { word: "taxi", translation: "taxi" },
    { word: "cab", translation: "taxi" },
    { word: "fare", translation: "the fare" },
    { word: "meter", translation: "meter" },
  ],
  phrases: [
    {
      phrase: "Could you take me to this address?",
      translation: "Could you take me to this address?",
    },
    {
      phrase: "How much will it cost to get to the airport?",
      translation: "How much will it cost to get to the airport?",
    },
    {
      phrase: "Do you accept credit cards?",
      translation: "Do you accept credit cards?",
    },
    { phrase: "Keep the change.", translation: "Keep the change." },
    {
      phrase: "Could you take me to this address?",
      translation: "Could you take me to this address?",
    },
    {
      phrase: "How much will it cost to get to the airport?",
      translation: "How much will it cost to get to the airport?",
    },
    {
      phrase: "Do you accept credit cards?",
      translation: "Do you accept credit cards?",
    },
    { phrase: "Keep the change.", translation: "Keep the change." },
  ],
  tips: [
    {
      title: "Using 'would like' for polite requests",
      description:
        "When taking a taxi, it's helpful to know how to make polite requests! One very common way to do this in American English is by using 'would like'. 'Would like' is a polite way of saying 'want'. It's considered more formal and courteous, especially when you're asking someone for a service. The structure is typically 'I/We would like + to + verb'. For example, 'I would like to go to the airport'. It's also very common to contract 'I would' to 'I'd', making it sound more natural in conversation. So, instead of saying 'I would like to go...', you can say 'I'd like to go...'.",
      examples: [
        "I'd like to go to Grand Central Station, please.",
        "We would like to be dropped off at the corner of Elm Street and Main Street.",
      ],
    },
    {
      title: "Paying the fare and tipping",
      description:
        "In the US, it's customary to tip your taxi driver about 10-15% of the fare. You can pay with cash or, in many cities, with a credit card. Always check if the taxi accepts cards before your ride.",
      examples: ["How much is the fare?", "Can I pay with a credit card?"],
    },
  ],
};

// Component that uses useSearchParams
function TinyLessonContent() {
  const [tab, setTab] = useState("vocab");
  const [editMode, setEditMode] = useState(false);
  const [language, setLanguage] = useState("");
  const [topic, setTopic] = useState("");
  const [topicInput, setTopicInput] = useState("");
  const [showAllVocab, setShowAllVocab] = useState(false);
  const [showAllPhrases, setShowAllPhrases] = useState(false);
  const [showAllTips, setShowAllTips] = useState(false);
  const [lessonData, setLessonData] = useState(testData);
  const [loading, setLoading] = useState(false);
  const [playingAudio, setPlayingAudio] = useState(null);
  const [loadingAudio, setLoadingAudio] = useState(null);

  const router = useRouter();
  const searchParams = useSearchParams();

  // Initialize state from URL parameters
  useEffect(() => {
    const purposeParam = searchParams.get("purpose");
    const languageParam = searchParams.get("language");

    if (purposeParam) {
      setTopic(purposeParam);
      setTopicInput(purposeParam);
    }

    if (languageParam) {
      setLanguage(languageParam);
    }

    // Load data when parameters change
    if (languageParam && purposeParam) {
      fetchLessonData(languageParam, purposeParam);
    }
  }, [searchParams]);

  // Function to fetch lesson data
  const fetchLessonData = async (lang, top) => {
    if (!lang || !top) return;

    setLoading(true);
    try {
      // Call API to fetch data using our AI model
      const data = await generateLessonData(lang, top);
      setLessonData(data);
    } catch (error) {
      console.error("Failed to fetch lesson data:", error);
      // Keep using test data if there's an error
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    setEditMode(true);
    setTopicInput(topic);
  };

  const handleSave = () => {
    setTopic(topicInput);
    setEditMode(false);

    // Update URL with new topic
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.set("purpose", topicInput);
    router.push(`/tiny-lesson/result?${newSearchParams.toString()}`);
  };

  const handleClose = () => {
    router.push("/tiny-lesson");
  };

  const handleRefresh = () => {
    // Fetch new data
    fetchLessonData(language, topic);
  };

  const handleSpeak = async (text, itemId) => {
    if (!text || !language) return;
    // Stop any currently playing
    if (playingAudio === itemId) {
      window.speechSynthesis?.cancel();
      setPlayingAudio(null);
      return;
    }
    setLoadingAudio(itemId);
    setPlayingAudio(itemId);
    try {
      await speakText(text, language);
    } catch (e) {
      console.error('TTS error:', e);
    } finally {
      setLoadingAudio(null);
      setPlayingAudio(null);
    }
  };

  // Vocab/Phrases slice logic
  const vocabToShow = showAllVocab
    ? lessonData.vocabulary
    : lessonData.vocabulary.slice(0, 4);
  const phrasesToShow = showAllPhrases
    ? lessonData.phrases
    : lessonData.phrases.slice(0, 4);
  // Tips logic
  const tipsToShow = showAllTips ? lessonData.tips : [lessonData.tips[0]];

  // Render loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0e1a] text-white px-4 pb-16 flex flex-col items-center justify-center font-sans">
        <div className="text-2xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-500">
          Loading your lesson...
        </div>
        <div className="flex space-x-4">
          <div className="w-12 h-12 rounded-full border-4 border-t-cyan-400 border-r-blue-500 border-b-cyan-600 border-l-transparent animate-spin"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0e1a] text-white px-4 pb-16 font-sans">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pt-10 pb-4">
        <div>
          <h1 className="text-5xl md:text-6xl font-black leading-tight mb-2">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-500">
              {language} for
            </span>{" "}
            {editMode ? (
              <span className="inline-flex items-center gap-2">
                <input
                  className="text-white bg-white/10 font-black text-4xl md:text-5xl px-3 py-1 rounded-xl border border-white/20 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  value={topicInput}
                  onChange={(e) => setTopicInput(e.target.value)}
                  autoFocus
                />
                <Button
                  size="sm"
                  className="ml-2 px-6 py-2 text-base font-semibold bg-cyan-500 hover:bg-cyan-600 text-white rounded-full transition-colors"
                  onClick={handleSave}
                >
                  Save
                </Button>
              </span>
            ) : (
              <span className="text-white">{topic}</span>
            )}
          </h1>
        </div>
        <div className="flex gap-3 self-end">
          <Button
            size="icon"
            variant="ghost"
            className="bg-white/10 hover:bg-white/20 text-white border border-white/10 rounded-full transition-colors"
            onClick={handleEdit}
            aria-label="Edit topic"
          >
            <Edit2 size={20} />
          </Button>
          <Button
            size="icon"
            variant="ghost"
            className="bg-white/10 hover:bg-white/20 text-white border border-white/10 rounded-full transition-colors"
            onClick={handleRefresh}
            aria-label="Refresh"
          >
            <RefreshCw size={20} />
          </Button>
          <Button
            size="icon"
            variant="ghost"
            className="bg-white/10 hover:bg-white/20 text-white border border-white/10 rounded-full transition-colors"
            onClick={handleClose}
            aria-label="Close"
          >
            <X size={20} />
          </Button>
        </div>
      </div>
      
      {/* Tabs */}
      <Tabs value={tab} onValueChange={setTab} className="mt-8">
        <TabsList className="flex gap-4 bg-transparent mb-8 overflow-x-auto justify-start border-b border-white/10 pb-4 h-auto">
          <TabsTrigger
            value="vocab"
            className="rounded-full px-6 py-3 data-[state=active]:bg-white/10 data-[state=active]:text-cyan-400 text-gray-400 hover:text-white transition-colors flex items-center gap-2 font-medium"
          >
            <span role="img" aria-label="vocab">📝</span> Vocabulary
          </TabsTrigger>
          <TabsTrigger
            value="phrases"
            className="rounded-full px-6 py-3 data-[state=active]:bg-white/10 data-[state=active]:text-cyan-400 text-gray-400 hover:text-white transition-colors flex items-center gap-2 font-medium"
          >
            <span role="img" aria-label="phrases">💬</span> Phrases
          </TabsTrigger>
          <TabsTrigger
            value="tips"
            className="rounded-full px-6 py-3 data-[state=active]:bg-white/10 data-[state=active]:text-cyan-400 text-gray-400 hover:text-white transition-colors flex items-center gap-2 font-medium"
          >
            <span role="img" aria-label="tips">📖</span> Tips
          </TabsTrigger>
        </TabsList>
        
        {/* Vocabulary Tab */}
        <TabsContent value="vocab" className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          <h2 className="text-2xl font-bold flex items-center gap-2 mb-6 text-white">
            <span role="img" aria-label="vocab">📝</span> Vocabulary
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {vocabToShow.map((item, i) => (
              <Card
                key={i}
                className="flex flex-row items-center justify-between bg-white/5 backdrop-blur-md border border-white/10 px-6 py-6 rounded-2xl shadow-lg transition-transform hover:-translate-y-1"
              >
                <div>
                  <div className="text-xl font-semibold text-white mb-1">
                    {item.word}
                  </div>
                  <div className="text-gray-400 text-base">
                    {item.translation}
                  </div>
                </div>
                <Button
                  size="icon"
                  variant="ghost"
                  className={`${
                    playingAudio === \`vocab-\${i}\` ? "bg-cyan-500/20" : ""
                  } text-cyan-400 hover:bg-cyan-500/20 hover:text-cyan-300 rounded-full h-12 w-12 transition-colors`}
                  onClick={() => handleSpeak(item.word, \`vocab-\${i}\`)}
                  aria-label={
                    playingAudio === \`vocab-\${i}\`
                      ? "Stop speaking"
                      : "Speak word"
                  }
                  disabled={loadingAudio === \`vocab-\${i}\`}
                >
                  {loadingAudio === \`vocab-\${i}\` ? (
                    <div className="w-5 h-5 border-2 border-t-transparent border-cyan-400 rounded-full animate-spin"></div>
                  ) : (
                    <Volume2 size={22} />
                  )}
                </Button>
              </Card>
            ))}
          </div>
          {lessonData.vocabulary.length > 4 && (
            <Button
              className="w-full mt-8 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white rounded-full py-7 text-lg font-semibold shadow-lg shadow-cyan-500/20 transition-all border-0"
              onClick={() => setShowAllVocab((v) => !v)}
            >
              {showAllVocab ? "See less ▲" : "See more ▼"}
            </Button>
          )}
        </TabsContent>
        
        {/* Phrases Tab */}
        <TabsContent value="phrases" className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          <h2 className="text-2xl font-bold flex items-center gap-2 mb-6 text-white">
            <span role="img" aria-label="phrases">💬</span> Phrases
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {phrasesToShow.map((item, i) => (
              <Card
                key={i}
                className="flex flex-row items-center justify-between bg-white/5 backdrop-blur-md border border-white/10 px-6 py-6 rounded-2xl shadow-lg transition-transform hover:-translate-y-1"
              >
                <div className="pr-4">
                  <div className="text-lg font-semibold text-white mb-2 leading-snug">
                    {item.phrase}
                  </div>
                  <div className="text-gray-400 text-base">
                    {item.translation}
                  </div>
                </div>
                <Button
                  size="icon"
                  variant="ghost"
                  className={`${
                    playingAudio === \`phrase-\${i}\` ? "bg-cyan-500/20" : ""
                  } text-cyan-400 hover:bg-cyan-500/20 hover:text-cyan-300 rounded-full h-12 w-12 shrink-0 transition-colors`}
                  onClick={() => handleSpeak(item.phrase, \`phrase-\${i}\`)}
                  aria-label={
                    playingAudio === \`phrase-\${i}\`
                      ? "Stop speaking"
                      : "Speak phrase"
                  }
                  disabled={loadingAudio === \`phrase-\${i}\`}
                >
                  {loadingAudio === \`phrase-\${i}\` ? (
                    <div className="w-5 h-5 border-2 border-t-transparent border-cyan-400 rounded-full animate-spin"></div>
                  ) : (
                    <Volume2 size={22} />
                  )}
                </Button>
              </Card>
            ))}
          </div>
          {lessonData.phrases.length > 4 && (
            <Button
              className="w-full mt-8 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white rounded-full py-7 text-lg font-semibold shadow-lg shadow-cyan-500/20 transition-all border-0"
              onClick={() => setShowAllPhrases((v) => !v)}
            >
              {showAllPhrases ? "See less ▲" : "See more ▼"}
            </Button>
          )}
        </TabsContent>
        
        {/* Tips Tab */}
        <TabsContent value="tips" className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          <h2 className="text-2xl font-bold flex items-center gap-2 mb-6 text-white">
            <span role="img" aria-label="tips">📖</span> Tips
          </h2>
          {tipsToShow.map((currentTip, idx) => (
            <Card
              key={idx}
              className="bg-white/5 border border-white/10 p-8 rounded-3xl shadow-xl mb-8"
            >
              <div className="text-xl font-bold mb-3 text-white">{currentTip.title}</div>
              <div className="text-gray-300 mb-8 leading-relaxed text-lg">{currentTip.description}</div>
              <div className="text-xs font-semibold text-cyan-400 mb-4 uppercase tracking-widest">
                Examples
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {currentTip.examples.map((ex, i) => (
                  <Card
                    key={i}
                    className="flex flex-row items-center justify-between bg-white/10 border border-white/10 px-6 py-6 rounded-2xl shadow-none"
                  >
                    <div className="text-base font-medium text-white pr-4 leading-snug">
                      {ex}
                    </div>
                    <Button
                      size="icon"
                      variant="ghost"
                      className={`${
                        playingAudio === \`tip-\${idx}-ex-\${i}\`
                          ? "bg-cyan-500/20"
                          : ""
                      } text-cyan-400 hover:bg-cyan-500/20 hover:text-cyan-300 rounded-full h-10 w-10 shrink-0 transition-colors`}
                      onClick={() => handleSpeak(ex, \`tip-\${idx}-ex-\${i}\`)}
                      aria-label={
                        playingAudio === \`tip-\${idx}-ex-\${i}\`
                          ? "Stop speaking"
                          : "Speak example"
                      }
                      disabled={loadingAudio === \`tip-\${idx}-ex-\${i}\`}
                    >
                      {loadingAudio === \`tip-\${idx}-ex-\${i}\` ? (
                        <div className="w-4 h-4 border-2 border-t-transparent border-cyan-400 rounded-full animate-spin"></div>
                      ) : (
                        <Volume2 size={18} />
                      )}
                    </Button>
                  </Card>
                ))}
              </div>
            </Card>
          ))}
          {lessonData.tips.length > 1 && (
            <Button
              className="w-full mt-4 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white rounded-full py-7 text-lg font-semibold shadow-lg shadow-cyan-500/20 transition-all border-0"
              onClick={() => setShowAllTips((v) => !v)}
            >
              {showAllTips ? "See less ▲" : "See more ▼"}
            </Button>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

// Main component with Suspense boundary
export default function TinyLessonResultPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#0a0e1a] px-4 pb-16 flex flex-col items-center justify-center text-white">
          <div className="text-2xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-500">Loading...</div>
          <div className="flex space-x-4">
            <div className="w-12 h-12 rounded-full border-4 border-t-cyan-400 border-r-blue-500 border-b-cyan-600 border-l-transparent animate-spin"></div>
          </div>
        </div>
      }
    >
      <TinyLessonContent />
    </Suspense>
  );
}
