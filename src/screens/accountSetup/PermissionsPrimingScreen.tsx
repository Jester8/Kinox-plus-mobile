import { useState } from "react";
import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Bell, Camera, Mic } from "lucide-react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import Button from "@/components/ui/Button";
import { useThemeColors } from "@/hooks/useThemeColors";
import { requestAllOnboardingPermissions } from "@/lib/permissions";
import type { AccountSetupStackParamList } from "@/navigation/types";

type Props = NativeStackScreenProps<AccountSetupStackParamList, "PermissionsPriming">;

const reasons = [
  { icon: Camera, text: "So your friends can see you in the room" },
  { icon: Mic, text: "So they can hear your reactions live" },
  { icon: Bell, text: "So you know when a room is about to start" },
];

export default function PermissionsPrimingScreen({ navigation }: Props) {
  const colors = useThemeColors();
  const [requesting, setRequesting] = useState(false);

  const onContinue = async () => {
    setRequesting(true);
    await requestAllOnboardingPermissions().catch(() => undefined);
    setRequesting(false);
    navigation.navigate("OnboardingComplete");
  };

  return (
    <SafeAreaView className="flex-1 bg-background px-6" edges={["top", "bottom"]}>
      <View className="mt-10 gap-2">
        <Text className="text-2xl font-['Manrope_700Bold'] text-foreground">One more thing</Text>
        <Text className="text-sm text-blue-100/70">
          KinoX Plus rooms use your camera and mic so friends can see and hear you live.
        </Text>
      </View>

      <View className="mt-8 gap-4">
        {reasons.map(({ icon: Icon, text }) => (
          <View key={text} className="flex-row items-center gap-3 rounded-2xl border border-line/10 bg-navy-950 p-4">
            <View className="h-10 w-10 items-center justify-center rounded-full bg-blue-500/15">
              <Icon size={18} color={colors.blue300} />
            </View>
            <Text className="flex-1 text-sm text-blue-100/85">{text}</Text>
          </View>
        ))}
      </View>

      <View className="flex-1" />

      <View className="gap-3 pb-10">
        <Button onPress={onContinue} loading={requesting} icon>
          Allow Access
        </Button>
        <Text onPress={() => navigation.navigate("OnboardingComplete")} className="text-center text-sm text-blue-100/50">
          Not now
        </Text>
      </View>
    </SafeAreaView>
  );
}
