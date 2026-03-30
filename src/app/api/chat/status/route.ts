import { NextRequest, NextResponse } from "next/server";
import { API_URL, getAuthHeader } from "@/lib/api-proxy";

export async function GET(request: NextRequest) {
  try {
    const response = await fetch(`${API_URL}/chat/status`, {
      headers: { ...getAuthHeader(request) },
    });
    const data = await response.json().catch(() => null);

    if (!response.ok) {
      return NextResponse.json(data ?? { message: "Erro ao verificar status do chat" }, { status: response.status });
    }

    return NextResponse.json(data);
  } catch {
    return NextResponse.json(
      { message: "Falha de comunicação com o backend." },
      { status: 500 }
    );
  }
}
