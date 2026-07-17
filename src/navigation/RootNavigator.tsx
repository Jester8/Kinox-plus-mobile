import { createNativeStackNavigator } from "@react-navigation/native-stack";

import SplashScreen from "@/screens/splash/SplashScreen";
import IntroScreen from "@/screens/intro/IntroScreen";
import OnboardingCarouselScreen from "@/screens/onboarding/OnboardingCarouselScreen";
import AuthNavigator from "./AuthNavigator";
import AccountSetupNavigator from "./AccountSetupNavigator";
import AppTabs from "./AppTabs";
import TitleDetailsScreen from "@/screens/titleDetails/TitleDetailsScreen";
import PlayerScreen from "@/screens/rooms/PlayerScreen";
import RoomRecapScreen from "@/screens/rooms/RoomRecapScreen";
import JoinRoomScreen from "@/screens/rooms/JoinRoomScreen";
import ForceUpdateScreen from "@/screens/system/ForceUpdateScreen";
import PaywallScreen from "@/screens/system/PaywallScreen";

import type { RootStackParamList } from "./types";

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootNavigator() {
  return (
    <Stack.Navigator initialRouteName="Splash" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Splash" component={SplashScreen} />
      <Stack.Screen name="Intro" component={IntroScreen} />
      <Stack.Screen name="OnboardingCarousel" component={OnboardingCarouselScreen} />
      <Stack.Screen name="Auth" component={AuthNavigator} />
      <Stack.Screen name="AccountSetup" component={AccountSetupNavigator} />
      <Stack.Screen name="Main" component={AppTabs} />
      <Stack.Screen name="TitleDetails" component={TitleDetailsScreen} />
      <Stack.Screen name="JoinRoom" component={JoinRoomScreen} />
      <Stack.Screen
        name="Player"
        component={PlayerScreen}
        options={{ presentation: "fullScreenModal", animation: "slide_from_bottom" }}
      />
      <Stack.Screen name="RoomRecap" component={RoomRecapScreen} />
      <Stack.Screen name="ForceUpdate" component={ForceUpdateScreen} />
      <Stack.Screen name="Paywall" component={PaywallScreen} options={{ presentation: "modal" }} />
    </Stack.Navigator>
  );
}
