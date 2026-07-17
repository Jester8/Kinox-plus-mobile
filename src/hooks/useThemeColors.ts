import { darkColors, lightColors } from "@/theme/colors";
import { useThemeStore } from "@/stores/themeStore";

// Drop-in replacement for the static `colors` import — same shape, but
// reacts to the user's light/dark/system preference so icon colors (and
// anything else that needs a raw hex value instead of a className) stay
// correct when the theme changes.
export function useThemeColors() {
  const resolved = useThemeStore((s) => s.resolved);
  return resolved === "light" ? lightColors : darkColors;
}
