import { cookies } from "next/headers"
import { NextResponse } from "next/server"
import {
  extractRefreshTokenFromResponse,
  extractTokenFromResponse,
  getAuthRefreshUrl,
  getBasicAuthHeaderValue,
  getJwtMaxAge,
  REFRESH_COOKIE_NAME,
  SESSION_COOKIE_NAME,
  SESSION_SUB_COOKIE_NAME,
} from "@/lib/auth"

export async function POST() {
  const cookieStore = await cookies()
  const accessToken = cookieStore.get(SESSION_COOKIE_NAME)?.value
  const refreshToken = cookieStore.get(REFRESH_COOKIE_NAME)?.value
  const sub = cookieStore.get(SESSION_SUB_COOKIE_NAME)?.value

  if (!accessToken || !refreshToken || !sub) {
    return NextResponse.json(
      { message: "Dados insuficientes para refresh da sessão." },
      { status: 401 },
    )
  }

  const refreshResponse = await fetch(getAuthRefreshUrl(), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-access-token": accessToken,
      Authorization: getBasicAuthHeaderValue(),
    },
    body: JSON.stringify({ sub, refreshToken }),
    cache: "no-store",
  })

  const payload = await refreshResponse.json().catch(() => ({}))
  if (!refreshResponse.ok) {
    return NextResponse.json(
      { message: "Não foi possível renovar a sessão.", details: payload },
      { status: refreshResponse.status },
    )
  }

  const newAccessToken = extractTokenFromResponse(payload)
  if (!newAccessToken) {
    return NextResponse.json(
      { message: "Token de acesso ausente na resposta do refresh." },
      { status: 502 },
    )
  }

  const newRefreshToken = extractRefreshTokenFromResponse(payload) ?? refreshToken

  cookieStore.set(SESSION_COOKIE_NAME, newAccessToken, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: getJwtMaxAge(newAccessToken),
  })
  cookieStore.set(REFRESH_COOKIE_NAME, newRefreshToken, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  })

  return NextResponse.json({ success: true })
}
