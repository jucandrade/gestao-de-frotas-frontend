---
description: "Use when creating or editing multi-step forms with React Hook Form, stepper navigation, per-step validation, masks, and toast notifications."
applyTo: "src/**/components/*Form.tsx"
---

# Multi-Step Form Guidelines

## Form Container Pattern
- Use `useForm` with `zodResolver(<entity>Schema)`, `mode: "onTouched"`, all `defaultValues` set
- Track `currentStep` with `useState(0)`
- Track `isSubmitting` with `useState(false)`

## Step Validation
- Define `STEP_FIELDS: Record<number, (keyof FormData)[]>` mapping each step index to its field names
- Before advancing: `const isValid = await form.trigger(STEP_FIELDS[currentStep])`
- Only advance if `isValid` is true

## Stepper UI
- Numbered circles: active = `bg-black text-white`, completed = `bg-black/10`, future = `bg-gray-100 text-gray-400`
- Clicking a completed step navigates back; future steps are disabled
- Divider line between steps: completed = `bg-black`, pending = `bg-gray-200`

## Navigation Buttons
- "Voltar" (back): `border border-gray-300`, hidden (via `disabled:invisible`) on first step
- "Próximo" (next): `bg-black text-white`, shows on all steps except last
- "Cadastrar" (submit): `bg-black text-white` with loading spinner, shows only on last step

## Error Handling
- `toast.success()` on successful submission, then `form.reset()` and `setCurrentStep(0)`
- `toast.error()` with specific message for 409 (duplicate) and generic for other errors
- Always wrap in `try/catch/finally` with `setIsSubmitting(false)` in finally

## Step Components
- Each step receives `form: UseFormReturn<FormData>` as single prop
- Destructure `register`, `formState: { errors }`, `watch`, `setValue` as needed
- Use responsive grid layout: `grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3`
