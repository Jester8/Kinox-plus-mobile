import { useEffect } from "react";
import { ActivityIndicator, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useThemeColors } from "@/hooks/useThemeColors";
import { useSessionStore } from "@/stores/sessionStore";
import type { RootStackParamList } from "@/navigation/types";

type Props = NativeStackScreenProps<RootStackParamList, "JoinRoom">;

// Landing screen for kinoxplus://room/:roomId and the https universal link —
// checks auth, then drops the guest straight into the lobby.
export default function JoinRoomScreen({ route, navigation }: Props) {
  const colors = useThemeColors();
  const { roomId } = route.params;
  const accessToken = useSessionStore((s) => s.accessToken);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!accessToken) {
        navigation.replace("Auth", { screen: "Login" });
      } else {
        navigation.replace("Main", {
          screen: "RoomsTab",
          params: { screen: "RoomLobby", params: { roomId } },
        });
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [accessToken, roomId, navigation]);

  return (
    <SafeAreaView className="flex-1 items-center justify-center bg-background">
      <ActivityIndicator color={colors.blue300} />
      <Text className="mt-3 text-sm text-blue-100/70">Joining room…</Text>
    </SafeAreaView>
  );
}
