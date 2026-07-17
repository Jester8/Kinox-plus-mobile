import { useNetworkState } from "expo-network";

export function useIsOnline() {
  const { isConnected } = useNetworkState();
  return isConnected !== false;
}
