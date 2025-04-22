import type { Config } from "tailwindcss";

export default {
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
        'gray': {
          100: '#fafafa',
          200: '#f0f0f0',
          300: '#d9d9d9',
          400: '#8c8c8c',
          500: '#595959',
          600: '#434343',
          700: '#262626',
          800: '#1f1f1f',
          900: '#141414',
        }
      },
    },
  },
  plugins: [
    require("@tailwindcss/typography")
  ],
} satisfies Config;
