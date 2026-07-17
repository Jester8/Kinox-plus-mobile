import { useState } from "react";
import { Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Star } from "lucide-react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import Button from "@/components/ui/Button";
import { useThemeColors } from "@/hooks/useThemeColors";
import type { RootStackParamList } from "@/navigation/types";

type Props = NativeStackScreenProps<RootStackParamList, "RoomRecap">;

export default function RoomRecapScreen({ navigation }: Props) {
  const colors = useThemeColors();
  const [rating, setRating] = useState(0);

  return (
    <SafeAreaView className="flex-1 items-center justify-center bg-background px-8" edges={["top", "bottom"]}>
      <View className="items-center gap-3">
        <Text className="text-2xl font-['Manrope_700Bold'] text-foreground">That's a wrap 🎬</Text>
        <Text className="text-center text-base text-blue-100/75">
          You watched Midnight Signal with 3 friends for 1h 42m.
        </Text>
      </View>

      <View className="mt-8 items-center gap-3">
        <Text className="text-sm font-['Manrope_600SemiBold'] text-blue-100/70">Rate the movie</Text>
        <View className="flex-row gap-2">
          {[1, 2, 3, 4, 5].map((n) => (
            <Pressable key={n} onPress={() => setRating(n)} hitSlop={6}>
              <Star size={28} color={n <= rating ? colors.blue300 : colors.foreground + "33"} fill={n <= rating ? colors.blue300 : "none"} />
            </Pressable>
          ))}
        </View>
      </View>

      <View className="mt-12 w-full gap-3">
        <Button onPress={() => navigation.replace("Main", { screen: "RoomsTab", params: { screen: "CreateRoom" } })} icon>
          Start Another Room
        </Button>
        <Button
          variant="ghost"
          onPress={() => navigation.replace("Main", { screen: "HomeTab", params: { screen: "Home" } })}
        >
          Back to Home
        </Button>
      </View>
    </SafeAreaView>
  );
}
