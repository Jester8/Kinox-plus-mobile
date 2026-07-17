import { create } from "zustand";
import { Appearance } from "react-native";
import { storage } from "@/lib/storage";

export type ThemePreference = "system" | "light" | "dark";
export type ResolvedTheme = "light" | "dark";

type ThemeState = {
  preference: ThemePreference;
  resolved: ResolvedTheme;
  isBootstrapped: boolean;
  setPreference: (preference: ThemePreference) => Promise<void>;
  bootstrap: () => Promise<void>;
  syncWithSystem: (systemScheme: ResolvedTheme) => void;
};

const THEME_PREFERENCE_KEY = "settings.themePreference";

function resolve(preference: ThemePreference): ResolvedTheme {
  if (preference === "system") {
    return Appearance.getColorScheme() === "light" ? "light" : "dark";
  }
  return preference;
}

export const useThemeStore = create<ThemeState>((set, get) => ({
  preference: "system",
  resolved: resolve("system"),
  isBootstrapped: false,

  setPreference: async (preference) => {
    await storage.setItem(THEME_PREFERENCE_KEY, preference).catch(() => undefined);
    set({ preference, resolved: resolve(preference) });
  },

  // System changes (e.g. user flips their phone into Dark Mode) should only
  // move the app's theme when the user hasn't explicitly overridden it.
  syncWithSystem: (systemScheme) => {
    if (get().preference === "system") {
      set({ resolved: systemScheme });
    }
  },

  bootstrap: async () => {
    try {
      const stored = await storage.getItem(THEME_PREFERENCE_KEY);
      const preference: ThemePreference =
        stored === "light" || stored === "dark" || stored === "system" ? stored : "system";
      set({ preference, resolved: resolve(preference), isBootstrapped: true });
    } catch {
      set({ preference: "system", resolved: resolve("system"), isBootstrapped: true });
    }
  },
}));
