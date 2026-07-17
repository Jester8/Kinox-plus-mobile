import { useEffect } from "react";
import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MotiView } from "moti";
import { PartyPopper } from "lucide-react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { CompositeScreenProps } from "@react-navigation/native";
import type { AccountSetupStackParamList, RootStackParamList } from "@/navigation/types";

type Props = CompositeScreenProps<
  NativeStackScreenProps<AccountSetupStackParamList, "OnboardingComplete">,
  NativeStackScreenProps<RootStackParamList>
>;

export default function OnboardingCompleteScreen({ navigation }: Props) {
  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.navigate("Main", { screen: "HomeTab", params: { screen: "Home" } });
    }, 1600);
    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <SafeAreaView className="flex-1 items-center justify-center bg-background">
      <MotiView
        from={{ opacity: 0, scale: 0.7 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: "spring", damping: 12 }}
        className="items-center gap-4"
      >
        <View className="h-20 w-20 items-center justify-center rounded-full bg-blue-600">
          <PartyPopper size={36} color="#fff" />
        </View>
        <Text className="text-2xl font-['Manrope_700Bold'] text-foreground">You're all set!</Text>
        <Text className="text-sm text-blue-100/70">Taking you home…</Text>
      </MotiView>
    </SafeAreaView>
  );
}
