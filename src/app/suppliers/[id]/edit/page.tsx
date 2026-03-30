import { Toaster } from "react-hot-toast";
import EditSupplierForm from "./components/EditSupplierForm";

export const metadata = {
  title: "Editar Fornecedor",
};

interface EditSupplierPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditSupplierPage({ params }: EditSupplierPageProps) {
  const { id } = await params;

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-10 sm:px-6 lg:px-8">
      <Toaster position="top-right" />
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
          <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">Editar Fornecedor</h1>
          <p className="mt-2 text-sm text-gray-600">
            Atualize os dados do fornecedor selecionado.
          </p>
        </div>

        <EditSupplierForm supplierId={id} />
      </div>
    </main>
  );
}
