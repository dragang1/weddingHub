import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import { ActiveSectionProvider } from "@/contexts/ActiveSectionContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import "./globals.css";

// next/font automatski preloada fontove (subsets: ["latin"]); display: "swap" izbjegava nevidljiv tekst (FOIT) dok fontovi učitavaju
const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Event Hub — Pružaoci usluga za vjenčanje",
  description:
    "Pronađite pružaoce usluga za vjenčanje i događaje. Muzika, fotografija, sale, torte i više.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="hr" className={`${playfair.variable} ${inter.variable}`} suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var s=localStorage.getItem('weddinghub-theme');var d=s==='dark'||(s!=='light'&&typeof window!=='undefined'&&window.matchMedia&&window.matchMedia('(prefers-color-scheme: dark)').matches);document.documentElement.classList.add(d?'dark':'light');}catch(e){document.documentElement.classList.add('light');}})();`,
          }}
        />
      </head>
      <body className="min-h-screen min-w-0 flex flex-col overflow-x-hidden bg-cream font-sans antialiased text-ink dark:bg-stone-900 dark:text-stone-100">
        <ThemeProvider>
          <ActiveSectionProvider>
            {children}
          </ActiveSectionProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
