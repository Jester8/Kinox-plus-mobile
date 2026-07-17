// Placeholder for the watch-party face-bubble video layer. The spec calls
// for the LiveKit React Native SDK (or Agora as fallback) here, but both
// pull in native WebRTC modules that need a custom dev client and real
// room tokens from a backend that doesn't exist yet — so face bubbles
// render as static Avatar tiles (see components/video/FaceBubble.tsx)
// until this is wired up to a real SFU.
//
// Real integration sketch, once a backend issues per-room tokens:
//   npx expo install @livekit/react-native @livekit/react-native-webrtc livekit-client
//   const room = new Room({ adaptiveStream: true, dynacast: true });
//   await room.connect(LIVEKIT_URL, token);
//   await room.localParticipant.setCameraEnabled(true);
//   await room.localParticipant.setMicrophoneEnabled(true);

export async function connectToLiveKitRoom(_token: string): Promise<null> {
  return null;
}

export async function disconnectFromLiveKitRoom(_room: unknown): Promise<void> {}
