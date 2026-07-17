import { useState } from "react";
import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ChevronLeft, Mail } from "lucide-react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import TextField from "@/components/ui/TextField";
import Button from "@/components/ui/Button";
import { useThemeColors } from "@/hooks/useThemeColors";
import { ApiError } from "@/services/api";
import { requestOtp } from "@/services/auth";
import type { AuthStackParamList } from "@/navigation/types";

type Props = NativeStackScreenProps<AuthStackParamList, "ForgotPassword">;

export default function ForgotPasswordScreen({ navigation }: Props) {
  const colors = useThemeColors();
  const [email, setEmail] = useState("");
  const [sending, setSending] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const onSubmit = async () => {
    setSending(true);
    setFormError(null);
    try {
      await requestOtp(email, "reset");
      navigation.navigate("VerifyOtp", { email });
    } catch (err) {
      setFormError(err instanceof ApiError ? err.message : "Couldn't send a code. Try again.");
    } finally {
      setSending(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-background px-6" edges={["top", "bottom"]}>
      <Text onPress={() => navigation.goBack()} className="mt-2 flex-row items-center py-3">
        <ChevronLeft size={22} color={colors.blue300} />
      </Text>

      <View className="mt-6 gap-2">
        <Text className="text-2xl font-['Manrope_700Bold'] text-foreground">Reset your password</Text>
        <Text className="text-sm text-blue-100/70">
          Enter the email on your account and we'll send a verification code.
        </Text>
      </View>

      <View className="mt-8 gap-4">
        <TextField
          label="Email"
          icon={Mail}
          autoCapitalize="none"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
          placeholder="you@example.com"
        />
        {formError && <Text className="text-center text-xs text-red-300">{formError}</Text>}
        <Button onPress={onSubmit} loading={sending} disabled={!email}>
          Send Code
        </Button>
      </View>
    </SafeAreaView>
  );
}
