import { NextRequest, NextResponse } from "next/server";
import { API_URL, getAuthHeader } from "@/lib/api-proxy";

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const response = await fetch(`${API_URL}/supplier-contacts/${id}`, {
      headers: { ...getAuthHeader(request) },
    });
    const data = await response.json().catch(() => null);

    if (!response.ok) {
      return NextResponse.json(data ?? { message: "Contato não encontrado" }, { status: response.status });
    }

    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ message: "Falha de comunicação com o servidor." }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const response = await fetch(`${API_URL}/supplier-contacts/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json", ...getAuthHeader(request) },
      body: JSON.stringify(body),
    });

    const data = await response.json().catch(() => null);

    if (!response.ok) {
      return NextResponse.json(data ?? { message: "Erro ao atualizar contato" }, { status: response.status });
    }

    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ message: "Falha de comunicação com o servidor." }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const response = await fetch(`${API_URL}/supplier-contacts/${id}`, {
      method: "DELETE",
      headers: { ...getAuthHeader(request) },
    });

    if (!response.ok) {
      const data = await response.json().catch(() => null);
      return NextResponse.json(data ?? { message: "Erro ao excluir contato" }, { status: response.status });
    }

    return new NextResponse(null, { status: 204 });
  } catch {
    return NextResponse.json({ message: "Falha de comunicação com o servidor." }, { status: 500 });
  }
}
