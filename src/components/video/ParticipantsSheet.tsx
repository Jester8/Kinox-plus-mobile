import { FlatList, Pressable, Text, View } from "react-native";
import { LogOut, MicOff, Power, UserMinus, X } from "lucide-react-native";
import Avatar from "@/components/ui/Avatar";
import Button from "@/components/ui/Button";
import { darkColors as colors } from "@/theme/colors";
import { useRoomStore } from "@/stores/roomStore";

type ParticipantsSheetProps = {
  isHost: boolean;
  onClose: () => void;
  onLeave: () => void;
  onEndRoom: () => void;
};

export default function ParticipantsSheet({ isHost, onClose, onLeave, onEndRoom }: ParticipantsSheetProps) {
  const participants = useRoomStore((s) => s.participants);
  const removeParticipant = useRoomStore((s) => s.removeParticipant);

  return (
    <View className="absolute inset-x-0 bottom-0 max-h-[70%] rounded-t-3xl border border-white/10 bg-navy-950 p-4">
      <View className="mb-3 flex-row items-center justify-between">
        <Text className="text-sm font-['Manrope_600SemiBold'] text-white">Participants ({participants.length})</Text>
        <Pressable onPress={onClose} hitSlop={8}>
          <X size={18} color={colors.blue300} />
        </Pressable>
      </View>

      <FlatList
        data={participants}
        keyExtractor={(p) => p.id}
        contentContainerClassName="gap-3 pb-3"
        renderItem={({ item }) => (
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center gap-3">
              <Avatar name={item.name} uri={item.avatarUri} size={36} />
              <View>
                <Text className="text-sm font-['Manrope_500Medium'] text-white">
                  {item.name} {item.isHost && <Text className="text-xs text-blue-300">· Host</Text>}
                </Text>
                {!item.micOn && (
                  <View className="mt-0.5 flex-row items-center gap-1">
                    <MicOff size={10} color="rgba(255,255,255,0.5)" />
                    <Text className="text-[11px] text-white/50">Muted</Text>
                  </View>
                )}
              </View>
            </View>
            {isHost && !item.isHost && (
              <Pressable onPress={() => removeParticipant(item.id)} hitSlop={8}>
                <UserMinus size={16} color="#f87171" />
              </Pressable>
            )}
          </View>
        )}
      />

      <View className="mt-2 gap-2 border-t border-white/10 pt-3">
        {isHost && (
          <Button variant="secondary" icon={false} onPress={onEndRoom}>
            <Power size={14} color={colors.blue200} /> End Room for Everyone
          </Button>
        )}
        <Button variant="ghost" icon={false} onPress={onLeave}>
          <LogOut size={14} color={colors.blue300} /> Leave Room
        </Button>
      </View>
    </View>
  );
}
