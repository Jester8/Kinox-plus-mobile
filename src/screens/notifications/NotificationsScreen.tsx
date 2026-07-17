import { FlatList, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Bell, Megaphone, UserPlus, Video } from "lucide-react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import EmptyState from "@/components/ui/EmptyState";
import { useThemeColors } from "@/hooks/useThemeColors";
import { notifications, type AppNotification } from "@/lib/mockData";
import type { NotificationsStackParamList } from "@/navigation/types";

type Props = NativeStackScreenProps<NotificationsStackParamList, "Notifications">;

const icons: Record<AppNotification["kind"], typeof Bell> = {
  "room-started": Video,
  invite: UserPlus,
  reminder: Bell,
  system: Megaphone,
};

export default function NotificationsScreen(_: Props) {
  const colors = useThemeColors();
  return (
    <SafeAreaView className="flex-1 bg-background" edges={["top"]}>
      <Text className="px-6 pt-2 text-2xl font-['Manrope_700Bold'] text-foreground">Notifications</Text>

      <FlatList
        data={notifications}
        keyExtractor={(n) => n.id}
        contentContainerClassName="gap-2 px-6 py-4"
        ListEmptyComponent={<EmptyState icon={Bell} title="You're all caught up" />}
        renderItem={({ item }) => {
          const Icon = icons[item.kind];
          return (
            <View
              className={`flex-row items-center gap-3 rounded-xl border px-4 py-3.5 ${
                item.read ? "border-line/10 bg-navy-950" : "border-blue-400/30 bg-blue-500/10"
              }`}
            >
              <View className="h-9 w-9 items-center justify-center rounded-full bg-elevated/10">
                <Icon size={16} color={colors.blue300} />
              </View>
              <View className="flex-1">
                <Text className="text-sm text-foreground/90">{item.message}</Text>
                <Text className="mt-0.5 text-xs text-blue-100/50">{item.timeAgo} ago</Text>
              </View>
              {!item.read && <View className="h-2 w-2 rounded-full bg-blue-400" />}
            </View>
          );
        }}
      />
    </SafeAreaView>
  );
}
