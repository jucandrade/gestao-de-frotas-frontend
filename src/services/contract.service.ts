import { Contract, ContractPayload } from "@/types/contract.types";

export async function createContract(data: ContractPayload): Promise<Contract> {
  const response = await fetch("/api/contracts", {
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

export async function getContracts(): Promise<Contract[]> {
  const response = await fetch("/api/contracts");

  if (!response.ok) {
    const error = await response.json().catch(() => null);
    const message = error?.message || `Erro HTTP ${response.status}`;
    const err = new Error(message);
    (err as Error & { statusCode?: number }).statusCode = response.status;
    throw err;
  }

  return response.json();
}

export async function getContract(id: string): Promise<Contract> {
  const response = await fetch(`/api/contracts/${id}`);

  if (!response.ok) {
    const error = await response.json().catch(() => null);
    const message = error?.message || `Erro HTTP ${response.status}`;
    const err = new Error(message);
    (err as Error & { statusCode?: number }).statusCode = response.status;
    throw err;
  }

  return response.json();
}

export async function updateContract(id: string, data: ContractPayload): Promise<Contract> {
  const response = await fetch(`/api/contracts/${id}`, {
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

export async function deleteContract(id: string): Promise<void> {
  const response = await fetch(`/api/contracts/${id}`, {
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
