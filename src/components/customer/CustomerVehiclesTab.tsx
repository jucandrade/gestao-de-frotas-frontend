"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { Vehicle } from "@/types/vehicle.types";
import { deleteVehicle, getVehicles } from "@/services/vehicle.service";

interface CustomerVehiclesTabProps {
  customerId: string | null;
}

export default function CustomerVehiclesTab({ customerId }: CustomerVehiclesTabProps) {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    if (!customerId) return;
    setLoading(true);
    getVehicles(customerId)
      .then(setVehicles)
      .catch((err) => toast.error(err instanceof Error ? err.message : "Erro ao carregar veículos."))
      .finally(() => setLoading(false));
  }, [customerId]);

  async function handleDelete(vehicle: Vehicle) {
    if (!confirm(`Deseja excluir o veículo ${vehicle.plate}?`)) return;
    try {
      setDeletingId(vehicle.id);
      await deleteVehicle(vehicle.id);
      toast.success("Veículo excluído.");
      setVehicles((prev) => prev.filter((v) => v.id !== vehicle.id));
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erro ao excluir veículo.");
    } finally {
      setDeletingId(null);
    }
  }

  if (!customerId) {
    return (
      <div className="rounded-xl border border-dashed border-gray-300 bg-gray-50 p-8 text-center">
        <p className="text-sm text-gray-500">
          Salve o cliente primeiro para vincular veículos.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Link
          href={`/vehicles/create?customerId=${customerId}`}
          className="inline-flex items-center gap-2 rounded-lg bg-black px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-gray-800"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Adicionar Veículo
        </Link>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="h-6 w-6 animate-spin rounded-full border-4 border-gray-200 border-t-black" />
        </div>
      ) : vehicles.length === 0 ? (
        <div className="rounded-xl border border-dashed border-gray-300 bg-gray-50 p-8 text-center">
          <p className="text-sm text-gray-500">Nenhum veículo vinculado a este cliente.</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="px-4 py-3 font-medium text-gray-600">Placa</th>
                <th className="px-4 py-3 font-medium text-gray-600">Fabricante</th>
                <th className="px-4 py-3 font-medium text-gray-600">Modelo</th>
                <th className="hidden px-4 py-3 font-medium text-gray-600 sm:table-cell">Ano</th>
                <th className="px-4 py-3 font-medium text-gray-600">Status</th>
                <th className="px-4 py-3 text-right font-medium text-gray-600">Ações</th>
              </tr>
            </thead>
            <tbody>
              {vehicles.map((v) => (
                <tr key={v.id} className="border-b border-gray-100 last:border-0 hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-900">{v.plate}</td>
                  <td className="px-4 py-3 text-gray-600">{v.manufacturer || "—"}</td>
                  <td className="px-4 py-3 text-gray-600">{v.model || "—"}</td>
                  <td className="hidden px-4 py-3 text-gray-600 sm:table-cell">{v.year || "—"}</td>
                  <td className="px-4 py-3">
                    <span
                      className={
                        "inline-flex rounded-full px-2 py-0.5 text-xs font-medium " +
                        (v.status === "Ativo"
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-100 text-gray-600")
                      }
                    >
                      {v.status || "Ativo"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <Link
                        href={`/vehicles/${v.id}/edit`}
                        title="Editar"
                        className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
                      >
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </Link>
                      <button
                        type="button"
                        title="Excluir"
                        disabled={deletingId === v.id}
                        onClick={() => handleDelete(v)}
                        className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-red-50 hover:text-red-600 disabled:opacity-50"
                      >
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
