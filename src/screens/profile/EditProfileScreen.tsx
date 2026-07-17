import { useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ChevronLeft } from "lucide-react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import Avatar from "@/components/ui/Avatar";
import TextField from "@/components/ui/TextField";
import Button from "@/components/ui/Button";
import { useThemeColors } from "@/hooks/useThemeColors";
import { avatarPresets } from "@/lib/mockData";
import { mapUserToProfile, useSessionStore } from "@/stores/sessionStore";
import { ApiError } from "@/services/api";
import { updateMe } from "@/services/users";
import type { ProfileStackParamList } from "@/navigation/types";

type Props = NativeStackScreenProps<ProfileStackParamList, "EditProfile">;

export default function EditProfileScreen({ navigation }: Props) {
  const colors = useThemeColors();
  const profile = useSessionStore((s) => s.profile);
  const setProfile = useSessionStore((s) => s.setProfile);
  const [displayName, setDisplayName] = useState(profile?.displayName ?? "");
  const [bio, setBio] = useState(profile?.bio ?? "");
  const [avatarColor, setAvatarColor] = useState(profile?.avatarColor ?? avatarPresets[0]);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const onSave = async () => {
    setSaving(true);
    setFormError(null);
    try {
      const updated = await updateMe({ displayName, bio, avatarColor });
      setProfile(mapUserToProfile(updated));
      navigation.goBack();
    } catch (err) {
      setFormError(err instanceof ApiError ? err.message : "Couldn't save changes. Try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-background px-6" edges={["top", "bottom"]}>
      <View className="flex-row items-center gap-3 pt-2">
        <Pressable onPress={() => navigation.goBack()} hitSlop={8}>
          <ChevronLeft size={22} color={colors.blue300} />
        </Pressable>
        <Text className="text-lg font-['Manrope_700Bold'] text-foreground">Edit Profile</Text>
      </View>

      <ScrollView contentContainerClassName="gap-6 py-6" keyboardShouldPersistTaps="handled">
        <View className="items-center gap-3">
          <Avatar name={displayName || "You"} size={80} color={avatarColor} />
          <View className="flex-row gap-2">
            {avatarPresets.map((color) => (
              <Pressable
                key={color}
                onPress={() => setAvatarColor(color)}
                className="h-9 w-9 items-center justify-center rounded-full"
                style={{
                  backgroundColor: color,
                  borderWidth: avatarColor === color ? 2 : 0,
                  borderColor: "#fff",
                }}
              />
            ))}
          </View>
        </View>

        <View className="gap-4">
          <TextField label="Username" value={profile?.username ?? ""} editable={false} />
          <TextField
            label="Display name"
            placeholder="Your name"
            value={displayName}
            onChangeText={setDisplayName}
          />
          <TextField
            label="Bio"
            placeholder="Tell people a bit about yourself…"
            value={bio}
            onChangeText={setBio}
            multiline
            numberOfLines={3}
            style={{ minHeight: 80, textAlignVertical: "top" }}
          />
        </View>

        {formError && <Text className="text-center text-xs text-red-300">{formError}</Text>}
        <Button onPress={onSave} loading={saving}>
          Save Changes
        </Button>
      </ScrollView>
    </SafeAreaView>
  );
}
