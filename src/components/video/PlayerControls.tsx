import { Pressable, Text, View } from "react-native";
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  Captions,
  Settings,
} from "lucide-react-native";
import ScrubBar from "@/components/ui/ScrubBar";
import { darkColors as colors } from "@/theme/colors";
import { usePlayerStore } from "@/stores/playerStore";

type PlayerControlsProps = {
  isHost: boolean;
  onSeek: (seconds: number) => void;
  onOpenSettings: () => void;
};

function formatTime(seconds: number) {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export default function PlayerControls({ isHost, onSeek, onOpenSettings }: PlayerControlsProps) {
  const isPlaying = usePlayerStore((s) => s.isPlaying);
  const setPlaying = usePlayerStore((s) => s.setPlaying);
  const position = usePlayerStore((s) => s.positionSeconds);
  const duration = usePlayerStore((s) => s.durationSeconds) || 1;
  const volume = usePlayerStore((s) => s.volume);
  const setVolume = usePlayerStore((s) => s.setVolume);
  const captionsOn = usePlayerStore((s) => s.captionsOn);
  const toggleCaptions = usePlayerStore((s) => s.toggleCaptions);
  const toggleFullscreen = usePlayerStore((s) => s.toggleFullscreen);

  return (
    <View className="gap-2 bg-black/60 px-5 pb-3 pt-2">
      <View className="flex-row items-center gap-2">
        <Text className="w-10 text-xs text-white/70">{formatTime(position)}</Text>
        <ScrubBar value={position} max={duration} disabled={!isHost} onChangeComplete={onSeek} />
        <Text className="w-10 text-xs text-white/70">{formatTime(duration)}</Text>
      </View>

      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center gap-4">
          <Pressable onPress={() => setPlaying(!isPlaying)} hitSlop={8}>
            {isPlaying ? <Pause size={22} color="#fff" /> : <Play size={22} color="#fff" />}
          </Pressable>
          <Pressable onPress={() => setVolume(volume > 0 ? 0 : 1)} hitSlop={8}>
            {volume > 0 ? <Volume2 size={20} color="#fff" /> : <VolumeX size={20} color="#fff" />}
          </Pressable>
        </View>

        <View className="flex-row items-center gap-4">
          <Pressable onPress={toggleCaptions} hitSlop={8}>
            <Captions size={20} color={captionsOn ? colors.blue300 : "rgba(255,255,255,0.6)"} />
          </Pressable>
          <Pressable onPress={onOpenSettings} hitSlop={8}>
            <Settings size={20} color="rgba(255,255,255,0.7)" />
          </Pressable>
          <Pressable onPress={toggleFullscreen} hitSlop={8}>
            <Maximize size={20} color="#fff" />
          </Pressable>
        </View>
      </View>
      {!isHost && <Text className="text-center text-[11px] text-white/40">Only the host can scrub playback</Text>}
    </View>
  );
}
