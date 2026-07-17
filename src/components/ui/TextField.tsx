import { forwardRef, ReactNode } from "react";
import { Text, TextInput, TextInputProps, View } from "react-native";
import type { LucideIcon } from "lucide-react-native";
import { useThemeColors } from "@/hooks/useThemeColors";

type TextFieldProps = TextInputProps & {
  label?: string;
  error?: string;
  icon?: LucideIcon;
  rightAccessory?: ReactNode;
};

const TextField = forwardRef<TextInput, TextFieldProps>(
  ({ label, error, icon: Icon, rightAccessory, className, style, ...props }, ref) => {
    const colors = useThemeColors();
    return (
      <View className="gap-1.5">
        {label && <Text className="text-sm font-['Manrope_500Medium'] text-blue-100/80">{label}</Text>}
        <View
          className={`min-h-[44px] flex-row items-center gap-2.5 rounded-xl border border-line/10 bg-navy-900 px-4 ${error ? "border-red-400/60" : ""}`}
        >
          {Icon && <Icon size={18} color={colors.blue300} />}
          <TextInput
            ref={ref}
            placeholderTextColor="rgba(226,233,251,0.35)"
            className={`flex-1 py-3 text-base text-foreground ${className ?? ""}`}
            style={style}
            selectionColor={colors.blue400}
            {...props}
          />
          {rightAccessory}
        </View>
        {error && <Text className="text-xs text-red-300">{error}</Text>}
      </View>
    );
  }
);

TextField.displayName = "TextField";
export default TextField;
