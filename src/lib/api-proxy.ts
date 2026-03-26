import { NextRequest } from "next/server";

export const API_URL =
  process.env.NEXT_PUBLIC_API_URL || process.env.API_URL || "http://localhost:3001";

export function getAuthHeader(request: NextRequest): Record<string, string> {
  const token = request.cookies.get("auth_token")?.value;
  return token ? { Authorization: `Bearer ${token}` } : {};
}
