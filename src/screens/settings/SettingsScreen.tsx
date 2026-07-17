import { useState } from "react";
import { Alert, Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  ChevronLeft,
  ChevronRight,
  Crown,
  FileText,
  HelpCircle,
  LogOut,
  Moon,
  Shield,
  User,
  Video,
} from "lucide-react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { CompositeScreenProps } from "@react-navigation/native";
import AppearanceSheet from "@/components/ui/AppearanceSheet";
import { useThemeColors } from "@/hooks/useThemeColors";
import { useSessionStore } from "@/stores/sessionStore";
import { useThemeStore } from "@/stores/themeStore";
import type { ProfileStackParamList, RootStackParamList } from "@/navigation/types";

type Props = CompositeScreenProps<
  NativeStackScreenProps<ProfileStackParamList, "Settings">,
  NativeStackScreenProps<RootStackParamList>
>;

const PREFERENCE_LABELS = { system: "System", light: "Light", dark: "Dark" } as const;

export default function SettingsScreen({ navigation }: Props) {
  const colors = useThemeColors();
  const logOut = useSessionStore((s) => s.logOut);
  const logOutAllDevices = useSessionStore((s) => s.logOutAllDevices);
  const themePreference = useThemeStore((s) => s.preference);
  const [appearanceOpen, setAppearanceOpen] = useState(false);

  const onLogOutEverywhere = () => {
    Alert.alert("Log out everywhere?", "This will sign you out on every device.", [
      { text: "Cancel", style: "cancel" },
      { text: "Log Out Everywhere", style: "destructive", onPress: logOutAllDevices },
    ]);
  };

  const sections: { title: string; items: { icon: any; label: string; onPress: () => void; value?: string }[] }[] = [
    {
      title: "Account",
      items: [
        { icon: User, label: "Edit Profile", onPress: () => navigation.navigate("EditProfile") },
        { icon: Crown, label: "Subscription", value: "Free", onPress: () => navigation.navigate("Subscription") },
      ],
    },
    {
      title: "Preferences",
      items: [
        { icon: Video, label: "Playback quality & data usage", value: "Auto", onPress: () => {} },
        { icon: Shield, label: "Privacy — who can invite me", value: "Friends", onPress: () => {} },
        { icon: Moon, label: "Appearance", value: PREFERENCE_LABELS[themePreference], onPress: () => setAppearanceOpen(true) },
        { icon: HelpCircle, label: "Notification Preferences", onPress: () => navigation.navigate("NotificationPreferences") },
      ],
    },
    {
      title: "Support",
      items: [
        { icon: HelpCircle, label: "Help & Support", onPress: () => navigation.navigate("HelpSupport") },
        { icon: FileText, label: "Privacy Policy", onPress: () => navigation.navigate("PrivacyTerms", { doc: "privacy" }) },
        { icon: FileText, label: "Terms of Service", onPress: () => navigation.navigate("PrivacyTerms", { doc: "terms" }) },
      ],
    },
  ];

  return (
    <SafeAreaView className="flex-1 bg-background" edges={["top"]}>
      <View className="flex-row items-center gap-3 px-6 pt-2">
        <Pressable onPress={() => navigation.goBack()} hitSlop={8}>
          <ChevronLeft size={22} color={colors.blue300} />
        </Pressable>
        <Text className="text-lg font-['Manrope_700Bold'] text-foreground">Settings</Text>
      </View>

      <ScrollView contentContainerClassName="gap-6 px-6 py-6" showsVerticalScrollIndicator={false}>
        {sections.map((section) => (
          <View key={section.title} className="gap-2">
            <Text className="px-1 text-xs font-['Manrope_600SemiBold'] uppercase tracking-wider text-blue-100/50">
              {section.title}
            </Text>
            <View className="overflow-hidden rounded-xl border border-line/10 bg-navy-950">
              {section.items.map((item, i) => (
                <Pressable
                  key={item.label}
                  onPress={item.onPress}
                  className={`flex-row items-center gap-3 px-4 py-3.5 ${i > 0 ? "border-t border-line/5" : ""}`}
                >
                  <item.icon size={16} color={colors.blue300} />
                  <Text className="flex-1 text-sm text-foreground/90">{item.label}</Text>
                  {item.value && <Text className="text-xs text-blue-100/50">{item.value}</Text>}
                  <ChevronRight size={14} color={colors.line + "4d"} />
                </Pressable>
              ))}
            </View>
          </View>
        ))}

        <Pressable onPress={logOut} className="flex-row items-center justify-center gap-2 pt-4">
          <LogOut size={16} color="#f87171" />
          <Text className="text-sm font-['Manrope_600SemiBold'] text-red-400">Log Out</Text>
        </Pressable>
        <Pressable onPress={onLogOutEverywhere} className="items-center pb-2 pt-1">
          <Text className="text-xs font-['Manrope_500Medium'] text-blue-100/50">Log out of all devices</Text>
        </Pressable>
      </ScrollView>

      <AppearanceSheet visible={appearanceOpen} onClose={() => setAppearanceOpen(false)} />
    </SafeAreaView>
  );
}
