import "./src/theme/global.css";
import "react-native-gesture-handler";
import { useCallback, useEffect } from "react";
import { Text, TextInput } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { NavigationContainer } from "@react-navigation/native";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import * as ScreenOrientation from "expo-screen-orientation";
import * as SplashScreen from "expo-splash-screen";
import {
  useFonts,
  Manrope_400Regular,
  Manrope_500Medium,
  Manrope_600SemiBold,
  Manrope_700Bold,
  Manrope_800ExtraBold,
} from "@expo-google-fonts/manrope";

import RootNavigator from "@/navigation/RootNavigator";
import OfflineBanner from "@/components/ui/OfflineBanner";
import ThemeProvider from "@/components/ThemeProvider";
import { linking } from "@/lib/deepLinking";
import { fetchTrendingMovies, fetchPopularMovies } from "@/services/tmdb";
import { tmdbMovieToTitle } from "@/lib/tmdbAdapter";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Window-focus refetching is a web convention that doesn't map cleanly
      // to RN and burns TMDb's rate limit for no benefit — staleTime already
      // controls freshness.
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000,
    },
  },
});

// Kicks off before the user ever reaches Home — by the time Splash's
// bootstrap finishes and navigation settles, trending/popular are usually
// already cached, so the feed paints instantly instead of spinning.
queryClient.prefetchQuery({
  queryKey: ["tmdb", "trending"],
  queryFn: async () => (await fetchTrendingMovies()).results.map(tmdbMovieToTitle),
});
queryClient.prefetchQuery({
  queryKey: ["tmdb", "popular"],
  queryFn: async () => (await fetchPopularMovies()).results.map(tmdbMovieToTitle),
});

SplashScreen.preventAutoHideAsync().catch(() => undefined);

// React Native has no font-weight matching for custom (non-system) fonts —
// each Manrope weight is its own registered family, so classNames like
// font-bold reference "Manrope_700Bold" directly (see tailwind.config.js /
// the font-* utility usages across screens). This default just covers every
// Text/TextInput that doesn't set an explicit weight utility.
// @ts-expect-error — defaultProps isn't in RN's public Text typings but is
// still honored at runtime; this is the standard way to set an app-wide font.
Text.defaultProps = { ...(Text.defaultProps ?? {}), style: [{ fontFamily: "Manrope_400Regular" }, Text.defaultProps?.style] };
// @ts-expect-error — see above.
TextInput.defaultProps = { ...(TextInput.defaultProps ?? {}), style: [{ fontFamily: "Manrope_400Regular" }, TextInput.defaultProps?.style] };

export default function App() {
  const [fontsLoaded, fontError] = useFonts({
    Manrope_400Regular,
    Manrope_500Medium,
    Manrope_600SemiBold,
    Manrope_700Bold,
    Manrope_800ExtraBold,
  });

  useEffect(() => {
    // The app is portrait-first everywhere except the Player screen's
    // fullscreen mode, which locks to landscape itself and restores this
    // on exit — matching the old app.json "orientation": "portrait" lock
    // for every other screen while still allowing that one override.
    ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP);
  }, []);

  const onLayoutRootView = useCallback(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync().catch(() => undefined);
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }} onLayout={onLayoutRootView}>
      <SafeAreaProvider>
        <QueryClientProvider client={queryClient}>
          <ThemeProvider>
            <OfflineBanner />
            <NavigationContainer linking={linking}>
              <RootNavigator />
            </NavigationContainer>
          </ThemeProvider>
        </QueryClientProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
