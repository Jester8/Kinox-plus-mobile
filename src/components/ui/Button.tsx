import { Children, ReactNode } from "react";
import { Pressable, Text, View, ActivityIndicator } from "react-native";
import { ArrowRight } from "lucide-react-native";
import { useThemeColors } from "@/hooks/useThemeColors";

type ButtonProps = {
  children: ReactNode;
  onPress?: () => void;
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "lg";
  icon?: boolean;
  loading?: boolean;
  disabled?: boolean;
  className?: string;
};

export default function Button({
  children,
  onPress,
  variant = "primary",
  size = "sm",
  icon = false,
  loading = false,
  disabled = false,
  className,
}: ButtonProps) {
  const colors = useThemeColors();
  const sizeClasses = size === "lg" ? "px-5 py-2.5" : "px-3.5 py-1.5";
  const textSize = size === "lg" ? "text-sm" : "text-xs";

  const variantClasses =
    variant === "primary"
      ? "bg-blue-600 active:bg-blue-700"
      : variant === "secondary"
        ? "border border-blue-500/40 bg-blue-500/10 active:bg-blue-500/20"
        : "bg-transparent";

  const textClasses =
    variant === "primary"
      ? "text-white"
      : variant === "secondary"
        ? "text-blue-200"
        : "text-blue-300";

  // Callers often pass an icon element alongside a text label as sibling
  // children (e.g. `<Play /> Watch Now`). Only string/number children get
  // wrapped in <Text> so icons stay flex siblings instead of being nested
  // inside the text node, which is what threw off vertical alignment.
  const content = Children.map(children, (child) =>
    typeof child === "string" || typeof child === "number" ? (
      <Text className={`font-['Manrope_600SemiBold'] ${textSize} ${textClasses}`}>{child}</Text>
    ) : (
      child
    )
  );

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      accessibilityRole="button"
      hitSlop={8}
      className={`min-h-[44px] flex-row items-center justify-center gap-2 rounded-full active:scale-[0.97] ${sizeClasses} ${variantClasses} ${disabled ? "opacity-40" : ""} ${className ?? ""}`}
    >
      {loading ? (
        <ActivityIndicator color={variant === "primary" ? "#fff" : colors.blue300} />
      ) : (
        <View className="flex-row items-center gap-1.5">
          {content}
          {icon && (
            <ArrowRight
              size={16}
              color={variant === "primary" ? "#fff" : colors.blue300}
            />
          )}
        </View>
      )}
    </Pressable>
  );
}
