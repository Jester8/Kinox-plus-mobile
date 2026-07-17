import { FlatList, Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ChevronLeft, History } from "lucide-react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { CompositeScreenProps } from "@react-navigation/native";
import EmptyState from "@/components/ui/EmptyState";
import { useThemeColors } from "@/hooks/useThemeColors";
import { titles } from "@/lib/mockData";
import type { ProfileStackParamList, RootStackParamList } from "@/navigation/types";

type Props = CompositeScreenProps<
  NativeStackScreenProps<ProfileStackParamList, "WatchHistory">,
  NativeStackScreenProps<RootStackParamList>
>;

const history = titles.slice(0, 5).map((t, i) => ({ ...t, watchedWith: i % 2 === 0 ? 3 : 1, watchedOn: "Jul 2026" }));

export default function WatchHistoryScreen({ navigation }: Props) {
  const colors = useThemeColors();
  return (
    <SafeAreaView className="flex-1 bg-background" edges={["top"]}>
      <View className="flex-row items-center gap-3 px-6 pt-2">
        <Pressable onPress={() => navigation.goBack()} hitSlop={8}>
          <ChevronLeft size={22} color={colors.blue300} />
        </Pressable>
        <Text className="text-lg font-['Manrope_700Bold'] text-foreground">Watch History</Text>
      </View>

      <FlatList
        data={history}
        keyExtractor={(t) => t.id}
        contentContainerClassName="gap-3 px-6 py-4"
        ListEmptyComponent={<EmptyState icon={History} title="No watch history yet" />}
        renderItem={({ item }) => (
          <Pressable
            onPress={() => navigation.navigate("Player", { roomId: `solo-${item.id}`, titleId: item.id, solo: true })}
            className="flex-row items-center gap-3 rounded-xl border border-line/10 bg-navy-950 p-3"
          >
            <View className="h-14 w-10 rounded-lg" style={{ backgroundColor: item.posterColor }} />
            <View className="flex-1">
              <Text className="text-sm font-['Manrope_600SemiBold'] text-foreground">{item.name}</Text>
              <Text className="text-xs text-blue-100/60">
                Watched with {item.watchedWith} friend{item.watchedWith > 1 ? "s" : ""} · {item.watchedOn}
              </Text>
            </View>
          </Pressable>
        )}
      />
    </SafeAreaView>
  );
}
