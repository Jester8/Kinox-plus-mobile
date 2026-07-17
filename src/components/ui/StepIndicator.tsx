import { Text, View } from "react-native";
import { useThemeColors } from "@/hooks/useThemeColors";

type StepIndicatorProps = {
  step: number;
  total: number;
  labels: string[];
};

export default function StepIndicator({ step, total, labels }: StepIndicatorProps) {
  const colors = useThemeColors();
  return (
    <View className="gap-2">
      <View className="flex-row gap-1.5">
        {Array.from({ length: total }).map((_, i) => (
          <View
            key={i}
            className="h-1 flex-1 rounded-full"
            style={{ backgroundColor: i < step ? colors.blue400 : colors.line + "1f" }}
          />
        ))}
      </View>
      <Text className="text-xs font-['Manrope_500Medium'] text-blue-100/60">
        Step {step} of {total} · {labels[step - 1]}
      </Text>
    </View>
  );
}
