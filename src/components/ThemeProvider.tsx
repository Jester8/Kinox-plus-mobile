import { ReactNode, useEffect } from "react";
import { Appearance, View } from "react-native";
import { StatusBar } from "expo-status-bar";
import { useThemeStore } from "@/stores/themeStore";
import { darkVars, lightVars } from "@/theme/vars";
import { darkColors, lightColors } from "@/theme/colors";

export default function ThemeProvider({ children }: { children: ReactNode }) {
  const resolved = useThemeStore((s) => s.resolved);
  const bootstrap = useThemeStore((s) => s.bootstrap);
  const syncWithSystem = useThemeStore((s) => s.syncWithSystem);

  useEffect(() => {
    bootstrap();
  }, [bootstrap]);

  useEffect(() => {
    const subscription = Appearance.addChangeListener(({ colorScheme }) => {
      syncWithSystem(colorScheme === "light" ? "light" : "dark");
    });
    return () => subscription.remove();
  }, [syncWithSystem]);

  const isLight = resolved === "light";
  const themeVars = isLight ? lightVars : darkVars;
  const backgroundColor = isLight ? lightColors.background : darkColors.background;

  return (
    <View style={[{ flex: 1, backgroundColor }, themeVars]}>
      <StatusBar style={isLight ? "dark" : "light"} />
      {children}
    </View>
  );
}
