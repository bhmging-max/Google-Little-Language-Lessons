"use client";
import { useState, useEffect, useRef, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Volume2, RefreshCw, X } from "lucide-react";
import { generateConversationData } from "../api";
import { speakText, getLanguageCode } from "@/utils/tts";

// Sample test data for initial rendering
const testData = {
  context: {
    setting: "A cramped capsule hotel room in Tokyo",
    relationship: "Strangers who were accidentally assigned the same room",
    speakers: [
      {
        name: "Meilin",
        background: "A young architect from Shanghai, visiting Tokyo for work",
        personality: "Serious, detail-oriented",
      },
      {
        name: "Jian",
        background: "A musician from Beijing, traveling for inspiration",
        personality: "Laid-back, optimistic",
      },
    ],
  },
  messages: [
    {
      speaker: "Meilin",
      text: "这... 搞什么呢? 我明明订的是单人间!",
      translation: "What's going on? I clearly booked a single room!",
      transliteration:
        "Zhè... gǎo shénme ne? Wǒ míngmíng dìng de shì dānrén jiān!",
    },
    {
      speaker: "Jian",
      text: "哎呀，别生气嘛。既来之，则安之。看看情况再说。",
      translation:
        "Oh, don't be angry. Now that it's here, just make the best of it. Let's see how it goes.",
      transliteration:
        "Āiyā, bié shēngqì ma. Jì lái zhī, zé ān zhī. Kànkan qíngkuàng zài shuō.",
    },
  ],
  slangTerms: [
    {
      term: "搞什么",
      definition:
        "An informal way to say 'what's going on' or 'what are you doing', expressing confusion or slight irritation",
      example:
        "你搞什么呢？我们要迟到了！(What are you doing? We're going to be late!)",
    },
    {
      term: "既来之，则安之",
      definition:
        "A Chinese proverb meaning 'since you've come, you might as well make the best of it' or 'make yourself comfortable with the situation'",
      example:
        "虽然不是我们计划的酒店，但既来之则安之，我们可以享受一下。(Although it's not the hotel we planned, since we're here, let's make the best of it and enjoy.)",
      origin:
        "From Confucian philosophy, emphasizing adaptation to circumstances",
    },
  ],
};

function MessageBubble({ message, language, isUserPrompt, speakers }) {
  const [playingAudio, setPlayingAudio] = useState(false);
  const [showTranslation, setShowTranslation] = useState(false);

  const isSystemMessage = !message.speaker;

  // Determine if this speaker is the first or second speaker
  const isFirstSpeaker =
    speakers?.length > 0 && message.speaker === speakers[0]?.name;

  // Align based on speaker position - first speaker left, second speaker right
  const alignment = isSystemMessage
    ? "justify-center"
    : isFirstSpeaker
    ? "justify-start"
    : "justify-end";

  // Get background color based on speaker position
  const getBgColor = () => {
    if (isSystemMessage) return "bg-white/10 text-gray-300";
    return isFirstSpeaker ? "bg-purple-500/20 border border-purple-500/20 text-white" : "bg-indigo-500/20 border border-indigo-500/20 text-white";
  };

  // Function to handle TTS
  const handleSpeak = async () => {
    if (!message.text || !language) return;
    if (playingAudio) {
      window.speechSynthesis?.cancel();
      setPlayingAudio(false);
      return;
    }
    setPlayingAudio(true);
    try {
      await speakText(message.text, language);
    } catch (e) {
      console.error('TTS error:', e);
    } finally {
      setPlayingAudio(false);
    }
  };

  // Toggle translation visibility
  const toggleTranslation = () => {
    setShowTranslation(!showTranslation);
  };

  if (isSystemMessage) {
    return (
      <div className="flex justify-center my-4">
        <div className="px-6 py-3 rounded-lg bg-white/10 text-gray-300 border border-white/5 max-w-[80%] text-sm backdrop-blur-sm">
          {message.text}
        </div>
      </div>
    );
  }

  return (
    <div className={`flex ${alignment} my-6 max-w-full`}>
      <div
        className={`px-5 py-4 rounded-2xl ${getBgColor()} max-w-[80%] shadow-sm backdrop-blur-sm`}
      >
        <div className="text-xs font-semibold mb-2 text-gray-400">
          {message.speaker}
        </div>
        <p className="text-lg mb-2 font-medium">{message.text}</p>

        {showTranslation && message.translation && (
          <p className="text-sm text-gray-400 italic border-t border-white/10 pt-2 mt-1">
            {message.translation}
          </p>
        )}

        {message.transliteration && (
          <p className="text-xs text-gray-500 mt-2 border-t border-white/10 pt-1">
            {message.transliteration}
          </p>
        )}

        <div className="flex mt-2 justify-end space-x-2">
          {message.translation && (
            <Button
              size="sm"
              variant="ghost"
              className="h-8 w-8 p-0 rounded-full hover:bg-white/10 text-gray-400"
              onClick={toggleTranslation}
            >
              <span className="text-xs font-bold">
                {showTranslation ? "EN" : "en"}
              </span>
            </Button>
          )}
          <Button
            size="sm"
            variant="ghost"
            className="h-8 w-8 p-0 rounded-full hover:bg-purple-500/20 text-purple-400"
            onClick={handleSpeak}
          >
            <Volume2
              size={16}
              className={playingAudio ? "text-purple-300" : "text-purple-400"}
            />
          </Button>
        </div>
      </div>
    </div>
  );
}

function SlangTermCard({ term }) {
  return (
    <Card className="mb-6 p-5 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-colors backdrop-blur-sm">
      <h3 className="text-xl font-bold text-purple-300 mb-2">{term.term}</h3>
      <p className="text-gray-300 mt-1">{term.definition}</p>

      {term.example && (
        <div className="mt-3 bg-purple-500/10 p-3 rounded-lg border border-purple-500/20">
          <span className="text-xs font-semibold text-purple-400 uppercase tracking-wider">
            Example
          </span>
          <p className="text-gray-300 italic mt-1">{term.example}</p>
        </div>
      )}

      {term.origin && (
        <div className="mt-3">
          <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
            Origin
          </span>
          <p className="text-gray-400 mt-1">{term.origin}</p>
        </div>
      )}
    </Card>
  );
}

function SlangHangContent({ language: initialLanguage }) {
  const [tab, setTab] = useState("conversation");
  const [language, setLanguage] = useState(initialLanguage || "");
  const [conversationData, setConversationData] = useState(testData);
  const [allMessages, setAllMessages] = useState([]); // Store all messages
  const [displayedMessages, setDisplayedMessages] = useState([]); // Only show a portion
  const [currentSegment, setCurrentSegment] = useState(1);
  const [slangTerms, setSlangTerms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [canContinue, setCanContinue] = useState(true);
  const messagesEndRef = useRef(null);

  // Define how many messages to show per segment
  const MESSAGES_PER_SEGMENT = 2;

  const router = useRouter();

  // Handle keypress to reveal next segment
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.code === "Space" && canContinue && !loading) {
        event.preventDefault();
        handleContinue();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [canContinue, loading, currentSegment, allMessages]);

  // Scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [displayedMessages]);

  // Initialize state and fetch data when language changes
  useEffect(() => {
    if (language) {
      fetchConversationData(language);
    }
  }, [language]);

  // Update messages and slang terms when conversation data changes
  useEffect(() => {
    if (conversationData) {
      setAllMessages(conversationData.messages || []);
      // Initially display only the first segment
      setDisplayedMessages(
        (conversationData.messages || []).slice(0, MESSAGES_PER_SEGMENT)
      );
      setSlangTerms(conversationData.slangTerms || []);
    }
  }, [conversationData]);

  // Function to fetch conversation data
  const fetchConversationData = async (lang) => {
    if (!lang) return;

    setLoading(true);
    try {
      // Call API to fetch data
      const data = await generateConversationData(lang);
      setConversationData(data);
      setCurrentSegment(1);
    } catch (error) {
      console.error("Failed to fetch conversation data:", error);
      // Keep using test data if there's an error
    } finally {
      setLoading(false);
    }
  };

  // Function to reveal next segment of the conversation
  const handleContinue = () => {
    // Check if we've displayed all messages
    if (currentSegment * MESSAGES_PER_SEGMENT >= allMessages.length) {
      // We've reached the end of the conversation
      return;
    }

    // Calculate the next segment to show
    const nextSegment = currentSegment + 1;
    const endIndex = Math.min(
      nextSegment * MESSAGES_PER_SEGMENT,
      allMessages.length
    );

    // Add a system message indicating the continuation
    const updatedMessages = [
      ...displayedMessages,
      { text: "Continuing the conversation..." },
      ...allMessages.slice(
        displayedMessages.filter((m) => m.speaker).length,
        endIndex
      ),
    ];

    setDisplayedMessages(updatedMessages);
    setCurrentSegment(nextSegment);

    // Update slang terms based on the displayed messages
    updateSlangTermsForDisplayedMessages(updatedMessages);
  };

  // Function to update the slang terms that correspond to the displayed messages
  const updateSlangTermsForDisplayedMessages = (messages) => {
    // In a real implementation, you might want to filter slang terms to only show
    // those that have appeared in the messages displayed so far
    // For simplicity, we're showing all slang terms regardless
  };

  const handleRefresh = () => {
    // Fetch new conversation
    fetchConversationData(language);
  };

  const handleClose = () => {
    router.push("/slang-hang");
  };

  // Calculate if we have more messages to show
  const hasMoreMessages =
    allMessages.length > displayedMessages.filter((m) => m.speaker).length;

  // Full-screen loading overlay
  if (loading) {
    return (
      <div className="fixed inset-0 bg-[#0a0e1a] text-white flex flex-col items-center justify-center z-50">
        <style dangerouslySetInnerHTML={{
          __html: `
          @keyframes gradientPulse {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }
        `}} />
        <div className="text-3xl font-bold mb-6 bg-gradient-to-r from-purple-400 via-pink-500 to-purple-400 bg-[length:200%_auto] bg-clip-text text-transparent" style={{ animation: 'gradientPulse 3s ease infinite' }}>
          Generating conversation...
        </div>
        <div className="flex items-center justify-center space-x-3">
          <div
            className="w-4 h-4 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full animate-bounce"
            style={{ animationDelay: "0ms" }}
          ></div>
          <div
            className="w-4 h-4 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full animate-bounce"
            style={{ animationDelay: "150ms" }}
          ></div>
          <div
            className="w-4 h-4 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full animate-bounce"
            style={{ animationDelay: "300ms" }}
          ></div>
          <div
            className="w-4 h-4 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full animate-bounce"
            style={{ animationDelay: "450ms" }}
          ></div>
        </div>
        <div className="mt-8 text-gray-400 font-mono text-sm">This may take a few moments...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0e1a] text-white px-4 pb-16">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pt-10 pb-4">
        <div>
          <h1 className="text-5xl md:text-6xl font-black leading-tight mb-2 bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
            Slang Hang
          </h1>
          <p className="text-xl text-purple-400 font-medium">
            Learning {language} slang through conversation
          </p>
        </div>
        <div className="flex gap-3 self-end">
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

      {/* Context Information */}
      {conversationData.context && (
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-8 backdrop-blur-md">
          <h2 className="text-xl font-bold mb-2 text-purple-300">Setting</h2>
          <p className="mb-6 text-gray-300">{conversationData.context.setting}</p>

          <h2 className="text-xl font-bold mb-3 text-purple-300">Speakers</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {conversationData.context.speakers.map((speaker, i) => (
              <div key={i} className="bg-white/10 p-4 rounded-xl border border-white/5">
                <h3 className="font-bold text-lg text-white mb-1">{speaker.name}</h3>
                <p className="text-sm text-gray-300">{speaker.background}</p>
                {speaker.personality && (
                  <p className="text-sm italic text-gray-400 mt-2">{speaker.personality}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tabs */}
      <Tabs value={tab} onValueChange={setTab} className="mt-8">
        <TabsList className="flex gap-4 bg-transparent mb-8">
          <TabsTrigger
            value="conversation"
            className="rounded-full px-6 py-2.5 data-[state=active]:bg-white/10 data-[state=active]:text-purple-400 text-gray-400 hover:text-gray-200 transition-all flex items-center gap-2 border border-transparent data-[state=active]:border-white/10"
          >
            <span role="img" aria-label="conversation">
              💬
            </span>{" "}
            Conversation
          </TabsTrigger>
          <TabsTrigger
            value="slang"
            className="rounded-full px-6 py-2.5 data-[state=active]:bg-white/10 data-[state=active]:text-purple-400 text-gray-400 hover:text-gray-200 transition-all flex items-center gap-2 border border-transparent data-[state=active]:border-white/10"
          >
            <span role="img" aria-label="slang">
              📝
            </span>{" "}
            Slang Glossary
          </TabsTrigger>
        </TabsList>

        {/* Conversation Tab */}
        <TabsContent value="conversation" className="focus:outline-none">
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 min-h-[500px] relative shadow-2xl backdrop-blur-sm">
            <div className="overflow-y-auto max-h-[600px] space-y-2 mb-20 px-4 custom-scrollbar">
              {displayedMessages.map((message, i) => (
                <MessageBubble
                  key={i}
                  message={message}
                  language={language}
                  isUserPrompt={!message.speaker}
                  speakers={conversationData.context?.speakers}
                />
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Continue button */}
            <div className="absolute bottom-6 left-0 right-0 flex justify-center">
              <Button
                className="bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white rounded-full py-6 px-10 text-base shadow-[0_0_20px_rgba(168,85,247,0.3)] hover:shadow-[0_0_25px_rgba(168,85,247,0.5)] transition-all border-0"
                onClick={handleContinue}
                disabled={loading || !hasMoreMessages}
              >
                {loading ? (
                  <div className="flex items-center">
                    <div className="w-5 h-5 border-2 border-t-transparent border-white rounded-full animate-spin mr-3"></div>
                    Loading...
                  </div>
                ) : hasMoreMessages ? (
                  <span className="font-semibold tracking-wide">Press space to continue</span>
                ) : (
                  <span className="font-semibold tracking-wide text-white/80">Conversation complete</span>
                )}
              </Button>
            </div>
          </div>
        </TabsContent>

        {/* Slang Glossary Tab */}
        <TabsContent value="slang" className="focus:outline-none">
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 shadow-2xl backdrop-blur-sm min-h-[500px]">
            <h2 className="text-2xl font-bold mb-8 flex items-center text-white">
              <span className="bg-purple-500/20 text-purple-400 w-10 h-10 rounded-full inline-flex items-center justify-center mr-3 border border-purple-500/30">
                <span role="img" aria-label="slang" className="text-xl">
                  📝
                </span>
              </span>
              Slang Glossary
            </h2>
            <div className="grid gap-4">
              {slangTerms.length > 0 ? (
                slangTerms.map((term, i) => <SlangTermCard key={i} term={term} />)
              ) : (
                <p className="text-gray-400 text-center py-16 text-lg">
                  No slang terms available yet.
                </p>
              )}
            </div>
          </div>
        </TabsContent>
      </Tabs>
      <style dangerouslySetInnerHTML={{
        __html: `
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.02);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.2);
        }
      `}} />
    </div>
  );
}

// Main component
export default function SlangHangResultPage() {
  return (
    <Suspense
      fallback={
        <div className="flex justify-center items-center min-h-screen bg-[#0a0e1a] text-white">
          <div className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent animate-pulse">Loading...</div>
        </div>
      }
    >
      <SlangHangWrapper />
    </Suspense>
  );
}

// Client component that uses useSearchParams
function SlangHangWrapper() {
  const searchParams = useSearchParams();
  const language = searchParams.get("language");

  return <SlangHangContent language={language} />;
}
