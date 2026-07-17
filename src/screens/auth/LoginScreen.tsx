import { useState } from "react";
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, Text, View } from "react-native";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { SafeAreaView } from "react-native-safe-area-context";
import { ChevronLeft, Eye, EyeOff, Lock, Mail } from "lucide-react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { CompositeScreenProps } from "@react-navigation/native";
import BrandMark from "@/components/ui/BrandMark";
import TextField from "@/components/ui/TextField";
import Button from "@/components/ui/Button";
import Checkbox from "@/components/ui/Checkbox";
import { useThemeColors } from "@/hooks/useThemeColors";
import { mapUserToProfile, useSessionStore } from "@/stores/sessionStore";
import { ApiError } from "@/services/api";
import { login } from "@/services/auth";
import { getMe } from "@/services/users";
import type { AuthStackParamList, RootStackParamList } from "@/navigation/types";

type Props = CompositeScreenProps<
  NativeStackScreenProps<AuthStackParamList, "Login">,
  NativeStackScreenProps<RootStackParamList>
>;

const schema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(1, "Password is required"),
});

type FormValues = z.infer<typeof schema>;

export default function LoginScreen({ navigation }: Props) {
  const colors = useThemeColors();
  const setTokens = useSessionStore((s) => s.setTokens);
  const setProfile = useSessionStore((s) => s.setProfile);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [formError, setFormError] = useState<string | null>(null);
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema), defaultValues: { email: "", password: "" } });

  const onSubmit = async (values: FormValues) => {
    setFormError(null);
    try {
      const session = await login(values.email, values.password);
      await setTokens(session.accessToken, session.refreshToken);
      // login() only returns the thin AuthUserDto — fetch the full profile
      // (bio, preferredGenres, dateOfBirth) so Home personalizes right away.
      const user = await getMe().catch(() => null);
      setProfile(
        user
          ? mapUserToProfile(user)
          : {
              id: session.user.id,
              role: session.user.role,
              username: session.user.username,
              displayName: session.user.displayName,
              email: session.user.email,
              emailVerified: session.user.emailVerified,
              avatarColor: session.user.avatarColor,
            }
      );
      navigation.navigate("Main", { screen: "HomeTab", params: { screen: "Home" } });
    } catch (err) {
      setFormError(err instanceof ApiError ? err.message : "Couldn't log in. Check your connection and try again.");
    }
  };

  const canGoBack = navigation.canGoBack();

  return (
    <SafeAreaView className="flex-1 bg-background" edges={["top", "bottom"]}>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} className="flex-1">
        <ScrollView
          contentContainerClassName="flex-grow items-center px-6 py-6"
          keyboardShouldPersistTaps="handled"
        >
          <View className="w-full max-w-[480px] gap-8">
            {canGoBack ? (
              <Pressable onPress={() => navigation.goBack()} hitSlop={8} className="h-9 w-9 items-center justify-center">
                <ChevronLeft size={22} color={colors.blue300} />
              </Pressable>
            ) : (
              <View className="h-9 w-9" />
            )}

            <View className="items-center gap-6">
              <BrandMark size={52} showWordmark />
              <View className="w-full">
                <Text className="text-2xl font-['Manrope_700Bold'] text-foreground">Welcome back</Text>
                <Text className="mt-1 text-sm text-blue-100/70">Log in to rejoin your rooms.</Text>
              </View>
            </View>

            <View className="gap-4">
              <Controller
                control={control}
                name="email"
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextField
                    label="Email"
                    icon={Mail}
                    autoCapitalize="none"
                    keyboardType="email-address"
                    placeholder="you@example.com"
                    onChangeText={onChange}
                    onBlur={onBlur}
                    value={value}
                    error={errors.email?.message}
                  />
                )}
              />
              <Controller
                control={control}
                name="password"
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextField
                    label="Password"
                    icon={Lock}
                    secureTextEntry={!showPassword}
                    placeholder="Enter your password"
                    onChangeText={onChange}
                    onBlur={onBlur}
                    value={value}
                    error={errors.password?.message}
                    rightAccessory={
                      <Pressable onPress={() => setShowPassword((v) => !v)} hitSlop={8}>
                        {showPassword ? <EyeOff size={18} color={colors.blue300} /> : <Eye size={18} color={colors.blue300} />}
                      </Pressable>
                    }
                  />
                )}
              />

              <View className="flex-row items-center justify-between">
                <Checkbox checked={rememberMe} onChange={setRememberMe} label="Remember me" />
                <Text onPress={() => navigation.navigate("ForgotPassword")} className="text-sm font-['Manrope_500Medium'] text-blue-300">
                  Forgot password?
                </Text>
              </View>

              {formError && <Text className="text-center text-xs text-red-300">{formError}</Text>}
              <Button onPress={handleSubmit(onSubmit)} loading={isSubmitting}>
                Log In
              </Button>
            </View>

            <View className="flex-row justify-center gap-1">
              <Text className="text-sm text-blue-100/70">New here?</Text>
              <Text onPress={() => navigation.navigate("SignUp")} className="text-sm font-['Manrope_600SemiBold'] text-blue-300">
                Sign Up
              </Text>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
