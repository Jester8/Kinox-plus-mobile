import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Crown, X } from "lucide-react-native";
import { Pressable } from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import Button from "@/components/ui/Button";
import { useThemeColors } from "@/hooks/useThemeColors";
import type { RootStackParamList } from "@/navigation/types";

type Props = NativeStackScreenProps<RootStackParamList, "Paywall">;

// Triggered when a free-tier limit is hit (e.g., room size cap).
export default function PaywallScreen({ route, navigation }: Props) {
  const colors = useThemeColors();
  const reason = route.params?.reason ?? "You've hit a free-tier limit.";

  return (
    <SafeAreaView className="flex-1 justify-end bg-black/70">
      <View className="gap-5 rounded-t-3xl border border-line/10 bg-navy-950 p-6">
        <Pressable onPress={() => navigation.goBack()} className="absolute right-4 top-4 z-10" hitSlop={8}>
          <X size={18} color={colors.blue300} />
        </Pressable>

        <View className="items-center gap-3">
          <View className="h-14 w-14 items-center justify-center rounded-full bg-blue-600">
            <Crown size={24} color="#fff" />
          </View>
          <Text className="text-center text-xl font-['Manrope_700Bold'] text-foreground">Upgrade to Plus</Text>
          <Text className="text-center text-sm text-blue-100/70">{reason}</Text>
        </View>

        <View className="gap-2">
          {["Up to 20 people per room", "4K playback", "Priority sync"].map((perk) => (
            <Text key={perk} className="text-center text-sm text-foreground/80">
              {perk}
            </Text>
          ))}
        </View>

        <Button onPress={() => navigation.goBack()} icon>
          See Plans
        </Button>
      </View>
    </SafeAreaView>
  );
}
