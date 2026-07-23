"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Camera, Upload, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

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

export default function WordCam() {
  const [selectedLanguage, setSelectedLanguage] = useState(languages[1].value); // Default Spanish
  const [cameraActive, setCameraActive] = useState(false);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const fileInputRef = useRef(null);
  const router = useRouter();

  const handleLanguageChange = (val) => setSelectedLanguage(val);

  const startCamera = async () => {
    setCameraActive(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error("Error accessing camera:", err);
      alert("Could not access the camera. Please check permissions or try uploading an image.");
      setCameraActive(false);
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = videoRef.current.srcObject.getTracks();
      tracks.forEach(track => track.stop());
    }
    setCameraActive(false);
  };

  const takePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
      stopCamera();
      processImage(dataUrl);
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result;
      if (dataUrl) {
        processImage(dataUrl);
      }
    };
    reader.readAsDataURL(file);
  };

  const processImage = (base64Image) => {
    sessionStorage.setItem('wordCamImage', base64Image);
    const langLabel = languages.find(l => l.value === selectedLanguage)?.label || 'Spanish';
    router.push(`/word-cam/result?language=${encodeURIComponent(langLabel)}`);
  };

  return (
    <div className="min-h-screen bg-[#0a0e1a] text-white p-6 selection:bg-purple-500/30 font-sans">
      <div className="max-w-2xl mx-auto space-y-8">
        <header className="text-center space-y-4 pt-8">
          <div className="inline-flex items-center justify-center p-3 bg-purple-500/10 rounded-2xl mb-2 backdrop-blur-sm border border-purple-500/20">
            <span className="text-4xl">📸</span>
          </div>
          <div className="text-xs font-bold tracking-widest text-purple-400 uppercase">Experiment No. 003</div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600">
            Word Cam
          </h1>
          <p className="text-gray-400 max-w-md mx-auto text-lg leading-relaxed">
            Point your camera at any object and learn its name in any language.
          </p>
        </header>

        <Card className="bg-white/5 border-white/10 backdrop-blur-xl shadow-2xl rounded-3xl overflow-hidden">
          <CardContent className="p-8 space-y-8">
            <div className="space-y-3">
              <label className="text-sm font-medium text-gray-300 ml-1">Target Language</label>
              <Select value={selectedLanguage} onValueChange={handleLanguageChange}>
                <SelectTrigger className="w-full h-14 bg-black/40 border-white/10 text-white rounded-xl focus:ring-purple-500/50 text-lg">
                  <SelectValue placeholder="Select a language" />
                </SelectTrigger>
                <SelectContent className="bg-[#111827] border-white/10 text-white max-h-[300px]">
                  {languages.map(lang => (
                    <SelectItem key={lang.value} value={lang.value} className="focus:bg-purple-500/20 focus:text-white cursor-pointer py-3">
                      {lang.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {cameraActive ? (
              <div className="relative rounded-2xl overflow-hidden bg-black aspect-video md:aspect-[3/4] lg:aspect-video flex items-center justify-center shadow-inner border border-white/10">
                <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
                <canvas ref={canvasRef} className="hidden" />
                <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-4 px-4">
                  <Button onClick={takePhoto} className="h-16 w-16 rounded-full bg-white hover:bg-gray-200 text-black shadow-[0_0_20px_rgba(255,255,255,0.4)] flex items-center justify-center transition-transform hover:scale-105">
                    <Camera className="w-8 h-8" />
                  </Button>
                  <Button onClick={stopCamera} variant="outline" className="h-16 px-6 rounded-full bg-black/50 hover:bg-black/80 backdrop-blur-md text-white border-white/20">
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button 
                  onClick={startCamera} 
                  className="h-32 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-blue-600/20 hover:from-cyan-500/30 hover:to-blue-600/30 border border-cyan-500/30 flex flex-col gap-3 transition-all duration-300 hover:shadow-[0_0_30px_rgba(6,182,212,0.2)]"
                >
                  <Camera className="w-8 h-8 text-cyan-400" />
                  <span className="text-lg font-semibold text-white">Take Photo</span>
                </Button>
                
                <Button 
                  onClick={() => fileInputRef.current?.click()} 
                  className="h-32 rounded-2xl bg-gradient-to-br from-purple-500/20 to-pink-600/20 hover:from-purple-500/30 hover:to-pink-600/30 border border-purple-500/30 flex flex-col gap-3 transition-all duration-300 hover:shadow-[0_0_30px_rgba(168,85,247,0.2)]"
                >
                  <Upload className="w-8 h-8 text-purple-400" />
                  <span className="text-lg font-semibold text-white">Upload Image</span>
                </Button>
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  className="hidden" 
                  accept="image/*" 
                  onChange={handleFileUpload} 
                />
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
