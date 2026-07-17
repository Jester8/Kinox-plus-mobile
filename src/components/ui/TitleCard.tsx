import { memo } from "react";
import { Image, Pressable, Text, View } from "react-native";
import { Play } from "lucide-react-native";
import type { Title } from "@/lib/mockData";

type TitleCardProps = {
  title: Title;
  onPress: () => void;
  progress?: number;
  width?: number;
};

function TitleCard({ title, onPress, progress, width = 128 }: TitleCardProps) {
  return (
    <Pressable onPress={onPress} className="gap-2 active:opacity-80" style={{ width }}>
      <View
        style={{ height: width * 1.5, backgroundColor: title.posterColor }}
        className="items-center justify-center overflow-hidden rounded-xl"
      >
        {title.posterImageUrl ? (
          <Image source={{ uri: title.posterImageUrl }} style={{ width: "100%", height: "100%" }} resizeMode="cover" />
        ) : (
          <Play size={22} color="rgba(255,255,255,0.6)" />
        )}
        {progress !== undefined && (
          <View className="absolute inset-x-0 bottom-0 h-1 bg-black/40">
            <View className="h-full bg-blue-400" style={{ width: `${progress * 100}%` }} />
          </View>
        )}
      </View>
      <Text numberOfLines={1} className="text-sm font-['Manrope_500Medium'] text-foreground">
        {title.name}
      </Text>
    </Pressable>
  );
}

export default memo(TitleCard);
