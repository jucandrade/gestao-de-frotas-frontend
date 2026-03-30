import { z } from "zod";

const optionalString = z.string().optional().or(z.literal(""));

export const supplierSchema = z.object({
  code: optionalString,
  name: z.string().min(1, "Nome é obrigatório"),
  tradeName: optionalString,
  supplierType: optionalString,
  contactName: optionalString,
  quotationContact: optionalString,
  personType: z.enum(["Juridica", "Fisica"]).optional().or(z.literal("")),
  cnpj: optionalString,
  cpf: optionalString,
  stateRegistration: optionalString,
  ieIndicator: optionalString,
  rg: optionalString,
  zipCode: optionalString,
  streetType: optionalString,
  street: optionalString,
  number: optionalString,
  complement: optionalString,
  neighborhood: optionalString,
  city: optionalString,
  state: optionalString,
  stateName: optionalString,
  email: z.string().email("E-mail inválido").optional().or(z.literal("")),
  phone: optionalString,
  phone2: optionalString,
  mobile: optionalString,
  fax: optionalString,
  paymentCondition: optionalString,
  paymentDescription: optionalString,
  discountPercentage: optionalString.refine((value) => {
    if (!value) return true;
    const parsed = Number(value.replace(",", "."));
    return !Number.isNaN(parsed) && parsed >= 0 && parsed <= 100;
  }, "Desconto deve estar entre 0 e 100"),
  site: optionalString,
  observations: optionalString,
});

export type SupplierFormValues = z.input<typeof supplierSchema>;

export const supplierContactSchema = z.object({
  sequence: optionalString,
  name: z.string().min(1, "Nome é obrigatório"),
  positionCode: optionalString,
  positionDescription: optionalString,
  phone: optionalString,
  email: z.string().email("E-mail inválido").optional().or(z.literal("")),
  active: z.boolean().default(true),
});

export type SupplierContactFormValues = z.input<typeof supplierContactSchema>;
