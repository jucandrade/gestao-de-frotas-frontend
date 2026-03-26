import { Toaster } from "react-hot-toast";
import EditCompanyForm from "./components/EditCompanyForm";

export const metadata = {
  title: "Editar Empresa",
};

interface EditCompanyPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditCompanyPage({ params }: EditCompanyPageProps) {
  const { id } = await params;

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-10 sm:px-6 lg:px-8">
      <Toaster position="top-right" />
      <div className="mx-auto max-w-4xl">
        <h1 className="mb-2 text-center text-2xl font-bold text-gray-900 sm:text-3xl">
          Editar Empresa
        </h1>
        <p className="mb-8 text-center text-sm text-gray-500">
          Atualize os dados da empresa selecionada.
        </p>
        <EditCompanyForm companyId={id} />
      </div>
    </main>
  );
}