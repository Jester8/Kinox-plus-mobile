import { useEffect } from "react";
import { View } from "react-native";
import { MotiView } from "moti";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import BrandMark from "@/components/ui/BrandMark";
import { useSessionStore } from "@/stores/sessionStore";
import type { RootStackParamList } from "@/navigation/types";

type Props = NativeStackScreenProps<RootStackParamList, "Splash">;

// Auth check / bootstrap: silently reads the persisted session token and
// routes into Onboarding, Auth, or Home once ready.
export default function SplashScreen({ navigation }: Props) {
  const bootstrap = useSessionStore((s) => s.bootstrap);
  const isBootstrapped = useSessionStore((s) => s.isBootstrapped);
  const accessToken = useSessionStore((s) => s.accessToken);
  const hasSeenOnboarding = useSessionStore((s) => s.hasSeenOnboarding);
  const profile = useSessionStore((s) => s.profile);

  useEffect(() => {
    bootstrap();
  }, [bootstrap]);

  useEffect(() => {
    if (!isBootstrapped) return;

    const timer = setTimeout(() => {
      if (!accessToken) {
        if (hasSeenOnboarding) {
          navigation.replace("Auth", { screen: "SignUp" });
        } else {
          navigation.replace("OnboardingCarousel");
        }
      } else if (!profile) {
        navigation.replace("AccountSetup", { screen: "Welcome" });
      } else {
        navigation.replace("Main", { screen: "HomeTab", params: { screen: "Home" } });
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [isBootstrapped, accessToken, hasSeenOnboarding, profile, navigation]);

  return (
    <View className="flex-1 items-center justify-center bg-background">
      <MotiView
        from={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: "timing", duration: 600 }}
      >
        <BrandMark size={72} />
      </MotiView>
    </View>
  );
}
