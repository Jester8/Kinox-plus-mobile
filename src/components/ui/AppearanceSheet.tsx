import { Modal, Pressable, Text, View } from "react-native";
import { Check, Moon, Smartphone, Sun, X } from "lucide-react-native";
import { useThemeColors } from "@/hooks/useThemeColors";
import { useThemeStore, type ThemePreference } from "@/stores/themeStore";

type AppearanceSheetProps = {
  visible: boolean;
  onClose: () => void;
};

const OPTIONS: { value: ThemePreference; label: string; description: string; icon: typeof Sun }[] = [
  { value: "system", label: "System", description: "Matches your device setting", icon: Smartphone },
  { value: "light", label: "Light", description: "Always use light mode", icon: Sun },
  { value: "dark", label: "Dark", description: "Always use dark mode", icon: Moon },
];

export default function AppearanceSheet({ visible, onClose }: AppearanceSheetProps) {
  const colors = useThemeColors();
  const preference = useThemeStore((s) => s.preference);
  const setPreference = useThemeStore((s) => s.setPreference);

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <Pressable onPress={onClose} className="flex-1 justify-end bg-black/60">
        <Pressable className="gap-2 rounded-t-3xl border border-line/10 bg-navy-950 p-4 pb-8">
          <View className="mb-1 flex-row items-center justify-between">
            <Text className="text-sm font-['Manrope_600SemiBold'] text-foreground">Appearance</Text>
            <Pressable onPress={onClose} hitSlop={8}>
              <X size={18} color={colors.blue300} />
            </Pressable>
          </View>

          {OPTIONS.map((option) => {
            const active = preference === option.value;
            const Icon = option.icon;
            return (
              <Pressable
                key={option.value}
                onPress={() => {
                  setPreference(option.value);
                  onClose();
                }}
                className={`flex-row items-center gap-3 rounded-xl px-3 py-3 ${active ? "bg-blue-500/15" : ""}`}
              >
                <Icon size={18} color={colors.blue300} />
                <View className="flex-1">
                  <Text className={`text-sm font-['Manrope_500Medium'] ${active ? "text-blue-300" : "text-foreground/85"}`}>
                    {option.label}
                  </Text>
                  <Text className="text-xs text-foreground/50">{option.description}</Text>
                </View>
                {active && <Check size={16} color={colors.blue300} />}
              </Pressable>
            );
          })}
        </Pressable>
      </Pressable>
    </Modal>
  );
}
