"use client";

import { useEffect, useState } from "react";
import VehicleForm from "@/components/vehicle/VehicleForm";
import { getVehicle } from "@/services/vehicle.service";
import { Vehicle } from "@/types/vehicle.types";

interface EditVehicleFormProps {
  vehicleId: string;
}

export default function EditVehicleForm({ vehicleId }: EditVehicleFormProps) {
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getVehicle(vehicleId)
      .then(setVehicle)
      .catch((err) => setError(err instanceof Error ? err.message : "Erro ao carregar veículo."))
      .finally(() => setLoading(false));
  }, [vehicleId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-black" />
      </div>
    );
  }

  if (error || !vehicle) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-sm text-red-700">
        {error ?? "Veículo não encontrado."}
      </div>
    );
  }

  return <VehicleForm vehicleId={vehicleId} initialData={vehicle} />;
}
