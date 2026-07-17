import { useState } from "react";
import { ActivityIndicator, Image, Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ChevronLeft, Clock, Play, Plus, Check, Star, Users } from "lucide-react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import { useThemeColors } from "@/hooks/useThemeColors";
import { titles } from "@/lib/mockData";
import { isTmdbId } from "@/lib/tmdbAdapter";
import { useMovieDetails } from "@/hooks/useTmdb";
import type { RootStackParamList } from "@/navigation/types";

type Props = NativeStackScreenProps<RootStackParamList, "TitleDetails">;

export default function TitleDetailsScreen({ route, navigation }: Props) {
  const colors = useThemeColors();
  const { titleId } = route.params;
  const isTmdb = isTmdbId(titleId);
  const tmdbQuery = useMovieDetails(isTmdb ? Number(titleId) : null);
  const [inWatchlist, setInWatchlist] = useState(false);

  const title = isTmdb ? tmdbQuery.data : (titles.find((t) => t.id === titleId) ?? titles[0]);

  if (isTmdb && tmdbQuery.isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-background">
        <ActivityIndicator color={colors.blue300} />
      </View>
    );
  }

  if (!title) {
    return (
      <View className="flex-1 items-center justify-center bg-background px-8">
        <Text className="text-center text-sm text-blue-100/60">Couldn't load this title right now.</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-background">
      <ScrollView showsVerticalScrollIndicator={false} contentContainerClassName="pb-12">
        <View style={{ height: 280, backgroundColor: title.posterColor }}>
          {title.backdropImageUrl && (
            <Image
              source={{ uri: title.backdropImageUrl }}
              style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
              resizeMode="cover"
            />
          )}
          <SafeAreaView edges={["top"]}>
            <Pressable
              onPress={() => navigation.goBack()}
              hitSlop={8}
              className="ml-4 mt-2 h-9 w-9 items-center justify-center rounded-full bg-black/40"
            >
              <ChevronLeft size={20} color="#fff" />
            </Pressable>
          </SafeAreaView>
        </View>

        <View className="gap-5 px-6 pt-6">
          <View className="gap-2">
            <Text className="text-2xl font-['Manrope_700Bold'] text-foreground">{title.name}</Text>
            <View className="flex-row items-center gap-3">
              <Text className="text-sm text-blue-100/70">{title.year}</Text>
              <Text className="text-sm text-blue-100/70">·</Text>
              <Text className="text-sm text-blue-100/70">{title.rating}</Text>
              {title.runtimeMinutes > 0 && (
                <>
                  <Text className="text-sm text-blue-100/70">·</Text>
                  <View className="flex-row items-center gap-1">
                    <Clock size={12} color={colors.blue300} />
                    <Text className="text-sm text-blue-100/70">{title.runtimeMinutes}m</Text>
                  </View>
                </>
              )}
            </View>
            <Badge>{title.genre}</Badge>
          </View>

          <Text className="text-base leading-6 text-blue-100/85">{title.synopsis}</Text>

          {title.cast.length > 0 && (
            <View className="gap-1">
              <Text className="text-sm font-['Manrope_600SemiBold'] text-blue-100/70">Cast</Text>
              <Text className="text-sm text-foreground/80">{title.cast.join(", ")}</Text>
            </View>
          )}

          <View className="flex-row gap-3">
            <Button
              className="flex-1"
              icon={false}
              onPress={() => navigation.navigate("Player", { roomId: `solo-${title.id}`, titleId: title.id, solo: true })}
            >
              <Play size={14} color="#fff" /> Watch Now
            </Button>
            <Button
              className="flex-1"
              variant="secondary"
              icon={false}
              onPress={() => navigation.navigate("Main", { screen: "RoomsTab", params: { screen: "CreateRoom", params: { titleId: title.id } } })}
            >
              <Users size={14} color={colors.blue200} /> Create Room
            </Button>
            <Pressable
              onPress={() => setInWatchlist((v) => !v)}
              className="h-[44px] w-[44px] items-center justify-center rounded-full border border-line/15"
            >
              {inWatchlist ? <Check size={18} color={colors.blue300} /> : <Plus size={18} color={colors.blue300} />}
            </Pressable>
          </View>

          {title.isSeries && title.episodes && (
            <View className="gap-3">
              <Text className="text-lg font-['Manrope_700Bold'] text-foreground">Episodes</Text>
              {title.episodes.map((ep, i) => (
                <View key={ep.id} className="flex-row items-center gap-3 rounded-xl border border-line/10 bg-navy-950 p-3">
                  <View className="h-12 w-20 items-center justify-center rounded-lg bg-blue-700">
                    <Play size={16} color="#fff" />
                  </View>
                  <View className="flex-1">
                    <Text className="text-sm font-['Manrope_600SemiBold'] text-foreground">
                      {i + 1}. {ep.title}
                    </Text>
                    <Text className="text-xs text-blue-100/60">{ep.runtimeMinutes}m</Text>
                  </View>
                </View>
              ))}
            </View>
          )}

          <View className="flex-row items-center gap-1.5 pt-2">
            <Star size={14} color={colors.blue300} />
            <Text className="text-sm text-blue-100/70">Rate this after you watch it with friends</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
