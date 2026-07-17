import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import BrandMark from "@/components/ui/BrandMark";
import Button from "@/components/ui/Button";
import type { AccountSetupStackParamList } from "@/navigation/types";

type Props = NativeStackScreenProps<AccountSetupStackParamList, "Welcome">;

export default function WelcomeScreen({ navigation }: Props) {
  return (
    <SafeAreaView className="flex-1 bg-background px-6" edges={["top", "bottom"]}>
      <View className="flex-1 items-center justify-center gap-8">
        <BrandMark size={64} />
        <View className="items-center gap-2">
          <Text className="text-center text-3xl font-['Manrope_700Bold'] text-foreground">Hey, let's set up your room</Text>
          <Text className="text-center text-base text-blue-100/70">
            A few quick steps and you'll be ready to watch with friends.
          </Text>
        </View>
      </View>
      <View className="pb-12">
        <Button onPress={() => navigation.navigate("PermissionsPriming")} icon>
          Let's Go
        </Button>
      </View>
    </SafeAreaView>
  );
}
