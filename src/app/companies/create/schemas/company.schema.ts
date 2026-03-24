import { z } from "zod";

const optionalString = z.string().optional().or(z.literal(""));

export const companySchema = z.object({
  // Dados da Empresa
  companyCode: optionalString,
  companyName: z.string().min(1, "Nome da empresa é obrigatório"),
  tradeName: optionalString,
  empCodFW: optionalString,
  branchCode: optionalString,

  // Fiscal
  cnpj: z
    .string()
    .min(1, "CNPJ é obrigatório")
    .refine(
      (val) => val.replace(/\D/g, "").length === 14,
      "CNPJ deve conter 14 dígitos numéricos"
    ),
  stateRegistration: optionalString,
  municipalRegistration: optionalString,
  cnae: optionalString,
  taxRegime: optionalString,

  // Endereço
  zipCode: optionalString,
  streetType: optionalString,
  streetName: optionalString,
  number: optionalString,
  complement: optionalString,
  neighborhood: optionalString,
  cityCode: optionalString,
  cityName: optionalString,
  state: optionalString,
  stateCode: optionalString,
  country: optionalString,
  fullAddress: optionalString,

  // Contato
  contactName: optionalString,
  phone: optionalString,
  whatsapp: optionalString,
  email: optionalString,

});

export type CompanyFormData = z.infer<typeof companySchema>;
