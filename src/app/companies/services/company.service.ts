export interface Company {
  id: string;
  companyCode?: string;
  companyName: string;
  tradeName?: string;
  cnpj: string;
  empCodFW?: string;
  branchCode?: string;
  stateRegistration?: string;
  municipalRegistration?: string;
  cnae?: string;
  taxRegime?: string;
  zipCode?: string;
  streetType?: string;
  streetName?: string;
  number?: string;
  complement?: string;
  neighborhood?: string;
  cityCode?: string;
  cityName?: string;
  state?: string;
  stateCode?: string;
  country?: string;
  fullAddress?: string;
  contactName?: string;
  phone?: string;
  whatsapp?: string;
  email?: string;
}

export async function getCompanies(): Promise<Company[]> {
  const response = await fetch("/api/companies");

  if (!response.ok) {
    const error = await response.json();
    throw error;
  }

  return response.json();
}

export async function getCompany(id: string): Promise<Company> {
  const response = await fetch(`/api/companies/${id}`);

  if (!response.ok) {
    const error = await response.json();
    throw error;
  }

  return response.json();
}

export async function updateCompany(id: string, data: Partial<Company>): Promise<Company> {
  const response = await fetch(`/api/companies/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw error;
  }

  return response.json();
}

export async function deleteCompany(id: string): Promise<void> {
  const response = await fetch(`/api/companies/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    const error = await response.json();
    throw error;
  }
}
