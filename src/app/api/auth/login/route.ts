import { NextRequest, NextResponse } from "next/server";
import { API_URL } from "@/lib/api-proxy";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const response = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const data = await response.json().catch(() => null);

    if (!response.ok) {
      return NextResponse.json(
        data ?? { message: "E-mail ou senha inválidos" },
        { status: response.status }
      );
    }

    const res = NextResponse.json({ user: data.user });

    // Store token in httpOnly cookie (not accessible via JS)
    res.cookies.set("auth_token", data.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 8, // 8 hours
    });

    return res;
  } catch {
    return NextResponse.json(
      { message: "Falha de comunicação com o servidor." },
      { status: 500 }
    );
  }
}
