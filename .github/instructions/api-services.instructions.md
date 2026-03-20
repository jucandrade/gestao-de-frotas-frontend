---
description: "Use when creating or editing API service files (fetch calls to backend). Covers fetch patterns, error handling, and environment config."
applyTo: "src/**/services/*.ts"
---

# API Service Guidelines

## Structure
- One service file per entity: `<entity>.service.ts`
- Import the form data type from the schema file

## Pattern

```typescript
const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";

export async function create<Entity>(data: <Entity>FormData) {
  const response = await fetch(`${API_URL}/<entities>`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw error;
  }

  return response.json();
}
```

## Conventions
- Use `fetch` — no axios
- Always check `response.ok` and throw parsed JSON error
- Function name matches the HTTP action: `create<Entity>`, `update<Entity>`, `delete<Entity>`
- Never use `any` — type inputs and outputs
