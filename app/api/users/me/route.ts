import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import {
  buildTokenHeaders,
  extractRefreshTokenFromResponse,
  extractTokenFromResponse,
  getAuthRefreshUrl,
  getBasicAuthHeaderValue,
  getJwtMaxAge,
  getUsersMeUrl,
  normalizeUser,
  REFRESH_COOKIE_NAME,
  SESSION_COOKIE_NAME,
  SESSION_SUB_COOKIE_NAME,
} from "@/lib/auth";

export async function GET() {
  const cookieStore = await cookies();
  let token = cookieStore.get(SESSION_COOKIE_NAME)?.value;

  if (!token) {
    return NextResponse.json(
      { message: "Sessão não autenticada." },
      { status: 401 },
    );
  }

  let response = await fetch(getUsersMeUrl(), {
    method: "GET",
    headers: buildTokenHeaders(token),
    cache: "no-store",
  });

  let payload = await response.json().catch(() => ({}));
  if (response.status === 401 || response.status === 403) {
    const refreshToken = cookieStore.get(REFRESH_COOKIE_NAME)?.value;
    const sub = cookieStore.get(SESSION_SUB_COOKIE_NAME)?.value;

    if (refreshToken && sub) {
      const refreshResponse = await fetch(getAuthRefreshUrl(), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-access-token": token,
          Authorization: getBasicAuthHeaderValue(),
        },
        body: JSON.stringify({ sub, refreshToken }),
        cache: "no-store",
      });

      const refreshPayload = await refreshResponse.json().catch(() => ({}));
      if (refreshResponse.ok) {
        const refreshedToken = extractTokenFromResponse(refreshPayload);
        if (refreshedToken) {
          const refreshedRefreshToken =
            extractRefreshTokenFromResponse(refreshPayload) ?? refreshToken;

          cookieStore.set(SESSION_COOKIE_NAME, refreshedToken, {
            httpOnly: true,
            sameSite: "lax",
            secure: process.env.NODE_ENV === "production",
            path: "/",
            maxAge: getJwtMaxAge(refreshedToken),
          });
          cookieStore.set(REFRESH_COOKIE_NAME, refreshedRefreshToken, {
            httpOnly: true,
            sameSite: "lax",
            secure: process.env.NODE_ENV === "production",
            path: "/",
            maxAge: 60 * 60 * 24 * 30,
          });
          token = refreshedToken;

          response = await fetch(getUsersMeUrl(), {
            method: "GET",
            headers: buildTokenHeaders(token),
            cache: "no-store",
          });
          payload = await response.json().catch(() => ({}));
        }
      }
    }
  }

  if (!response.ok) {
    return NextResponse.json(
      { message: "Não foi possível obter dados do usuário.", details: payload },
      { status: response.status },
    );
  }

  const user = normalizeUser(payload);
  if (!user) {
    return NextResponse.json(
      { message: "Formato inválido no retorno de users/me." },
      { status: 502 },
    );
  }

  return NextResponse.json({ user });
}
