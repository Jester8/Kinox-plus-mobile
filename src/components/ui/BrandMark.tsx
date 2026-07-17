import { Image, View } from "react-native";
import Svg, { Path } from "react-native-svg";
import { useThemeStore } from "@/stores/themeStore";

type BrandMarkProps = {
  size?: number;
  showWordmark?: boolean;
};

// The Sync X — two play triangles (Sunset Coral + Aurora Violet) meeting at
// center, used for the icon-only lockup. Mirrors web's Logo.tsx SyncMark
// exactly (same path data from the brand kit) so both apps render the
// identical mark.
function SyncMark({ size }: { size: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 240 240">
      <Path
        d="M 119.064 6.188 L 112.663 98.259 Q 111.727 111.727 98.259 112.663 L 6.188 119.064 Q -7.279 120.000 2.267 110.454 L 110.454 2.267 Q 120.000 -7.279 119.064 6.188 Z"
        fill="#FF6B5B"
      />
      <Path
        d="M 233.812 120.936 L 141.741 127.337 Q 128.273 128.273 127.337 141.741 L 120.936 233.812 Q 120.000 247.279 129.546 237.733 L 237.733 129.546 Q 247.279 120.000 233.812 120.936 Z"
        fill="#7B5CFF"
      />
    </Svg>
  );
}

// Native aspect ratio of the brand kit's horizontal lockup PNGs (2000x743).
const HORIZONTAL_LOGO_RATIO = 2000 / 743;

// The kit only ships a light-"KINO"-text version (meant for dark surfaces).
// This dark-text counterpart was rasterized from the kit's own
// kinox-logo-horizontal-light.svg with its baked-in background stripped, so
// it stays transparent and works on the light theme's background too.
const LOGO_LIGHT_TEXT = require("../../../assets/brand/kinox-logo-horizontal.png");
const LOGO_DARK_TEXT = require("../../../assets/brand/logo-horizontal-dark-text.png");

export default function BrandMark({ size = 40, showWordmark = false }: BrandMarkProps) {
  const resolvedTheme = useThemeStore((s) => s.resolved);

  if (showWordmark) {
    return (
      <Image
        source={resolvedTheme === "light" ? LOGO_DARK_TEXT : LOGO_LIGHT_TEXT}
        resizeMode="contain"
        style={{ height: size, width: size * HORIZONTAL_LOGO_RATIO }}
      />
    );
  }

  return (
    <View
      style={{ width: size, height: size, borderRadius: size * 0.28, padding: size * 0.16 }}
      className="items-center justify-center bg-navy-800"
    >
      <SyncMark size={size * 0.68} />
    </View>
  );
}
