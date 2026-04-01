export type ContractTabKey =
  | "general"
  | "financial"
  | "reserves"
  | "items";

export interface ContractItem {
  id: string;
  ctoAcronym?: string;
  ctoName?: string;
  productPercentage: number;
  servicePercentage: number;
  value: number;
  reserved: number;
  productReserve: number;
  usedProduct: number;
  productBalance: number;
  serviceReserve: number;
  usedService: number;
  serviceBalance: number;
  balance: number;
  ctoCategory?: string;
  contractId: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Contract {
  id: string;
  contractNumber?: number;
  customerId?: string;
  customerName?: string;
  startDate?: string;
  endDate?: string;
  contractType?: string;
  contractYear?: number;
  extraCodeDRAC?: string;
  deliveryLocation?: string;
  totalValue: number;
  generalBalance: number;
  productPercentage: number;
  productValue: number;
  servicePercentage: number;
  serviceValue: number;
  reserved: number;
  reserveBalance: number;
  reservedProduct: number;
  usedProduct: number;
  reservedService: number;
  usedService: number;
  createdAt?: string;
  updatedAt?: string;
  items?: ContractItem[];
  customer?: {
    id: string;
    name: string;
    tradeName?: string;
  };
}

export interface ContractPayload {
  contractNumber?: number;
  customerId?: string;
  customerName?: string;
  startDate?: string;
  endDate?: string;
  contractType?: string;
  contractYear?: number;
  extraCodeDRAC?: string;
  deliveryLocation?: string;
  totalValue?: number;
  generalBalance?: number;
  productPercentage?: number;
  productValue?: number;
  servicePercentage?: number;
  serviceValue?: number;
  reserved?: number;
  reserveBalance?: number;
  reservedProduct?: number;
  usedProduct?: number;
  reservedService?: number;
  usedService?: number;
  items?: ContractItemPayload[];
}

export interface ContractItemPayload {
  ctoAcronym?: string;
  ctoName?: string;
  productPercentage?: number;
  servicePercentage?: number;
  value?: number;
  reserved?: number;
  productReserve?: number;
  usedProduct?: number;
  productBalance?: number;
  serviceReserve?: number;
  usedService?: number;
  serviceBalance?: number;
  balance?: number;
  ctoCategory?: string;
}
