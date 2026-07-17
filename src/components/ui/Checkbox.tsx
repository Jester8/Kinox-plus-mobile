import { Pressable, Text, View } from "react-native";
import { Check } from "lucide-react-native";

type CheckboxProps = {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
};

export default function Checkbox({ checked, onChange, label }: CheckboxProps) {
  return (
    <Pressable
      onPress={() => onChange(!checked)}
      className="flex-row items-center gap-2 py-1"
      hitSlop={6}
      accessibilityRole="checkbox"
      accessibilityState={{ checked }}
    >
      <View
        className={`h-5 w-5 items-center justify-center rounded-md border ${
          checked ? "border-blue-500 bg-blue-600" : "border-line/25 bg-transparent"
        }`}
      >
        {checked && <Check size={13} color="#fff" strokeWidth={3} />}
      </View>
      {label && <Text className="text-sm text-blue-100/80">{label}</Text>}
    </Pressable>
  );
}
