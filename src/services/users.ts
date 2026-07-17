import { api } from "./api";

// GET /users/me's response schema isn't published in the API's OpenAPI doc,
// so this is inferred from AuthUserDto plus every field UpdateProfileDto
// accepts — the fields a client can read should be a superset of what it
// can write.
export type UserProfile = {
  id: string;
  role: "USER" | "ADMIN" | "SUPPORT";
  email: string | null;
  username: string | null;
  displayName: string;
  avatarUrl?: string | null;
  avatarColor: string | null;
  bio?: string | null;
  preferredGenres?: string[];
  dateOfBirth?: string | null;
  emailVerified: boolean;
};

export function getMe() {
  return api.get<UserProfile>("/users/me");
}

export type UpdateProfilePayload = Partial<{
  displayName: string;
  username: string;
  avatarUrl: string;
  avatarColor: string;
  bio: string;
  preferredGenres: string[];
}>;

export function updateMe(payload: UpdateProfilePayload) {
  return api.patch<UserProfile>("/users/me", payload);
}
