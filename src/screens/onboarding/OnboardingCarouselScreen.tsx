import { useRef, useState } from "react";
import { Dimensions, NativeScrollEvent, NativeSyntheticEvent, ScrollView, Text, View } from "react-native";
import { CirclePlay, Video, Users } from "lucide-react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import Button from "@/components/ui/Button";
import { useThemeColors } from "@/hooks/useThemeColors";
import { useSessionStore } from "@/stores/sessionStore";
import type { RootStackParamList } from "@/navigation/types";

type Props = NativeStackScreenProps<RootStackParamList, "OnboardingCarousel">;

const { width } = Dimensions.get("window");

const slides = [
  {
    icon: CirclePlay,
    title: "Movies are better together",
    body: "Browse a growing library and start a room with one tap — no downloads, no friction.",
  },
  {
    icon: Video,
    title: "Synced playback, zero drift",
    body: "Every screen shows the exact same frame, down to the millisecond, no matter who hits play.",
  },
  {
    icon: Users,
    title: "See your friends' faces, not just their names",
    body: "Floating video bubbles keep the room feeling like a room, even when everyone's remote.",
  },
];

export default function OnboardingCarouselScreen({ navigation }: Props) {
  const colors = useThemeColors();
  const [index, setIndex] = useState(0);
  const scrollRef = useRef<ScrollView>(null);
  const markOnboardingSeen = useSessionStore((s) => s.markOnboardingSeen);

  const finish = () => {
    markOnboardingSeen();
    navigation.replace("Auth", { screen: "SignUp" });
  };

  const onScrollEnd = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    setIndex(Math.round(e.nativeEvent.contentOffset.x / width));
  };

  const isLast = index === slides.length - 1;

  return (
    <View className="flex-1 bg-background">
      <View className="flex-row justify-end px-6 pt-16">
        <Text onPress={finish} className="text-sm font-['Manrope_600SemiBold'] text-blue-300">
          Skip
        </Text>
      </View>

      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={onScrollEnd}
        className="flex-1"
      >
        {slides.map((slide, i) => (
          <View key={i} style={{ width }} className="flex-1 items-center justify-center px-10">
            <View className="mb-8 h-20 w-20 items-center justify-center rounded-3xl bg-blue-600">
              <slide.icon size={36} color="#fff" />
            </View>
            <Text className="text-center text-2xl font-['Manrope_700Bold'] text-foreground">{slide.title}</Text>
            <Text className="mt-4 text-center text-base text-blue-100/80">{slide.body}</Text>
          </View>
        ))}
      </ScrollView>

      <View className="flex-row items-center justify-center gap-2 pb-4">
        {slides.map((_, i) => (
          <View
            key={i}
            className="h-1.5 rounded-full"
            style={{
              width: i === index ? 20 : 6,
              backgroundColor: i === index ? colors.blue400 : colors.foreground + "33",
            }}
          />
        ))}
      </View>

      <View className="px-6 pb-12 pt-2">
        <Button
          onPress={() => {
            if (isLast) {
              finish();
            } else {
              scrollRef.current?.scrollTo({ x: (index + 1) * width, animated: true });
            }
          }}
          icon
        >
          {isLast ? "Get Started" : "Next"}
        </Button>
      </View>
    </View>
  );
}
