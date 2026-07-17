import { Text, View } from "react-native";
import { RefreshCw, Check } from "lucide-react-native";
import { darkColors as colors } from "@/theme/colors";
import { useRoomStore } from "@/stores/roomStore";

export default function SyncIndicator() {
  const status = useRoomStore((s) => s.syncStatus);
  const synced = status === "synced";

  return (
    <View
      className={`flex-row items-center gap-1.5 self-start rounded-full border px-3 py-1 ${
        synced ? "border-blue-400/30 bg-blue-500/10" : "border-yellow-400/30 bg-yellow-500/10"
      }`}
    >
      {synced ? <Check size={11} color={colors.blue300} /> : <RefreshCw size={11} color="#fbbf24" />}
      <Text className={`text-xs font-['Manrope_600SemiBold'] ${synced ? "text-blue-200" : "text-yellow-300"}`}>
        {synced ? "Synced" : "Syncing…"}
      </Text>
    </View>
  );
}
