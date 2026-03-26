import { UserProfile, UserProfilePayload } from "@/types/user-profile.types";

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const response = await fetch(path, options);
  const data = await response.json().catch(() => null);

  if (!response.ok) {
    const message = data?.message ?? "Erro na requisição";
    throw new Error(Array.isArray(message) ? message.join(", ") : message);
  }

  return data as T;
}

export async function getUserProfiles(): Promise<UserProfile[]> {
  return request<UserProfile[]>("/api/user-profiles");
}

export async function getUserProfile(id: string): Promise<UserProfile> {
  return request<UserProfile>(`/api/user-profiles/${id}`);
}

export async function createUserProfile(payload: UserProfilePayload): Promise<UserProfile> {
  return request<UserProfile>("/api/user-profiles", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
}

export async function updateUserProfile(id: string, payload: Partial<UserProfilePayload>): Promise<UserProfile> {
  return request<UserProfile>(`/api/user-profiles/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
}

export async function deleteUserProfile(id: string): Promise<void> {
  await request<void>(`/api/user-profiles/${id}`, { method: "DELETE" });
}
