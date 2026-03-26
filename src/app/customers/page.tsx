import { Toaster } from "react-hot-toast";
import CustomerTable from "@/app/customers/components/CustomerTable";

export const metadata = {
  title: "Gestao de Clientes",
};

export default function CustomersPage() {
  return (
    <main className="min-h-screen bg-gray-50 px-4 py-10 sm:px-6 lg:px-8">
      <Toaster position="top-right" />

      <div className="mx-auto max-w-6xl">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">Clientes</h1>
          <p className="mt-2 text-sm text-gray-600">
            Gerencie os clientes cadastrados no sistema.
          </p>
        </div>

        <CustomerTable />
      </div>
    </main>
  );
}