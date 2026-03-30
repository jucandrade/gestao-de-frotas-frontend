import { SupplierContact, SupplierContactPayload } from "@/types/supplier.types";

export async function createSupplierContact(data: SupplierContactPayload): Promise<SupplierContact> {
  const response = await fetch("/api/supplier-contacts", {
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

export async function getSupplierContacts(supplierId: string): Promise<SupplierContact[]> {
  const response = await fetch(`/api/supplier-contacts?supplierId=${encodeURIComponent(supplierId)}`);

  if (!response.ok) {
    const error = await response.json().catch(() => null);
    const message = error?.message || `Erro HTTP ${response.status}`;
    const err = new Error(message);
    (err as Error & { statusCode?: number }).statusCode = response.status;
    throw err;
  }

  return response.json();
}

export async function updateSupplierContact(id: string, data: Partial<SupplierContactPayload>): Promise<SupplierContact> {
  const response = await fetch(`/api/supplier-contacts/${id}`, {
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

export async function deleteSupplierContact(id: string): Promise<void> {
  const response = await fetch(`/api/supplier-contacts/${id}`, {
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
