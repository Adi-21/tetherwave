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
        bgLight: "var(--bgLight)",
        bgDark: "var(--bgDark)",
        text: "var(--text)",
        pink: "var(--pink)",
        purple: "var(--purple)",
        blue: "var(--blue)",
      },
      fontFamily: {
        manrope: ["var(--font-manrope)"],
        inter: ["var(--font-inter)"],
      },
    },
  },
  plugins: [],
} satisfies Config;
