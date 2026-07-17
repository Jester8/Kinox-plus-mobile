import type { NavigatorScreenParams } from "@react-navigation/native";

export type AuthStackParamList = {
  SignUp: undefined;
  Login: undefined;
  ForgotPassword: undefined;
  VerifyOtp: { email: string };
  ResetPassword: { email: string; resetToken: string };
};

export type AccountSetupStackParamList = {
  Welcome: undefined;
  PermissionsPriming: undefined;
  OnboardingComplete: undefined;
};

export type HomeStackParamList = {
  Home: undefined;
};

export type DiscoverStackParamList = {
  Search: undefined;
  CategoryBrowse: { category: string };
  SearchResults: { query: string };
};

export type RoomsStackParamList = {
  CreateRoom: { titleId?: string } | undefined;
  InviteSheet: { roomId: string };
  RoomLobby: { roomId: string };
};

export type NotificationsStackParamList = {
  Notifications: undefined;
};

export type ProfileStackParamList = {
  Profile: undefined;
  EditProfile: undefined;
  Watchlist: undefined;
  WatchHistory: undefined;
  Friends: undefined;
  Settings: undefined;
  NotificationPreferences: undefined;
  Subscription: undefined;
  HelpSupport: undefined;
  PrivacyTerms: { doc: "privacy" | "terms" };
};

export type AppTabsParamList = {
  HomeTab: NavigatorScreenParams<HomeStackParamList>;
  DiscoverTab: NavigatorScreenParams<DiscoverStackParamList>;
  RoomsTab: NavigatorScreenParams<RoomsStackParamList>;
  NotificationsTab: NavigatorScreenParams<NotificationsStackParamList>;
  ProfileTab: NavigatorScreenParams<ProfileStackParamList>;
};

export type RootStackParamList = {
  Splash: undefined;
  Intro: undefined;
  OnboardingCarousel: undefined;
  Auth: NavigatorScreenParams<AuthStackParamList>;
  AccountSetup: NavigatorScreenParams<AccountSetupStackParamList>;
  Main: NavigatorScreenParams<AppTabsParamList>;
  TitleDetails: { titleId: string };
  Player: { roomId: string; titleId?: string; solo?: boolean };
  RoomRecap: { roomId: string };
  JoinRoom: { roomId: string };
  ForceUpdate: undefined;
  Paywall: { reason?: string } | undefined;
};

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
