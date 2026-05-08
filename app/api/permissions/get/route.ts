import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { SESSION_COOKIE_NAME, buildTokenHeaders } from "@/lib/auth";

const BACKEND_URL = "http://localhost:3050";

export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;

  if (!token) {
    return NextResponse.json({ message: "Não autorizado" }, { status: 401 });
  }

  try {
    const response = await fetch(`${BACKEND_URL}/permissions`, {
      method: "GET",
      headers: buildTokenHeaders(token),
    });

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { message: "Erro ao buscar permissões" },
      { status: 500 },
    );
  }
}
