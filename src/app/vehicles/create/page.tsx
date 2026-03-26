import { Toaster } from "react-hot-toast";
import VehicleForm from "@/components/vehicle/VehicleForm";

export const metadata = {
  title: "Cadastro de Veículo",
};

interface CreateVehiclePageProps {
  searchParams: Promise<{ customerId?: string }>;
}

export default async function CreateVehiclePage({ searchParams }: CreateVehiclePageProps) {
  const { customerId } = await searchParams;

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-10 sm:px-6 lg:px-8">
      <Toaster position="top-right" />
      <div className="mx-auto max-w-4xl">
        <div className="mb-8 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
          <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">Cadastro de Veículo</h1>
          <p className="mt-2 text-sm text-gray-600">
            Preencha os dados abaixo para cadastrar um novo veículo.
          </p>
        </div>
        <VehicleForm preselectedCustomerId={customerId} />
      </div>
    </main>
  );
}
