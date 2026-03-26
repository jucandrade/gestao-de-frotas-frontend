
import { z } from "zod";
import { cpf as cpfValidator } from "cpf-cnpj-validator";

const optionalString = z.string().optional().or(z.literal(""));

export const customerSchema = z
  .object({
    code: optionalString,
    name: z.string().min(1, "Nome é obrigatório"),
    tradeName: optionalString,
    type: z.enum(["INDIVIDUAL", "COMPANY"]),
    cpf: optionalString,
    cnpj: optionalString,
    stateRegistration: optionalString,
    ieIndicator: z.enum(["NOT_INFORMED", "EXEMPT", "CONTRIBUTOR"]).optional().or(z.literal("")),
    originCode: optionalString,
    origin: optionalString,
    mainContact: optionalString,
    email: z
      .string()
      .email("E-mail inválido")
      .optional()
      .or(z.literal("")),
    phone: optionalString,
    commercialPhone: optionalString,
    mobile: optionalString,
    whatsapp: optionalString,
    allowWhatsapp: z.boolean().default(false),
    allowEmail: z.boolean().default(false),
    allowSMS: z.boolean().default(false),
    allowPhone: z.boolean().default(false),
    zipCode: optionalString,
    street: optionalString,
    number: optionalString,
    complement: optionalString,
    neighborhood: optionalString,
    city: optionalString,
    state: optionalString,
    cityCode: optionalString,
    country: optionalString,
    occupationCode: optionalString,
    occupation: optionalString,
    discountPercentage: optionalString.refine((value) => {
      if (!value) return true;
      const parsed = Number(value.replace(",", "."));
      return !Number.isNaN(parsed) && parsed >= 0 && parsed <= 100;
    }, "Desconto deve estar entre 0 e 100"),
    paymentMethod: optionalString,
    paymentCondition: optionalString,
    clientType: optionalString,
    clientTypeDescription: optionalString,
    createdAt: optionalString,
    updatedAt: optionalString,
    lastVisit: optionalString,
    status: optionalString,
    observations: optionalString,
  })
  .superRefine((data, ctx) => {
    if (data.type === "INDIVIDUAL") {
      if (!data.cpf || data.cpf.replace(/\D/g, "").length !== 11) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["cpf"],
          message: "CPF é obrigatório e deve conter 11 dígitos",
        });
      } else if (!cpfValidator.isValid(data.cpf)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["cpf"],
          message: "CPF inválido",
        });
      }
    }
    if (data.type === "COMPANY") {
      if (!data.cnpj || data.cnpj.replace(/\D/g, "").length !== 14) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["cnpj"],
          message: "CNPJ é obrigatório e deve conter 14 dígitos",
        });
      }
    }
  });

export type CustomerFormValues = z.input<typeof customerSchema>;