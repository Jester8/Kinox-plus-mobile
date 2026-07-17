import { vars } from "nativewind";
import { darkColors, lightColors, type ThemePalette } from "./colors";

function hexToRgbTriplet(hex: string): string {
  const value = hex.replace("#", "");
  const r = parseInt(value.slice(0, 2), 16);
  const g = parseInt(value.slice(2, 4), 16);
  const b = parseInt(value.slice(4, 6), 16);
  return `${r} ${g} ${b}`;
}

function paletteToVars(palette: ThemePalette) {
  return vars({
    "--color-background": hexToRgbTriplet(palette.background),
    "--color-foreground": hexToRgbTriplet(palette.foreground),
    "--color-navy-950": hexToRgbTriplet(palette.navy950),
    "--color-navy-900": hexToRgbTriplet(palette.navy900),
    "--color-navy-800": hexToRgbTriplet(palette.navy800),
    "--color-blue-100": hexToRgbTriplet(palette.blue100),
    "--color-blue-200": hexToRgbTriplet(palette.blue200),
    "--color-blue-300": hexToRgbTriplet(palette.blue300),
    "--color-blue-400": hexToRgbTriplet(palette.blue400),
    "--color-blue-500": hexToRgbTriplet(palette.blue500),
    "--color-blue-600": hexToRgbTriplet(palette.blue600),
    "--color-blue-700": hexToRgbTriplet(palette.blue700),
    "--color-line": hexToRgbTriplet(palette.line),
    "--color-elevated": hexToRgbTriplet(palette.elevated),
    "--color-royal": hexToRgbTriplet(palette.royal),
    "--color-silver": hexToRgbTriplet(palette.silver),
  });
}

export const darkVars = paletteToVars(darkColors);
export const lightVars = paletteToVars(lightColors);
