import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { SESSION_COOKIE_NAME, buildTokenHeaders } from "@/lib/auth";
import { Env } from "@/app/env";

export async function POST() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;

  if (token) {
    try {
      await fetch(`${Env.BACKEND_BASE_URL}/auth/logout`, {
        method: "POST",
        headers: buildTokenHeaders(token),
      });
    } catch (error) {
      console.error("Erro ao fazer logout no backend:", error);
    }
  }

  cookieStore.delete(SESSION_COOKIE_NAME);

  return NextResponse.json({
    success: true,
    message: "Logout realizado com sucesso",
  });
}
