import { useState } from "react";
import { FlatList, Pressable, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ChevronLeft, UserPlus } from "lucide-react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import Avatar from "@/components/ui/Avatar";
import { useThemeColors } from "@/hooks/useThemeColors";
import { friends } from "@/lib/mockData";
import type { ProfileStackParamList } from "@/navigation/types";

type Props = NativeStackScreenProps<ProfileStackParamList, "Friends">;

export default function FriendsScreen({ navigation }: Props) {
  const colors = useThemeColors();
  const [query, setQuery] = useState("");

  return (
    <SafeAreaView className="flex-1 bg-background" edges={["top"]}>
      <View className="flex-row items-center gap-3 px-6 pt-2">
        <Pressable onPress={() => navigation.goBack()} hitSlop={8}>
          <ChevronLeft size={22} color={colors.blue300} />
        </Pressable>
        <Text className="text-lg font-['Manrope_700Bold'] text-foreground">Friends</Text>
      </View>

      <View className="mx-6 mt-4 flex-row items-center gap-2 rounded-xl border border-line/10 bg-navy-900 px-4">
        <UserPlus size={16} color={colors.blue300} />
        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder="Add by username or invite link"
          placeholderTextColor="rgba(226,233,251,0.35)"
          className="min-h-[44px] flex-1 text-sm text-foreground"
        />
      </View>

      <FlatList
        data={friends}
        keyExtractor={(f) => f.id}
        contentContainerClassName="gap-1 px-6 py-4"
        renderItem={({ item }) => (
          <View className="flex-row items-center gap-3 py-2.5">
            <View>
              <Avatar name={item.name} size={40} />
              {item.online && (
                <View className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-background bg-green-400" />
              )}
            </View>
            <View className="flex-1">
              <Text className="text-sm font-['Manrope_500Medium'] text-foreground">{item.name}</Text>
              <Text className="text-xs text-blue-100/60">@{item.username}</Text>
            </View>
            <Text className="text-xs text-blue-100/50">{item.online ? "Online" : "Offline"}</Text>
          </View>
        )}
      />
    </SafeAreaView>
  );
}
