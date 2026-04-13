import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        primary: "#D85A30",
        secondary: "#2563EB",
        hsk1: { DEFAULT: '#E53E3E', light: '#FFF5F5' },
        hsk2: { DEFAULT: '#DD6B20', light: '#FFFAF0' },
        hsk3: { DEFAULT: '#D69E2E', light: '#FFFFF0' },
        brand: { DEFAULT: '#D85A30' },
      },
      borderRadius: {
        '4xl': '2rem',
        '5xl': '2.5rem',
      },
      fontFamily: {
        sans: ['var(--font-outfit)', 'Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
export default config;
