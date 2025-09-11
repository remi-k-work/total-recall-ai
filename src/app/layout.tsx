import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// constants
export const metadata: Metadata = {
  title: "Total Recall AI: Your AI-Powered Memory Assistant",
  description:
    "An innovative note-taking application powered by artificial intelligence. Ask questions about your notes, get instant answers, and find connections across all your thoughts with an AI that has total recall of your personal knowledge.",
  authors: [{ name: "Remi" }],
  robots: { index: true, follow: true },
  category: "technology",
  other: { google: "notranslate" },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" translate="no">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>{children}</body>
    </html>
  );
}
