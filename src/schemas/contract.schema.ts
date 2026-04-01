import { z } from "zod";

const optionalString = z.string().optional().or(z.literal(""));

const optionalNumber = optionalString.refine((value) => {
  if (!value) return true;
  const parsed = Number(value.replace(",", "."));
  return !Number.isNaN(parsed);
}, "Valor numérico inválido");

export const contractItemSchema = z.object({
  ctoAcronym: optionalString,
  ctoName: optionalString,
  productPercentage: optionalNumber,
  servicePercentage: optionalNumber,
  value: optionalNumber,
  reserved: optionalNumber,
  productReserve: optionalNumber,
  usedProduct: optionalNumber,
  productBalance: optionalNumber,
  serviceReserve: optionalNumber,
  usedService: optionalNumber,
  serviceBalance: optionalNumber,
  balance: optionalNumber,
  ctoCategory: optionalString,
});

export type ContractItemFormValues = z.input<typeof contractItemSchema>;

export const contractSchema = z.object({
  contractNumber: optionalString,
  customerId: optionalString,
  customerName: optionalString,
  startDate: optionalString,
  endDate: optionalString,
  contractType: optionalString,
  contractYear: optionalString,
  extraCodeDRAC: optionalString,
  deliveryLocation: optionalString,
  totalValue: optionalNumber,
  generalBalance: optionalNumber,
  productPercentage: optionalNumber,
  productValue: optionalNumber,
  servicePercentage: optionalNumber,
  serviceValue: optionalNumber,
  reserved: optionalNumber,
  reserveBalance: optionalNumber,
  reservedProduct: optionalNumber,
  usedProduct: optionalNumber,
  reservedService: optionalNumber,
  usedService: optionalNumber,
});

export type ContractFormValues = z.input<typeof contractSchema>;
