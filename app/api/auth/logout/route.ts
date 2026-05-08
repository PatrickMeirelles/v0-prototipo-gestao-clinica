import { cookies } from "next/headers"
import { NextResponse } from "next/server"
import {
  REFRESH_COOKIE_NAME,
  SESSION_COOKIE_NAME,
  SESSION_SUB_COOKIE_NAME,
} from "@/lib/auth"

export async function POST() {
  const cookieStore = await cookies()
  cookieStore.delete(SESSION_COOKIE_NAME)
  cookieStore.delete(REFRESH_COOKIE_NAME)
  cookieStore.delete(SESSION_SUB_COOKIE_NAME)

  return NextResponse.json({ success: true })
}
