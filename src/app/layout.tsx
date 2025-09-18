import "./globals.css";

// services, features, and other libraries
import { cn } from "@/lib/utils";
import { Analytics } from "@vercel/analytics/next";

// components
import { ThemeProvider } from "next-themes";
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

export default function Layout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" translate="no" suppressHydrationWarning>
      <body
        className={cn(
          `${fontSans.variable} ${fontMono.variable} grid font-mono antialiased`,
          "grid-cols-[1fr] grid-rows-[auto_1fr_auto] [grid-template-areas:'header''main''footer']",
        )}
      >
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          {children}
          <Toaster richColors />
          <Analytics debug={false} />
        </ThemeProvider>
      </body>
    </html>
  );
}
