import { useEffect, useRef, useState } from "react";
import { Pressable, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MailCheck } from "lucide-react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { CompositeScreenProps } from "@react-navigation/native";
import Button from "@/components/ui/Button";
import { useThemeColors } from "@/hooks/useThemeColors";
import { ApiError } from "@/services/api";
import { requestOtp, verifyResetOtp } from "@/services/auth";
import type { AuthStackParamList, RootStackParamList } from "@/navigation/types";

type Props = CompositeScreenProps<
  NativeStackScreenProps<AuthStackParamList, "VerifyOtp">,
  NativeStackScreenProps<RootStackParamList>
>;

const CODE_LENGTH = 6;

export default function VerifyOtpScreen({ route, navigation }: Props) {
  const colors = useThemeColors();
  const { email } = route.params;
  const [digits, setDigits] = useState<string[]>(Array(CODE_LENGTH).fill(""));
  const [verifying, setVerifying] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [resendCooldown, setResendCooldown] = useState(0);
  const inputs = useRef<(TextInput | null)[]>([]);

  useEffect(() => {
    if (resendCooldown <= 0) return;
    const timer = setTimeout(() => setResendCooldown((s) => s - 1), 1000);
    return () => clearTimeout(timer);
  }, [resendCooldown]);

  const setDigit = (index: number, value: string) => {
    const clean = value.replace(/[^0-9]/g, "").slice(-1);
    const next = [...digits];
    next[index] = clean;
    setDigits(next);
    if (clean && index < CODE_LENGTH - 1) {
      inputs.current[index + 1]?.focus();
    }
  };

  const code = digits.join("");
  const complete = code.length === CODE_LENGTH;

  const onVerify = async () => {
    setVerifying(true);
    setFormError(null);
    try {
      const res = await verifyResetOtp(email, code);
      navigation.navigate("ResetPassword", { email, resetToken: res.resetToken });
    } catch (err) {
      setFormError(err instanceof ApiError ? err.message : "That code didn't work. Try again.");
    } finally {
      setVerifying(false);
    }
  };

  const onResend = async () => {
    if (resendCooldown > 0) return;
    setFormError(null);
    try {
      const res = await requestOtp(email, "reset");
      setResendCooldown(Math.min(30, res.expiresIn));
    } catch (err) {
      setFormError(err instanceof ApiError ? err.message : "Couldn't resend the code. Try again.");
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-background px-6" edges={["top", "bottom"]}>
      <View className="mt-16 items-center gap-3">
        <View className="h-14 w-14 items-center justify-center rounded-full bg-blue-500/15">
          <MailCheck size={26} color={colors.blue300} />
        </View>
      </View>

      <View className="mt-4 items-center gap-2">
        <Text className="text-2xl font-['Manrope_700Bold'] text-foreground">Check your email</Text>
        <Text className="text-center text-sm text-blue-100/70">
          Enter the 6-digit code we sent to {email || "your email"}.
        </Text>
      </View>

      <View className="mt-8 flex-row justify-between gap-2">
        {digits.map((digit, i) => (
          <TextInput
            key={i}
            ref={(el) => {
              inputs.current[i] = el;
            }}
            value={digit}
            onChangeText={(value) => setDigit(i, value)}
            keyboardType="number-pad"
            maxLength={1}
            className="h-14 w-12 rounded-xl border border-line/10 bg-navy-900 text-center text-xl font-['Manrope_600SemiBold'] text-foreground"
          />
        ))}
      </View>

      {formError && <Text className="mt-4 text-center text-xs text-red-300">{formError}</Text>}

      <View className="mt-8">
        <Button onPress={onVerify} disabled={!complete} loading={verifying}>
          Verify
        </Button>
      </View>

      <Pressable onPress={onResend} disabled={resendCooldown > 0} hitSlop={8}>
        <Text className={`mt-6 text-center text-sm ${resendCooldown > 0 ? "text-blue-100/40" : "text-blue-300"}`}>
          {resendCooldown > 0 ? `Resend code in ${resendCooldown}s` : "Resend code"}
        </Text>
      </Pressable>
    </SafeAreaView>
  );
}
