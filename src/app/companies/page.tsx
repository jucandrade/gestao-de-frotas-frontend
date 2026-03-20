import { Toaster } from "react-hot-toast";
import CompanyTable from "@/app/companies/components/CompanyTable";

export default function CompaniesPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      <Toaster position="top-right" />
      <div className="mx-auto max-w-6xl px-4 py-10">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Empresas</h1>
          <p className="mt-1 text-sm text-gray-500">
            Gerencie as empresas cadastradas no sistema.
          </p>
        </div>
        <CompanyTable />
      </div>
    </main>
  );
}
