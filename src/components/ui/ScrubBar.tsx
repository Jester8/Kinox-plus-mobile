import { useRef, useState } from "react";
import { GestureResponderEvent, PanResponder, View } from "react-native";
import { darkColors as colors } from "@/theme/colors";

type ScrubBarProps = {
  value: number;
  max: number;
  disabled?: boolean;
  onChangeComplete: (value: number) => void;
};

// Lightweight scrub bar built on core RN touch handling — avoids pulling in
// a third-party native slider module just for a progress track + thumb.
export default function ScrubBar({ value, max, disabled, onChangeComplete }: ScrubBarProps) {
  const [width, setWidth] = useState(0);
  const [dragRatio, setDragRatio] = useState<number | null>(null);
  const widthRef = useRef(0);

  const ratioToValue = (ratio: number) => Math.min(max, Math.max(0, ratio * max));

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => !disabled,
      onMoveShouldSetPanResponder: () => !disabled,
      onPanResponderMove: (e: GestureResponderEvent) => {
        if (widthRef.current === 0) return;
        const ratio = e.nativeEvent.locationX / widthRef.current;
        setDragRatio(Math.min(1, Math.max(0, ratio)));
      },
      onPanResponderRelease: (e: GestureResponderEvent) => {
        if (widthRef.current === 0) return;
        const ratio = Math.min(1, Math.max(0, e.nativeEvent.locationX / widthRef.current));
        setDragRatio(null);
        onChangeComplete(ratioToValue(ratio));
      },
    })
  ).current;

  const activeRatio = dragRatio ?? (max > 0 ? value / max : 0);

  return (
    <View
      className="flex-1 justify-center py-3"
      onLayout={(e) => {
        widthRef.current = e.nativeEvent.layout.width;
        setWidth(e.nativeEvent.layout.width);
      }}
      {...(disabled ? {} : panResponder.panHandlers)}
    >
      <View className="h-1 rounded-full bg-white/20">
        <View
          className="h-1 rounded-full"
          style={{ width: `${activeRatio * 100}%`, backgroundColor: colors.blue400 }}
        />
      </View>
      {!disabled && width > 0 && (
        <View
          className="absolute h-3 w-3 rounded-full bg-white"
          style={{ left: Math.max(0, activeRatio * width - 6) }}
        />
      )}
    </View>
  );
}
