import { ActivityIndicator, Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ChevronLeft, SearchX } from "lucide-react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { CompositeScreenProps } from "@react-navigation/native";
import TitleGrid from "@/components/ui/TitleGrid";
import EmptyState from "@/components/ui/EmptyState";
import { useThemeColors } from "@/hooks/useThemeColors";
import { useSearchMovies } from "@/hooks/useTmdb";
import type { DiscoverStackParamList, RootStackParamList } from "@/navigation/types";

type Props = CompositeScreenProps<
  NativeStackScreenProps<DiscoverStackParamList, "SearchResults">,
  NativeStackScreenProps<RootStackParamList>
>;

export default function SearchResultsScreen({ route, navigation }: Props) {
  const colors = useThemeColors();
  const { query } = route.params;
  const { data: results, isLoading, isError } = useSearchMovies(query);

  return (
    <SafeAreaView className="flex-1 bg-background" edges={["top"]}>
      <View className="flex-row items-center gap-3 px-6 pt-2">
        <Pressable onPress={() => navigation.goBack()} hitSlop={8}>
          <ChevronLeft size={22} color={colors.blue300} />
        </Pressable>
        <View>
          <Text className="text-xs text-blue-100/60">Results for</Text>
          <Text className="text-lg font-['Manrope_700Bold'] text-foreground">"{query}"</Text>
        </View>
      </View>

      <ScrollView className="mt-4" contentContainerClassName="pb-10" showsVerticalScrollIndicator={false}>
        {isLoading ? (
          <ActivityIndicator color={colors.blue300} style={{ marginTop: 40 }} />
        ) : results && results.length > 0 ? (
          <TitleGrid
            data={results}
            onPressTitle={(t) => navigation.navigate("Player", { roomId: `solo-${t.id}`, titleId: t.id, solo: true })}
          />
        ) : (
          <EmptyState
            icon={SearchX}
            title={isError ? "Search unavailable" : "No results"}
            description={isError ? "Couldn't reach the movie database. Try again shortly." : "Try a different title or genre."}
          />
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
