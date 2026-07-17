import { Platform } from "react-native";

// iOS ships Helvetica Neue natively. Android has no system Helvetica Neue and
// it isn't freely licensed for redistribution, so it falls back to a system
// sans-serif until licensed font files are bundled via expo-font — keeping
// this a one-line decision instead of scattered Platform.select calls.
export const fontFamily = Platform.select({
  ios: "Helvetica Neue",
  default: "sans-serif",
});

// Mirrors the web type scale (text-4xl/6xl/7xl hero, text-3xl/4xl section
// headings, text-sm/base body) as RN fontSize/lineHeight tokens.
export const typeScale = {
  hero: { fontSize: 56, lineHeight: 60, fontWeight: "700" as const },
  h1: { fontSize: 40, lineHeight: 46, fontWeight: "700" as const },
  h2: { fontSize: 30, lineHeight: 36, fontWeight: "700" as const },
  h3: { fontSize: 22, lineHeight: 28, fontWeight: "600" as const },
  body: { fontSize: 16, lineHeight: 24, fontWeight: "400" as const },
  bodySm: { fontSize: 14, lineHeight: 20, fontWeight: "400" as const },
  caption: { fontSize: 12, lineHeight: 16, fontWeight: "500" as const },
};
