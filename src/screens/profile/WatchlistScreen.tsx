import { Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ChevronLeft, Bookmark } from "lucide-react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { CompositeScreenProps } from "@react-navigation/native";
import TitleGrid from "@/components/ui/TitleGrid";
import EmptyState from "@/components/ui/EmptyState";
import { useThemeColors } from "@/hooks/useThemeColors";
import { titles } from "@/lib/mockData";
import type { ProfileStackParamList, RootStackParamList } from "@/navigation/types";

type Props = CompositeScreenProps<
  NativeStackScreenProps<ProfileStackParamList, "Watchlist">,
  NativeStackScreenProps<RootStackParamList>
>;

const watchlist = titles.slice(1, 4);

export default function WatchlistScreen({ navigation }: Props) {
  const colors = useThemeColors();
  return (
    <SafeAreaView className="flex-1 bg-background" edges={["top"]}>
      <View className="flex-row items-center gap-3 px-6 pt-2">
        <Pressable onPress={() => navigation.goBack()} hitSlop={8}>
          <ChevronLeft size={22} color={colors.blue300} />
        </Pressable>
        <Text className="text-lg font-['Manrope_700Bold'] text-foreground">Watchlist</Text>
      </View>

      <ScrollView className="mt-4" contentContainerClassName="pb-10" showsVerticalScrollIndicator={false}>
        {watchlist.length > 0 ? (
          <TitleGrid
            data={watchlist}
            onPressTitle={(t) => navigation.navigate("Player", { roomId: `solo-${t.id}`, titleId: t.id, solo: true })}
          />
        ) : (
          <EmptyState icon={Bookmark} title="Your watchlist is empty" description="Save titles to watch with friends later." />
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
