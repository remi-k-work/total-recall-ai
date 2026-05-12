import "./globals.css";

// services, features, and other libraries
import { cn } from "@/lib/utils";
import { Analytics } from "@vercel/analytics/next";

// components
import { ThemeProvider } from "next-themes";
import DemoModeProvider from "@/contexts/DemoMode";
import { RegistryProvider } from "@effect-atom/atom-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Toaster } from "@/components/ui/custom/sonner";

// assets
import { fontSans, fontMono } from "@/assets/fonts";

// types
import type { Metadata } from "next";

// constants
export const metadata: Metadata = {
  title: "Total Recall AI — AI Note-Taking & Personal Knowledge Assistant",
  description:
    "An innovative note-taking application powered by artificial intelligence. Ask questions about your notes, get instant answers, and find connections across all your thoughts with an AI that has total recall of your personal knowledge.",
  authors: [{ name: "Remi" }],
  robots: { index: true, follow: true },
  category: "productivity",
  keywords: [
    "AI note-taking app",
    "AI memory assistant",
    "personal knowledge base",
    "second brain app",
    "AI notes",
    "knowledge management",
    "AI productivity tool",
    "chat with notes",
    "semantic note search",
    "AI-powered notes",
    "note organization",
    "personal knowledge management",
    "smart notes",
    "artificial intelligence assistant",
    "digital memory assistant",
  ],
  other: { google: "notranslate" },

  metadataBase: new URL("https://total-recall-ai.remiforge.dev"),
  alternates: { canonical: "/" },
};

export default function Layout({ notes, children }: LayoutProps<"/">) {
  return (
    <html lang="en" translate="no" suppressHydrationWarning>
      <body
        className={cn(
          `${fontSans.variable} ${fontMono.variable} grid font-mono antialiased`,
          "grid-cols-[1fr] grid-rows-[auto_1fr_auto] [grid-template-areas:'header''main''footer']"
        )}
      >
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <DemoModeProvider>
            <RegistryProvider>
              <Header />
              <main className="mx-4 [grid-area:main]">
                {children}
                {notes}
              </main>
              <Footer />
              <Toaster richColors />
              <Analytics debug={false} />
            </RegistryProvider>
          </DemoModeProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
