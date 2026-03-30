export type SupplierTabKey =
  | "general"
  | "documents"
  | "address"
  | "contact"
  | "financial"
  | "contacts";

export interface SupplierContact {
  id: string;
  sequence?: number;
  name: string;
  positionCode?: string;
  positionDescription?: string;
  phone?: string;
  email?: string;
  active: boolean;
  supplierId: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Supplier {
  id: string;
  code?: string;
  name: string;
  tradeName?: string;
  supplierType?: string;
  contactName?: string;
  quotationContact?: string;
  personType?: string;
  cnpj?: string;
  cpf?: string;
  stateRegistration?: string;
  ieIndicator?: string;
  rg?: string;
  zipCode?: string;
  streetType?: string;
  street?: string;
  number?: string;
  complement?: string;
  neighborhood?: string;
  city?: string;
  state?: string;
  stateName?: string;
  email?: string;
  phone?: string;
  phone2?: string;
  mobile?: string;
  fax?: string;
  paymentCondition?: string;
  paymentDescription?: string;
  discountPercentage?: number;
  site?: string;
  observations?: string;
  createdAt?: string;
  updatedAt?: string;
  contacts?: SupplierContact[];
}

export interface SupplierPayload {
  code?: string;
  name: string;
  tradeName?: string;
  supplierType?: string;
  contactName?: string;
  quotationContact?: string;
  personType?: string;
  cnpj?: string;
  cpf?: string;
  stateRegistration?: string;
  ieIndicator?: string;
  rg?: string;
  zipCode?: string;
  streetType?: string;
  street?: string;
  number?: string;
  complement?: string;
  neighborhood?: string;
  city?: string;
  state?: string;
  stateName?: string;
  email?: string;
  phone?: string;
  phone2?: string;
  mobile?: string;
  fax?: string;
  paymentCondition?: string;
  paymentDescription?: string;
  discountPercentage?: number | null;
  site?: string;
  observations?: string;
}

export interface SupplierContactPayload {
  sequence?: number;
  name: string;
  positionCode?: string;
  positionDescription?: string;
  phone?: string;
  email?: string;
  active?: boolean;
  supplierId: string;
}
