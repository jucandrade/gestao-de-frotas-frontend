import { Toaster } from "react-hot-toast";
import ContractTable from "@/app/contracts/components/ContractTable";

export const metadata = {
  title: "Gestão de Contratos",
};

export default function ContractsPage() {
  return (
    <main className="min-h-screen bg-gray-50 px-4 py-10 sm:px-6 lg:px-8">
      <Toaster position="top-right" />

      <div className="mx-auto max-w-7xl">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">Contratos</h1>
          <p className="mt-2 text-sm text-gray-600">
            Gerencie os contratos cadastrados no sistema.
          </p>
        </div>

        <ContractTable />
      </div>
    </main>
  );
}
