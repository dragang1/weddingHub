import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "-apple-system", "sans-serif"],
        serif: [
          "var(--font-playfair)",
          "Georgia",
          "Times New Roman",
          "serif",
        ],
      },
      colors: {
        surface: "#FAFAF7",
        ink: "#18181B",
        muted: "#71717A",
        border: "#E4E4E7",
        accent: "rgb(146 118 74 / <alpha-value>)",
        "accent-hover": "rgb(122 99 57 / <alpha-value>)",
        "accent-soft": "#F5F1EA",
        sage: "rgb(107 127 107 / <alpha-value>)",
        "sage-soft": "#F0F4F0",
        blush: "rgb(201 169 166 / <alpha-value>)",
        "blush-soft": "#FAF5F4",
      },
      boxShadow: {
        soft: "0 1px 2px rgba(0,0,0,0.03), 0 1px 3px rgba(0,0,0,0.02)",
        elevated:
          "0 2px 4px rgba(0,0,0,0.03), 0 6px 24px rgba(0,0,0,0.05)",
        prominent:
          "0 4px 12px rgba(0,0,0,0.04), 0 20px 48px rgba(0,0,0,0.08)",
        "inner-glow": "inset 0 0 0 1px rgba(146,118,74,0.15), 0 0 0 3px rgba(146,118,74,0.06)",
        glow: "0 0 24px rgba(146,118,74,0.12)",
      },
      borderRadius: {
        card: "1rem",
        button: "0.625rem",
      },
      keyframes: {
        "fade-in": {
          from: { opacity: "0", transform: "translateY(6px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in-up": {
          from: { opacity: "0", transform: "translateY(12px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
      animation: {
        "fade-in": "fade-in 0.4s ease-out forwards",
        "fade-in-up": "fade-in-up 0.5s ease-out forwards",
        shimmer: "shimmer 2s linear infinite",
      },
    },
  },
  plugins: [],
};
export default config;
