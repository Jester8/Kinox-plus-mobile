import { ReactNode } from "react";
import { ScrollView, Text, View } from "react-native";

type RailProps = {
  title: string;
  children: ReactNode;
};

export default function Rail({ title, children }: RailProps) {
  return (
    <View className="gap-3">
      <Text className="px-6 text-lg font-['Manrope_700Bold'] text-foreground">{title}</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerClassName="gap-3 px-6"
      >
        {children}
      </ScrollView>
    </View>
  );
}
