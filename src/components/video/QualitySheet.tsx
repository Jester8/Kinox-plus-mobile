import { Pressable, Text, View } from "react-native";
import { Check, X } from "lucide-react-native";
import { darkColors as colors } from "@/theme/colors";
import { usePlayerStore } from "@/stores/playerStore";

type QualitySheetProps = {
  onClose: () => void;
};

const QUALITY_OPTIONS = [
  { value: "auto", label: "Auto", description: "Adjusts to your connection" },
  { value: "1080p", label: "1080p", description: "High definition" },
  { value: "720p", label: "720p", description: "Standard definition" },
  { value: "480p", label: "480p", description: "Saves data" },
] as const;

export default function QualitySheet({ onClose }: QualitySheetProps) {
  const quality = usePlayerStore((s) => s.quality);
  const setQuality = usePlayerStore((s) => s.setQuality);

  return (
    <View className="absolute inset-x-0 bottom-0 gap-2 rounded-t-3xl border border-white/10 bg-navy-950 p-4">
      <View className="mb-1 flex-row items-center justify-between">
        <Text className="text-sm font-['Manrope_600SemiBold'] text-white">Playback quality</Text>
        <Pressable onPress={onClose} hitSlop={8}>
          <X size={18} color={colors.blue300} />
        </Pressable>
      </View>

      {QUALITY_OPTIONS.map((option) => {
        const active = quality === option.value;
        return (
          <Pressable
            key={option.value}
            onPress={() => {
              setQuality(option.value);
              onClose();
            }}
            className={`flex-row items-center justify-between rounded-xl px-3 py-3 ${active ? "bg-blue-500/15" : ""}`}
          >
            <View>
              <Text className={`text-sm font-['Manrope_500Medium'] ${active ? "text-blue-200" : "text-white/85"}`}>
                {option.label}
              </Text>
              <Text className="text-xs text-blue-100/50">{option.description}</Text>
            </View>
            {active && <Check size={16} color={colors.blue300} />}
          </Pressable>
        );
      })}
    </View>
  );
}
