import { io, Socket } from "socket.io-client";
import { storage } from "@/lib/storage";
import { useRoomStore } from "@/stores/roomStore";
import { usePlayerStore } from "@/stores/playerStore";

// TODO: point at the real KinoX Plus realtime server once it's live.
const SOCKET_URL = process.env.EXPO_PUBLIC_SOCKET_URL ?? "wss://realtime.kinoxplus.app";

let socket: Socket | null = null;

type ServerClockTick = { serverTimeMs: number; positionSeconds: number };

// Server periodically broadcasts an authoritative timestamp; the client
// nudges its local playback rate (never a hard seek) to converge, keeping
// perceived drift under ~150ms without visible jumps.
function reconcileClock({ positionSeconds }: ServerClockTick) {
  const local = usePlayerStore.getState().positionSeconds;
  const drift = positionSeconds - local;

  if (Math.abs(drift) < 0.15) {
    usePlayerStore.getState().resetRate();
    useRoomStore.getState().setSyncStatus("synced");
    return;
  }

  useRoomStore.getState().setSyncStatus("syncing");
  usePlayerStore.getState().nudgeRate(drift > 0 ? 1.05 : 0.95);
}

export async function connectSocket(roomId: string) {
  const accessToken = await storage.getItem("session.accessToken");

  socket = io(SOCKET_URL, {
    auth: { token: accessToken, roomId },
    transports: ["websocket"],
  });

  socket.on("room:clock", reconcileClock);

  socket.on("room:participant-joined", (participant) => {
    useRoomStore.getState().upsertParticipant(participant);
  });

  socket.on("room:participant-left", ({ id }: { id: string }) => {
    useRoomStore.getState().removeParticipant(id);
  });

  socket.on("room:chat-message", (message) => {
    useRoomStore.getState().addMessage(message);
  });

  return socket;
}

export function disconnectSocket() {
  socket?.disconnect();
  socket = null;
}

export function sendChatMessage(body: string) {
  socket?.emit("room:chat-message", { body });
}

export function sendReaction(emoji: string) {
  socket?.emit("room:reaction", { emoji });
}

export function getSocket() {
  return socket;
}
