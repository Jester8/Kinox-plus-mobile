// Single source of truth for the palette — mirrors src/app/globals.css on the
// KinoX Plus web app so both codebases render the exact same brand colors
// (KinoX Plus Brand Guidelines v1.0, July 2026). Dark is the guide's native
// direction ("a cinema at night"); light is the adaptive counterpart used
// when Appearance resolves to light.
export type ThemePalette = {
  background: string;
  foreground: string;
  navy950: string;
  navy900: string;
  navy800: string;
  blue600: string;
  blue700: string;
  blue500: string;
  blue400: string;
  blue300: string;
  blue200: string;
  blue100: string;
  line: string;
  elevated: string;
  coral: string;
  champagne: string;
};

export const darkColors: ThemePalette = {
  background: "#0a0e1a", // Cinema Ink
  foreground: "#f6f7fb", // Cloud

  navy950: "#0a0e1a", // Cinema Ink
  navy900: "#10182c",
  navy800: "#141b2e", // Midnight

  // Aurora Violet — cool signature, primary accent (CTAs, active states,
  // brand mark). Constant across themes for brand consistency.
  blue600: "#7b5cff",
  blue700: "#6247e0",
  blue500: "#9478ff",
  blue400: "#ab97ff",
  // In dark mode these are light tints used as text/icon color on dark surfaces.
  blue300: "#c7bbff",
  blue200: "#ded6ff",
  blue100: "#f0ecff",

  line: "#ffffff", // hairline borders/dividers, always used at low opacity
  elevated: "#ffffff", // translucent fill for secondary surfaces, always used at low opacity

  // Signature warm color and premium "Plus" accent — brand-invariant, same
  // hex in both themes (used as solid fills/icons, not raw body text).
  coral: "#ff6b5b", // Sunset Coral
  champagne: "#e8c07d", // Champagne
};

export const lightColors: ThemePalette = {
  background: "#ffffff",
  foreground: "#0a0e1a", // Cinema Ink — "text on light" per brand guide

  // Elevation surfaces: subtle violet-tinted grays instead of pure white so
  // cards/sheets/inputs still read as "raised" above the background.
  navy950: "#f3f2fb",
  navy900: "#e9e6f9",
  navy800: "#dcd7f5",

  blue600: "#7b5cff",
  blue700: "#6247e0",
  blue500: "#9478ff",
  // Darkened counterparts of the dark-mode text tints so blue-100/200/300/400
  // stay legible on a light background instead of washing out.
  blue400: "#6b4fe0",
  blue300: "#5636c9",
  blue200: "#4a2ba8",
  blue100: "#3d2088",

  line: "#0a0e1a",
  elevated: "#0a0e1a",

  coral: "#ff6b5b",
  champagne: "#e8c07d",
};

// Default export used by tailwind.config.js at build time (Node, no React
// context available) and as the initial paint before the theme store
// resolves — always dark, matching the app's original design direction.
export const colors = darkColors;

export type ColorToken = keyof typeof colors;
