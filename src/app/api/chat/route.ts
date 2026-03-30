import { NextRequest, NextResponse } from "next/server";
import { API_URL, getAuthHeader } from "@/lib/api-proxy";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const response = await fetch(`${API_URL}/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...getAuthHeader(request) },
      body: JSON.stringify(body),
    });

    const data = await response.json().catch(() => null);

    if (!response.ok) {
      return NextResponse.json(
        data ?? { message: "Erro ao comunicar com o chatbot" },
        { status: response.status }
      );
    }

    return NextResponse.json(data);
  } catch {
    return NextResponse.json(
      { message: "Falha de comunicação com o backend." },
      { status: 500 }
    );
  }
}
