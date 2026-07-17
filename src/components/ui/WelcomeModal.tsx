import { Modal, Text, View } from "react-native";
import BrandMark from "./BrandMark";
import Button from "./Button";

type WelcomeModalProps = {
  visible: boolean;
  onDismiss: () => void;
};

export default function WelcomeModal({ visible, onDismiss }: WelcomeModalProps) {
  return (
    <Modal visible={visible} animationType="fade" transparent onRequestClose={onDismiss}>
      <View className="flex-1 items-center justify-center bg-black/70 px-8">
        <View className="w-full items-center gap-4 rounded-2xl border border-line/10 bg-navy-950 p-8">
          <BrandMark size={56} />
          <Text className="text-center text-xl font-['Manrope_700Bold'] text-foreground">Welcome to KinoX Plus</Text>
          <Text className="text-center text-sm text-blue-100/75">A home for shared experiences.</Text>
          <Button className="mt-2 w-full" onPress={onDismiss} icon>
            Let's Go
          </Button>
        </View>
      </View>
    </Modal>
  );
}
