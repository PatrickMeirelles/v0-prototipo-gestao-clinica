import { cookies } from "next/headers"
import { NextResponse } from "next/server"
import {
  getAuthChangePasswordUrl,
  getBasicAuthHeaderValue,
  SESSION_COOKIE_NAME,
} from "@/lib/auth"

interface ChangePasswordBody {
  code?: string
  oldPassword?: string
  newPassword?: string
}

export async function POST(req: Request) {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get(SESSION_COOKIE_NAME)?.value

    if (!token) {
      return NextResponse.json(
        { message: "Sessão não autenticada." },
        { status: 401 },
      )
    }

    const body = (await req.json()) as ChangePasswordBody

    if (!body.code || !body.oldPassword || !body.newPassword) {
      return NextResponse.json(
        { message: "code, oldPassword e newPassword são obrigatórios." },
        { status: 400 },
      )
    }

    const response = await fetch(getAuthChangePasswordUrl(), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-access-token": token,
        Authorization: getBasicAuthHeaderValue(),
      },
      body: JSON.stringify({
        code: body.code,
        oldPassword: body.oldPassword,
        newPassword: body.newPassword,
      }),
      cache: "no-store",
    })

    const payload = await response.json().catch(() => ({}))

    if (!response.ok) {
      return NextResponse.json(
        {
          message: "Não foi possível alterar a senha.",
          details: payload,
        },
        { status: response.status },
      )
    }

    return NextResponse.json({ success: true, ...payload })
  } catch {
    return NextResponse.json(
      { message: "Erro inesperado ao alterar a senha." },
      { status: 500 },
    )
  }
}

