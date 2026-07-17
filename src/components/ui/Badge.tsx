import { ReactNode } from "react";
import { Text, View } from "react-native";

type BadgeProps = {
  children: ReactNode;
  tone?: "blue" | "neutral" | "live";
};

const toneClasses: Record<NonNullable<BadgeProps["tone"]>, string> = {
  blue: "bg-blue-500/15 border-blue-400/40 text-blue-200",
  neutral: "bg-elevated/10 border-line/15 text-foreground/70",
  live: "bg-red-500/15 border-red-400/40 text-red-300",
};

export default function Badge({ children, tone = "blue" }: BadgeProps) {
  const classes = toneClasses[tone];
  const [bg, border, text] = classes.split(" ");

  return (
    <View className={`self-start rounded-full border px-3 py-1 ${bg} ${border}`}>
      <Text className={`text-xs font-['Manrope_600SemiBold'] ${text}`}>{children}</Text>
    </View>
  );
}
