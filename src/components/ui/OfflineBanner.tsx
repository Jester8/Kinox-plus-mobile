import { Text, View } from "react-native";
import { WifiOff } from "lucide-react-native";
import { useIsOnline } from "@/hooks/useIsOnline";

// Cached "Continue Watching" and watchlist metadata still render offline;
// rooms/live features require connectivity, so this banner makes that
// state explicit instead of failing silently.
export default function OfflineBanner() {
  const isOnline = useIsOnline();
  if (isOnline) return null;

  return (
    <View className="flex-row items-center justify-center gap-2 bg-yellow-500/15 px-4 py-2">
      <WifiOff size={13} color="#fbbf24" />
      <Text className="text-xs font-['Manrope_500Medium'] text-yellow-300">
        You're offline — rooms and live features are unavailable
      </Text>
    </View>
  );
}
