import { User, UserPayload } from "@/types/user.types";

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const response = await fetch(path, options);
  const data = await response.json().catch(() => null);

  if (!response.ok) {
    const message = data?.message ?? "Erro na requisição";
    throw new Error(Array.isArray(message) ? message.join(", ") : message);
  }

  return data as T;
}

export async function getUsers(): Promise<User[]> {
  return request<User[]>("/api/users");
}

export async function getUser(id: string): Promise<User> {
  return request<User>(`/api/users/${id}`);
}

export async function createUser(payload: UserPayload): Promise<User> {
  return request<User>("/api/users", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
}

export async function updateUser(id: string, payload: Partial<UserPayload>): Promise<User> {
  return request<User>(`/api/users/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
}

export async function deleteUser(id: string): Promise<void> {
  await request<void>(`/api/users/${id}`, { method: "DELETE" });
}
