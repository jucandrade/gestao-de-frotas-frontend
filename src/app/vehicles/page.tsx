import { Toaster } from "react-hot-toast";
import VehicleTable from "@/app/vehicles/components/VehicleTable";

export const metadata = {
  title: "Gestão de Veículos",
};

export default function VehiclesPage() {
  return (
    <main className="min-h-screen bg-gray-50 px-4 py-10 sm:px-6 lg:px-8">
      <Toaster position="top-right" />
      <div className="mx-auto max-w-6xl">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">Veículos</h1>
          <p className="mt-2 text-sm text-gray-600">
            Gerencie os veículos cadastrados no sistema.
          </p>
        </div>
        <VehicleTable />
      </div>
    </main>
  );
}
