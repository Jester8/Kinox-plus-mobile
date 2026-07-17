import { create } from "zustand";

export type Participant = {
  id: string;
  name: string;
  avatarUri?: string;
  isHost: boolean;
  micOn: boolean;
  cameraOn: boolean;
  isMuted?: boolean;
  isPinned?: boolean;
};

export type ChatMessage = {
  id: string;
  authorId: string;
  authorName: string;
  body: string;
  sentAt: number;
};

type RoomState = {
  roomId: string | null;
  roomName: string | null;
  titleId: string | null;
  isPrivate: boolean;
  isHost: boolean;
  participants: Participant[];
  messages: ChatMessage[];
  syncStatus: "synced" | "syncing";
  setRoom: (room: { roomId: string; roomName: string; titleId?: string; isPrivate: boolean; isHost: boolean }) => void;
  setParticipants: (participants: Participant[]) => void;
  upsertParticipant: (participant: Participant) => void;
  removeParticipant: (id: string) => void;
  addMessage: (message: ChatMessage) => void;
  setSyncStatus: (status: "synced" | "syncing") => void;
  leaveRoom: () => void;
};

export const useRoomStore = create<RoomState>((set) => ({
  roomId: null,
  roomName: null,
  titleId: null,
  isPrivate: true,
  isHost: false,
  participants: [],
  messages: [],
  syncStatus: "synced",

  setRoom: ({ roomId, roomName, titleId, isPrivate, isHost }) =>
    set({ roomId, roomName, titleId: titleId ?? null, isPrivate, isHost }),

  setParticipants: (participants) => set({ participants }),

  upsertParticipant: (participant) =>
    set((state) => {
      const existingIndex = state.participants.findIndex((p) => p.id === participant.id);
      if (existingIndex === -1) {
        return { participants: [...state.participants, participant] };
      }
      const next = [...state.participants];
      next[existingIndex] = participant;
      return { participants: next };
    }),

  removeParticipant: (id) =>
    set((state) => ({ participants: state.participants.filter((p) => p.id !== id) })),

  addMessage: (message) => set((state) => ({ messages: [...state.messages, message] })),

  setSyncStatus: (syncStatus) => set({ syncStatus }),

  leaveRoom: () =>
    set({
      roomId: null,
      roomName: null,
      titleId: null,
      isHost: false,
      participants: [],
      messages: [],
      syncStatus: "synced",
    }),
}));
