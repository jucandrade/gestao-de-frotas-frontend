import { NextRequest, NextResponse } from "next/server";

function getApiUrl() {
  const url = process.env.API_URL ?? process.env.NEXT_PUBLIC_API_URL;
  if (!url) {
    throw new Error("API_URL not configured");
  }
  return url.replace(/\/$/, "");
}

export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const apiUrl = getApiUrl();
    const { id } = await params;
    const response = await fetch(`${apiUrl}/companies/${id}`);
    const data = await response.json().catch(() => null);

    if (!response.ok) {
      return NextResponse.json(data ?? { message: "Empresa não encontrada" }, { status: response.status });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error(`[GET /api/companies/:id]`, error);
    return NextResponse.json({ message: "Falha de comunicação com o servidor." }, { status: 502 });
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const apiUrl = getApiUrl();
    const { id } = await params;
    const body = await request.json();

    const response = await fetch(`${apiUrl}/companies/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const data = await response.json().catch(() => null);

    if (!response.ok) {
      return NextResponse.json(data ?? { message: "Erro ao atualizar empresa" }, { status: response.status });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error(`[PUT /api/companies/:id]`, error);
    return NextResponse.json({ message: "Falha de comunicação com o servidor." }, { status: 502 });
  }
}

export async function DELETE(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const apiUrl = getApiUrl();
    const { id } = await params;
    const response = await fetch(`${apiUrl}/companies/${id}`, { method: "DELETE" });

    if (!response.ok) {
      const data = await response.json().catch(() => null);
      return NextResponse.json(data ?? { message: "Erro ao excluir empresa" }, { status: response.status });
    }

    return NextResponse.json({ message: "Empresa excluída com sucesso" });
  } catch (error) {
    console.error(`[DELETE /api/companies/:id]`, error);
    return NextResponse.json({ message: "Falha de comunicação com o servidor." }, { status: 502 });
  }
}
