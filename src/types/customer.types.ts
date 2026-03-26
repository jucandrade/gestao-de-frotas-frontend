export type IeIndicator = "NOT_INFORMED" | "EXEMPT" | "CONTRIBUTOR";

export type CustomerTabKey =
  | "general"
  | "address"
  | "contact"
  | "financial"
  | "vehicles"
  | "history";

export interface CustomerVehicle {
  id: string;
  customerId: string;
  plate: string;
  model: string;
  createdAt: string;
}

export interface CustomerHistoryEvent {
  id: string;
  customerId: string;
  type: "maintenance" | "visits" | "updates";
  description: string;
  occurredAt: string;
}

export interface Customer {
  id: string;
  code?: string;
  name: string;
  tradeName?: string;
  type?: string;
  cpf?: string;
  cnpj?: string;
  stateRegistration?: string;
  ieIndicator?: IeIndicator;
  originCode?: string;
  origin?: string;
  mainContact?: string;
  email?: string;
  phone?: string;
  commercialPhone?: string;
  mobile?: string;
  whatsapp?: string;
  allowWhatsapp: boolean;
  allowEmail: boolean;
  allowSMS: boolean;
  allowPhone: boolean;
  zipCode?: string;
  street?: string;
  number?: string;
  complement?: string;
  neighborhood?: string;
  city?: string;
  state?: string;
  cityCode?: string;
  country?: string;
  occupationCode?: string;
  occupation?: string;
  discountPercentage?: number;
  paymentMethod?: string;
  paymentCondition?: string;
  clientType?: string;
  clientTypeDescription?: string;
  observations?: string;
  createdAt?: string;
  updatedAt?: string;
  lastVisit?: string;
  status?: string;
  vehicles?: CustomerVehicle[];
  history?: CustomerHistoryEvent[];
}

export interface CustomerPayload {
  code?: string;
  name: string;
  tradeName?: string;
  type?: string;
  cpf?: string;
  cnpj?: string;
  stateRegistration?: string;
  ieIndicator?: IeIndicator | "";
  originCode?: string;
  origin?: string;
  mainContact?: string;
  email?: string;
  phone?: string;
  commercialPhone?: string;
  mobile?: string;
  whatsapp?: string;
  allowWhatsapp?: boolean;
  allowEmail?: boolean;
  allowSMS?: boolean;
  allowPhone?: boolean;
  zipCode?: string;
  street?: string;
  number?: string;
  complement?: string;
  neighborhood?: string;
  city?: string;
  state?: string;
  cityCode?: string;
  country?: string;
  occupationCode?: string;
  occupation?: string;
  discountPercentage?: number | null;
  paymentMethod?: string;
  paymentCondition?: string;
  clientType?: string;
  clientTypeDescription?: string;
  observations?: string;
  createdAt?: string;
  updatedAt?: string;
  lastVisit?: string;
  status?: string;
}