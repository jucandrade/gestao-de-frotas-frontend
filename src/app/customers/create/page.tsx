import { Toaster } from "react-hot-toast";
import CustomerForm from "@/components/customer/CustomerForm";

export const metadata = {
  title: "Cadastro de Cliente",
};

export default function CreateCustomerPage() {
  return (
    <main className="min-h-screen bg-gray-50 px-4 py-10 sm:px-6 lg:px-8">
      <Toaster position="top-right" />
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
          <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">Cadastro de Cliente</h1>
          <p className="mt-2 text-sm text-gray-600">
            Preencha os dados abaixo para cadastrar um novo cliente.
          </p>
        </div>

        <CustomerForm />
      </div>
    </main>
  );
}