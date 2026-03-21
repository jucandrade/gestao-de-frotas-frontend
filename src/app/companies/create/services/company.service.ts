import { Company } from "../../services/company.service";
import { CompanyFormData } from "../schemas/company.schema";


const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api";

export async function createCompany(data: Company): Promise<Company> {
  const response = await fetch(`${API_URL}/companies`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw error;
  }

  return response.json();
}