export interface AuthUser {
  id: number;
  name: string;
  email: string;
  username: string;
  isMaster: boolean;
  permissions: string[];
}

const DEFAULT_BASIC_USER = "clinica-api";
const DEFAULT_BASIC_PASSWORD = "senha-super-segura";

export const SESSION_COOKIE_NAME = "cognito_access_token";
export const REFRESH_COOKIE_NAME = "cognito_refresh_token";
export const SESSION_SUB_COOKIE_NAME = "cognito_session_sub";

export function getBasicAuthHeaderValue() {
  const username = process.env.API_BASIC_AUTH_USER ?? DEFAULT_BASIC_USER;
  const password =
    process.env.API_BASIC_AUTH_PASSWORD ?? DEFAULT_BASIC_PASSWORD;
  return `Basic ${Buffer.from(`${username}:${password}`).toString("base64")}`;
}

export function getAuthLoginUrl() {
  return process.env.AUTH_LOGIN_URL ?? "http://localhost:3050/auth/login";
}

export function getUsersMeUrl() {
  return process.env.USERS_ME_URL ?? "http://localhost:3050/users/me";
}

export function getAuthRefreshUrl() {
  return process.env.AUTH_REFRESH_URL ?? "http://localhost:3050/auth/refresh";
}

export function getAuthRequestPasswordChangeUrl() {
  return (
    process.env.AUTH_REQUEST_PASSWORD_CHANGE_URL ??
    "http://localhost:3050/auth/request-password-change"
  );
}

export function getAuthChangePasswordUrl() {
  return (
    process.env.AUTH_CHANGE_PASSWORD_URL ??
    "http://localhost:3050/auth/change-password"
  );
}

export function buildTokenHeaders(token: string) {
  return {
    "x-access-token": token,
    Authorization: getBasicAuthHeaderValue(),
    "Content-Type": "application/json",
  };
}

export function extractTokenFromResponse(payload: unknown): string | null {
  if (!payload || typeof payload !== "object") return null;

  const candidates = [
    "token",
    "accessToken",
    "idToken",
    "jwt",
    "access_token",
    "id_token",
  ];

  const queue: unknown[] = [payload];
  let depth = 0;

  while (queue.length && depth < 3) {
    const levelSize = queue.length;
    for (let i = 0; i < levelSize; i += 1) {
      const current = queue.shift();
      if (!current || typeof current !== "object") continue;

      for (const key of candidates) {
        const value = (current as Record<string, unknown>)[key];
        if (typeof value === "string" && value.length > 0) {
          return value;
        }
      }

      for (const value of Object.values(current as Record<string, unknown>)) {
        if (value && typeof value === "object") {
          queue.push(value);
        }
      }
    }
    depth += 1;
  }

  return null;
}

export function extractRefreshTokenFromResponse(
  payload: unknown,
): string | null {
  if (!payload || typeof payload !== "object") return null;

  const candidates = ["refreshToken", "refresh_token"];
  const queue: unknown[] = [payload];
  let depth = 0;

  while (queue.length && depth < 3) {
    const levelSize = queue.length;
    for (let i = 0; i < levelSize; i += 1) {
      const current = queue.shift();
      if (!current || typeof current !== "object") continue;

      for (const key of candidates) {
        const value = (current as Record<string, unknown>)[key];
        if (typeof value === "string" && value.length > 0) {
          return value;
        }
      }

      for (const value of Object.values(current as Record<string, unknown>)) {
        if (value && typeof value === "object") {
          queue.push(value);
        }
      }
    }
    depth += 1;
  }

  return null;
}

export function getJwtMaxAge(token: string) {
  const parts = token.split(".");
  if (parts.length < 2) return 60 * 60;

  try {
    const payload = JSON.parse(
      Buffer.from(parts[1], "base64url").toString("utf-8"),
    ) as { exp?: number };

    if (!payload.exp) return 60 * 60;

    const now = Math.floor(Date.now() / 1000);
    const remaining = payload.exp - now;
    return remaining > 0 ? remaining : 60 * 60;
  } catch {
    return 60 * 60;
  }
}

export function normalizeUser(payload: unknown): AuthUser | null {
  if (!payload || typeof payload !== "object") return null;
  const data = (payload as Record<string, unknown>).data;
  if (!data || typeof data !== "object") return null;

  const value = data as Record<string, unknown>;

  if (
    typeof value.id !== "number" ||
    typeof value.name !== "string" ||
    typeof value.email !== "string" ||
    typeof value.username !== "string" ||
    typeof value.isMaster !== "boolean"
  ) {
    return null;
  }

  const permissions = Array.isArray(value.permissions)
    ? value.permissions.filter(
        (item): item is string => typeof item === "string",
      )
    : [];

  return {
    id: value.id,
    name: value.name,
    email: value.email,
    username: value.username,
    isMaster: value.isMaster,
    permissions,
  };
}
