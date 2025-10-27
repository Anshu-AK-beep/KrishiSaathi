import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import UserSync from "@/components/UserSync";
import TanStackProvider from "@/components/providers/TanStackProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "KrishiSaathi - Digital Farming Solution",
  description: "Transforming Indian Agriculture Through Technology",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <TanStackProvider>
          <ClerkProvider
            appearance={{
              variables: {
                colorPrimary: "#228b22",
                colorBackground: "#f8fce7",
                colorText: "#1e1e1e",
                colorTextSecondary: "#282828",
                colorInputBackground: "#cedac4",
              },
            }}
          >
            <UserSync />
            {children}
          </ClerkProvider>
        </TanStackProvider>
      </body>
    </html>
  );
}
