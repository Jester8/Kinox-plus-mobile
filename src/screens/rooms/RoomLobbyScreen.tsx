import { useEffect } from "react";
import { FlatList, Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Mic, MicOff, Video, VideoOff, X } from "lucide-react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { CompositeScreenProps } from "@react-navigation/native";
import { useState } from "react";
import Avatar from "@/components/ui/Avatar";
import Button from "@/components/ui/Button";
import { darkColors as colors } from "@/theme/colors";
import { useRoomStore } from "@/stores/roomStore";
import { connectSocket, disconnectSocket } from "@/services/socket";
import type { RoomsStackParamList, RootStackParamList } from "@/navigation/types";

type Props = CompositeScreenProps<
  NativeStackScreenProps<RoomsStackParamList, "RoomLobby">,
  NativeStackScreenProps<RootStackParamList>
>;

export default function RoomLobbyScreen({ route, navigation }: Props) {
  const { roomId } = route.params;
  const roomName = useRoomStore((s) => s.roomName);
  const isHost = useRoomStore((s) => s.isHost);
  const participants = useRoomStore((s) => s.participants);
  const leaveRoom = useRoomStore((s) => s.leaveRoom);
  const [micOn, setMicOn] = useState(true);
  const [cameraOn, setCameraOn] = useState(true);

  useEffect(() => {
    // TODO: this requires a real backend — safe no-op against a mock URL.
    connectSocket(roomId);
    return () => disconnectSocket();
  }, [roomId]);

  const onLeave = () => {
    leaveRoom();
    navigation.goBack();
  };

  return (
    <SafeAreaView className="flex-1 bg-background px-6" edges={["top", "bottom"]}>
      <View className="flex-row items-center justify-between pt-2">
        <View>
          <Text className="text-xs text-blue-100/60">Room Lobby</Text>
          <Text className="text-lg font-['Manrope_700Bold'] text-white">{roomName ?? "Untitled room"}</Text>
        </View>
        <Pressable onPress={onLeave} hitSlop={8}>
          <X size={20} color={colors.blue300} />
        </Pressable>
      </View>

      <View className="mt-8 aspect-square w-full items-center justify-center rounded-3xl border border-white/10 bg-navy-950">
        {cameraOn ? (
          <Avatar name="You" size={96} />
        ) : (
          <Text className="text-sm text-blue-100/50">Camera off</Text>
        )}
        <View className="absolute bottom-4 flex-row gap-3">
          <Pressable
            onPress={() => setMicOn((v) => !v)}
            className={`h-11 w-11 items-center justify-center rounded-full ${micOn ? "bg-white/10" : "bg-red-500/20"}`}
          >
            {micOn ? <Mic size={18} color="#fff" /> : <MicOff size={18} color="#f87171" />}
          </Pressable>
          <Pressable
            onPress={() => setCameraOn((v) => !v)}
            className={`h-11 w-11 items-center justify-center rounded-full ${cameraOn ? "bg-white/10" : "bg-red-500/20"}`}
          >
            {cameraOn ? <Video size={18} color="#fff" /> : <VideoOff size={18} color="#f87171" />}
          </Pressable>
        </View>
      </View>

      <Text className="mt-6 text-sm font-['Manrope_600SemiBold'] text-blue-100/70">
        Waiting in lobby ({participants.length})
      </Text>
      <FlatList
        data={participants}
        keyExtractor={(p) => p.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerClassName="gap-4 py-3"
        renderItem={({ item }) => (
          <View className="items-center gap-1.5">
            <Avatar name={item.name} uri={item.avatarUri} size={48} />
            <Text className="text-xs text-white/70">{item.name.split(" ")[0]}</Text>
          </View>
        )}
      />

      <View className="flex-1" />

      <View className="gap-3 pb-8">
        {isHost ? (
          <Button onPress={() => navigation.navigate("Player", { roomId })} icon>
            Start Playback
          </Button>
        ) : (
          <Text className="text-center text-sm text-blue-100/60">Waiting for the host to start…</Text>
        )}
      </View>
    </SafeAreaView>
  );
}
