import { useEffect, useRef, useState } from "react";
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MotiView } from "moti";
import {
  Calendar,
  Check,
  ChevronLeft,
  Eye,
  EyeOff,
  Lock,
  Mail,
  User,
  X,
} from "lucide-react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { CompositeScreenProps } from "@react-navigation/native";
import BrandMark from "@/components/ui/BrandMark";
import TextField from "@/components/ui/TextField";
import Button from "@/components/ui/Button";
import StepIndicator from "@/components/ui/StepIndicator";
import DateOfBirthPicker from "@/components/ui/DateOfBirthPicker";
import Avatar from "@/components/ui/Avatar";
import { useThemeColors } from "@/hooks/useThemeColors";
import { avatarPresets, genres } from "@/lib/mockData";
import { useSessionStore } from "@/stores/sessionStore";
import { ApiError } from "@/services/api";
import { checkUsernameAvailable, register, requestOtp, verifySignupOtp } from "@/services/auth";
import type { AuthStackParamList, RootStackParamList } from "@/navigation/types";

type Props = CompositeScreenProps<
  NativeStackScreenProps<AuthStackParamList, "SignUp">,
  NativeStackScreenProps<RootStackParamList>
>;

const STEP_LABELS = ["Personal details", "Movie categories", "Verify email", "Profile"];
const MIN_CATEGORIES = 3;
const OTP_LENGTH = 6;
type Availability = "idle" | "checking" | "available" | "taken";

function formatDate(date: Date) {
  return date.toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" });
}

export default function SignUpScreen({ navigation }: Props) {
  const colors = useThemeColors();
  const setTokens = useSessionStore((s) => s.setTokens);
  const setProfile = useSessionStore((s) => s.setProfile);

  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Step 1 — personal details
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [dob, setDob] = useState<Date | null>(null);
  const [dobModalOpen, setDobModalOpen] = useState(false);
  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const step1Valid = fullName.trim().length > 1 && emailValid && password.length >= 8 && dob !== null;

  // Step 2 — movie categories
  const [categories, setCategories] = useState<string[]>([]);
  const step2Valid = categories.length >= MIN_CATEGORIES;

  // Step 3 — verify email (OTP sent when step 2 is confirmed)
  const [digits, setDigits] = useState<string[]>(Array(OTP_LENGTH).fill(""));
  const [signupToken, setSignupToken] = useState<string | null>(null);
  const [resendCooldown, setResendCooldown] = useState(0);
  const otpInputs = useRef<(TextInput | null)[]>([]);
  const code = digits.join("");
  const step3Valid = code.length === OTP_LENGTH;

  useEffect(() => {
    if (resendCooldown <= 0) return;
    const timer = setTimeout(() => setResendCooldown((s) => s - 1), 1000);
    return () => clearTimeout(timer);
  }, [resendCooldown]);

  // Step 4 — profile
  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");
  const [avatarColor, setAvatarColor] = useState(avatarPresets[0]);
  const [availability, setAvailability] = useState<Availability>("idle");
  const step4Valid = availability === "available";

  useEffect(() => {
    if (username.length < 3) {
      setAvailability("idle");
      return;
    }
    setAvailability("checking");
    let cancelled = false;
    const timer = setTimeout(async () => {
      try {
        const { available } = await checkUsernameAvailable(username);
        if (!cancelled) setAvailability(available ? "available" : "taken");
      } catch {
        if (!cancelled) setAvailability("idle");
      }
    }, 500);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [username]);

  const toggleCategory = (genre: string) => {
    setCategories((prev) => (prev.includes(genre) ? prev.filter((g) => g !== genre) : [...prev, genre]));
  };

  const setDigit = (index: number, value: string) => {
    const clean = value.replace(/[^0-9]/g, "").slice(-1);
    const next = [...digits];
    next[index] = clean;
    setDigits(next);
    if (clean && index < OTP_LENGTH - 1) {
      otpInputs.current[index + 1]?.focus();
    }
  };

  const onBack = () => {
    setFormError(null);
    if (step === 1) {
      navigation.goBack();
    } else if (step === 3) {
      // Back to categories rather than silently re-sending a code.
      setDigits(Array(OTP_LENGTH).fill(""));
      setStep(2);
    } else {
      setStep((s) => s - 1);
    }
  };

  const sendOtp = async () => {
    setSubmitting(true);
    setFormError(null);
    try {
      const res = await requestOtp(email, "signup");
      setResendCooldown(Math.min(30, res.expiresIn));
      setStep(3);
    } catch (err) {
      setFormError(err instanceof ApiError ? err.message : "Couldn't send a verification code. Try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const onResend = async () => {
    if (resendCooldown > 0) return;
    setFormError(null);
    try {
      const res = await requestOtp(email, "signup");
      setResendCooldown(Math.min(30, res.expiresIn));
    } catch (err) {
      setFormError(err instanceof ApiError ? err.message : "Couldn't resend the code. Try again.");
    }
  };

  const verifyOtp = async () => {
    setSubmitting(true);
    setFormError(null);
    try {
      const res = await verifySignupOtp(email, code);
      setSignupToken(res.signupToken);
      setStep(4);
    } catch (err) {
      setFormError(err instanceof ApiError ? err.message : "That code didn't work. Try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const onFinish = async () => {
    if (!signupToken || !dob) return;
    setSubmitting(true);
    setFormError(null);
    try {
      const session = await register({
        fullName,
        email,
        password,
        dateOfBirth: dob.toISOString().slice(0, 10),
        preferredGenres: categories,
        signupToken,
        username,
        avatarColor,
        bio: bio || undefined,
      });
      await setTokens(session.accessToken, session.refreshToken);
      setProfile({
        id: session.user.id,
        role: session.user.role,
        username: session.user.username,
        displayName: session.user.displayName,
        email: session.user.email,
        emailVerified: session.user.emailVerified,
        avatarColor: session.user.avatarColor,
        dateOfBirth: dob.toISOString().slice(0, 10),
        bio,
        categories,
      });
      navigation.navigate("AccountSetup", { screen: "Welcome" });
    } catch (err) {
      setFormError(err instanceof ApiError ? err.message : "Couldn't create your account. Try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const canContinue = step === 1 ? step1Valid : step === 2 ? step2Valid : step === 3 ? step3Valid : step4Valid;
  const canGoBack = step > 1 || navigation.canGoBack();

  const onContinue = () => {
    setFormError(null);
    if (step === 2) sendOtp();
    else if (step === 3) verifyOtp();
    else if (step === 4) onFinish();
    else setStep((s) => s + 1);
  };

  return (
    <SafeAreaView className="flex-1 bg-background" edges={["top", "bottom"]}>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} className="flex-1">
        <View className="w-full max-w-[480px] flex-1 self-center">
          <View className="px-6 pt-2">
            {canGoBack ? (
              <Pressable onPress={onBack} hitSlop={8} className="h-9 w-9 items-center justify-center">
                <ChevronLeft size={22} color={colors.blue300} />
              </Pressable>
            ) : (
              <View className="h-9 w-9" />
            )}
          </View>

          <View className="items-center px-6 pb-1">
            <BrandMark size={44} showWordmark />
          </View>

          <View className="px-6 pt-3">
            <StepIndicator step={step} total={4} labels={STEP_LABELS} />
          </View>

          <ScrollView contentContainerClassName="flex-grow gap-6 px-6 py-6" keyboardShouldPersistTaps="handled">
        <MotiView
          key={step}
          from={{ opacity: 0, translateX: 16 }}
          animate={{ opacity: 1, translateX: 0 }}
          transition={{ type: "timing", duration: 260 }}
        >
        {step === 1 && (
          <View className="gap-4">
            <View>
              <Text className="text-2xl font-['Manrope_700Bold'] text-foreground">Let's get started</Text>
              <Text className="mt-1 text-sm text-blue-100/70">Tell us a bit about yourself.</Text>
            </View>

            <TextField
              label="Full name"
              icon={User}
              autoCapitalize="words"
              value={fullName}
              onChangeText={setFullName}
              placeholder="Ada Lovelace"
            />
            <TextField
              label="Email"
              icon={Mail}
              autoCapitalize="none"
              keyboardType="email-address"
              value={email}
              onChangeText={setEmail}
              placeholder="you@example.com"
            />
            <TextField
              label="Password"
              icon={Lock}
              secureTextEntry={!showPassword}
              value={password}
              onChangeText={setPassword}
              placeholder="At least 8 characters"
              rightAccessory={
                <Pressable onPress={() => setShowPassword((v) => !v)} hitSlop={8}>
                  {showPassword ? <EyeOff size={18} color={colors.blue300} /> : <Eye size={18} color={colors.blue300} />}
                </Pressable>
              }
            />

            <View className="gap-1.5">
              <Text className="text-sm font-['Manrope_500Medium'] text-blue-100/80">Date of birth</Text>
              <Pressable
                onPress={() => setDobModalOpen(true)}
                className="min-h-[44px] flex-row items-center gap-2.5 rounded-xl border border-line/10 bg-navy-900 px-4 py-3"
              >
                <Calendar size={18} color={colors.blue300} />
                <Text className={dob ? "text-base text-foreground" : "text-base text-foreground/35"}>
                  {dob ? formatDate(dob) : "Select your date of birth"}
                </Text>
              </Pressable>
            </View>
          </View>
        )}

        {step === 2 && (
          <View className="gap-4">
            <View>
              <Text className="text-2xl font-['Manrope_700Bold'] text-foreground">Choose your categories</Text>
              <Text className="mt-1 text-sm text-blue-100/70">
                Pick at least {MIN_CATEGORIES} genres to personalize your home feed.
              </Text>
            </View>

            <View className="flex-row flex-wrap gap-3">
              {genres.map((genre) => {
                const active = categories.includes(genre);
                return (
                  <Pressable
                    key={genre}
                    onPress={() => toggleCategory(genre)}
                    className={`flex-row items-center gap-1.5 rounded-full border px-4 py-2.5 ${
                      active ? "border-blue-400 bg-blue-500/20" : "border-line/10 bg-navy-900"
                    }`}
                  >
                    {active && <Check size={14} color={colors.blue200} />}
                    <Text className={`text-sm font-['Manrope_500Medium'] ${active ? "text-blue-100" : "text-foreground/70"}`}>
                      {genre}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
            <Text className="text-center text-xs text-blue-100/50">
              {categories.length}/{MIN_CATEGORIES} selected
            </Text>
          </View>
        )}

        {step === 3 && (
          <View className="gap-4">
            <View>
              <Text className="text-2xl font-['Manrope_700Bold'] text-foreground">Check your email</Text>
              <Text className="mt-1 text-sm text-blue-100/70">
                Enter the 6-digit code we sent to {email}.
              </Text>
            </View>

            <View className="mt-2 flex-row gap-2">
              {digits.map((digit, i) => (
                <TextInput
                  key={i}
                  ref={(el) => {
                    otpInputs.current[i] = el;
                  }}
                  value={digit}
                  onChangeText={(value) => setDigit(i, value)}
                  keyboardType="number-pad"
                  maxLength={1}
                  className="h-14 flex-1 rounded-xl border border-line/10 bg-navy-900 text-center text-xl font-['Manrope_600SemiBold'] text-foreground"
                />
              ))}
            </View>

            <Pressable onPress={onResend} disabled={resendCooldown > 0} hitSlop={8}>
              <Text className={`text-center text-sm ${resendCooldown > 0 ? "text-blue-100/40" : "text-blue-300"}`}>
                {resendCooldown > 0 ? `Resend code in ${resendCooldown}s` : "Resend code"}
              </Text>
            </Pressable>
          </View>
        )}

        {step === 4 && (
          <View className="gap-4">
            <View>
              <Text className="text-2xl font-['Manrope_700Bold'] text-foreground">Create your profile</Text>
              <Text className="mt-1 text-sm text-blue-100/70">This is how friends will see you in rooms.</Text>
            </View>

            <View className="items-center gap-3">
              <Avatar name={fullName || "K"} size={80} />
              <View className="flex-row gap-2">
                {avatarPresets.map((color) => (
                  <Pressable
                    key={color}
                    onPress={() => setAvatarColor(color)}
                    className="h-9 w-9 items-center justify-center rounded-full"
                    style={{
                      backgroundColor: color,
                      borderWidth: avatarColor === color ? 2 : 0,
                      borderColor: "#fff",
                    }}
                  />
                ))}
              </View>
            </View>

            <View>
              <TextField
                label="Username"
                icon={User}
                autoCapitalize="none"
                value={username}
                onChangeText={setUsername}
                placeholder="e.g. priyan"
              />
              {availability !== "idle" && (
                <View className="mt-1.5 flex-row items-center gap-1.5">
                  {availability === "checking" && (
                    <Text className="text-xs text-blue-100/50">Checking availability…</Text>
                  )}
                  {availability === "available" && (
                    <>
                      <Check size={12} color={colors.blue300} />
                      <Text className="text-xs text-blue-300">Available</Text>
                    </>
                  )}
                  {availability === "taken" && (
                    <>
                      <X size={12} color="#f87171" />
                      <Text className="text-xs text-red-300">Already taken</Text>
                    </>
                  )}
                </View>
              )}
            </View>
            <TextField
              label="Bio (optional)"
              value={bio}
              onChangeText={setBio}
              multiline
              numberOfLines={3}
              style={{ minHeight: 60, textAlignVertical: "top" }}
            />
          </View>
        )}
        </MotiView>
      </ScrollView>

      <View className="gap-3 px-6 pb-8 pt-2">
        {formError && <Text className="text-center text-xs text-red-300">{formError}</Text>}
        <Button onPress={onContinue} disabled={!canContinue} loading={submitting} icon>
          {step === 3 ? "Verify" : step < 4 ? "Continue" : "Create Account"}
        </Button>
        {step === 1 && (
          <View className="flex-row justify-center gap-1">
            <Text className="text-sm text-blue-100/70">Already have an account?</Text>
            <Text onPress={() => navigation.navigate("Login")} className="text-sm font-['Manrope_600SemiBold'] text-blue-300">
              Log In
            </Text>
          </View>
        )}
          </View>
        </View>
      </KeyboardAvoidingView>

      <DateOfBirthPicker
        visible={dobModalOpen}
        value={dob}
        onClose={() => setDobModalOpen(false)}
        onConfirm={(date) => {
          setDob(date);
          setDobModalOpen(false);
        }}
      />
    </SafeAreaView>
  );
}
