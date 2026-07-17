/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: [
    "./App.tsx",
    "./index.ts",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        // Resolved via CSS variables set at runtime (see theme/vars.ts +
        // App.tsx) so switching light/dark re-themes every usage of these
        // token names instantly, without needing dark: variants everywhere.
        background: "rgb(var(--color-background) / <alpha-value>)",
        foreground: "rgb(var(--color-foreground) / <alpha-value>)",
        navy: {
          950: "rgb(var(--color-navy-950) / <alpha-value>)",
          900: "rgb(var(--color-navy-900) / <alpha-value>)",
          800: "rgb(var(--color-navy-800) / <alpha-value>)",
        },
        blue: {
          100: "rgb(var(--color-blue-100) / <alpha-value>)",
          200: "rgb(var(--color-blue-200) / <alpha-value>)",
          300: "rgb(var(--color-blue-300) / <alpha-value>)",
          400: "rgb(var(--color-blue-400) / <alpha-value>)",
          500: "rgb(var(--color-blue-500) / <alpha-value>)",
          600: "rgb(var(--color-blue-600) / <alpha-value>)",
          700: "rgb(var(--color-blue-700) / <alpha-value>)",
        },
        // Adaptive replacements for what used to be literal white/black
        // utilities (border-white/10, bg-white/10, text-white) — same
        // opacity suffixes work via Tailwind's <alpha-value>.
        line: "rgb(var(--color-line) / <alpha-value>)",
        elevated: "rgb(var(--color-elevated) / <alpha-value>)",
        // Second "X" triangle / premium "Plus" accent — darkened per-theme
        // for legibility, so these resolve via CSS variables too (see
        // theme/colors.ts + theme/vars.ts).
        royal: "rgb(var(--color-royal) / <alpha-value>)",
        silver: "rgb(var(--color-silver) / <alpha-value>)",
      },
      fontFamily: {
        // Weight-specific PostScript names loaded via @expo-google-fonts/manrope
        // (see App.tsx) — React Native has no variable-font/font-weight
        // matching for custom fonts, so each weight is its own family here.
        sans: ["Manrope_400Regular", "Helvetica Neue", "Helvetica", "Arial", "sans-serif"],
      },
    },
  },
  plugins: [],
};
