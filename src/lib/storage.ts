import * as SecureStore from "expo-secure-store";

// Encrypted key-value storage for session tokens and the onboarding flag,
// backed by the OS keychain/keystore via Expo's own SecureStore module.
export const storage = {
  async getItem(key: string): Promise<string | null> {
    return SecureStore.getItemAsync(key);
  },
  async setItem(key: string, value: string): Promise<void> {
    await SecureStore.setItemAsync(key, value);
  },
  async removeItem(key: string): Promise<void> {
    await SecureStore.deleteItemAsync(key);
  },
};
