import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Bell, Compass, Home, User, Video } from "lucide-react-native";
import { useThemeColors } from "@/hooks/useThemeColors";

import HomeScreen from "@/screens/home/HomeScreen";
import SearchScreen from "@/screens/discover/SearchScreen";
import CategoryBrowseScreen from "@/screens/discover/CategoryBrowseScreen";
import SearchResultsScreen from "@/screens/discover/SearchResultsScreen";
import CreateRoomScreen from "@/screens/rooms/CreateRoomScreen";
import InviteSheetScreen from "@/screens/rooms/InviteSheetScreen";
import RoomLobbyScreen from "@/screens/rooms/RoomLobbyScreen";
import NotificationsScreen from "@/screens/notifications/NotificationsScreen";
import ProfileScreen from "@/screens/profile/ProfileScreen";
import EditProfileScreen from "@/screens/profile/EditProfileScreen";
import WatchlistScreen from "@/screens/profile/WatchlistScreen";
import WatchHistoryScreen from "@/screens/profile/WatchHistoryScreen";
import FriendsScreen from "@/screens/profile/FriendsScreen";
import SettingsScreen from "@/screens/settings/SettingsScreen";
import NotificationPreferencesScreen from "@/screens/settings/NotificationPreferencesScreen";
import SubscriptionScreen from "@/screens/settings/SubscriptionScreen";
import HelpSupportScreen from "@/screens/settings/HelpSupportScreen";
import PrivacyTermsScreen from "@/screens/settings/PrivacyTermsScreen";

import type {
  HomeStackParamList,
  DiscoverStackParamList,
  RoomsStackParamList,
  NotificationsStackParamList,
  ProfileStackParamList,
  AppTabsParamList,
} from "./types";

const HomeStack = createNativeStackNavigator<HomeStackParamList>();
function HomeStackNavigator() {
  return (
    <HomeStack.Navigator screenOptions={{ headerShown: false }}>
      <HomeStack.Screen name="Home" component={HomeScreen} />
    </HomeStack.Navigator>
  );
}

const DiscoverStack = createNativeStackNavigator<DiscoverStackParamList>();
function DiscoverStackNavigator() {
  return (
    <DiscoverStack.Navigator screenOptions={{ headerShown: false }}>
      <DiscoverStack.Screen name="Search" component={SearchScreen} />
      <DiscoverStack.Screen name="CategoryBrowse" component={CategoryBrowseScreen} />
      <DiscoverStack.Screen name="SearchResults" component={SearchResultsScreen} />
    </DiscoverStack.Navigator>
  );
}

const RoomsStack = createNativeStackNavigator<RoomsStackParamList>();
function RoomsStackNavigator() {
  return (
    <RoomsStack.Navigator screenOptions={{ headerShown: false }}>
      <RoomsStack.Screen name="CreateRoom" component={CreateRoomScreen} />
      <RoomsStack.Screen name="InviteSheet" component={InviteSheetScreen} options={{ presentation: "modal" }} />
      <RoomsStack.Screen name="RoomLobby" component={RoomLobbyScreen} />
    </RoomsStack.Navigator>
  );
}

const NotificationsStack = createNativeStackNavigator<NotificationsStackParamList>();
function NotificationsStackNavigator() {
  return (
    <NotificationsStack.Navigator screenOptions={{ headerShown: false }}>
      <NotificationsStack.Screen name="Notifications" component={NotificationsScreen} />
    </NotificationsStack.Navigator>
  );
}

const ProfileStack = createNativeStackNavigator<ProfileStackParamList>();
function ProfileStackNavigator() {
  return (
    <ProfileStack.Navigator screenOptions={{ headerShown: false }}>
      <ProfileStack.Screen name="Profile" component={ProfileScreen} />
      <ProfileStack.Screen name="EditProfile" component={EditProfileScreen} />
      <ProfileStack.Screen name="Watchlist" component={WatchlistScreen} />
      <ProfileStack.Screen name="WatchHistory" component={WatchHistoryScreen} />
      <ProfileStack.Screen name="Friends" component={FriendsScreen} />
      <ProfileStack.Screen name="Settings" component={SettingsScreen} />
      <ProfileStack.Screen name="NotificationPreferences" component={NotificationPreferencesScreen} />
      <ProfileStack.Screen name="Subscription" component={SubscriptionScreen} />
      <ProfileStack.Screen name="HelpSupport" component={HelpSupportScreen} />
      <ProfileStack.Screen name="PrivacyTerms" component={PrivacyTermsScreen} />
    </ProfileStack.Navigator>
  );
}

const Tab = createBottomTabNavigator<AppTabsParamList>();

export default function AppTabs() {
  const colors = useThemeColors();
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.blue400,
        tabBarInactiveTintColor: colors.blue100 + "66",
        tabBarStyle: {
          backgroundColor: colors.navy950,
          borderTopColor: colors.line + "14",
        },
      }}
    >
      <Tab.Screen
        name="HomeTab"
        component={HomeStackNavigator}
        options={{ title: "Home", tabBarIcon: ({ color, size }) => <Home color={color} size={size} /> }}
      />
      <Tab.Screen
        name="DiscoverTab"
        component={DiscoverStackNavigator}
        options={{ title: "Discover", tabBarIcon: ({ color, size }) => <Compass color={color} size={size} /> }}
      />
      <Tab.Screen
        name="RoomsTab"
        component={RoomsStackNavigator}
        options={{ title: "Rooms", tabBarIcon: ({ color, size }) => <Video color={color} size={size} /> }}
      />
      <Tab.Screen
        name="NotificationsTab"
        component={NotificationsStackNavigator}
        options={{ title: "Alerts", tabBarIcon: ({ color, size }) => <Bell color={color} size={size} /> }}
      />
      <Tab.Screen
        name="ProfileTab"
        component={ProfileStackNavigator}
        options={{ title: "Profile", tabBarIcon: ({ color, size }) => <User color={color} size={size} /> }}
      />
    </Tab.Navigator>
  );
}
