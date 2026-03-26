import { z } from "zod";

const optionalString = z.string().optional().or(z.literal(""));

export const vehicleSchema = z.object({
  plate: z.string().min(1, "Placa é obrigatória"),
  chassis: optionalString,
  prefix: optionalString,
  manufacturer: optionalString,
  model: optionalString,
  year: optionalString.refine((v) => {
    if (!v) return true;
    const n = Number(v);
    return !Number.isNaN(n) && n >= 1900 && n <= 2100;
  }, "Ano deve estar entre 1900 e 2100"),
  color: optionalString,
  fuel: optionalString,
  renavam: optionalString,
  status: optionalString,
  customerId: optionalString,
});

export type VehicleFormValues = z.infer<typeof vehicleSchema>;
