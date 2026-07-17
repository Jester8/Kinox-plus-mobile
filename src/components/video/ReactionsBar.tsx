import { useRef, useState } from "react";
import { Animated, Easing, Pressable, Text, View } from "react-native";
import { sendReaction } from "@/services/socket";

const REACTIONS = ["❤️", "😂", "😱", "👏"];

type FloatingEmoji = { id: number; emoji: string; anim: Animated.Value };

export default function ReactionsBar() {
  const [floaters, setFloaters] = useState<FloatingEmoji[]>([]);
  const idRef = useRef(0);

  const burst = (emoji: string) => {
    sendReaction(emoji);
    const anim = new Animated.Value(0);
    const id = idRef.current++;
    setFloaters((prev) => [...prev, { id, emoji, anim }]);

    Animated.timing(anim, {
      toValue: 1,
      duration: 1200,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start(() => {
      setFloaters((prev) => prev.filter((f) => f.id !== id));
    });
  };

  return (
    <View className="absolute bottom-24 right-4 items-center">
      {floaters.map(({ id, emoji, anim }) => (
        <Animated.Text
          key={id}
          style={{
            position: "absolute",
            bottom: 56,
            fontSize: 28,
            opacity: anim.interpolate({ inputRange: [0, 0.8, 1], outputRange: [1, 1, 0] }),
            transform: [
              { translateY: anim.interpolate({ inputRange: [0, 1], outputRange: [0, -120] }) },
              { translateX: anim.interpolate({ inputRange: [0, 1], outputRange: [0, (id % 2 === 0 ? 1 : -1) * 20] }) },
            ],
          }}
        >
          {emoji}
        </Animated.Text>
      ))}
      <View className="flex-row gap-2 rounded-full bg-black/60 px-3 py-2">
        {REACTIONS.map((emoji) => (
          <Pressable key={emoji} onPress={() => burst(emoji)} hitSlop={6}>
            <Text className="text-xl">{emoji}</Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}
