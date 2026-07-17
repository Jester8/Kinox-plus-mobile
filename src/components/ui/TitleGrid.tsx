import { useWindowDimensions, View } from "react-native";
import TitleCard from "./TitleCard";
import type { Title } from "@/lib/mockData";

type TitleGridProps = {
  data: Title[];
  onPressTitle: (title: Title) => void;
};

const HORIZONTAL_PADDING = 24; // px-6
const GAP = 12;
const MIN_CARD_WIDTH = 140;

export default function TitleGrid({ data, onPressTitle }: TitleGridProps) {
  const { width: windowWidth } = useWindowDimensions();
  const contentWidth = windowWidth - HORIZONTAL_PADDING * 2;
  const columns = Math.max(2, Math.floor((contentWidth + GAP) / (MIN_CARD_WIDTH + GAP)));
  const cardWidth = (contentWidth - GAP * (columns - 1)) / columns;

  return (
    <View className="flex-row flex-wrap gap-x-3 gap-y-4 px-6">
      {data.map((title) => (
        <TitleCard key={title.id} title={title} onPress={() => onPressTitle(title)} width={cardWidth} />
      ))}
    </View>
  );
}
