import { Camera } from "expo-camera";
import { requestRecordingPermissionsAsync } from "expo-audio";
import * as Notifications from "expo-notifications";

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

export async function requestNotificationPermission() {
  const { status } = await Notifications.requestPermissionsAsync();
  return status === "granted";
}

export async function requestAllOnboardingPermissions() {
  const [camera, microphone, notifications] = await Promise.all([
    requestCameraPermission(),
    requestMicrophonePermission(),
    requestNotificationPermission(),
  ]);
  return { camera, microphone, notifications };
}
