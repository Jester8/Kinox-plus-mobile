import { Camera } from "expo-camera";
import { requestRecordingPermissionsAsync } from "expo-audio";

// Camera/mic/notification permissions are primed inside onboarding (with
// in-app context explaining *why*) rather than on first room join — never a
// bare OS prompt, per the spec's privacy requirement.
export async function requestCameraPermission() {
  const { status } = await Camera.requestCameraPermissionsAsync();
  return status === "granted";
}

export async function requestMicrophonePermission() {
  const { status } = await requestRecordingPermissionsAsync();
  return status === "granted";
}

// expo-notifications' Android remote-push functionality was pulled from
// Expo Go entirely as of SDK 53 — even just importing the module can throw
// there. Loaded lazily (only when this is actually called) and guarded so
// Expo Go on Android degrades to "not granted" instead of crashing the app;
// a real dev/production build still gets the real permission prompt.
export async function requestNotificationPermission() {
  try {
    const Notifications = await import("expo-notifications");
    const { status } = await Notifications.requestPermissionsAsync();
    return status === "granted";
  } catch {
    return false;
  }
}

export async function requestAllOnboardingPermissions() {
  const [camera, microphone, notifications] = await Promise.all([
    requestCameraPermission(),
    requestMicrophonePermission(),
    requestNotificationPermission(),
  ]);
  return { camera, microphone, notifications };
}
