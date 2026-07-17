import { useState } from "react";
import { ActivityIndicator, Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ChevronLeft, SlidersHorizontal, Search } from "lucide-react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import TitleGrid from "@/components/ui/TitleGrid";
import EmptyState from "@/components/ui/EmptyState";
import { useThemeColors } from "@/hooks/useThemeColors";
import { titles, TMDB_GENRE_ID_BY_NAME, type Genre } from "@/lib/mockData";
import { useMoviesByGenre } from "@/hooks/useTmdb";
import type { DiscoverStackParamList, RootStackParamList } from "@/navigation/types";
import type { CompositeScreenProps } from "@react-navigation/native";

type Props = CompositeScreenProps<
  NativeStackScreenProps<DiscoverStackParamList, "CategoryBrowse">,
  NativeStackScreenProps<RootStackParamList>
>;

const sortOptions = ["Popular", "Newest", "A–Z"] as const;

export default function CategoryBrowseScreen({ route, navigation }: Props) {
  const colors = useThemeColors();
  const { category } = route.params;
  const [sort, setSort] = useState<(typeof sortOptions)[number]>("Popular");
  const [showSort, setShowSort] = useState(false);

  const genreId = TMDB_GENRE_ID_BY_NAME[category as Genre] ?? null;
  const { data: tmdbResults, isLoading, isError } = useMoviesByGenre(genreId);

  // "Anime" has no TMDb genre id — fall back to mock data for it.
  const filtered = genreId ? (tmdbResults ?? []) : titles.filter((t) => t.genre === category);

  return (
    <SafeAreaView className="flex-1 bg-background" edges={["top"]}>
      <View className="flex-row items-center justify-between px-6 pt-2">
        <Pressable onPress={() => navigation.goBack()} hitSlop={8}>
          <ChevronLeft size={22} color={colors.blue300} />
        </Pressable>
        <Text className="text-lg font-['Manrope_700Bold'] text-foreground">{category}</Text>
        <Pressable onPress={() => setShowSort((v) => !v)} hitSlop={8}>
          <SlidersHorizontal size={18} color={colors.blue300} />
        </Pressable>
      </View>

      {showSort && (
        <View className="mx-6 mt-3 flex-row gap-2 rounded-xl border border-line/10 bg-navy-950 p-2">
          {sortOptions.map((option) => (
            <Pressable
              key={option}
              onPress={() => setSort(option)}
              className={`flex-1 items-center rounded-lg py-2 ${sort === option ? "bg-blue-500/20" : ""}`}
            >
              <Text className={`text-xs font-['Manrope_500Medium'] ${sort === option ? "text-blue-200" : "text-foreground/60"}`}>
                {option}
              </Text>
            </Pressable>
          ))}
        </View>
      )}

      <ScrollView className="mt-4" contentContainerClassName="pb-10" showsVerticalScrollIndicator={false}>
        {genreId && isLoading ? (
          <ActivityIndicator color={colors.blue300} style={{ marginTop: 40 }} />
        ) : filtered.length > 0 ? (
          <TitleGrid
            data={filtered}
            onPressTitle={(t) => navigation.navigate("Player", { roomId: `solo-${t.id}`, titleId: t.id, solo: true })}
          />
        ) : (
          <EmptyState
            icon={Search}
            title={isError ? "Couldn't load this category" : "Nothing here yet"}
            description={isError ? "Try again shortly." : `No titles in ${category} yet.`}
          />
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
