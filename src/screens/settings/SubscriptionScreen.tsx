import { Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Check, ChevronLeft, Crown } from "lucide-react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import { useThemeColors } from "@/hooks/useThemeColors";
import type { ProfileStackParamList } from "@/navigation/types";

type Props = NativeStackScreenProps<ProfileStackParamList, "Subscription">;

const plans = [
  { name: "Free", price: "$0", perks: ["Up to 4 people per room", "SD playback", "Standard library"] },
  { name: "Plus", price: "$8.99/mo", perks: ["Up to 20 people per room", "4K playback", "Full library", "Priority sync"] },
];

export default function SubscriptionScreen({ navigation }: Props) {
  const colors = useThemeColors();
  return (
    <SafeAreaView className="flex-1 bg-background" edges={["top"]}>
      <View className="flex-row items-center gap-3 px-6 pt-2">
        <Pressable onPress={() => navigation.goBack()} hitSlop={8}>
          <ChevronLeft size={22} color={colors.blue300} />
        </Pressable>
        <Text className="text-lg font-['Manrope_700Bold'] text-foreground">Subscription</Text>
      </View>

      <ScrollView contentContainerClassName="gap-4 px-6 py-6">
        {plans.map((plan) => {
          const isPlus = plan.name === "Plus";
          return (
            <Card key={plan.name} className={isPlus ? "border-champagne/50" : undefined}>
              <View className="flex-row items-center justify-between">
                <View className="flex-row items-center gap-2">
                  {isPlus && <Crown size={16} color={colors.champagne} />}
                  <Text className="text-lg font-['Manrope_700Bold'] text-foreground">{plan.name}</Text>
                </View>
                {plan.name === "Free" && <Badge tone="neutral">Current Plan</Badge>}
              </View>
              <Text className="mt-1 text-2xl font-['Manrope_700Bold'] text-blue-200">{plan.price}</Text>
              <View className="mt-4 gap-2">
                {plan.perks.map((perk) => (
                  <View key={perk} className="flex-row items-center gap-2">
                    <Check size={14} color={colors.blue300} />
                    <Text className="text-sm text-foreground/85">{perk}</Text>
                  </View>
                ))}
              </View>
              {isPlus && (
                <Button className="mt-5" icon>
                  Upgrade to Plus
                </Button>
              )}
            </Card>
          );
        })}
        <Text className="text-center text-xs text-blue-100/40">
          Payments handled by RevenueCat / Stripe. Manage or cancel anytime.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}
