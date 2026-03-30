import { Toaster } from "react-hot-toast";
import SupplierTable from "@/app/suppliers/components/SupplierTable";

export const metadata = {
  title: "Gestão de Fornecedores",
};

export default function SuppliersPage() {
  return (
    <main className="min-h-screen bg-gray-50 px-4 py-10 sm:px-6 lg:px-8">
      <Toaster position="top-right" />

      <div className="mx-auto max-w-6xl">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">Fornecedores</h1>
          <p className="mt-2 text-sm text-gray-600">
            Gerencie os fornecedores cadastrados no sistema.
          </p>
        </div>

        <SupplierTable />
      </div>
    </main>
  );
}
