import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import {
  buildTokenHeaders,
  extractRefreshTokenFromResponse,
  extractTokenFromResponse,
  getAuthLoginUrl,
  getBasicAuthHeaderValue,
  getJwtMaxAge,
  getUsersMeUrl,
  normalizeUser,
  REFRESH_COOKIE_NAME,
  SESSION_COOKIE_NAME,
  SESSION_SUB_COOKIE_NAME,
} from "@/lib/auth";

interface LoginRequestBody {
  email?: string;
  password?: string;
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as LoginRequestBody;

    if (!body.email || !body.password) {
      return NextResponse.json(
        { message: "E-mail e senha são obrigatórios." },
        { status: 400 },
      );
    }

    const loginResponse = await fetch(getAuthLoginUrl(), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: getBasicAuthHeaderValue(),
      },
      body: JSON.stringify({
        email: body.email,
        password: body.password,
      }),
      cache: "no-store",
    });

    const loginPayload = await loginResponse.json().catch(() => ({}));
    if (!loginResponse.ok) {
      return NextResponse.json(
        { message: "Email ou senha incorretos.", details: loginPayload },
        { status: loginResponse.status },
      );
    }

    const token = extractTokenFromResponse(loginPayload);
    const refreshToken = extractRefreshTokenFromResponse(loginPayload);
    if (!token) {
      return NextResponse.json(
        { message: "Token Cognito não encontrado na resposta de login." },
        { status: 502 },
      );
    }

    const meResponse = await fetch(getUsersMeUrl(), {
      method: "GET",
      headers: buildTokenHeaders(token),
      cache: "no-store",
    });

    const mePayload = await meResponse.json().catch(() => ({}));
    if (!meResponse.ok) {
      return NextResponse.json(
        {
          message: "Login ok, mas falhou ao carregar usuário.",
          details: mePayload,
        },
        { status: meResponse.status },
      );
    }

    const user = normalizeUser(mePayload);
    if (!user) {
      return NextResponse.json(
        { message: "Formato inválido no retorno de users/me." },
        { status: 502 },
      );
    }

    const cookieStore = await cookies();
    cookieStore.set(SESSION_COOKIE_NAME, token, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: getJwtMaxAge(token),
    });
    if (refreshToken) {
      cookieStore.set(REFRESH_COOKIE_NAME, refreshToken, {
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        path: "/",
        maxAge: 60 * 60 * 24 * 30,
      });
    }
    cookieStore.set(SESSION_SUB_COOKIE_NAME, user.username, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 30,
    });

    return NextResponse.json({ user });
  } catch {
    return NextResponse.json(
      { message: "Erro inesperado durante o login." },
      { status: 500 },
    );
  }
}
