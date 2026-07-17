import { useState } from "react";
import { Pressable, ScrollView, Switch, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ChevronLeft, Film } from "lucide-react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { CompositeScreenProps } from "@react-navigation/native";
import TextField from "@/components/ui/TextField";
import Button from "@/components/ui/Button";
import { useThemeColors } from "@/hooks/useThemeColors";
import { titles } from "@/lib/mockData";
import { useRoomStore } from "@/stores/roomStore";
import { useSessionStore } from "@/stores/sessionStore";
import type { RoomsStackParamList, RootStackParamList } from "@/navigation/types";

type Props = CompositeScreenProps<
  NativeStackScreenProps<RoomsStackParamList, "CreateRoom">,
  NativeStackScreenProps<RootStackParamList>
>;

export default function CreateRoomScreen({ route, navigation }: Props) {
  const colors = useThemeColors();
  const titleId = route.params?.titleId;
  const selectedTitle = titles.find((t) => t.id === titleId);
  const profile = useSessionStore((s) => s.profile);
  const setRoom = useRoomStore((s) => s.setRoom);
  const upsertParticipant = useRoomStore((s) => s.upsertParticipant);

  const [roomName, setRoomName] = useState(selectedTitle ? `${selectedTitle.name} night` : "");
  const [isPrivate, setIsPrivate] = useState(true);

  const onCreate = () => {
    const roomId = `room-${Date.now().toString(36)}`;
    setRoom({ roomId, roomName: roomName || "Untitled room", titleId: selectedTitle?.id, isPrivate, isHost: true });
    upsertParticipant({
      id: profile?.id ?? "me",
      name: profile?.displayName ?? "You",
      isHost: true,
      micOn: true,
      cameraOn: true,
    });
    navigation.navigate("InviteSheet", { roomId });
  };

  return (
    <SafeAreaView className="flex-1 bg-background px-6" edges={["top", "bottom"]}>
      <View className="flex-row items-center gap-3 pt-2">
        <Pressable onPress={() => navigation.goBack()} hitSlop={8}>
          <ChevronLeft size={22} color={colors.blue300} />
        </Pressable>
        <Text className="text-lg font-['Manrope_700Bold'] text-foreground">Create a Room</Text>
      </View>

      <ScrollView contentContainerClassName="gap-6 py-6" showsVerticalScrollIndicator={false}>
        <View className="flex-row items-center gap-3 rounded-2xl border border-line/10 bg-navy-950 p-4">
          <View
            className="h-14 w-10 items-center justify-center rounded-lg"
            style={{ backgroundColor: selectedTitle?.posterColor ?? colors.navy800 }}
          >
            <Film size={16} color="#fff" />
          </View>
          <View className="flex-1">
            <Text className="text-sm font-['Manrope_600SemiBold'] text-foreground">
              {selectedTitle?.name ?? "Decide later"}
            </Text>
            <Text className="text-xs text-blue-100/60">
              {selectedTitle ? `${selectedTitle.runtimeMinutes}m · ${selectedTitle.genre}` : "Pick something once friends join"}
            </Text>
          </View>
        </View>

        <TextField label="Room name" value={roomName} onChangeText={setRoomName} placeholder="e.g. Friday night watch" />

        <View className="flex-row items-center justify-between rounded-2xl border border-line/10 bg-navy-950 p-4">
          <View className="flex-1 pr-4">
            <Text className="text-sm font-['Manrope_600SemiBold'] text-foreground">Invite-only</Text>
            <Text className="mt-0.5 text-xs text-blue-100/60">
              Private by default — only people with the link can join.
            </Text>
          </View>
          <Switch
            value={isPrivate}
            onValueChange={setIsPrivate}
            trackColor={{ true: colors.blue600, false: colors.foreground + "26" }}
          />
        </View>

        <Button onPress={onCreate} icon>
          Create Room
        </Button>
      </ScrollView>
    </SafeAreaView>
  );
}
