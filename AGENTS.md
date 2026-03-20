<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Gestão de Frotas — Project Guidelines

## Stack

- **Framework**: Next.js 16 (App Router, `src/` directory)
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS 4
- **Forms**: React Hook Form + @hookform/resolvers + Zod
- **Notifications**: react-hot-toast
- **Input masks**: react-input-mask
- **API**: REST backend at `http://localhost:3001` (env `NEXT_PUBLIC_API_URL`)

## Architecture

```
src/app/
  <entity>/create/           # Feature folder per entity (companies, vehicles, etc.)
    page.tsx                  # Server component — page entry
    components/
      <Entity>Form.tsx        # Client component — multi-step form container
      steps/                  # One component per form step
      ui/                     # Reusable UI primitives (Input, Select, FileUpload)
    schemas/
      <entity>.schema.ts      # Zod schema mirroring backend DTO
    services/
      <entity>.service.ts     # API calls (fetch-based)
```

## Code Conventions

- **Language**: Code in English (variables, components, functions)
- **UI text**: Portuguese (pt-BR) for labels, errors, placeholders
- **No `any`**: Strong typing everywhere
- **`"use client"`**: Required on any component using hooks
- **One component per file**: Always
- **Imports**: Use `@/*` alias for `src/`

## Patterns

### Forms
- Multi-step with visual stepper
- Per-step validation via `form.trigger(fieldsArray)`
- Zod schema strips masks before validating (`.transform()` + `.pipe()`)
- Default values for all fields in `useForm`

### API Service
```typescript
const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";
// POST with fetch, throw parsed JSON on error
```

### UI Components
- `Input`: supports `label`, `name`, `mask`, `error`, `register`
- `Select`: supports `label`, `name`, `options[]`, `error`, `register`
- `FileUpload`: supports `label`, `name`, `error`, `onChange` with image preview

### Design
- Clean, minimal (Uber-inspired)
- Mobile-first responsive grids
- Black primary buttons, gray-50 backgrounds
- Loading spinner on submit, toast on success/error

## Build & Test

```bash
npm run dev       # Dev server
npm run build     # Production build
npm run lint      # ESLint
```
