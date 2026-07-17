// Single source of truth for the palette — mirrors src/app/globals.css on the
// KinoX Plus web app so both codebases render the exact same brand colors
// (KinoX Plus Brand Guidelines v2.0 — Black / White / Cobalt Blue). Dark is
// the guide's native direction; light is the adaptive counterpart used when
// Appearance resolves to light.
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
  royal: string;
  silver: string;
};

export const darkColors: ThemePalette = {
  background: "#0a0a0a", // Black
  foreground: "#ffffff", // White

  navy950: "#0a0a0a", // Black
  navy900: "#1a1a1a",
  navy800: "#3a3a3a", // Dark Grey

  // Cobalt Blue — primary accent (CTAs, active states, brand mark). Constant
  // across themes for brand consistency.
  blue600: "#0047ab", // Cobalt Blue
  blue700: "#003d82",
  blue500: "#0f52ba", // Sapphire
  blue400: "#4169e1", // Royal Blue
  // In dark mode these are light tints used as text/icon color on dark surfaces.
  blue300: "#007fff", // Azure
  blue200: "#5ca9ff",
  blue100: "#b8d9ff",

  line: "#ffffff", // hairline borders/dividers, always used at low opacity
  elevated: "#ffffff", // translucent fill for secondary surfaces, always used at low opacity

  // Second "X" triangle / premium "Plus" accent. Royal is brand-invariant
  // (matches blue400); Silver is darkened per-theme below for legibility.
  royal: "#4169e1", // Royal Blue
  silver: "#c0c0c0", // Silver
};

export const lightColors: ThemePalette = {
  background: "#ffffff",
  foreground: "#0a0a0a", // Black — "text on light"

  // Elevation surfaces: light greys instead of pure white so cards/sheets/
  // inputs still read as "raised" above the background.
  navy950: "#f2f2f2",
  navy900: "#e8e8e8",
  navy800: "#d9d9d9", // Light Grey

  blue600: "#0047ab", // Cobalt Blue
  blue700: "#003d82",
  blue500: "#0f52ba", // Sapphire
  // Darkened counterparts of the dark-mode text tints so blue-100/200/300/400
  // stay legible on a light background instead of washing out.
  blue400: "#2f55c4",
  blue300: "#0062cc",
  blue200: "#0d4fa0",
  blue100: "#0a3d7a",

  line: "#0a0a0a",
  elevated: "#0a0a0a",

  royal: "#2f55c4", // darkened Royal Blue, matches blue400 above
  silver: "#7a7a7a", // darkened Silver — #c0c0c0 washes out on white
};

// Default export used by tailwind.config.js at build time (Node, no React
// context available) and as the initial paint before the theme store
// resolves — always dark, matching the app's original design direction.
export const colors = darkColors;

export type ColorToken = keyof typeof colors;
