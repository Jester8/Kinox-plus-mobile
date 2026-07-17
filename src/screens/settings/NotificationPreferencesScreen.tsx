import { useState } from "react";
import { Pressable, ScrollView, Switch, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ChevronLeft } from "lucide-react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useThemeColors } from "@/hooks/useThemeColors";
import type { ProfileStackParamList } from "@/navigation/types";

type Props = NativeStackScreenProps<ProfileStackParamList, "NotificationPreferences">;

const initialPrefs = [
  { key: "roomStarted", label: "A friend starts a room", value: true },
  { key: "invites", label: "Room invites", value: true },
  { key: "reminders", label: "Room reminders", value: true },
  { key: "product", label: "Product announcements", value: false },
];

export default function NotificationPreferencesScreen({ navigation }: Props) {
  const colors = useThemeColors();
  const [prefs, setPrefs] = useState(initialPrefs);

  const toggle = (key: string) =>
    setPrefs((prev) => prev.map((p) => (p.key === key ? { ...p, value: !p.value } : p)));

  return (
    <SafeAreaView className="flex-1 bg-background" edges={["top"]}>
      <View className="flex-row items-center gap-3 px-6 pt-2">
        <Pressable onPress={() => navigation.goBack()} hitSlop={8}>
          <ChevronLeft size={22} color={colors.blue300} />
        </Pressable>
        <Text className="text-lg font-['Manrope_700Bold'] text-foreground">Notifications</Text>
      </View>

      <ScrollView contentContainerClassName="gap-3 px-6 py-6">
        {prefs.map((pref) => (
          <View
            key={pref.key}
            className="flex-row items-center justify-between rounded-xl border border-line/10 bg-navy-950 px-4 py-4"
          >
            <Text className="flex-1 pr-4 text-sm text-foreground/90">{pref.label}</Text>
            <Switch
              value={pref.value}
              onValueChange={() => toggle(pref.key)}
              trackColor={{ true: colors.blue600, false: colors.foreground + "26" }}
            />
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}
