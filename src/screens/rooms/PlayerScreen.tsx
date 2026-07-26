import React, { useState, useRef, useCallback, useEffect } from "react";
import { 
  View, 
  Text, 
  ActivityIndicator, 
  StyleSheet, 
  Pressable,
  Animated,
  StatusBar,
} from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import { useVideoPlayer, VideoView } from "expo-video";
import { useEventListener } from "expo";
import { 
  MessageCircle, 
  Smile,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  RotateCcw,
  RotateCw,
  ChevronDown,
  MoreVertical,
  CreditCard,
  AlertTriangle,
  WifiOff,
} from "lucide-react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import ChatDrawer from "@/components/video/ChatDrawer";
import ScrubBar from "@/components/ui/ScrubBar";
import { usePlayback } from "@/hooks/UsePlayback";
import type { ApiError } from "@/services/api";

type RouteParams = {
  titleId?: string;
  title?: string;
  season?: number;
  episode?: number;
  id?: string;
  slug?: string;
  solo?: boolean;
  roomId?: string;
  trailerUrl?: string;
  name?: string;
};

// Error code constants matching the backend response envelope
const ERR_SUBSCRIPTION_REQUIRED = "SUBSCRIPTION_REQUIRED";
const ERR_TITLE_NOT_PLAYABLE = "TITLE_NOT_PLAYABLE";
const ERR_CLOUDFLARE_STREAM_ERROR = "CLOUDFLARE_STREAM_ERROR";
const ERR_CLOUDFLARE_UNCONFIGURED = "CLOUDFLARE_STREAM_UNCONFIGURED";

// Match score helper
function matchScoreFor(name: string) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = (hash * 31 + name.charCodeAt(i)) >>> 0;
  return 85 + (hash % 15);
}

function formatTime(seconds: number) {
  if (!seconds || !isFinite(seconds)) return "0:00";
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  if (h > 0) return `${h}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

// Reaction emojis
const REACTION_EMOJIS = ["❤️", "😂", "🤣", "🔥", "👍", "🎉", "😍", "🤩", "😎", "💀", "🙌", "🥳", "😱", "💯", "✨", "🚀", "👏", "💪"];

export default function PlayerScreen() {
  const route = useRoute();
  const navigation = useNavigation<any>();
  
  const params = (route?.params || {}) as RouteParams;
  
  // Extract title info from params
  const titleName = params?.name || params?.title || "Now Playing";
  const titleId = params?.titleId || params?.id || "";
  
  // Fetch the real playback URL from the catalog API
  const { data: playbackData, isLoading: playbackLoading, error: playbackError, refetch: retryPlayback } = usePlayback(titleId || null);
  
  const [playbackUrl, setPlaybackUrl] = useState<string | null>(null);
  const [playbackErrorCode, setPlaybackErrorCode] = useState<string | null>(null);
  
  // Process playback response
  useEffect(() => {
    if (playbackData && playbackData.url) {
      setPlaybackUrl(playbackData.url);
      setPlaybackErrorCode(null);
    }
  }, [playbackData]);

  // Handle playback error codes for proper UX
  useEffect(() => {
    if (playbackError) {
      const apiErr = playbackError as ApiError;
      if (apiErr.status === 403) {
        setPlaybackErrorCode(ERR_SUBSCRIPTION_REQUIRED);
      } else if (apiErr.status === 404) {
        setPlaybackErrorCode(ERR_TITLE_NOT_PLAYABLE);
      } else if (apiErr.status === 502) {
        setPlaybackErrorCode(ERR_CLOUDFLARE_STREAM_ERROR);
      } else if (apiErr.status === 503) {
        setPlaybackErrorCode(ERR_CLOUDFLARE_UNCONFIGURED);
      } else {
        setPlaybackErrorCode("UNKNOWN");
      }
    }
  }, [playbackError]);

  // Create the video player with a placeholder source initially.
  // Once the real playback URL is fetched, player.replace() updates it.
  const player = useVideoPlayer(
    playbackUrl ? { uri: playbackUrl } : { uri: "https://example.com/placeholder.mp4" },
    (p) => {
      if (playbackUrl) {
        p.volume = 1;
        p.play();
      }
    },
  );

  // Update player source when playbackUrl changes
  useEffect(() => {
    if (playbackUrl && player) {
      player.replace(playbackUrl);
      player.play();
    }
  }, [playbackUrl, player]);
  
  // UI State
  const [error, setError] = useState<string | null>(null);
  
  // Playback tracking state
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  
  // Chat & Reaction state
  const [showChat, setShowChat] = useState(false);
  const [showReactionPicker, setShowReactionPicker] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  
  // Controls overlay visibility
  const [controlsVisible, setControlsVisible] = useState(true);
  const controlsOpacity = useRef(new Animated.Value(1)).current;
  const hideTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  // Listen for player status changes
  useEventListener(player, "statusChange", ({ status, error: playerError }) => {
    if (status === "readyToPlay") {
      setError(null);
      // Set duration when video is ready
      if (player.duration) {
        setDuration(player.duration);
      }
    } else if (status === "error") {
      setError(playerError?.message || "Failed to load video");
    }
  });

  // Listen for time updates to track current position
  useEventListener(player, "timeUpdate", ({ currentTime: time }) => {
    setCurrentTime(time);
    // Also update duration in case it becomes available later
    if (player.duration && player.duration !== duration) {
      setDuration(player.duration);
    }
  });

  // Listen for muted state changes
  useEventListener(player, "mutedChange", ({ muted }) => {
    setIsMuted(muted);
  });

  // Listen for playing state changes
  useEventListener(player, "playingChange", ({ isPlaying: playing }) => {
    setIsPlaying(playing);
  });

  // Auto-hide controls after 5 seconds
  const showControlsTemporarily = useCallback(() => {
    setControlsVisible(true);
    Animated.timing(controlsOpacity, {
      toValue: 1,
      duration: 200,
      useNativeDriver: true,
    }).start();

    if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
    hideTimerRef.current = setTimeout(() => {
      if (!showChat && !showReactionPicker) {
        Animated.timing(controlsOpacity, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }).start(() => setControlsVisible(false));
      }
    }, 5000);
  }, [controlsOpacity, showChat, showReactionPicker]);

  // Clean up timer on unmount
  useEffect(() => {
    return () => {
      if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
    };
  }, []);

  const handleTapOverlay = () => {
    if (controlsVisible) {
      if (showChat || showReactionPicker) return;
      Animated.timing(controlsOpacity, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start(() => setControlsVisible(false));
    } else {
      showControlsTemporarily();
    }
  };

  const togglePlayPause = () => {
    if (player.playing) {
      player.pause();
    } else {
      player.play();
    }
    showControlsTemporarily();
  };

  const seekBackward = () => {
    player.seekBy(-10);
    showControlsTemporarily();
  };

  const seekForward = () => {
    player.seekBy(10);
    showControlsTemporarily();
  };

  const toggleChat = () => {
    setShowChat((v) => !v);
    setShowReactionPicker(false);
    setShowMenu(false);
    showControlsTemporarily();
  };

  const toggleReactionPicker = () => {
    setShowReactionPicker((v) => !v);
    setShowMenu(false);
    showControlsTemporarily();
  };

  const sendReaction = (emoji: string) => {
    // For solo mode, we just provide visual feedback
    setShowReactionPicker(false);
    showControlsTemporarily();
  };

  const handleSeek = (seconds: number) => {
    player.currentTime = seconds;
    showControlsTemporarily();
  };

  const toggleMute = () => {
    player.muted = !player.muted;
    showControlsTemporarily();
  };

  // ------ Error state for playback issues (before video loads) ------

  // SUBSCRIPTION_REQUIRED (403)
  if (playbackErrorCode === ERR_SUBSCRIPTION_REQUIRED) {
    return (
      <View style={styles.container}>
        <StatusBar hidden />
        <SafeAreaView edges={["top"]} className="absolute top-0 left-0 right-0 z-10">
          <Pressable onPress={() => navigation.goBack()} className="ml-4 mt-2 h-9 w-9 items-center justify-center rounded-full bg-black/50">
            <ChevronDown size={20} color="#fff" />
          </Pressable>
        </SafeAreaView>
        <View className="flex-1 items-center justify-center px-8">
          <CreditCard size={48} color="#f87171" />
          <Text className="mt-4 text-lg font-['Manrope_600SemiBold'] text-red-400">Subscription Required</Text>
          <Text className="mt-2 text-sm text-white/50 text-center">
            An active subscription is required to play this title.
          </Text>
          <Pressable 
            onPress={() => {
              navigation.goBack();
              // Navigate to subscription screen
              navigation.navigate("Main", {
                screen: "ProfileTab",
                params: { screen: "Subscription" },
              });
            }} 
            className="mt-6 rounded-lg bg-blue-600 px-6 py-3"
          >
            <Text className="text-sm font-['Manrope_600SemiBold'] text-white">View Plans</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  // TITLE_NOT_PLAYABLE (404)
  if (playbackErrorCode === ERR_TITLE_NOT_PLAYABLE) {
    return (
      <View style={styles.container}>
        <StatusBar hidden />
        <SafeAreaView edges={["top"]} className="absolute top-0 left-0 right-0 z-10">
          <Pressable onPress={() => navigation.goBack()} className="ml-4 mt-2 h-9 w-9 items-center justify-center rounded-full bg-black/50">
            <ChevronDown size={20} color="#fff" />
          </Pressable>
        </SafeAreaView>
        <View className="flex-1 items-center justify-center px-8">
          <AlertTriangle size={48} color="#fbbf24" />
          <Text className="mt-4 text-lg font-['Manrope_600SemiBold'] text-yellow-400">Not Available</Text>
          <Text className="mt-2 text-sm text-white/50 text-center">
            This title is not available right now.
          </Text>
          <Pressable onPress={() => navigation.goBack()} className="mt-6 rounded-lg bg-blue-600 px-6 py-3">
            <Text className="text-sm font-['Manrope_600SemiBold'] text-white">Go Back</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  // Cloudflare errors (502/503)
  if (playbackErrorCode === ERR_CLOUDFLARE_STREAM_ERROR || playbackErrorCode === ERR_CLOUDFLARE_UNCONFIGURED) {
    return (
      <View style={styles.container}>
        <StatusBar hidden />
        <SafeAreaView edges={["top"]} className="absolute top-0 left-0 right-0 z-10">
          <Pressable onPress={() => navigation.goBack()} className="ml-4 mt-2 h-9 w-9 items-center justify-center rounded-full bg-black/50">
            <ChevronDown size={20} color="#fff" />
          </Pressable>
        </SafeAreaView>
        <View className="flex-1 items-center justify-center px-8">
          <WifiOff size={48} color="#60a5fa" />
          <Text className="mt-4 text-lg font-['Manrope_600SemiBold'] text-blue-400">Stream Unavailable</Text>
          <Text className="mt-2 text-sm text-white/50 text-center">
            {playbackErrorCode === ERR_CLOUDFLARE_STREAM_ERROR
              ? "There was an issue loading the stream. Please try again."
              : "The stream source is not fully configured yet. Please try again later."}
          </Text>
          <Pressable 
            onPress={() => {
              setPlaybackErrorCode(null);
              retryPlayback();
            }} 
            className="mt-6 flex-row items-center gap-2 rounded-lg bg-blue-600 px-6 py-3"
          >
            <RotateCcw size={16} color="#fff" />
            <Text className="text-sm font-['Manrope_600SemiBold'] text-white">Try Again</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  // Loading state (waiting for playback URL)
  if (playbackLoading || (!playbackUrl && !playbackErrorCode)) {
    return (
      <View style={styles.container}>
        <StatusBar hidden />
        <SafeAreaView edges={["top"]} className="absolute top-0 left-0 right-0 z-10">
          <Pressable onPress={() => navigation.goBack()} className="ml-4 mt-2 h-9 w-9 items-center justify-center rounded-full bg-black/50">
            <ChevronDown size={20} color="#fff" />
          </Pressable>
        </SafeAreaView>
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#3B82F6" />
          <Text className="mt-4 text-sm text-white/70">Loading video...</Text>
          <Text className="mt-2 text-xs text-white/40">{titleName}</Text>
        </View>
      </View>
    );
  }

  // Error state (video player error after loading URL)
  if (error) {
    return (
      <View style={styles.container}>
        <StatusBar hidden />
        <SafeAreaView edges={["top"]} className="absolute top-0 left-0 right-0 z-10">
          <Pressable onPress={() => navigation.goBack()} className="ml-4 mt-2 h-9 w-9 items-center justify-center rounded-full bg-black/50">
            <ChevronDown size={20} color="#fff" />
          </Pressable>
        </SafeAreaView>
        <View className="flex-1 items-center justify-center px-8">
          <Text className="text-lg font-['Manrope_600SemiBold'] text-red-400">Couldn't load video</Text>
          <Text className="mt-2 text-sm text-white/50 text-center">{error}</Text>
          <Pressable 
            onPress={() => {
              setError(null);
              retryPlayback();
            }} 
            className="mt-6 flex-row items-center gap-2 rounded-lg bg-blue-600 px-6 py-3"
          >
            <RotateCcw size={16} color="#fff" />
            <Text className="text-sm font-['Manrope_600SemiBold'] text-white">Try Again</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  const matchScore = matchScoreFor(titleName);

  return (
    <View style={styles.container}>
      <StatusBar hidden />
      
      {/* Video Player - full screen */}
      <View style={styles.videoContainer}>
        <VideoView
          player={player}
          style={styles.video}
          contentFit="contain"
          nativeControls={false}
        />
      </View>

      {/* Netflix-style Overlay - appears on tap */}
      <Pressable 
        style={StyleSheet.absoluteFill}
        onPress={handleTapOverlay}
      >
        {/* Controls Overlay */}
        {controlsVisible && (
          <Animated.View 
            style={[styles.overlay, { opacity: controlsOpacity }]}
            pointerEvents="box-none"
          >
            {/* Dark gradient overlay for readability */}
            <View style={styles.overlayGradient} />

            {/* Top bar - Netflix style */}
            <SafeAreaView edges={["top"]} className="absolute top-0 left-0 right-0 z-20">
              <View className="flex-row items-center justify-between px-4 pt-2">
                <View className="flex-row items-center gap-3 flex-1">
                  <Pressable onPress={() => navigation.goBack()} hitSlop={8} className="h-9 w-9 items-center justify-center rounded-full bg-black/50">
                    <ChevronDown size={20} color="#fff" />
                  </Pressable>
                  <View className="flex-1">
                    <Text className="text-sm font-['Manrope_600SemiBold'] text-white" numberOfLines={1}>
                      {titleName}
                    </Text>
                    {/* Movie metadata line */}
                    <View className="flex-row items-center gap-2 mt-0.5">
                      <Text className="text-xs font-['Manrope_700Bold'] text-green-400">
                        {matchScore}% Match
                      </Text>
                      {params?.titleId && (
                        <Text className="text-[10px] text-blue-100/60">Now Playing</Text>
                      )}
                    </View>
                  </View>
                </View>
                <View className="flex-row items-center gap-3">
                  {/* 3-dot Kebab Menu */}
                  <Pressable 
                    onPress={() => setShowMenu((v) => !v)}
                    hitSlop={8} 
                    className={`h-9 w-9 items-center justify-center rounded-full ${showMenu ? 'bg-blue-600' : 'bg-black/50'}`}
                  >
                    <MoreVertical size={20} color="#fff" />
                  </Pressable>
                </View>
              </View>
              {/* Dropdown menu for 3-dot */}
              {showMenu && (
                <View className="absolute right-4 top-14 z-50 rounded-2xl bg-navy-950/95 border border-white/10 p-2 shadow-2xl min-w-[160px]">
                  <Pressable
                    onPress={toggleReactionPicker}
                    className="flex-row items-center gap-3 rounded-xl px-4 py-3 active:bg-white/10"
                  >
                    <Smile size={18} color="#fff" />
                    <Text className="text-sm text-white">React</Text>
                  </Pressable>
                  <Pressable
                    onPress={toggleChat}
                    className="flex-row items-center gap-3 rounded-xl px-4 py-3 active:bg-white/10"
                  >
                    <MessageCircle size={18} color="#fff" />
                    <Text className="text-sm text-white">Chat</Text>
                  </Pressable>
                </View>
              )}
            </SafeAreaView>

            {/* Center controls - properly centered */}
            <View className="absolute inset-0 items-center justify-center z-10">
              <View className="flex-row items-center gap-8">
                <Pressable onPress={seekBackward} hitSlop={12} className="h-12 w-12 items-center justify-center rounded-full bg-black/30">
                  <RotateCcw size={26} color="#fff" />
                </Pressable>
                <Pressable 
                  onPress={togglePlayPause}
                  className="h-16 w-16 items-center justify-center rounded-full bg-white/20"
                >
                  {isPlaying ? <Pause size={32} color="#fff" fill="#fff" /> : <Play size={32} color="#fff" fill="#fff" />}
                </Pressable>
                <Pressable onPress={seekForward} hitSlop={12} className="h-12 w-12 items-center justify-center rounded-full bg-black/30">
                  <RotateCw size={26} color="#fff" />
                </Pressable>
              </View>
            </View>

            {/* Reaction Picker - shown from 3-dot menu */}
            {showReactionPicker && (
              <View className="absolute bottom-32 left-4 right-4 z-30">
                <View className="rounded-2xl bg-navy-950/95 border border-white/10 p-3">
                  <Text className="text-xs font-['Manrope_600SemiBold'] text-blue-100/70 mb-2 text-center">
                    Send a reaction
                  </Text>
                  <View className="flex-row flex-wrap justify-center gap-1">
                    {REACTION_EMOJIS.map((emoji) => (
                      <Pressable
                        key={emoji}
                        onPress={() => sendReaction(emoji)}
                        className="h-10 w-10 items-center justify-center active:bg-white/10 rounded-lg"
                      >
                        <Text className="text-2xl">{emoji}</Text>
                      </Pressable>
                    ))}
                  </View>
                </View>
              </View>
            )}

            {/* Bottom bar */}
            <SafeAreaView edges={["bottom"]} className="absolute bottom-0 left-0 right-0 z-10">
              <View className="px-4 pb-4">
                {/* Scrub bar with time labels */}
                <View className="flex-row items-center gap-2 mb-2">
                  <Text className="text-xs text-white/70 w-10 text-right font-['Manrope_500Medium']">
                    {formatTime(currentTime)}
                  </Text>
                  <View className="flex-1">
                    <ScrubBar
                      value={currentTime}
                      max={duration || 1}
                      disabled={false}
                      onChangeComplete={handleSeek}
                    />
                  </View>
                  <Text className="text-xs text-white/70 w-10 font-['Manrope_500Medium']">
                    {formatTime(duration)}
                  </Text>
                </View>
                <View className="flex-row items-center justify-between">
                  <View className="flex-row items-center gap-3">
                    <Pressable onPress={togglePlayPause} hitSlop={8}>
                      {isPlaying ? <Pause size={20} color="#fff" /> : <Play size={20} color="#fff" />}
                    </Pressable>
                  </View>
                  <View className="flex-row items-center gap-4">
                    <Pressable onPress={toggleMute} hitSlop={8}>
                      {isMuted ? <VolumeX size={18} color="#fff" /> : <Volume2 size={18} color="#fff" />}
                    </Pressable>
                    <Text className="text-xs text-white/50">HD</Text>
                    <Maximize size={18} color="#fff" />
                  </View>
                </View>
              </View>
            </SafeAreaView>
          </Animated.View>
        )}
      </Pressable>

      {/* Chat Drawer */}
      {showChat && (
        <ChatDrawer onClose={() => setShowChat(false)} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  videoContainer: {
    ...StyleSheet.absoluteFillObject,
  },
  video: {
    flex: 1,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
  },
  overlayGradient: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.55)",
  },
});

