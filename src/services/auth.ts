import { api } from "./api";

export type OtpPurpose = "signup" | "login" | "verify" | "reset";

export type AuthUser = {
  id: string;
  role: "USER" | "ADMIN" | "SUPPORT";
  email: string | null;
  username: string | null;
  displayName: string;
  avatarColor: string | null;
  emailVerified: boolean;
};

export type AuthSession = {
  accessToken: string;
  refreshToken: string;
  user: AuthUser;
};

export function requestOtp(identifier: string, purpose: OtpPurpose) {
  return api.post<{ message: string; expiresIn: number }>("/auth/otp/request", { identifier, purpose });
}

export function verifySignupOtp(identifier: string, code: string) {
  return api.post<{ verified: boolean; signupToken: string; expiresIn: number }>("/auth/otp/verify", {
    identifier,
    code,
    purpose: "signup",
  });
}

export function verifyResetOtp(identifier: string, code: string) {
  return api.post<{ verified: boolean; resetToken: string; expiresIn: number }>("/auth/otp/verify", {
    identifier,
    code,
    purpose: "reset",
  });
}

export function checkUsernameAvailable(username: string) {
  return api.get<{ available: boolean }>(`/auth/username-available?username=${encodeURIComponent(username)}`);
}

export type RegisterPayload = {
  fullName: string;
  email: string;
  password: string;
  dateOfBirth: string;
  preferredGenres: string[];
  signupToken: string;
  username: string;
  avatarColor: string;
  bio?: string;
};

export function register(payload: RegisterPayload) {
  return api.post<AuthSession>("/auth/register", payload);
}

export function login(email: string, password: string) {
  return api.post<AuthSession>("/auth/login", { email, password });
}

export function resetPassword(input: { identifier: string; resetToken?: string; code?: string; newPassword: string }) {
  return api.post<{ message: string }>("/auth/reset-password", input);
}

export function refreshTokens(refreshToken: string) {
  return api.post<{ accessToken: string; refreshToken: string }>("/auth/refresh", { refreshToken });
}

export function logout(refreshToken: string) {
  return api.post<{ message: string }>("/auth/logout", { refreshToken });
}

export function logoutAll() {
  return api.post<{ message: string }>("/auth/logout-all");
}
