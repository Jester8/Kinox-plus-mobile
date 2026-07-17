import * as Linking from "expo-linking";
import type { LinkingOptions } from "@react-navigation/native";
import type { RootStackParamList } from "@/navigation/types";

// kinoxplus://room/:roomId and the https://kinoxplus.app/room/:roomId
// universal link both resolve to the same in-app route. Invite links carry
// a signed, expiring token as a query param, not a raw room ID.
export const linking: LinkingOptions<RootStackParamList> = {
  prefixes: [Linking.createURL("/"), "kinoxplus://", "https://kinoxplus.app"],
  config: {
    screens: {
      JoinRoom: "room/:roomId",
    },
  },
};
