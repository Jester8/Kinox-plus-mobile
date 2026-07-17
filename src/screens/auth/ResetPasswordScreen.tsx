import { useState } from "react";
import { Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Eye, EyeOff, Lock } from "lucide-react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import TextField from "@/components/ui/TextField";
import Button from "@/components/ui/Button";
import { useThemeColors } from "@/hooks/useThemeColors";
import { ApiError } from "@/services/api";
import { resetPassword } from "@/services/auth";
import type { AuthStackParamList } from "@/navigation/types";

type Props = NativeStackScreenProps<AuthStackParamList, "ResetPassword">;

export default function ResetPasswordScreen({ route, navigation }: Props) {
  const colors = useThemeColors();
  const { email, resetToken } = route.params;
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const mismatch = confirm.length > 0 && password !== confirm;
  const valid = password.length >= 8 && password === confirm;

  const onSubmit = async () => {
    setSaving(true);
    setFormError(null);
    try {
      await resetPassword({ identifier: email, resetToken, newPassword: password });
      navigation.navigate("Login");
    } catch (err) {
      setFormError(err instanceof ApiError ? err.message : "Couldn't reset your password. Try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-background px-6" edges={["top", "bottom"]}>
      <View className="mt-16 gap-2">
        <Text className="text-2xl font-['Manrope_700Bold'] text-foreground">Set a new password</Text>
        <Text className="text-sm text-blue-100/70">Make it at least 8 characters.</Text>
      </View>

      <View className="mt-8 gap-4">
        <TextField
          label="New password"
          icon={Lock}
          secureTextEntry={!showPassword}
          value={password}
          onChangeText={setPassword}
          rightAccessory={
            <Pressable onPress={() => setShowPassword((v) => !v)} hitSlop={8}>
              {showPassword ? <EyeOff size={18} color={colors.blue300} /> : <Eye size={18} color={colors.blue300} />}
            </Pressable>
          }
        />
        <TextField
          label="Confirm password"
          icon={Lock}
          secureTextEntry={!showPassword}
          value={confirm}
          onChangeText={setConfirm}
          error={mismatch ? "Passwords don't match" : undefined}
        />
        {formError && <Text className="text-center text-xs text-red-300">{formError}</Text>}
        <Button onPress={onSubmit} disabled={!valid} loading={saving}>
          Reset Password
        </Button>
      </View>
    </SafeAreaView>
  );
}
