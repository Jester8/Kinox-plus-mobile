import { useState } from "react";
import { FlatList, KeyboardAvoidingView, Platform, Pressable, Text, TextInput, View } from "react-native";
import { Send, X } from "lucide-react-native";
import { darkColors as colors } from "@/theme/colors";
import { useRoomStore } from "@/stores/roomStore";
import { sendChatMessage } from "@/services/socket";

type ChatDrawerProps = {
  onClose: () => void;
};

export default function ChatDrawer({ onClose }: ChatDrawerProps) {
  const messages = useRoomStore((s) => s.messages);
  const [draft, setDraft] = useState("");

  const submit = () => {
    if (!draft.trim()) return;
    sendChatMessage(draft.trim());
    setDraft("");
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      className="absolute inset-x-0 bottom-0 h-[60%] rounded-t-3xl border border-white/10 bg-navy-950"
    >
      <View className="flex-row items-center justify-between border-b border-white/10 px-4 py-3">
        <Text className="text-sm font-['Manrope_600SemiBold'] text-white">Room chat</Text>
        <Pressable onPress={onClose} hitSlop={8}>
          <X size={18} color={colors.blue300} />
        </Pressable>
      </View>

      <FlatList
        data={messages}
        keyExtractor={(m) => m.id}
        contentContainerClassName="gap-3 p-4"
        renderItem={({ item }) => (
          <View>
            <Text className="text-xs font-['Manrope_600SemiBold'] text-blue-300">{item.authorName}</Text>
            <Text className="text-sm text-white/90">{item.body}</Text>
          </View>
        )}
        ListEmptyComponent={
          <Text className="py-6 text-center text-sm text-blue-100/50">
            No messages yet — say hi to the room.
          </Text>
        }
      />

      <View className="flex-row items-center gap-2 border-t border-white/10 p-3">
        <TextInput
          value={draft}
          onChangeText={setDraft}
          placeholder="Message the room…"
          placeholderTextColor="rgba(226,233,251,0.35)"
          className="min-h-[40px] flex-1 rounded-full border border-white/10 bg-navy-900 px-4 text-sm text-white"
          onSubmitEditing={submit}
        />
        <Pressable
          onPress={submit}
          className="h-10 w-10 items-center justify-center rounded-full bg-blue-600"
        >
          <Send size={16} color="#fff" />
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}
