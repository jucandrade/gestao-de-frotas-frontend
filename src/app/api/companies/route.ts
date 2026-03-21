import { NextRequest, NextResponse } from "next/server";

function getApiUrl() {
  const url = process.env.API_URL ?? process.env.NEXT_PUBLIC_API_URL;
  if (!url) {
    throw new Error("API_URL not configured");
  }
  return url.replace(/\/$/, "");
}

export async function GET() {
  try {
    const apiUrl = getApiUrl();
    const response = await fetch(`${apiUrl}/companies`);
    const data = await response.json().catch(() => null);

    if (!response.ok) {
      return NextResponse.json(data ?? { message: "Erro ao listar empresas" }, { status: response.status });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("[GET /api/companies]", error);
    return NextResponse.json({ message: "Falha de comunicação com o servidor." }, { status: 502 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const apiUrl = getApiUrl();
    const body = await request.json();

    const response = await fetch(`${apiUrl}/companies`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const data = await response.json().catch(() => null);

    if (!response.ok) {
      return NextResponse.json(data ?? { message: "Erro ao criar empresa" }, { status: response.status });
    }

    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error("[POST /api/companies]", error);
    return NextResponse.json(
      { message: "Falha de comunicação com o servidor." },
      { status: 502 }
    );
  }
}
