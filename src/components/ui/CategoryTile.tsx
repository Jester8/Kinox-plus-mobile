import { Image, Pressable, Text, View } from "react-native";

type CategoryTileProps = {
  label: string;
  posterUrl?: string | null;
  fallbackColor: string;
  onPress: () => void;
};

export default function CategoryTile({ label, posterUrl, fallbackColor, onPress }: CategoryTileProps) {
  return (
    <Pressable
      onPress={onPress}
      style={{ backgroundColor: fallbackColor }}
      className="h-20 flex-1 justify-end overflow-hidden rounded-md"
    >
      {posterUrl && (
        <Image source={{ uri: posterUrl }} style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }} resizeMode="cover" />
      )}
      <View className="bg-black/45 px-3 py-2">
        <Text className="text-sm font-['Manrope_600SemiBold'] text-white">{label}</Text>
      </View>
    </Pressable>
  );
}
