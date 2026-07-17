import { ReactNode } from "react";
import { View, Pressable } from "react-native";

type CardProps = {
  children: ReactNode;
  onPress?: () => void;
  className?: string;
};

// RN counterpart to the web's GlowCard — navy-950 surface, subtle border,
// glow appears on press instead of hover since touch has no hover state.
export default function Card({ children, onPress, className }: CardProps) {
  const classes = `rounded-2xl border border-line/10 bg-navy-950 p-6 ${className ?? ""}`;

  if (onPress) {
    return (
      <Pressable onPress={onPress} className={classes}>
        {children}
      </Pressable>
    );
  }

  return <View className={classes}>{children}</View>;
}
