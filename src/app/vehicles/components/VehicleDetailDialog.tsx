"use client";

import { Vehicle } from "@/types/vehicle.types";

interface VehicleDetailDialogProps {
  vehicle: Vehicle | null;
  isOpen: boolean;
  onClose: () => void;
}

function InfoRow({ label, value }: { label: string; value?: string | number }) {
  if (value === undefined || value === null || value === "") return null;
  return (
    <div className="flex flex-col gap-0.5 sm:flex-row sm:gap-2">
      <span className="text-sm font-medium text-gray-500">{label}:</span>
      <span className="text-sm text-gray-900">{value}</span>
    </div>
  );
}

export default function VehicleDetailDialog({ vehicle, isOpen, onClose }: VehicleDetailDialogProps) {
  if (!isOpen || !vehicle) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="mx-4 max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-2xl bg-white p-6 shadow-xl">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">Detalhes do Veículo</h3>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="mt-5 space-y-5">
          <section>
            <h4 className="mb-2 text-sm font-semibold uppercase tracking-wide text-gray-400">
              Dados do Veículo
            </h4>
            <div className="space-y-1.5">
              <InfoRow label="Placa" value={vehicle.plate} />
              <InfoRow label="Nº Chassi" value={vehicle.chassis} />
              <InfoRow label="Prefixo / Tipo" value={vehicle.prefix} />
              <InfoRow label="Fabricante" value={vehicle.manufacturer} />
              <InfoRow label="Modelo" value={vehicle.model} />
              <InfoRow label="Ano" value={vehicle.year} />
              <InfoRow label="Cor" value={vehicle.color} />
              <InfoRow label="Combustível" value={vehicle.fuel} />
              <InfoRow label="Renavam" value={vehicle.renavam} />
              <InfoRow label="Status" value={vehicle.status} />
            </div>
          </section>

          {vehicle.customer && (
            <section>
              <h4 className="mb-2 text-sm font-semibold uppercase tracking-wide text-gray-400">
                Cliente
              </h4>
              <div className="space-y-1.5">
                <InfoRow label="Nome" value={vehicle.customer.name} />
                <InfoRow label="Código" value={vehicle.customer.code} />
              </div>
            </section>
          )}
        </div>

        <div className="mt-6 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg bg-black px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-gray-800"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
}
