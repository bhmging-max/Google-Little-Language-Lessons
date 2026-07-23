import { Inter } from "next/font/google";
import Link from "next/link";
import Image from "next/image";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata = {
  title: "BHM PRO - Language Learning",
  description: "AI-powered language learning platform by BHM PRO.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} font-sans antialiased bg-background text-foreground min-h-screen flex flex-col`}>
        <div className="particles-container"></div>
        <nav className="glass-nav fixed top-0 w-full z-50 flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
              <div className="relative w-10 h-10 overflow-hidden rounded-lg glow-border">
                <Image 
                  src="/images/bhm_logo.png" 
                  alt="BHM PRO Logo" 
                  width={40} 
                  height={40} 
                  className="object-cover"
                />
              </div>
              <span className="font-bold text-xl tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-primary via-secondary to-accent">
                BHM PRO
              </span>
            </Link>
          </div>
          
          <div className="hidden md:flex items-center gap-8 font-medium">
            <Link href="/" className="text-sm hover:text-primary transition-colors">Home</Link>
            <Link href="/tiny-lesson" className="text-sm hover:text-secondary transition-colors">Tiny Lesson</Link>
            <Link href="/slang-hang" className="text-sm hover:text-accent transition-colors">Slang Hang</Link>
            <Link href="/word-cam" className="text-sm hover:text-primary transition-colors">Word Cam</Link>
          </div>
          
          <div className="flex items-center gap-4">
            <button className="bg-primary text-primary-foreground px-4 py-2 rounded-md text-sm font-semibold btn-ripple hover:opacity-90 transition-opacity shadow-lg shadow-primary/20">
              Get Started
            </button>
          </div>
        </nav>

        <main className="flex-grow pt-24 pb-12 px-6 sm:px-12 max-w-7xl mx-auto w-full relative z-10 animate-fade-in-up">
          {children}
        </main>

        <footer className="border-t border-white/10 mt-auto relative z-10 bg-[#0a0e1a]/50 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-6 py-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex flex-col items-center md:items-start gap-1">
              <p className="text-sm text-muted-foreground font-medium">
                Built with <span className="text-destructive animate-pulse">❤️</span> by BHM PRO
              </p>
              <p className="text-xs text-muted-foreground/60">
                &copy; {new Date().getFullYear()} All rights reserved.
              </p>
            </div>
            
            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              <Link href="#" className="hover:text-primary transition-colors">Experiments</Link>
              <Link href="#" className="hover:text-secondary transition-colors">Developer Credit</Link>
              <Link href="#" className="hover:text-accent transition-colors">Terms</Link>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
