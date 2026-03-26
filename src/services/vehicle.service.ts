import { Vehicle, VehiclePayload } from "@/types/vehicle.types";

async function request<T>(url: string, init?: RequestInit): Promise<T> {
  const response = await fetch(url, init);
  if (!response.ok) {
    const error = await response.json().catch(() => null);
    const message = error?.message ?? `Erro HTTP ${response.status}`;
    const err = new Error(message);
    (err as Error & { statusCode?: number }).statusCode = response.status;
    throw err;
  }
  if (response.status === 204) return undefined as T;
  return response.json();
}

export async function getVehicles(customerId?: string): Promise<Vehicle[]> {
  const qs = customerId ? `?customerId=${encodeURIComponent(customerId)}` : "";
  return request(`/api/vehicles${qs}`);
}

export async function getVehicle(id: string): Promise<Vehicle> {
  return request(`/api/vehicles/${id}`);
}

export async function createVehicle(data: VehiclePayload): Promise<Vehicle> {
  return request("/api/vehicles", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
}

export async function updateVehicle(id: string, data: VehiclePayload): Promise<Vehicle> {
  return request(`/api/vehicles/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
}

export async function deleteVehicle(id: string): Promise<void> {
  return request(`/api/vehicles/${id}`, { method: "DELETE" });
}
