import { ReactNode } from "react";
import { Text, View } from "react-native";
import { LucideIcon } from "lucide-react-native";
import { useThemeColors } from "@/hooks/useThemeColors";
import Button from "./Button";

type EmptyStateProps = {
  icon: LucideIcon;
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  children?: ReactNode;
};

export default function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  onAction,
  children,
}: EmptyStateProps) {
  const colors = useThemeColors();
  return (
    <View className="flex-1 items-center justify-center gap-4 px-8 py-16">
      <View className="h-16 w-16 items-center justify-center rounded-full bg-navy-900">
        <Icon size={28} color={colors.blue300} />
      </View>
      <Text className="text-center text-lg font-['Manrope_600SemiBold'] text-foreground">{title}</Text>
      {description && (
        <Text className="text-center text-sm text-blue-100/70">{description}</Text>
      )}
      {actionLabel && onAction && (
        <Button onPress={onAction} size="sm" variant="secondary">
          {actionLabel}
        </Button>
      )}
      {children}
    </View>
  );
}
