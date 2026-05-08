import { cookies } from "next/headers"
import { NextResponse } from "next/server"
import {
  getAuthRequestPasswordChangeUrl,
  getBasicAuthHeaderValue,
  SESSION_COOKIE_NAME,
} from "@/lib/auth"

export async function POST() {
  const cookieStore = await cookies()
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value

  if (!token) {
    return NextResponse.json(
      { message: "Sessão não autenticada." },
      { status: 401 },
    )
  }

  const response = await fetch(getAuthRequestPasswordChangeUrl(), {
    method: "POST",
    headers: {
      "x-access-token": token,
      Authorization: getBasicAuthHeaderValue(),
    },
    cache: "no-store",
  })

  const payload = await response.json().catch(() => ({}))

  if (!response.ok) {
    return NextResponse.json(
      { message: "Não foi possível solicitar troca de senha.", details: payload },
      { status: response.status },
    )
  }

  return NextResponse.json({ success: true, ...payload })
}

