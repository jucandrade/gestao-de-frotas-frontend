import { Toaster } from "react-hot-toast";
import CompanyForm from "./components/CompanyForm";

export const metadata = {
  title: "Cadastro de Empresa",
};

export default function CreateCompanyPage() {
  return (
    <main className="min-h-screen bg-gray-50 px-4 py-10 sm:px-6 lg:px-8">
      <Toaster position="top-right" />
      <div className="mx-auto max-w-4xl">
        <h1 className="mb-2 text-center text-2xl font-bold text-gray-900 sm:text-3xl">
          Cadastro de Empresa
        </h1>
        <p className="mb-8 text-center text-sm text-gray-500">
          Preencha os dados abaixo para cadastrar uma nova empresa.
        </p>
        <CompanyForm />
      </div>
    </main>
  );
}
