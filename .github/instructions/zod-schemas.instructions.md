---
description: "Use when creating or editing Zod schemas for form validation. Covers mask stripping, optional fields, and DTO mirroring patterns."
applyTo: "src/**/schemas/*.ts"
---

# Zod Schema Guidelines

## Structure
- One schema file per entity: `<entity>.schema.ts`
- Schema must mirror the backend DTO exactly (same field names)
- Export the schema and the inferred type: `export type <Entity>FormData = z.infer<typeof <entity>Schema>`

## Field Patterns

### Required string
```typescript
z.string().min(1, "Mensagem de erro em português")
```

### Optional string (accepts empty string)
```typescript
z.string().optional().or(z.literal(""))
```

### Masked field (strip mask before validation)
```typescript
z.string()
  .min(1, "Campo obrigatório")
  .transform((val) => val.replace(/\D/g, ""))
  .pipe(z.string().regex(/^\d{14}$/, "Deve conter 14 dígitos"))
```

## Conventions
- Error messages in Portuguese (pt-BR)
- Use `z.object()` with all fields — no partial schemas
- Define a reusable `optionalString` helper when many optional fields exist
