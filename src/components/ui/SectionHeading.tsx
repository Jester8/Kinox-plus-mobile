import { Text, View } from "react-native";
import Reveal from "./Reveal";

type SectionHeadingProps = {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  align?: "left" | "center";
  className?: string;
};

export default function SectionHeading({
  eyebrow,
  title,
  subtitle,
  align = "left",
  className,
}: SectionHeadingProps) {
  const alignClass = align === "center" ? "items-center" : "items-start";
  const textAlign = align === "center" ? "text-center" : "text-left";

  return (
    <Reveal className={`${alignClass} ${className ?? ""}`}>
      <View className={alignClass}>
        {eyebrow && (
          <Text className={`mb-2 text-xs font-['Manrope_600SemiBold'] uppercase tracking-widest text-blue-300 ${textAlign}`}>
            {eyebrow}
          </Text>
        )}
        <Text className={`text-3xl font-['Manrope_700Bold'] tracking-tight text-foreground ${textAlign}`}>
          {title}
        </Text>
        {subtitle && (
          <Text className={`mt-2 text-base text-blue-100/80 ${textAlign}`}>{subtitle}</Text>
        )}
      </View>
    </Reveal>
  );
}
