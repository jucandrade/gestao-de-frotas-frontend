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
  try {
    const response = await fetch("/api/companies");

    if (!response.ok) {
      const error = await response.json().catch(() => null);
      const message = error?.message || `Erro HTTP ${response.status}`;
      const err = new Error(message);
      (err as any).statusCode = response.status;
      throw err;
    }

    return response.json();
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Erro ao comunicar com o servidor");
  }
}

export async function getCompany(id: string): Promise<Company> {
  try {
    const response = await fetch(`/api/companies/${id}`);

    if (!response.ok) {
      const error = await response.json().catch(() => null);
      const message = error?.message || `Erro HTTP ${response.status}`;
      const err = new Error(message);
      (err as any).statusCode = response.status;
      throw err;
    }

    return response.json();
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Erro ao comunicar com o servidor");
  }
}

export async function updateCompany(id: string, data: Partial<Company>): Promise<Company> {
  try {
    const response = await fetch(`/api/companies/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => null);
      const message = error?.message || `Erro HTTP ${response.status}`;
      const err = new Error(message);
      (err as any).statusCode = response.status;
      throw err;
    }

    return response.json();
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Erro ao comunicar com o servidor");
  }
}

export async function deleteCompany(id: string): Promise<void> {
  try {
    const response = await fetch(`/api/companies/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      const error = await response.json().catch(() => null);
      const message = error?.message || `Erro HTTP ${response.status}`;
      const err = new Error(message);
      (err as any).statusCode = response.status;
      throw err;
    }
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Erro ao comunicar com o servidor");
  }
}
