// src/components/FloatingVoiceButton.tsx (Enhanced Version)
"use client";

import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Mic, X, Sparkles } from "lucide-react";
import { useState, useEffect } from "react";

export default function FloatingVoiceButton() {
  const pathname = usePathname();
  const router = useRouter();
  const [isHovered, setIsHovered] = useState(false);
  const [showWelcome, setShowWelcome] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);

  // Show welcome message on first visit (only once per session)
  useEffect(() => {
    const hasSeenWelcome = sessionStorage.getItem("voiceWelcomeSeen");
    if (!hasSeenWelcome && pathname !== "/voice" && pathname !== "/") {
      setTimeout(() => setShowWelcome(true), 2000);
      setTimeout(() => setShowWelcome(false), 8000);
      sessionStorage.setItem("voiceWelcomeSeen", "true");
    }
  }, [pathname]);

  // Keyboard shortcut: Press 'V' to open voice assistant
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === "v" && !e.ctrlKey && !e.metaKey && !e.altKey) {
        // Only if not typing in an input/textarea
        const target = e.target as HTMLElement;
        if (target.tagName !== "INPUT" && target.tagName !== "TEXTAREA") {
          router.push("/voice");
        }
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [router]);

  // Don't show on voice page itself or landing page
  if (pathname === "/voice" || pathname === "/") {
    return null;
  }

  if (isMinimized) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          size="sm"
          variant="outline"
          className="rounded-full shadow-lg bg-background"
          onClick={() => setIsMinimized(false)}
        >
          <Mic className="w-4 h-4 mr-1" />
          <span className="text-xs">Show</span>
        </Button>
      </div>
    );
  }

  return (
    <>
      {/* Floating Button Container */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
        
        {/* Welcome Message */}
        {showWelcome && (
          <div className="relative animate-in slide-in-from-bottom-4 fade-in duration-500">
            <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-4 py-3 rounded-lg shadow-2xl max-w-xs">
              <div className="flex items-start gap-2">
                <Sparkles className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-sm mb-1">Try Voice Assistant!</p>
                  <p className="text-xs opacity-90">
                    Ask farming questions in your language 🎙️
                  </p>
                  <p className="text-xs opacity-75 mt-1">
                    Press <kbd className="px-1 py-0.5 bg-white/20 rounded">V</kbd> to start
                  </p>
                </div>
                <button
                  onClick={() => setShowWelcome(false)}
                  className="ml-2 hover:bg-white/20 rounded p-1 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              {/* Arrow */}
              <div className="absolute bottom-0 right-8 transform translate-y-1/2 rotate-45 w-3 h-3 bg-emerald-600" />
            </div>
          </div>
        )}

        {/* Main Button */}
        <div className="relative">
          <Button
            size="lg"
            className="h-16 w-16 rounded-full shadow-2xl bg-gradient-to-br from-green-500 to-green-700 hover:from-green-600 hover:to-green-800 transition-all duration-300 border-4 border-white dark:border-gray-900 hover:shadow-green-500/50"
            onClick={() => router.push("/voice")}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            style={{
              transform: isHovered ? "scale(1.15) rotate(5deg)" : "scale(1) rotate(0deg)",
            }}
          >
            <Mic className="w-7 h-7 text-white" />
            
            {/* Animated Pulsing Ring */}
            <span className="absolute inset-0 rounded-full bg-green-500 animate-ping opacity-75" />
            
            {/* Red Live Indicator */}
            <span className="absolute -top-1 -right-1 flex h-4 w-4">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-4 w-4 bg-red-500 border-2 border-white dark:border-gray-900"></span>
            </span>

            {/* Sparkle Effect */}
            {isHovered && (
              <>
                <span className="absolute -top-2 -left-2 text-yellow-300 animate-pulse">✨</span>
                <span className="absolute -bottom-2 -right-2 text-yellow-300 animate-pulse delay-75">✨</span>
              </>
            )}
          </Button>

          {/* Hover Tooltip */}
          {isHovered && (
            <div className="absolute bottom-full right-0 mb-3 animate-in fade-in slide-in-from-bottom-2 duration-200">
              <div className="px-4 py-2 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 text-sm font-medium rounded-lg whitespace-nowrap shadow-xl">
                <div className="flex items-center gap-2">
                  <Mic className="w-4 h-4" />
                  <span>Voice Assistant</span>
                </div>
                <div className="text-xs opacity-75 mt-1">
                  Press <kbd className="px-1 py-0.5 bg-white/20 dark:bg-gray-900/20 rounded text-[10px]">V</kbd> key
                </div>
                <div className="absolute bottom-0 right-6 transform translate-y-1/2 rotate-45 w-2 h-2 bg-gray-900 dark:bg-gray-100" />
              </div>
            </div>
          )}

          {/* Minimize Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsMinimized(true);
            }}
            className="absolute -top-2 -left-2 w-6 h-6 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center shadow-lg transition-all opacity-0 hover:opacity-100 group-hover:opacity-100"
            title="Hide"
          >
            <X className="w-3 h-3 text-white" />
          </button>
        </div>
      </div>

      {/* Global Styles for Animations */}
      <style jsx global>{`
        @keyframes ripple {
          0% {
            box-shadow: 0 0 0 0 rgba(34, 197, 94, 0.7);
          }
          100% {
            box-shadow: 0 0 0 20px rgba(34, 197, 94, 0);
          }
        }
        
        .delay-75 {
          animation-delay: 75ms;
        }
      `}</style>
    </>
  );
}