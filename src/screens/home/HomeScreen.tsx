import { ActivityIndicator, Image, ScrollView, Text, View, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LayoutGrid, Play, Users } from "lucide-react-native";
import type { CompositeScreenProps } from "@react-navigation/native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import BrandMark from "@/components/ui/BrandMark";
import Rail from "@/components/ui/Rail";
import TitleCard from "@/components/ui/TitleCard";
import Button from "@/components/ui/Button";
import WelcomeModal from "@/components/ui/WelcomeModal";
import { useThemeColors } from "@/hooks/useThemeColors";
import { TMDB_GENRE_ID_BY_NAME, type Genre } from "@/lib/mockData";
import {
  useTrendingMovies,
  usePopularMovies,
  useMoviesByGenre,
  usePrefetchGenres,
  usePrefetchMovieDetails,
  usePrefetchTitleImages,
} from "@/hooks/useTmdb";
import { useRoomStore } from "@/stores/roomStore";
import { useSessionStore } from "@/stores/sessionStore";
import type { HomeStackParamList, AppTabsParamList, RootStackParamList } from "@/navigation/types";

type Props = CompositeScreenProps<
  NativeStackScreenProps<HomeStackParamList, "Home">,
  CompositeScreenProps<
    BottomTabScreenProps<AppTabsParamList>,
    NativeStackScreenProps<RootStackParamList>
  >
>;

export default function HomeScreen({ navigation }: Props) {
  const colors = useThemeColors();
  const profile = useSessionStore((s) => s.profile);
  const hasSeenWelcome = useSessionStore((s) => s.hasSeenWelcome);
  const markWelcomeSeen = useSessionStore((s) => s.markWelcomeSeen);
  const activeRoomId = useRoomStore((s) => s.roomId);
  const activeParticipants = useRoomStore((s) => s.participants.length);

  const tmdbGenres = (profile?.categories ?? []).filter(
    (g): g is keyof typeof TMDB_GENRE_ID_BY_NAME => Boolean(TMDB_GENRE_ID_BY_NAME[g as keyof typeof TMDB_GENRE_ID_BY_NAME])
  );
  const [primaryGenre, secondaryGenre, tertiaryGenre] = tmdbGenres;
  const fallbackGenres: Genre[] = ["Action", "Comedy"];
  const secondRailGenre: Genre = secondaryGenre ?? fallbackGenres[0];
  const thirdRailGenre: Genre = tertiaryGenre ?? fallbackGenres[1];

  const trending = useTrendingMovies();
  const popular = usePopularMovies();
  const byGenre = useMoviesByGenre(primaryGenre ? TMDB_GENRE_ID_BY_NAME[primaryGenre]! : null);
  const bySecondGenre = useMoviesByGenre(TMDB_GENRE_ID_BY_NAME[secondRailGenre] ?? null);
  const byThirdGenre = useMoviesByGenre(TMDB_GENRE_ID_BY_NAME[thirdRailGenre] ?? null);

  const hero = trending.data?.[0];
  const genreRail = primaryGenre ? byGenre.data : popular.data;
  const genreRailTitle = primaryGenre ? `Because you like ${primaryGenre}` : "Popular right now";

  // Warm caches for whatever the user is likely to tap next: their full
  // onboarding genre list (for Category Browse), the details of everything
  // currently on screen (for Title Details), and the poster/backdrop images
  // themselves — so those screens open instantly instead of spinning.
  usePrefetchGenres(tmdbGenres);
  // Capped to what's actually likely to be tapped first (the hero + the top
  // of each rail) — prefetching every loaded title would mean dozens of
  // parallel detail requests and burn through TMDb's rate limit for no gain.
  const visibleIds = [
    ...(trending.data ?? []).slice(0, 5),
    ...(popular.data ?? []).slice(0, 5),
    ...(genreRail ?? []).slice(0, 5),
  ]
    .map((t) => Number(t.id))
    .filter((id) => !Number.isNaN(id));
  usePrefetchMovieDetails(visibleIds);
  usePrefetchTitleImages(trending.data);
  usePrefetchTitleImages(popular.data);

  const secondRailData = bySecondGenre.data;
  const secondRailLoading = bySecondGenre.isLoading;
  const thirdRailData = byThirdGenre.data;
  const thirdRailLoading = byThirdGenre.isLoading;

  const openPlayer = (titleId: string) =>
    navigation.navigate("Player", { roomId: `solo-${titleId}`, titleId, solo: true });

  return (
    <SafeAreaView className="flex-1 bg-background" edges={["top"]}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerClassName="gap-8 pb-10">
        <View className="flex-row items-center justify-between px-6 pt-2">
          <View>
            <Text className="text-xs text-blue-100/60">Welcome back</Text>
            <Text className="text-lg font-['Manrope_700Bold'] text-foreground">{profile?.displayName ?? "Friend"}</Text>
          </View>
          <View className="flex-row items-center gap-3">
            <Pressable
              onPress={() => navigation.navigate("DiscoverTab", { screen: "Search" })}
              className="flex-row items-center gap-1.5 rounded-full border border-line/10 bg-navy-900 px-3 py-2"
              hitSlop={4}
            >
              <LayoutGrid size={14} color={colors.blue300} />
              <Text className="text-xs font-['Manrope_600SemiBold'] text-blue-200">Categories</Text>
            </Pressable>
            <BrandMark size={36} />
          </View>
        </View>

        {activeRoomId && (
          <Pressable
            onPress={() => navigation.navigate("Player", { roomId: activeRoomId })}
            className="mx-6 flex-row items-center justify-between rounded-2xl border border-blue-400/40 bg-blue-500/15 px-4 py-3"
          >
            <View className="flex-row items-center gap-3">
              <View className="h-2 w-2 rounded-full bg-red-400" />
              <Text className="text-sm font-['Manrope_600SemiBold'] text-blue-100">
                Your room is live — {activeParticipants} friends watching
              </Text>
            </View>
            <Text className="text-xs font-['Manrope_600SemiBold'] text-blue-300">Rejoin</Text>
          </Pressable>
        )}

        <View className="px-6">
          {trending.isLoading ? (
            <View style={{ height: 220 }} className="items-center justify-center rounded-3xl bg-navy-950">
              <ActivityIndicator color={colors.blue300} />
            </View>
          ) : hero ? (
            <Pressable
              onPress={() => openPlayer(hero.id)}
              style={{ height: 220, backgroundColor: hero.posterColor }}
              className="justify-end overflow-hidden rounded-3xl"
            >
              {hero.backdropImageUrl && (
                <Image
                  source={{ uri: hero.backdropImageUrl }}
                  style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
                  resizeMode="cover"
                />
              )}
              <View className="gap-1 bg-black/40 p-5">
                <Text className="text-xs font-['Manrope_600SemiBold'] uppercase tracking-widest text-blue-200">Trending</Text>
                <Text className="text-2xl font-['Manrope_700Bold'] text-white">{hero.name}</Text>
                <Text numberOfLines={2} className="text-sm text-white/80">
                  {hero.synopsis}
                </Text>
                <View className="mt-4 flex-row gap-2">
                  <Button size="sm" icon={false} onPress={() => openPlayer(hero.id)}>
                    <Play size={13} color="#fff" /> Watch Now
                  </Button>
                  <Button
                    size="sm"
                    variant="secondary"
                    icon={false}
                    onPress={() =>
                      navigation.navigate("Main", {
                        screen: "RoomsTab",
                        params: { screen: "CreateRoom", params: { titleId: hero.id } },
                      })
                    }
                  >
                    <Users size={13} color={colors.blue200} /> Create Room
                  </Button>
                </View>
              </View>
            </Pressable>
          ) : (
            <View style={{ height: 220 }} className="items-center justify-center rounded-3xl bg-navy-950 px-6">
              <Text className="text-center text-sm text-blue-100/50">
                {trending.isError ? "Couldn't load trending titles right now." : "Nothing trending yet."}
              </Text>
            </View>
          )}
        </View>

        <Rail title="Continue Watching">
          {trending.isLoading ? (
            <ActivityIndicator color={colors.blue300} />
          ) : (
            trending.data?.slice(3, 7).map((t) => (
              <TitleCard
                key={t.id}
                title={t}
                progress={(Number(t.id) % 70) / 100 + 0.15}
                onPress={() => openPlayer(t.id)}
              />
            ))
          )}
        </Rail>

        <Rail title={genreRailTitle}>
          {(popular.isLoading || byGenre.isLoading) && !genreRail?.length ? (
            <ActivityIndicator color={colors.blue300} />
          ) : (
            genreRail?.map((t) => (
              <TitleCard key={t.id} title={t} onPress={() => openPlayer(t.id)} />
            ))
          )}
        </Rail>

        <Rail title="Trending in watch parties">
          {trending.data?.slice(0, 6).map((t) => (
            <View key={t.id} className="gap-2">
              <TitleCard title={t} onPress={() => openPlayer(t.id)} />
              <View className="flex-row items-center gap-1 px-0.5">
                <Users size={12} color={colors.blue300} />
                <Text className="text-xs text-blue-300">12 watching now</Text>
              </View>
            </View>
          ))}
        </Rail>

        <Rail title={secondRailGenre}>
          {secondRailLoading && !secondRailData?.length ? (
            <ActivityIndicator color={colors.blue300} />
          ) : (
            secondRailData?.map((t) => (
              <TitleCard key={t.id} title={t} onPress={() => openPlayer(t.id)} />
            ))
          )}
        </Rail>

        <Rail title={thirdRailGenre}>
          {thirdRailLoading && !thirdRailData?.length ? (
            <ActivityIndicator color={colors.blue300} />
          ) : (
            thirdRailData?.map((t) => (
              <TitleCard key={t.id} title={t} onPress={() => openPlayer(t.id)} />
            ))
          )}
        </Rail>
      </ScrollView>

      <WelcomeModal visible={!hasSeenWelcome} onDismiss={markWelcomeSeen} />
    </SafeAreaView>
  );
}
