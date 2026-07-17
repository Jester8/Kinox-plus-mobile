import { useEffect, useState } from "react";
import { View } from "react-native";
import { useVideoPlayer, VideoView } from "expo-video";
import { useEventListener } from "expo";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { RootStackParamList } from "@/navigation/types";

type Props = NativeStackScreenProps<RootStackParamList, "Intro">;

const INTRO_SOURCE = require("../../../assets/brand/splash-intro.mp4");
// Matches the encoded length of assets/brand/splash-intro.mp4. Navigation is
// gated on this fixed timer rather than the player's "playToEnd" event —
// that event isn't reliably emitted on every Android device/decoder.
const INTRO_DURATION_MS = 4300;

// Plays the brand intro once (Sync X converging + cinematic sting) after the
// static Splash logo, then always lands on Login — this only runs for
// logged-out users; Splash sends anyone with a session straight to Home.
export default function IntroScreen({ navigation }: Props) {
  const [finished, setFinished] = useState(false);

  const player = useVideoPlayer(INTRO_SOURCE, (p) => {
    p.volume = 1;
    p.play();
  });

  // Fails fast instead of waiting out the full timer if the source can't be
  // decoded on this device.
  useEventListener(player, "statusChange", ({ status }) => {
    if (status === "error") setFinished(true);
  });

  useEffect(() => {
    const timer = setTimeout(() => setFinished(true), INTRO_DURATION_MS);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (finished) {
      navigation.replace("Auth", { screen: "Login" });
    }
  }, [finished, navigation]);

  return (
    <View className="flex-1 bg-background">
      <VideoView
        player={player}
        style={{ flex: 1 }}
        contentFit="cover"
        nativeControls={false}
        fullscreenOptions={{ enable: false }}
      />
    </View>
  );
}
