import { useEffect } from "react";
import { View } from "react-native";
import { MotiView } from "moti";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import BrandMark from "@/components/ui/BrandMark";
import { useSessionStore } from "@/stores/sessionStore";
import type { RootStackParamList } from "@/navigation/types";

type Props = NativeStackScreenProps<RootStackParamList, "Splash">;

// Short, static-logo splash — no video or custom fonts on this critical
// path, so nothing here can hang the app before it even renders. Runs the
// session bootstrap in the background; a signed-in user with a profile goes
// straight to Home, everyone else moves on to the video Intro screen.
const MIN_DISPLAY_MS = 900;

export default function SplashScreen({ navigation }: Props) {
  const bootstrap = useSessionStore((s) => s.bootstrap);
  const isBootstrapped = useSessionStore((s) => s.isBootstrapped);
  const accessToken = useSessionStore((s) => s.accessToken);
  const profile = useSessionStore((s) => s.profile);

  useEffect(() => {
    bootstrap();
  }, [bootstrap]);

  useEffect(() => {
    if (!isBootstrapped) return;

    const timer = setTimeout(() => {
      if (!accessToken) {
        navigation.replace("Intro");
      } else if (!profile) {
        navigation.replace("AccountSetup", { screen: "Welcome" });
      } else {
        navigation.replace("Main", { screen: "HomeTab", params: { screen: "Home" } });
      }
    }, MIN_DISPLAY_MS);

    return () => clearTimeout(timer);
  }, [isBootstrapped, accessToken, profile, navigation]);

  return (
    <View className="flex-1 items-center justify-center bg-background">
      <MotiView
        from={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: "timing", duration: 500 }}
      >
        <BrandMark size={72} />
      </MotiView>
    </View>
  );
}
