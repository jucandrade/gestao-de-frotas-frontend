import { NextRequest, NextResponse } from "next/server";
import { API_URL, getAuthHeader } from "@/lib/api-proxy";

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const response = await fetch(`${API_URL}/suppliers/${id}`, {
      headers: { ...getAuthHeader(request) },
    });
    const data = await response.json().catch(() => null);

    if (!response.ok) {
      return NextResponse.json(data ?? { message: "Fornecedor não encontrado" }, { status: response.status });
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

    const response = await fetch(`${API_URL}/suppliers/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json", ...getAuthHeader(request) },
      body: JSON.stringify(body),
    });

    const data = await response.json().catch(() => null);

    if (!response.ok) {
      return NextResponse.json(data ?? { message: "Erro ao atualizar fornecedor" }, { status: response.status });
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

    const response = await fetch(`${API_URL}/suppliers/${id}`, {
      method: "DELETE",
      headers: { ...getAuthHeader(request) },
    });

    if (!response.ok) {
      const data = await response.json().catch(() => null);
      return NextResponse.json(data ?? { message: "Erro ao excluir fornecedor" }, { status: response.status });
    }

    return NextResponse.json({ message: "Fornecedor excluido com sucesso" });
  } catch {
    return NextResponse.json({ message: "Falha de comunicação com o servidor." }, { status: 500 });
  }
}
