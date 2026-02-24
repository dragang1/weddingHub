import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/contexts/**/*.{js,ts,jsx,tsx,mdx}",
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
        surface: "#FBF9F6",
        ink: "#1C1917",
        muted: "#57534E",
        border: "#E7E5E4",
        accent: "#B8860B",
        "accent-hover": "#9A7209",
        "accent-soft": "#FEF3C7",
        dark: "#1C1917",
        rose: "#B76E79",
        "rose-soft": "#FDF2F4",
        cream: "#F7F5F2",
        sage: "#5B7B7A",
        "sage-soft": "#E8F0EF",
      },
      boxShadow: {
        soft: "0 2px 8px rgba(0, 0, 0, 0.04)",
        elevated: "0 10px 30px -10px rgba(0, 0, 0, 0.08)",
        prominent: "0 20px 40px -15px rgba(0, 0, 0, 0.12)",
        "inner-glow": "inset 0 0 0 1px rgba(184, 134, 11, 0.2), 0 0 0 3px rgba(184, 134, 11, 0.1)",
        glow: "0 0 30px rgba(184, 134, 11, 0.2)",
        "marketplace": "0 4px 24px -4px rgba(28, 25, 23, 0.06), 0 0 0 1px rgba(28, 25, 23, 0.03)",
        "marketplace-hover": "0 24px 48px -12px rgba(28, 25, 23, 0.12), 0 0 0 1px rgba(28, 25, 23, 0.04)",
        "marketplace-glow": "0 0 0 1px rgba(184, 134, 11, 0.2), 0 12px 40px -8px rgba(184, 134, 11, 0.15)",
      },
      borderRadius: {
        card: "1.25rem",
        button: "9999px",
        "marketplace": "1.5rem",
        "marketplace-lg": "1.75rem",
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
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-6px)" },
        },
        "avatar-stack": {
          "0%, 100%": { transform: "translateX(0)" },
          "50%": { transform: "translateX(2px)" },
        },
      },
      animation: {
        "fade-in": "fade-in 0.4s ease-out forwards",
        "fade-in-up": "fade-in-up 0.5s ease-out forwards",
        shimmer: "shimmer 2s linear infinite",
        float: "float 4s ease-in-out infinite",
        "avatar-stack": "avatar-stack 3s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
export default config;
