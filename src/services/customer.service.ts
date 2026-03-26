import { Customer, CustomerPayload } from "@/types/customer.types";

export async function createCustomer(data: CustomerPayload): Promise<Customer> {
  const response = await fetch("/api/customers", {
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

export async function getCustomers(): Promise<Customer[]> {
  const response = await fetch("/api/customers");

  if (!response.ok) {
    const error = await response.json().catch(() => null);
    const message = error?.message || `Erro HTTP ${response.status}`;
    const err = new Error(message);
    (err as Error & { statusCode?: number }).statusCode = response.status;
    throw err;
  }

  return response.json();
}

export async function getCustomer(id: string): Promise<Customer> {
  const response = await fetch(`/api/customers/${id}`);

  if (!response.ok) {
    const error = await response.json().catch(() => null);
    const message = error?.message || `Erro HTTP ${response.status}`;
    const err = new Error(message);
    (err as Error & { statusCode?: number }).statusCode = response.status;
    throw err;
  }

  return response.json();
}

export async function updateCustomer(id: string, data: CustomerPayload): Promise<Customer> {
  const response = await fetch(`/api/customers/${id}`, {
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

export async function deleteCustomer(id: string): Promise<void> {
  const response = await fetch(`/api/customers/${id}`, {
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