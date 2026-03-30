import { Supplier, SupplierPayload } from "@/types/supplier.types";

export async function createSupplier(data: SupplierPayload): Promise<Supplier> {
  const response = await fetch("/api/suppliers", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => null);
    const message = error?.message || `Erro HTTP ${response.status}`;
    const err = new Error(message);
    (err as Error & { statusCode?: number }).statusCode = response.status;
    throw err;
  }

  return response.json();
}

export async function getSuppliers(): Promise<Supplier[]> {
  const response = await fetch("/api/suppliers");

  if (!response.ok) {
    const error = await response.json().catch(() => null);
    const message = error?.message || `Erro HTTP ${response.status}`;
    const err = new Error(message);
    (err as Error & { statusCode?: number }).statusCode = response.status;
    throw err;
  }

  return response.json();
}

export async function getSupplier(id: string): Promise<Supplier> {
  const response = await fetch(`/api/suppliers/${id}`);

  if (!response.ok) {
    const error = await response.json().catch(() => null);
    const message = error?.message || `Erro HTTP ${response.status}`;
    const err = new Error(message);
    (err as Error & { statusCode?: number }).statusCode = response.status;
    throw err;
  }

  return response.json();
}

export async function updateSupplier(id: string, data: SupplierPayload): Promise<Supplier> {
  const response = await fetch(`/api/suppliers/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => null);
    const message = error?.message || `Erro HTTP ${response.status}`;
    const err = new Error(message);
    (err as Error & { statusCode?: number }).statusCode = response.status;
    throw err;
  }

  return response.json();
}

export async function deleteSupplier(id: string): Promise<void> {
  const response = await fetch(`/api/suppliers/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    const error = await response.json().catch(() => null);
    const message = error?.message || `Erro HTTP ${response.status}`;
    const err = new Error(message);
    (err as Error & { statusCode?: number }).statusCode = response.status;
    throw err;
  }
}
