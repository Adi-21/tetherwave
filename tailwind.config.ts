import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      fontFamily: {
        manrope: ["var(--font-manrope)"],
        inter: ["var(--font-inter)"],
      },
      animation: {
        "spin-slow": "spin 8s linear infinite",
        "spin-slower": "spin 5s linear infinite",
        "reverse-spin": "reverse-spin 5s linear infinite",
        "shimmer-slide": "shimmer-slide 3s linear infinite",
      },
      keyframes: {
        "reverse-spin": {
          from: {
            transform: "rotate(360deg)",
          },
        },
        "shimmer-slide": {
          "0%": { transform: "translateX(-400%) skewX(-30deg)" },
          "100%": { transform: "translateX(400%) skewX(-30deg)" },
        },
      },
    },
  },
  plugins: [],
} satisfies Config;
