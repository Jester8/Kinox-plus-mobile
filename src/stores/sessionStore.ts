import { create } from "zustand";
import { storage } from "@/lib/storage";
import { logout as apiLogout, logoutAll as apiLogoutAll } from "@/services/auth";
import { getMe, type UserProfile } from "@/services/users";

// id/role/email/username/displayName/avatarColor/emailVerified come straight
// off AuthUserDto (the shape every auth endpoint returns). dateOfBirth/bio/
// categories are collected during the sign-up wizard but aren't part of that
// DTO, so they're optional — a plain login only ever populates the former
// until /users/me backfills the rest.
export type Profile = {
  id: string;
  role?: "USER" | "ADMIN" | "SUPPORT";
  username: string | null;
  displayName: string;
  email: string | null;
  emailVerified?: boolean;
  avatarColor?: string | null;
  avatarUri?: string;
  dateOfBirth?: string;
  bio?: string;
  categories?: string[];
};

export function mapUserToProfile(user: UserProfile): Profile {
  return {
    id: user.id,
    role: user.role,
    username: user.username,
    displayName: user.displayName,
    email: user.email,
    emailVerified: user.emailVerified,
    avatarColor: user.avatarColor,
    avatarUri: user.avatarUrl ?? undefined,
    dateOfBirth: user.dateOfBirth ?? undefined,
    bio: user.bio ?? undefined,
    categories: user.preferredGenres ?? [],
  };
}

type SessionState = {
  accessToken: string | null;
  refreshToken: string | null;
  profile: Profile | null;
  hasSeenOnboarding: boolean;
  hasSeenWelcome: boolean;
  isBootstrapped: boolean;
  setTokens: (accessToken: string, refreshToken: string) => Promise<void>;
  syncTokens: (accessToken: string, refreshToken: string) => void;
  setProfile: (profile: Profile | null) => void;
  markOnboardingSeen: () => Promise<void>;
  markWelcomeSeen: () => Promise<void>;
  bootstrap: () => Promise<void>;
  logOut: () => Promise<void>;
  logOutAllDevices: () => Promise<void>;
};

const ACCESS_TOKEN_KEY = "session.accessToken";
const REFRESH_TOKEN_KEY = "session.refreshToken";
const ONBOARDING_SEEN_KEY = "session.hasSeenOnboarding";
const WELCOME_SEEN_KEY = "session.hasSeenWelcome";

export const useSessionStore = create<SessionState>((set, get) => ({
  accessToken: null,
  refreshToken: null,
  profile: null,
  hasSeenOnboarding: false,
  hasSeenWelcome: false,
  isBootstrapped: false,

  setTokens: async (accessToken, refreshToken) => {
    await storage.setItem(ACCESS_TOKEN_KEY, accessToken).catch(() => undefined);
    await storage.setItem(REFRESH_TOKEN_KEY, refreshToken).catch(() => undefined);
    set({ accessToken, refreshToken });
  },

  // State-only counterpart to setTokens, used by the API layer's own
  // refresh-on-401 flow — it already persists the rotated pair to storage
  // itself, so this just keeps the in-memory store from going stale.
  syncTokens: (accessToken, refreshToken) => set({ accessToken, refreshToken }),

  setProfile: (profile) => set({ profile }),

  markOnboardingSeen: async () => {
    await storage.setItem(ONBOARDING_SEEN_KEY, "true").catch(() => undefined);
    set({ hasSeenOnboarding: true });
  },

  markWelcomeSeen: async () => {
    await storage.setItem(WELCOME_SEEN_KEY, "true").catch(() => undefined);
    set({ hasSeenWelcome: true });
  },

  // Reads the securely-persisted session token and routes into Onboarding,
  // Auth, or Home — mirrors the "Auth check / bootstrap" splash screen in the
  // spec. SecureStore has no web implementation, so failures here fall back
  // to a logged-out state rather than leaving the splash screen stuck.
  bootstrap: async () => {
    try {
      const [accessToken, refreshToken, hasSeenOnboardingRaw, hasSeenWelcomeRaw] = await Promise.all([
        storage.getItem(ACCESS_TOKEN_KEY),
        storage.getItem(REFRESH_TOKEN_KEY),
        storage.getItem(ONBOARDING_SEEN_KEY),
        storage.getItem(WELCOME_SEEN_KEY),
      ]);
      set({
        accessToken,
        refreshToken,
        hasSeenOnboarding: hasSeenOnboardingRaw === "true",
        hasSeenWelcome: hasSeenWelcomeRaw === "true",
        isBootstrapped: true,
      });

      // Profile lives only in memory, so a cold restart otherwise leaves it
      // null even with a valid session — backfill it from the server so
      // Splash doesn't route a returning user back into onboarding.
      if (accessToken) {
        const user = await getMe().catch(() => null);
        if (user) set({ profile: mapUserToProfile(user) });
      }
    } catch {
      set({ accessToken: null, refreshToken: null, hasSeenOnboarding: false, isBootstrapped: true });
    }
  },

  logOut: async () => {
    const { refreshToken } = get();
    // Best-effort — revoking the server-side session shouldn't block a local
    // logout if the network is down or the token's already expired.
    if (refreshToken) await apiLogout(refreshToken).catch(() => undefined);
    await storage.removeItem(ACCESS_TOKEN_KEY).catch(() => undefined);
    await storage.removeItem(REFRESH_TOKEN_KEY).catch(() => undefined);
    set({ accessToken: null, refreshToken: null, profile: null });
  },

  logOutAllDevices: async () => {
    await apiLogoutAll().catch(() => undefined);
    await storage.removeItem(ACCESS_TOKEN_KEY).catch(() => undefined);
    await storage.removeItem(REFRESH_TOKEN_KEY).catch(() => undefined);
    set({ accessToken: null, refreshToken: null, profile: null });
  },
}));
