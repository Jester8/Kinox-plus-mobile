import { Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ChevronRight, Clock, Settings, Users2, Video } from "lucide-react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { CompositeScreenProps } from "@react-navigation/native";
import Avatar from "@/components/ui/Avatar";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { useThemeColors } from "@/hooks/useThemeColors";
import { useSessionStore } from "@/stores/sessionStore";
import type { ProfileStackParamList } from "@/navigation/types";

type Props = CompositeScreenProps<NativeStackScreenProps<ProfileStackParamList, "Profile">, any>;

const stats = [
  { icon: Video, label: "Rooms hosted", value: "12" },
  { icon: Clock, label: "Hours watched", value: "48" },
  { icon: Users2, label: "Friends", value: "9" },
];

const shortcuts: { label: string; route: keyof ProfileStackParamList }[] = [
  { label: "Watchlist", route: "Watchlist" },
  { label: "Watch History", route: "WatchHistory" },
  { label: "Friends & Following", route: "Friends" },
];

export default function ProfileScreen({ navigation }: Props) {
  const colors = useThemeColors();
  const profile = useSessionStore((s) => s.profile);

  return (
    <SafeAreaView className="flex-1 bg-background" edges={["top"]}>
      <ScrollView contentContainerClassName="gap-6 px-6 pb-10 pt-2" showsVerticalScrollIndicator={false}>
        <View className="flex-row items-center justify-between">
          <Text className="text-2xl font-['Manrope_700Bold'] text-foreground">Profile</Text>
          <Pressable onPress={() => navigation.navigate("Settings")} hitSlop={8}>
            <Settings size={20} color={colors.blue300} />
          </Pressable>
        </View>

        <View className="items-center gap-3">
          <Avatar name={profile?.displayName ?? "You"} size={88} />
          <View className="items-center">
            <Text className="text-lg font-['Manrope_700Bold'] text-foreground">{profile?.displayName ?? "Your Name"}</Text>
            <Text className="text-sm text-blue-100/60">@{profile?.username ?? "username"}</Text>
          </View>
          {profile?.bio && <Text className="text-center text-sm text-blue-100/75">{profile.bio}</Text>}
          <Button size="sm" variant="secondary" onPress={() => navigation.navigate("EditProfile")}>
            Edit Profile
          </Button>
        </View>

        <View className="flex-row gap-3">
          {stats.map(({ icon: Icon, label, value }) => (
            <Card key={label} className="flex-1 items-center gap-1 p-4">
              <Icon size={16} color={colors.blue300} />
              <Text className="text-lg font-['Manrope_700Bold'] text-foreground">{value}</Text>
              <Text className="text-center text-[11px] text-blue-100/60">{label}</Text>
            </Card>
          ))}
        </View>

        <View className="gap-2">
          {shortcuts.map(({ label, route }) => (
            <Pressable
              key={route}
              onPress={() => navigation.navigate(route as never)}
              className="flex-row items-center justify-between rounded-xl border border-line/10 bg-navy-950 px-4 py-4"
            >
              <Text className="text-sm font-['Manrope_500Medium'] text-foreground">{label}</Text>
              <ChevronRight size={16} color={colors.blue300} />
            </Pressable>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
