import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';

export default function Home() {
  return (
    <div className="min-h-screen bg-[#0a0e1a] text-white overflow-x-hidden font-sans selection:bg-cyan-500/30">
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes fadeInUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes float { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-15px); } }
        @keyframes pulse-glow { 0%,100% { opacity: 0.3; transform: scale(1); } 50% { opacity: 0.8; transform: scale(1.05); } }
        @keyframes bounce-subtle { 0%,100% { transform: translateY(0); } 50% { transform: translateY(8px); } }
        @keyframes gradient-shift { 0% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } 100% { background-position: 0% 50%; } }
        
        .animate-fade-in-up { animation: fadeInUp 0.8s ease-out forwards; }
        .animate-float { animation: float 6s ease-in-out infinite; }
        .animate-pulse-glow { animation: pulse-glow 4s ease-in-out infinite; }
        .animate-bounce-subtle { animation: bounce-subtle 2s ease-in-out infinite; }
        
        .glass-card { background: rgba(255, 255, 255, 0.03); backdrop-filter: blur(16px); border: 1px solid rgba(255, 255, 255, 0.08); box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1); }
        .glass-card:hover { border: 1px solid rgba(255, 255, 255, 0.15); }
      `}} />

      {/* Hero Section */}
      <section className="relative w-full min-h-screen flex flex-col items-center justify-center pt-20 pb-16 overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-cyan-600/20 blur-[120px] animate-pulse-glow" />
          <div className="absolute bottom-[-10%] right-[-5%] w-[50%] h-[50%] rounded-full bg-purple-600/20 blur-[150px] animate-pulse-glow" style={{ animationDelay: '2s' }} />
          <div className="absolute top-[30%] left-[60%] w-[20%] h-[20%] rounded-full bg-pink-600/10 blur-[100px] animate-pulse-glow" style={{ animationDelay: '1s' }} />
        </div>

        <div className="z-10 flex flex-col items-center text-center px-4 max-w-5xl mx-auto space-y-8">
          <div className="opacity-0 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            <div className="animate-float">
              <Image 
                src="/images/bhm_logo.png" 
                alt="BHM PRO" 
                width={80} 
                height={80} 
                className="drop-shadow-[0_0_15px_rgba(6,182,212,0.5)]"
                priority
              />
            </div>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight opacity-0 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
            <span className="bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Little Language Lessons
            </span>
            <span className="inline-block ml-3 animate-bounce-subtle" style={{ animationDuration: '3s' }}>🌍</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-400 max-w-2xl opacity-0 animate-fade-in-up font-light" style={{ animationDelay: '0.5s' }}>
            A collection of bite-sized learning experiments built with AI
          </p>
          
          <div className="opacity-0 animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
            <span className="px-4 py-1.5 rounded-full text-xs font-medium uppercase tracking-wider bg-white/5 border border-white/10 text-cyan-300">
              Powered by BHM PRO
            </span>
          </div>
        </div>

        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 opacity-0 animate-fade-in-up" style={{ animationDelay: '1s' }}>
          <div className="animate-bounce-subtle flex flex-col items-center text-gray-500">
            <span className="text-sm tracking-widest uppercase mb-2">Explore</span>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 5v14M19 12l-7 7-7-7"/>
            </svg>
          </div>
        </div>
      </section>

      {/* Experiments Section */}
      <section className="relative z-10 py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-16 opacity-0 animate-fade-in-up" style={{ animationDelay: '0.2s', animationFillMode: 'both' }}>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Choose Your Experiment</h2>
          <div className="h-1 w-20 bg-gradient-to-r from-cyan-500 to-purple-500 mx-auto rounded-full"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-20">
          {/* Card 1: Tiny Lesson */}
          <div className="opacity-0 animate-fade-in-up group" style={{ animationDelay: '0.4s', animationFillMode: 'both' }}>
            <Card className="glass-card h-full border-t-4 border-t-cyan-500/50 hover:border-t-cyan-400 transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_40px_rgba(6,182,212,0.15)] bg-transparent">
              <CardHeader className="pb-4">
                <div className="text-[10px] font-bold tracking-widest text-cyan-400 mb-2">EXPERIMENT NO. 001</div>
                <CardTitle className="text-2xl text-white">Tiny Lesson</CardTitle>
                <CardDescription className="text-gray-400 min-h-[60px] text-base mt-2">
                  Find relevant vocabulary, phrases, and grammar tips for any situation.
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col items-center pt-2">
                <div className="mb-8 mt-4 relative w-24 h-24 transition-transform duration-500 group-hover:scale-110">
                  <div className="absolute inset-0 bg-cyan-500/20 blur-xl rounded-full"></div>
                  <Image src="/hand-ladybug.png" alt="Tiny Lesson" width={100} height={100} className="relative z-10 object-contain drop-shadow-xl" />
                </div>
                <Link href="/tiny-lesson" className="w-full mt-auto">
                  <Button className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white border-0 shadow-lg group-hover:shadow-cyan-500/25 transition-all">
                    Try it &rarr;
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>

          {/* Card 2: Slang Hang */}
          <div className="opacity-0 animate-fade-in-up group" style={{ animationDelay: '0.6s', animationFillMode: 'both' }}>
            <Card className="glass-card h-full border-t-4 border-t-purple-500/50 hover:border-t-purple-400 transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_40px_rgba(168,85,247,0.15)] bg-transparent">
              <CardHeader className="pb-4">
                <div className="text-[10px] font-bold tracking-widest text-purple-400 mb-2">EXPERIMENT NO. 002</div>
                <CardTitle className="text-2xl text-white">Slang Hang</CardTitle>
                <CardDescription className="text-gray-400 min-h-[60px] text-base mt-2">
                  Learn expressions, idioms, and regional slang from a generated conversation between native speakers.
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col items-center pt-2">
                <div className="mb-8 mt-4 relative w-24 h-24 transition-transform duration-500 group-hover:scale-110">
                  <div className="absolute inset-0 bg-purple-500/20 blur-xl rounded-full"></div>
                  <Image src="/mouth-slang.png" alt="Slang Hang" width={100} height={100} className="relative z-10 object-contain drop-shadow-xl" />
                </div>
                <Link href="/slang-hang" className="w-full mt-auto">
                  <Button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white border-0 shadow-lg group-hover:shadow-purple-500/25 transition-all">
                    Try it &rarr;
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>

          {/* Card 3: Word Cam */}
          <div className="opacity-0 animate-fade-in-up group" style={{ animationDelay: '0.8s', animationFillMode: 'both' }}>
            <Card className="glass-card h-full border-t-4 border-t-emerald-500/50 hover:border-t-emerald-400 transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_40px_rgba(16,185,129,0.15)] bg-transparent relative overflow-hidden">
              <div className="absolute top-4 right-4 bg-emerald-500 text-white text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wide z-10">NEW</div>
              <CardHeader className="pb-4">
                <div className="text-[10px] font-bold tracking-widest text-emerald-400 mb-2">EXPERIMENT NO. 003</div>
                <CardTitle className="text-2xl text-white">Word Cam</CardTitle>
                <CardDescription className="text-gray-400 min-h-[60px] text-base mt-2">
                  Point your camera at any object and learn its name in any language instantly.
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col items-center pt-2">
                <div className="mb-8 mt-4 relative w-24 h-24 flex items-center justify-center transition-transform duration-500 group-hover:scale-110">
                  <div className="absolute inset-0 bg-emerald-500/20 blur-xl rounded-full"></div>
                  <span className="text-6xl relative z-10 drop-shadow-xl">📸</span>
                </div>
                <Link href="/word-cam" className="w-full mt-auto">
                  <Button className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white border-0 shadow-lg group-hover:shadow-emerald-500/25 transition-all">
                    Try it &rarr;
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-black/20 border-y border-white/5">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="glass-card p-6 rounded-2xl flex flex-col items-center text-center">
              <span className="text-4xl mb-4">🎯</span>
              <h3 className="text-lg font-semibold text-white mb-2">AI-Powered</h3>
              <p className="text-sm text-gray-400">Intelligent content generation using advanced AI</p>
            </div>
            <div className="glass-card p-6 rounded-2xl flex flex-col items-center text-center">
              <span className="text-4xl mb-4">🔊</span>
              <h3 className="text-lg font-semibold text-white mb-2">Natural Voices</h3>
              <p className="text-sm text-gray-400">Human-like text-to-speech in 25+ languages</p>
            </div>
            <div className="glass-card p-6 rounded-2xl flex flex-col items-center text-center">
              <span className="text-4xl mb-4">📱</span>
              <h3 className="text-lg font-semibold text-white mb-2">Mobile Ready</h3>
              <p className="text-sm text-gray-400">Learn on any device, anywhere, anytime</p>
            </div>
            <div className="glass-card p-6 rounded-2xl flex flex-col items-center text-center">
              <span className="text-4xl mb-4">🆓</span>
              <h3 className="text-lg font-semibold text-white mb-2">100% Free</h3>
              <p className="text-sm text-gray-400">No subscriptions, no hidden fees</p>
            </div>
          </div>
        </div>
      </section>

      {/* Developer Section */}
      <section className="py-16 px-4">
        <div className="max-w-lg mx-auto glass-card rounded-3xl p-8 text-center flex flex-col items-center justify-center">
          <h3 className="text-xl font-medium text-white mb-6">Meet the Developer</h3>
          <div className="relative mb-4 p-1 rounded-full bg-gradient-to-tr from-cyan-500 to-purple-500">
            <div className="bg-[#0a0e1a] rounded-full p-1">
              <Image 
                src="/images/developer.jpg" 
                alt="Developer" 
                width={80} 
                height={80} 
                className="rounded-full object-cover"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  e.currentTarget.nextElementSibling.style.display = 'flex';
                }}
              />
              <div className="w-[80px] h-[80px] rounded-full bg-gray-800 flex items-center justify-center hidden">
                <span className="text-2xl">👨‍💻</span>
              </div>
            </div>
          </div>
          <p className="text-gray-300 font-medium mb-1">Developed with passion</p>
          <p className="text-sm text-gray-500 mb-6">by the BHM PRO team</p>
          <div className="flex space-x-4">
            <span className="text-xs text-gray-600">&copy; {new Date().getFullYear()} BHM PRO</span>
          </div>
        </div>
      </section>
    </div>
  );
}
