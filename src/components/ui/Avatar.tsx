import { memo } from "react";
import { Image, Text, View } from "react-native";

type AvatarProps = {
  uri?: string;
  name: string;
  size?: number;
  ring?: boolean;
};

function initials(name: string) {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

function Avatar({ uri, name, size = 40, ring = false }: AvatarProps) {
  const dimension = { width: size, height: size, borderRadius: size / 2 };

  if (uri) {
    return (
      <Image
        source={{ uri }}
        style={dimension}
        className={ring ? "border-2 border-blue-400" : undefined}
      />
    );
  }

  return (
    <View
      style={dimension}
      className={`items-center justify-center bg-blue-700 ${ring ? "border-2 border-blue-400" : ""}`}
    >
      <Text style={{ fontSize: size * 0.4 }} className="font-['Manrope_600SemiBold'] text-white">
        {initials(name)}
      </Text>
    </View>
  );
}

export default memo(Avatar);
