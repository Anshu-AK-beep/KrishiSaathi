"use client";

import { UserButton, useUser } from "@clerk/nextjs";
import LanguageSelector from "@/components/LanguageSelector";
import { useLanguage } from "@/contexts/LanguageContext";
import { 
  HomeIcon, 
  Sprout, 
  Shield,
  TrendingUp,
  Mic
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

function Navbar() {
  const { user } = useUser();
  const pathname = usePathname();
  const { t } = useLanguage();

  // Check if user is admin
  const isAdmin = user?.publicMetadata?.role === "ADMIN" || 
                  user?.emailAddresses?.[0]?.emailAddress?.includes("admin");

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-2 border-b border-border/50 bg-background/80 backdrop-blur-md h-16">
      <div className="max-w-7xl mx-auto flex justify-between items-center h-full">
        {/* LOGO */}
        <div className="flex items-center gap-8">
          <Link href="/dashboard" className="flex items-center gap-2 group">
            <div className="relative">
              <Image 
                src="/LOGO-ONLY.png" 
                alt="KrishiSaathi Logo" 
                width={32} 
                height={32} 
                className="w-11 transition-transform group-hover:scale-110" 
              />
            </div>
            <span className="hidden xl:block text-lg font-semibold text-foreground">
              KrishiSaathi
            </span>
          </Link>

          <div className="flex items-center gap-6">
            {/* Dashboard Link */}
            <Link
              href="/dashboard"
              className={`flex items-center gap-2 transition-colors ${
                pathname === "/dashboard"
                  ? "text-primary font-medium"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <HomeIcon className="w-4 h-4" />
              <span className="hidden md:inline">{t('dashboard')}</span>
            </Link>

            {/* Admin-Only Link */}
            {isAdmin && (
              <Link
                href="/admin"
                className={`flex items-center gap-2 transition-colors ${
                  pathname === "/admin"
                    ? "text-primary font-medium"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Shield className="w-4 h-4" />
                <span className="hidden md:inline">Admin</span>
              </Link>
            )}

            {/* Predictions Link - Farmers Only */}
            {!isAdmin && (
              <Link
                href="/predict"
                className={`flex items-center gap-2 transition-colors ${
                  pathname === "/predict"
                    ? "text-primary font-medium"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <TrendingUp className="w-4 h-4" />
                <span className="hidden md:inline">{t('predictions')}</span>
              </Link>
            )}

            {/* Farm Profile Link - Farmers Only */}
            {!isAdmin && (
              <Link
                href="/farms"
                className={`flex items-center gap-2 transition-colors ${
                  pathname === "/farms" || pathname === "/farm-profile"
                    ? "text-primary font-medium"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Sprout className="w-4 h-4" />
                <span className="hidden md:inline">{t('myFarms')}</span>
              </Link>
            )}

            {/* Voice Assistant Link - Farmers Only */}
            {!isAdmin && (
              <Link
                href="/voice"
                className={`flex items-center gap-2 transition-colors relative ${
                  pathname === "/voice"
                    ? "text-primary font-medium"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <div className="relative">
                  <Mic className="w-4 h-4" />
                  <span className="absolute -top-1 -right-1 w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                </div>
                <span className="hidden md:inline">{t('voiceAssistant')}</span>
                <span className="hidden lg:inline-block ml-1 px-1.5 py-0.5 bg-green-600 text-white text-[10px] font-semibold rounded">
                  NEW
                </span>
              </Link>
            )}
          </div>
        </div>

        {/* RIGHT SECTION */}
        <div className="flex items-center gap-4">
          {/* Language Selector */}
          <LanguageSelector />
          
          <div className="flex items-center gap-3">
            {/* User Info */}
            <div className="hidden lg:flex flex-col items-end">
              <span className="text-sm font-medium text-foreground">
                {user?.firstName} {user?.lastName}
              </span>
              <span className="text-xs text-muted-foreground">
                {isAdmin ? "Administrator" : "Farmer"}
              </span>
            </div>

            {/* Clerk User Button */}
            <UserButton 
              afterSignOutUrl="/"
              appearance={{
                elements: {
                  avatarBox: "w-10 h-10 ring-2 ring-primary/20 hover:ring-primary/40 transition-all"
                }
              }}
            />
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;