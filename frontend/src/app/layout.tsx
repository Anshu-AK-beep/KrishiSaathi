import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import Navbar from "@/components/Navbar";
import FloatingVoiceButton from "@/components/FloatingVoiceButton";
import { LanguageProvider } from "@/contexts/LanguageContext";
import QueryProvider from "@/providers/query-provider"; // ⭐ ADD THIS

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "KrishiSaathi - Smart Farming Assistant",
  description: "AI-powered crop yield prediction and farming assistance for Indian farmers",
  keywords: "farming, crop prediction, agriculture, AI, India, KrishiSaathi",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body className={inter.className}>
          <QueryProvider>               {/* ⭐ WRAP EVERYTHING HERE */}
            <LanguageProvider>
              <Navbar />
              <main className="pt-16">
                {children}
              </main>
              <FloatingVoiceButton />
            </LanguageProvider>
          </QueryProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
