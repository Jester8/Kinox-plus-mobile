import { useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ChevronDown, ChevronLeft } from "lucide-react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import TextField from "@/components/ui/TextField";
import Button from "@/components/ui/Button";
import { useThemeColors } from "@/hooks/useThemeColors";
import { faqs } from "@/lib/mockData";
import type { ProfileStackParamList } from "@/navigation/types";

type Props = NativeStackScreenProps<ProfileStackParamList, "HelpSupport">;

export default function HelpSupportScreen({ navigation }: Props) {
  const colors = useThemeColors();
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);

  return (
    <SafeAreaView className="flex-1 bg-background" edges={["top"]}>
      <View className="flex-row items-center gap-3 px-6 pt-2">
        <Pressable onPress={() => navigation.goBack()} hitSlop={8}>
          <ChevronLeft size={22} color={colors.blue300} />
        </Pressable>
        <Text className="text-lg font-['Manrope_700Bold'] text-foreground">Help & Support</Text>
      </View>

      <ScrollView contentContainerClassName="gap-8 px-6 py-6">
        <View className="gap-2">
          <Text className="text-sm font-['Manrope_600SemiBold'] text-blue-100/70">Frequently asked questions</Text>
          {faqs.map((faq, i) => {
            const open = openIndex === i;
            return (
              <Pressable
                key={faq.question}
                onPress={() => setOpenIndex(open ? null : i)}
                className="rounded-xl border border-line/10 bg-navy-950 p-4"
              >
                <View className="flex-row items-center justify-between">
                  <Text className="flex-1 pr-3 text-sm font-['Manrope_500Medium'] text-foreground">{faq.question}</Text>
                  <ChevronDown
                    size={16}
                    color={colors.blue300}
                    style={{ transform: [{ rotate: open ? "180deg" : "0deg" }] }}
                  />
                </View>
                {open && <Text className="mt-2 text-sm text-blue-100/70">{faq.answer}</Text>}
              </Pressable>
            );
          })}
        </View>

        <View className="gap-3">
          <Text className="text-sm font-['Manrope_600SemiBold'] text-blue-100/70">Contact support</Text>
          <TextField
            placeholder="Tell us what's going on…"
            value={message}
            onChangeText={setMessage}
            multiline
            numberOfLines={4}
            style={{ minHeight: 100, textAlignVertical: "top" }}
          />
          <Button
            onPress={() => {
              setSent(true);
              setMessage("");
            }}
            disabled={!message}
          >
            {sent ? "Message Sent" : "Send Message"}
          </Button>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
