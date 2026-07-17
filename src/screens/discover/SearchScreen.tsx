import { useMemo, useState } from "react";
import { Pressable, ScrollView, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Search as SearchIcon, TrendingUp, Clock } from "lucide-react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import CategoryTile from "@/components/ui/CategoryTile";
import { useThemeColors } from "@/hooks/useThemeColors";
import { genres, type Genre } from "@/lib/mockData";
import { useTrendingMovies, usePopularMovies } from "@/hooks/useTmdb";
import type { DiscoverStackParamList } from "@/navigation/types";

type Props = NativeStackScreenProps<DiscoverStackParamList, "Search">;

const recentSearches = ["Midnight Signal", "Hangar 9"];
const trendingQueries = ["Anime watch parties", "Weekend horror picks", "New this week"];
const TILE_TINTS = ["#0047ab", "#0f52ba", "#4169e1", "#007fff", "#3a3a3a"];

export default function SearchScreen({ navigation }: Props) {
  const colors = useThemeColors();
  const [query, setQuery] = useState("");
  const trending = useTrendingMovies();
  const popular = usePopularMovies();

  // Derives one representative poster per genre from data already fetched
  // for the Home screen — no extra API calls needed.
  const posterByGenre = useMemo(() => {
    const combined = [...(trending.data ?? []), ...(popular.data ?? [])];
    const map: Partial<Record<Genre, string>> = {};
    for (const title of combined) {
      if (!map[title.genre] && title.posterImageUrl) {
        map[title.genre] = title.posterImageUrl;
      }
    }
    return map;
  }, [trending.data, popular.data]);

  const submit = (value: string) => {
    if (!value.trim()) return;
    navigation.navigate("SearchResults", { query: value.trim() });
  };

  return (
    <SafeAreaView className="flex-1 bg-background" edges={["top"]}>
      <View className="gap-6 px-6 pt-2">
        <Text className="text-2xl font-['Manrope_700Bold'] text-foreground">Discover</Text>
        <View className="flex-row items-center gap-2 rounded-xl border border-line/10 bg-navy-900 px-4">
          <SearchIcon size={18} color={colors.blue300} />
          <TextInput
            value={query}
            onChangeText={setQuery}
            onSubmitEditing={() => submit(query)}
            placeholder="Search movies, shows, genres…"
            placeholderTextColor="rgba(226,233,251,0.35)"
            className="min-h-[44px] flex-1 text-base text-foreground"
            returnKeyType="search"
          />
        </View>
      </View>

      <ScrollView contentContainerClassName="gap-8 px-6 py-6" showsVerticalScrollIndicator={false}>
        <View className="gap-3">
          <Text className="text-sm font-['Manrope_600SemiBold'] text-blue-100/70">Recent searches</Text>
          {recentSearches.map((item) => (
            <Pressable key={item} onPress={() => submit(item)} className="flex-row items-center gap-3 py-1.5">
              <Clock size={16} color={colors.blue300} />
              <Text className="text-sm text-foreground/85">{item}</Text>
            </Pressable>
          ))}
        </View>

        <View className="gap-3">
          <Text className="text-sm font-['Manrope_600SemiBold'] text-blue-100/70">Trending searches</Text>
          {trendingQueries.map((item) => (
            <Pressable key={item} onPress={() => submit(item)} className="flex-row items-center gap-3 py-1.5">
              <TrendingUp size={16} color={colors.blue300} />
              <Text className="text-sm text-foreground/85">{item}</Text>
            </Pressable>
          ))}
        </View>

        <View className="gap-3">
          <Text className="text-sm font-['Manrope_600SemiBold'] text-blue-100/70">Browse by category</Text>
          <View className="flex-row flex-wrap gap-3">
            {genres.map((genre, i) => (
              <View key={genre} style={{ width: "31%" }}>
                <CategoryTile
                  label={genre}
                  posterUrl={posterByGenre[genre]}
                  fallbackColor={TILE_TINTS[i % TILE_TINTS.length]}
                  onPress={() => navigation.navigate("CategoryBrowse", { category: genre })}
                />
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
