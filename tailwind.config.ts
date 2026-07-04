import { ThermometerSunIcon } from "lucide-react";
import type { Config } from "tailwindcss";

// In Tailwind v4, most configuration is done via CSS @theme in globals.css
// This file is kept for tooling compatibility
const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};

export default config;  
