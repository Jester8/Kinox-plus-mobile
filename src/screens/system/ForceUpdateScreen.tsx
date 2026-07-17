import { Linking, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { DownloadCloud } from "lucide-react-native";
import BrandMark from "@/components/ui/BrandMark";
import Button from "@/components/ui/Button";
import { useThemeColors } from "@/hooks/useThemeColors";

// Shown when the running app version is below the minimum supported
// version, blocking further use until the user updates.
export default function ForceUpdateScreen() {
  const colors = useThemeColors();
  return (
    <SafeAreaView className="flex-1 items-center justify-center gap-6 bg-background px-8">
      <BrandMark size={56} />
      <View className="h-16 w-16 items-center justify-center rounded-full bg-blue-500/15">
        <DownloadCloud size={28} color={colors.blue300} />
      </View>
      <View className="items-center gap-2">
        <Text className="text-center text-2xl font-['Manrope_700Bold'] text-foreground">Update required</Text>
        <Text className="text-center text-sm text-blue-100/70">
          A new version of KinoX Plus is available. Please update to keep watching.
        </Text>
      </View>
      <Button onPress={() => Linking.openURL("https://kinoxplus.app")} icon>
        Update Now
      </Button>
    </SafeAreaView>
  );
}
