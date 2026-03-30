import { Toaster } from "react-hot-toast";
import SupplierForm from "@/components/supplier/SupplierForm";

export const metadata = {
  title: "Cadastro de Fornecedor",
};

export default function CreateSupplierPage() {
  return (
    <main className="min-h-screen bg-gray-50 px-4 py-10 sm:px-6 lg:px-8">
      <Toaster position="top-right" />
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
          <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">Cadastro de Fornecedor</h1>
          <p className="mt-2 text-sm text-gray-600">
            Preencha os dados abaixo para cadastrar um novo fornecedor.
          </p>
        </div>

        <SupplierForm />
      </div>
    </main>
  );
}
