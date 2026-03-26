import { Toaster } from "react-hot-toast";
import EditCustomerForm from "./components/EditCustomerForm";

export const metadata = {
  title: "Editar Cliente",
};

interface EditCustomerPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditCustomerPage({ params }: EditCustomerPageProps) {
  const { id } = await params;

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-10 sm:px-6 lg:px-8">
      <Toaster position="top-right" />
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
          <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">Editar Cliente</h1>
          <p className="mt-2 text-sm text-gray-600">
            Atualize os dados do cliente selecionado.
          </p>
        </div>

        <EditCustomerForm customerId={id} />
      </div>
    </main>
  );
}