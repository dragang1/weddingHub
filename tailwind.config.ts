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
        surface: "#FAFAF8",
        ink: "#1C1917",
        muted: "#78716C",
        border: "#E7E5E4",
        accent: "rgb(160 132 92 / <alpha-value>)",
        "accent-hover": "rgb(134 112 63 / <alpha-value>)",
        "accent-soft": "#F5F0E8",
        rose: "rgb(194 158 152 / <alpha-value>)",
        "rose-soft": "#F9F2F0",
      },
      boxShadow: {
        soft: "0 1px 2px rgba(0,0,0,0.04), 0 1px 3px rgba(0,0,0,0.03)",
        "soft-lg":
          "0 4px 6px -1px rgba(0,0,0,0.05), 0 10px 30px -5px rgba(0,0,0,0.06)",
        card: "0 1px 3px rgba(0,0,0,0.03), 0 4px 16px rgba(0,0,0,0.04)",
        "card-hover":
          "0 4px 8px rgba(0,0,0,0.04), 0 16px 40px rgba(0,0,0,0.08)",
        glow: "0 0 20px rgba(160,132,92,0.15)",
      },
      borderRadius: {
        card: "1.25rem",
        button: "0.875rem",
      },
      keyframes: {
        "fade-in": {
          from: { opacity: "0", transform: "translateY(8px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in-up": {
          from: { opacity: "0", transform: "translateY(16px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
      animation: {
        "fade-in": "fade-in 0.5s ease-out forwards",
        "fade-in-up": "fade-in-up 0.6s ease-out forwards",
        shimmer: "shimmer 2s linear infinite",
      },
    },
  },
  plugins: [],
};
export default config;
