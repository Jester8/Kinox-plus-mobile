import { createNativeStackNavigator } from "@react-navigation/native-stack";
import WelcomeScreen from "@/screens/accountSetup/WelcomeScreen";
import PermissionsPrimingScreen from "@/screens/accountSetup/PermissionsPrimingScreen";
import OnboardingCompleteScreen from "@/screens/accountSetup/OnboardingCompleteScreen";
import type { AccountSetupStackParamList } from "./types";

const Stack = createNativeStackNavigator<AccountSetupStackParamList>();

export default function AccountSetupNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Welcome" component={WelcomeScreen} />
      <Stack.Screen name="PermissionsPriming" component={PermissionsPrimingScreen} />
      <Stack.Screen name="OnboardingComplete" component={OnboardingCompleteScreen} />
    </Stack.Navigator>
  );
}
