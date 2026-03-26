export interface VehicleCustomer {
  id: string;
  name: string;
  code?: string;
}

export interface Vehicle {
  id: string;
  plate: string;
  chassis?: string;
  prefix?: string;
  manufacturer?: string;
  model?: string;
  year?: number;
  color?: string;
  fuel?: string;
  renavam?: string;
  status?: string;
  customerId?: string;
  customer?: VehicleCustomer;
  createdAt?: string;
  updatedAt?: string;
}

export interface VehiclePayload {
  plate: string;
  chassis?: string;
  prefix?: string;
  manufacturer?: string;
  model?: string;
  year?: number;
  color?: string;
  fuel?: string;
  renavam?: string;
  status?: string;
  customerId?: string;
}
