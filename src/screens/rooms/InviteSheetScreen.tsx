import { Alert, Pressable, Share, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import QRCode from "react-native-qrcode-svg";
import { Copy, Share2, UserPlus } from "lucide-react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { CompositeScreenProps } from "@react-navigation/native";
import Button from "@/components/ui/Button";
import { useThemeColors } from "@/hooks/useThemeColors";
import { darkColors } from "@/theme/colors";
import type { RoomsStackParamList, RootStackParamList } from "@/navigation/types";

type Props = CompositeScreenProps<
  NativeStackScreenProps<RoomsStackParamList, "InviteSheet">,
  NativeStackScreenProps<RootStackParamList>
>;

export default function InviteSheetScreen({ route, navigation }: Props) {
  const colors = useThemeColors();
  const { roomId } = route.params;
  // TODO: fetch a signed, expiring invite token from the API instead of the raw room ID.
  const inviteUrl = `https://kinoxplus.app/room/${roomId}`;

  const onShare = () => {
    Share.share({ message: `Join my KinoX Plus room: ${inviteUrl}` }).catch(() => undefined);
  };

  const onCopy = () => {
    Alert.alert("Link copied", inviteUrl);
  };

  return (
    <SafeAreaView className="flex-1 items-center bg-background px-6" edges={["top", "bottom"]}>
      <View className="mt-8 items-center gap-2">
        <Text className="text-2xl font-['Manrope_700Bold'] text-foreground">Invite friends</Text>
        <Text className="text-sm text-blue-100/70">Anyone with this link or QR code can join.</Text>
      </View>

      <View className="mt-8 items-center rounded-3xl border border-line/10 bg-white p-6">
        <QRCode value={inviteUrl} size={180} backgroundColor="#fff" color={darkColors.navy950} />
      </View>

      <View className="mt-8 w-full flex-row items-center justify-between rounded-xl border border-line/10 bg-navy-950 px-4 py-3">
        <Text numberOfLines={1} className="flex-1 text-sm text-blue-100/80">
          {inviteUrl}
        </Text>
        <Pressable onPress={onCopy} hitSlop={8} className="ml-3">
          <Copy size={16} color={colors.blue300} />
        </Pressable>
      </View>

      <View className="mt-6 w-full gap-3">
        <Button onPress={onShare} icon={false}>
          <Share2 size={16} color="#fff" /> Share Link
        </Button>
        <Button variant="secondary" icon={false} onPress={onCopy}>
          <UserPlus size={16} color={colors.blue200} /> Invite from Contacts
        </Button>
      </View>

      <View className="flex-1" />

      <View className="w-full pb-8">
        <Button variant="ghost" onPress={() => navigation.navigate("RoomLobby", { roomId })} icon>
          Go to Lobby
        </Button>
      </View>
    </SafeAreaView>
  );
}
