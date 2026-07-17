import { useEffect, useState } from "react";
import { Pressable, Text, View, useWindowDimensions } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import * as ScreenOrientation from "expo-screen-orientation";
import { useVideoPlayer, VideoView } from "expo-video";
import { useEvent } from "expo";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { ChevronDown, Clock, Info, MessageSquare, Users, X } from "lucide-react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import FaceBubble from "@/components/video/FaceBubble";
import PlayerControls from "@/components/video/PlayerControls";
import SyncIndicator from "@/components/video/SyncIndicator";
import ReactionsBar from "@/components/video/ReactionsBar";
import ChatDrawer from "@/components/video/ChatDrawer";
import ParticipantsSheet from "@/components/video/ParticipantsSheet";
import QualitySheet from "@/components/video/QualitySheet";
import Badge from "@/components/ui/Badge";
import { useThemeColors } from "@/hooks/useThemeColors";
import { titles } from "@/lib/mockData";
import { isTmdbId } from "@/lib/tmdbAdapter";
import { useMovieDetails } from "@/hooks/useTmdb";
import { useRoomStore } from "@/stores/roomStore";
import { usePlayerStore } from "@/stores/playerStore";
import { connectSocket, disconnectSocket } from "@/services/socket";
import type { RootStackParamList } from "@/navigation/types";

type Props = NativeStackScreenProps<RootStackParamList, "Player">;

// TODO: replace with the real per-room manifest URL once transcoding is wired up.
// Apple's public BipBop HLS test stream — native AVPlayer/ExoPlayer handle
// it directly, bypassing the browser fetch/CORS/content-decoding quirks
// that can trip up a web preview.
const SAMPLE_HLS_URL = "https://devstreaming-cdn.apple.com/videos/streaming/examples/img_bipbop_adv_example_fmp4/master.m3u8";

// Shown whenever there's no real title to describe (e.g. opening the Player
// directly during testing) so the info panel never renders empty.
const DUMMY_TITLE = {
  name: "Midnight Signal",
  genre: "Sci-Fi",
  year: 2025,
  rating: "PG-13",
  runtimeMinutes: 118,
  synopsis:
    "A late-night radio host starts receiving broadcasts from a future that hasn't happened yet.",
};

const SWIPE_DISMISS_DISTANCE = 120;
const SWIPE_DISMISS_VELOCITY = 800;

export default function PlayerScreen({ route, navigation }: Props) {
  const { roomId, titleId, solo } = route.params;
  const { width, height } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const colors = useThemeColors();
  const isHost = useRoomStore((s) => s.isHost);
  const participants = useRoomStore((s) => s.participants);
  const upsertParticipant = useRoomStore((s) => s.upsertParticipant);
  const leaveRoom = useRoomStore((s) => s.leaveRoom);
  const isPlaying = usePlayerStore((s) => s.isPlaying);
  const playbackRate = usePlayerStore((s) => s.playbackRate);
  const isFullscreen = usePlayerStore((s) => s.isFullscreen);
  const setPosition = usePlayerStore((s) => s.setPosition);
  const setDuration = usePlayerStore((s) => s.setDuration);
  const setPlaying = usePlayerStore((s) => s.setPlaying);
  const resetPlayer = usePlayerStore((s) => s.reset);

  const isTmdb = titleId ? isTmdbId(titleId) : false;
  const tmdbTitle = useMovieDetails(isTmdb ? Number(titleId) : null).data;
  const mockTitle = titleId && !isTmdb ? titles.find((t) => t.id === titleId) : undefined;
  const displayTitle = tmdbTitle ?? mockTitle ?? DUMMY_TITLE;

  const [chatOpen, setChatOpen] = useState(false);
  const [participantsOpen, setParticipantsOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  // Shown by default so the movie's details are visible the moment the
  // player opens, rather than requiring the viewer to discover the "i" button.
  const [infoOpen, setInfoOpen] = useState(true);

  const player = useVideoPlayer(SAMPLE_HLS_URL, (p) => {
    p.play();
  });

  const { currentTime } = useEvent(player, "timeUpdate", {
    currentTime: player.currentTime,
    currentLiveTimestamp: null,
    currentOffsetFromLive: null,
    bufferedPosition: 0,
  });

  useEffect(() => {
    setPosition(currentTime);
    setDuration(player.duration);
  }, [currentTime, player, setPosition, setDuration]);

  useEffect(() => {
    if (isPlaying) player.play();
    else player.pause();
  }, [isPlaying, player]);

  useEffect(() => {
    player.playbackRate = playbackRate;
  }, [playbackRate, player]);

  // Fullscreen rotates to landscape (matching how every video app's
  // fullscreen button behaves) and restores portrait on exit or unmount —
  // requires app.json's orientation to be "default" rather than locked, see App.tsx.
  useEffect(() => {
    const lock = isFullscreen
      ? ScreenOrientation.OrientationLock.LANDSCAPE
      : ScreenOrientation.OrientationLock.PORTRAIT_UP;
    ScreenOrientation.lockAsync(lock);
  }, [isFullscreen]);

  useEffect(() => {
    return () => {
      ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP);
    };
  }, []);

  useEffect(() => {
    setPlaying(true);
    if (solo) return;
    connectSocket(roomId);
    if (participants.length === 0) {
      upsertParticipant({ id: "me", name: "You", isHost, micOn: true, cameraOn: true });
    }
    return () => disconnectSocket();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roomId, solo]);

  const onEndRoom = () => {
    resetPlayer();
    leaveRoom();
    navigation.replace("RoomRecap", { roomId });
  };

  const exitPlayer = () => {
    resetPlayer();
    if (navigation.canGoBack()) {
      navigation.goBack();
    } else {
      navigation.navigate("Main", { screen: "HomeTab", params: { screen: "Home" } });
    }
  };

  const togglePlayPause = () => setPlaying(!isPlaying);

  // Swipe-down-to-dismiss: follows the finger vertically (clamped so it
  // can't be dragged upward), then either snaps back or exits the player
  // once it clears a distance/velocity threshold — the same gesture used
  // to dismiss a fullscreen modal on iOS.
  const translateY = useSharedValue(0);
  const backdropOpacity = useSharedValue(1);

  const panGesture = Gesture.Pan()
    .activeOffsetY(10)
    .failOffsetY(-10)
    .onUpdate((e) => {
      translateY.value = Math.max(0, e.translationY);
      backdropOpacity.value = 1 - Math.min(translateY.value / (height * 0.6), 0.5);
    })
    .onEnd((e) => {
      const shouldDismiss = translateY.value > SWIPE_DISMISS_DISTANCE || e.velocityY > SWIPE_DISMISS_VELOCITY;
      if (shouldDismiss) {
        translateY.value = withTiming(height, { duration: 220 });
        backdropOpacity.value = withTiming(0, { duration: 220 }, (finished) => {
          if (finished) runOnJS(exitPlayer)();
        });
      } else {
        translateY.value = withSpring(0, { damping: 20, stiffness: 250 });
        backdropOpacity.value = withTiming(1, { duration: 150 });
      }
    });

  const sheetStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
    opacity: backdropOpacity.value,
  }));

  return (
    <View className="flex-1 bg-black">
      <StatusBar hidden={isFullscreen} />

      <GestureDetector gesture={panGesture}>
        <Animated.View style={[{ flex: 1 }, sheetStyle]}>
          <Pressable onPress={togglePlayPause} style={{ flex: 1 }}>
            <VideoView player={player} style={{ flex: 1 }} contentFit="contain" nativeControls={false} />
          </Pressable>

          {!solo &&
            !isFullscreen &&
            participants.map((participant, i) => {
              const columns = width < 380 ? 2 : 3;
              const bubbleSize = Math.min(84, width / columns - 24);
              const headerHeight = insets.top + 76;
              return (
                <FaceBubble
                  key={participant.id}
                  participant={participant}
                  size={bubbleSize}
                  initialX={16 + (i % columns) * (bubbleSize + 12)}
                  initialY={headerHeight + Math.floor(i / columns) * (bubbleSize + 12)}
                  onTogglePin={(id) =>
                    upsertParticipant({ ...participant, isPinned: participant.id === id ? !participant.isPinned : false })
                  }
                />
              );
            })}

          {!isFullscreen && (
            <SafeAreaView edges={["top"]} className="absolute inset-x-0 top-0" pointerEvents="box-none">
              <View className="flex-row items-center justify-between gap-2 px-5 py-2">
                <Pressable
                  onPress={exitPlayer}
                  hitSlop={8}
                  className="h-10 w-10 items-center justify-center rounded-full bg-black/50"
                >
                  <ChevronDown size={20} color="#fff" />
                </Pressable>
                {!solo && <SyncIndicator />}
                <View className="flex-row gap-2">
                  <Pressable
                    onPress={() => setInfoOpen(true)}
                    hitSlop={8}
                    className="h-10 w-10 items-center justify-center rounded-full bg-black/50"
                  >
                    <Info size={16} color="#fff" />
                  </Pressable>
                  {!solo && (
                    <>
                      <Pressable
                        onPress={() => setParticipantsOpen(true)}
                        hitSlop={8}
                        className="h-10 w-10 items-center justify-center rounded-full bg-black/50"
                      >
                        <Users size={16} color="#fff" />
                      </Pressable>
                      <Pressable
                        onPress={() => setChatOpen(true)}
                        hitSlop={8}
                        className="h-10 w-10 items-center justify-center rounded-full bg-black/50"
                      >
                        <MessageSquare size={16} color="#fff" />
                      </Pressable>
                    </>
                  )}
                </View>
              </View>
              <Text className="px-5 text-xs text-white/60">{displayTitle.name}</Text>
            </SafeAreaView>
          )}

          {!solo && !isFullscreen && <ReactionsBar />}

          {infoOpen && (
            <Pressable
              onPress={() => setInfoOpen(false)}
              className="absolute inset-0 items-end bg-black/60 px-5"
              style={{ justifyContent: "flex-start", paddingTop: insets.top + 84 }}
            >
              <Pressable className="w-full gap-3 rounded-2xl border border-line/10 bg-navy-950 p-5">
                <View className="flex-row items-start justify-between">
                  <Text className="flex-1 pr-3 text-lg font-['Manrope_700Bold'] text-foreground">{displayTitle.name}</Text>
                  <Pressable onPress={() => setInfoOpen(false)} hitSlop={8}>
                    <X size={18} color={colors.blue300} />
                  </Pressable>
                </View>
                <View className="flex-row items-center gap-3">
                  <Badge>{displayTitle.genre}</Badge>
                  {displayTitle.year > 0 && <Text className="text-xs text-blue-100/60">{displayTitle.year}</Text>}
                  <Text className="text-xs text-blue-100/60">{displayTitle.rating}</Text>
                  {displayTitle.runtimeMinutes > 0 && (
                    <View className="flex-row items-center gap-1">
                      <Clock size={11} color={colors.blue300} />
                      <Text className="text-xs text-blue-100/60">{displayTitle.runtimeMinutes}m</Text>
                    </View>
                  )}
                </View>
                <Text className="text-sm leading-5 text-blue-100/80">{displayTitle.synopsis}</Text>
              </Pressable>
            </Pressable>
          )}

          <View className="absolute inset-x-0 bottom-0" style={{ paddingBottom: insets.bottom }}>
            <PlayerControls
              isHost={solo ? true : isHost}
              onSeek={(seconds) => {
                player.currentTime = seconds;
              }}
              onOpenSettings={() => setSettingsOpen(true)}
            />
          </View>

          {!solo && chatOpen && <ChatDrawer onClose={() => setChatOpen(false)} />}
          {!solo && participantsOpen && (
            <ParticipantsSheet
              isHost={isHost}
              onClose={() => setParticipantsOpen(false)}
              onLeave={() => {
                resetPlayer();
                leaveRoom();
                navigation.goBack();
              }}
              onEndRoom={onEndRoom}
            />
          )}
          {settingsOpen && <QualitySheet onClose={() => setSettingsOpen(false)} />}
        </Animated.View>
      </GestureDetector>
    </View>
  );
}
