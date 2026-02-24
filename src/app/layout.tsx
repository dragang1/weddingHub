import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";

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
    <html lang="hr" className={`${playfair.variable} ${inter.variable}`}>
      <body className="min-h-screen min-w-0 flex flex-col overflow-x-hidden bg-cream font-sans antialiased text-ink">
        {children}
      </body>
    </html>
  );
}
