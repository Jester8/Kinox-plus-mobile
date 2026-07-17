import { createNativeStackNavigator } from "@react-navigation/native-stack";
import SignUpScreen from "@/screens/auth/SignUpScreen";
import LoginScreen from "@/screens/auth/LoginScreen";
import ForgotPasswordScreen from "@/screens/auth/ForgotPasswordScreen";
import VerifyOtpScreen from "@/screens/auth/VerifyOtpScreen";
import ResetPasswordScreen from "@/screens/auth/ResetPasswordScreen";
import type { AuthStackParamList } from "./types";

const Stack = createNativeStackNavigator<AuthStackParamList>();

export default function AuthNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="SignUp" component={SignUpScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
      <Stack.Screen name="VerifyOtp" component={VerifyOtpScreen} />
      <Stack.Screen name="ResetPassword" component={ResetPasswordScreen} />
    </Stack.Navigator>
  );
}
