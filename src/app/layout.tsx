import "./globals.css";

// components
import { Toaster } from "@/components/ui/sonner";

// assets
import { fontSans, fontMono } from "@/assets/fonts";

// types
import type { Metadata } from "next";

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

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" translate="no">
      <body className={`${fontSans.variable} ${fontMono.variable} dark font-mono antialiased`}>
        <main>{children}</main>
        <Toaster richColors />
      </body>
    </html>
  );
}
