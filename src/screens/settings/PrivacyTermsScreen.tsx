import { Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ChevronLeft } from "lucide-react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useThemeColors } from "@/hooks/useThemeColors";
import type { ProfileStackParamList } from "@/navigation/types";

type Props = NativeStackScreenProps<ProfileStackParamList, "PrivacyTerms">;

// TODO: swap the placeholder copy for the bundled markdown / web view once legal delivers final copy.
const placeholder =
  "This is placeholder legal copy. Replace with the bundled markdown or a WebView pointed at the hosted document once it's finalized.";

export default function PrivacyTermsScreen({ route, navigation }: Props) {
  const colors = useThemeColors();
  const { doc } = route.params;
  const title = doc === "privacy" ? "Privacy Policy" : "Terms of Service";

  return (
    <SafeAreaView className="flex-1 bg-background" edges={["top"]}>
      <View className="flex-row items-center gap-3 px-6 pt-2">
        <Pressable onPress={() => navigation.goBack()} hitSlop={8}>
          <ChevronLeft size={22} color={colors.blue300} />
        </Pressable>
        <Text className="text-lg font-['Manrope_700Bold'] text-foreground">{title}</Text>
      </View>
      <ScrollView contentContainerClassName="px-6 py-6">
        <Text className="text-sm leading-6 text-blue-100/75">{placeholder}</Text>
      </ScrollView>
    </SafeAreaView>
  );
}
