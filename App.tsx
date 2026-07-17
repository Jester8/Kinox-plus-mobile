import "./src/theme/global.css";
import "react-native-gesture-handler";
import { useCallback, useEffect, useRef, useState } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { NavigationContainer, useNavigationContainerRef } from "@react-navigation/native";
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
import { useSessionStore } from "@/stores/sessionStore";
import type { RootStackParamList } from "@/navigation/types";

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

// Logging out (from Settings, or automatically when a refresh token expires
// inside services/api.ts) only ever clears the session store — nothing else
// was watching for that and moving the user off whatever protected screen
// they were on, so "sign out" looked like it did nothing. This resets the
// whole nav stack back to Login the moment an active session disappears.
//
// The reverse direction matters too: after that sign-out reset, Login's own
// screen-level navigate() only pushes "Main" on top of "Auth" rather than
// replacing it, so a logout followed by logging back in left a stale Login
// screen underneath in the back-stack (and depended on timing that could
// race with the async token/profile save). Tracking justSignedOut lets this
// same effect force a clean reset straight to Home the moment a login
// completes — but only for that post-logout case, not a normal cold-start
// bootstrap login, which Splash already routes more carefully (onboarding
// vs. Home) on its own.
function useSessionRedirect(navigationRef: ReturnType<typeof useNavigationContainerRef<RootStackParamList>>) {
  const accessToken = useSessionStore((s) => s.accessToken);
  const hadSession = useRef(false);
  const justSignedOut = useRef(false);

  useEffect(() => {
    if (accessToken) {
      if (justSignedOut.current) {
        justSignedOut.current = false;
        navigationRef.current?.reset({
          index: 0,
          routes: [{ name: "Main", params: { screen: "HomeTab", params: { screen: "Home" } } }],
        });
      }
      hadSession.current = true;
      return;
    }
    if (!hadSession.current) return;
    hadSession.current = false;
    justSignedOut.current = true;
    navigationRef.current?.reset({
      index: 0,
      routes: [{ name: "Auth", params: { screen: "Login" } }],
    });
  }, [accessToken, navigationRef]);
}

export default function App() {
  const navigationRef = useNavigationContainerRef<RootStackParamList>();
  useSessionRedirect(navigationRef);

  const [fontsLoaded, fontError] = useFonts({
    Manrope_400Regular,
    Manrope_500Medium,
    Manrope_600SemiBold,
    Manrope_700Bold,
    Manrope_800ExtraBold,
  });
  // useFonts hanging (seen intermittently on some Android devices) would
  // otherwise leave the native splash on screen forever, since nothing else
  // ever flips fontsLoaded/fontError — this timeout guarantees the app
  // renders (falling back to system fonts if they truly never load) instead
  // of blocking startup indefinitely.
  const [fontsTimedOut, setFontsTimedOut] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setFontsTimedOut(true), 3000);
    return () => clearTimeout(timer);
  }, []);

  const ready = fontsLoaded || fontError || fontsTimedOut;

  useEffect(() => {
    // The app is portrait-first everywhere except the Player screen's
    // fullscreen mode, which locks to landscape itself and restores this
    // on exit — matching the old app.json "orientation": "portrait" lock
    // for every other screen while still allowing that one override.
    ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP);
  }, []);

  const onLayoutRootView = useCallback(() => {
    if (ready) {
      SplashScreen.hideAsync().catch(() => undefined);
    }
  }, [ready]);

  if (!ready) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }} onLayout={onLayoutRootView}>
      <SafeAreaProvider>
        <QueryClientProvider client={queryClient}>
          <ThemeProvider>
            <OfflineBanner />
            <NavigationContainer ref={navigationRef} linking={linking}>
              <RootNavigator />
            </NavigationContainer>
          </ThemeProvider>
        </QueryClientProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
