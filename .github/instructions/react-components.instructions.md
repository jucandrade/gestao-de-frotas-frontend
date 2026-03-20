---
description: "Use when creating or editing React components in this project. Covers component patterns, client directives, Tailwind styling, and TypeScript conventions."
applyTo: "src/**/*.tsx"
---

# React Component Guidelines

## Structure
- One component per file, named export or default export matching filename
- `"use client"` directive at the top of any file using hooks (`useState`, `useEffect`, `useForm`, etc.)
- Server components (no hooks) do NOT need `"use client"`

## TypeScript
- Define explicit interfaces for all props — never use `any`
- Use `React.ChangeEvent<HTMLInputElement>` etc. for event types
- Export types when shared across files

## Styling
- Tailwind CSS utility classes only — no CSS modules, no inline `style`
- Mobile-first: base classes for mobile, `sm:`, `md:`, `lg:` for breakpoints
- Design tokens: black primary buttons, `gray-50` backgrounds, `gray-200` borders, `red-500` for errors

## Naming
- Component/file names: PascalCase (`CompanyForm.tsx`)
- Variables and functions: camelCase in English
- UI labels, placeholders, error messages: Portuguese (pt-BR)

## Imports
- Use `@/*` path alias for `src/` imports
- Relative imports only within the same feature folder
