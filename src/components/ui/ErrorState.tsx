import { Linking } from "react-native";
import { AlertTriangle, LucideIcon, WifiOff, Users, Clock, ShieldAlert } from "lucide-react-native";
import EmptyState from "./EmptyState";

type ErrorKind = "network" | "room-full" | "room-ended" | "permission-denied" | "generic";

type ErrorStateProps = {
  kind: ErrorKind;
  onRetry?: () => void;
};

const config: Record<ErrorKind, { icon: LucideIcon; title: string; description: string }> = {
  network: {
    icon: WifiOff,
    title: "Connection lost",
    description: "Check your internet connection and try again.",
  },
  "room-full": {
    icon: Users,
    title: "This room is full",
    description: "Ask the host to make room, or start your own.",
  },
  "room-ended": {
    icon: Clock,
    title: "This room has ended",
    description: "The host wrapped up the watch party.",
  },
  "permission-denied": {
    icon: ShieldAlert,
    title: "Camera & mic access needed",
    description: "Enable camera and microphone access in Settings to join with video.",
  },
  generic: {
    icon: AlertTriangle,
    title: "Something went wrong",
    description: "Please try again in a moment.",
  },
};

export default function ErrorState({ kind, onRetry }: ErrorStateProps) {
  const { icon, title, description } = config[kind];
  const isPermission = kind === "permission-denied";

  return (
    <EmptyState
      icon={icon}
      title={title}
      description={description}
      actionLabel={isPermission ? "Open Settings" : onRetry ? "Try Again" : undefined}
      onAction={isPermission ? () => Linking.openSettings() : onRetry}
    />
  );
}
