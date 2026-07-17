import { useRef } from "react";
import { Animated, PanResponder, Pressable, View } from "react-native";
import { MicOff, Pin } from "lucide-react-native";
import Avatar from "@/components/ui/Avatar";
import { darkColors as colors } from "@/theme/colors";
import type { Participant } from "@/stores/roomStore";

type FaceBubbleProps = {
  participant: Participant;
  initialX: number;
  initialY: number;
  size?: number;
  onTogglePin: (id: string) => void;
};

// Floating, draggable video tile stand-in for a LiveKit video track. Real
// camera frames are wired up via services/livekit.ts on native builds —
// this renders an Avatar placeholder so the layout/interaction works
// everywhere, including the web preview used for design review.
export default function FaceBubble({ participant, initialX, initialY, size = 84, onTogglePin }: FaceBubbleProps) {
  const pan = useRef(new Animated.ValueXY({ x: initialX, y: initialY })).current;

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: Animated.event([null, { dx: pan.x, dy: pan.y }], { useNativeDriver: false }),
      onPanResponderGrant: () => {
        pan.setOffset({ x: (pan.x as any)._value, y: (pan.y as any)._value });
        pan.setValue({ x: 0, y: 0 });
      },
      onPanResponderRelease: () => {
        pan.flattenOffset();
      },
    })
  ).current;

  return (
    <Animated.View
      {...panResponder.panHandlers}
      style={{
        transform: pan.getTranslateTransform(),
        position: "absolute",
        width: size,
        height: size,
      }}
    >
      <Pressable
        onPress={() => onTogglePin(participant.id)}
        className={`h-full w-full items-center justify-center rounded-2xl border-2 ${
          participant.isPinned ? "border-blue-400" : "border-white/20"
        }`}
        style={{ backgroundColor: colors.navy900 }}
      >
        <Avatar name={participant.name} uri={participant.avatarUri} size={size * 0.6} />
        {!participant.micOn && (
          <View className="absolute bottom-1 right-1 h-5 w-5 items-center justify-center rounded-full bg-black/70">
            <MicOff size={11} color="#fff" />
          </View>
        )}
        {participant.isPinned && (
          <View className="absolute left-1 top-1 h-5 w-5 items-center justify-center rounded-full bg-black/70">
            <Pin size={10} color={colors.blue300} />
          </View>
        )}
      </Pressable>
    </Animated.View>
  );
}
