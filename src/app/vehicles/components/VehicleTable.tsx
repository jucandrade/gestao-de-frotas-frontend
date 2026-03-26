"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { Vehicle } from "@/types/vehicle.types";
import { deleteVehicle, getVehicles } from "@/services/vehicle.service";
import VehicleDeleteDialog from "./VehicleDeleteDialog";
import VehicleDetailDialog from "./VehicleDetailDialog";

export default function VehicleTable() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Vehicle | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    loadVehicles();
  }, []);

  async function loadVehicles() {
    try {
      setLoading(true);
      const data = await getVehicles();
      setVehicles(data);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Erro ao carregar veículos.";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete() {
    if (!selected) return;
    try {
      setDeleting(true);
      await deleteVehicle(selected.id);
      toast.success("Veículo excluído com sucesso!");
      setDeleteOpen(false);
      setSelected(null);
      await loadVehicles();
    } catch (error) {
      const message = error instanceof Error ? error.message : "Erro ao excluir veículo.";
      toast.error(message);
    } finally {
      setDeleting(false);
    }
  }

  const filtered = vehicles.filter((v) => {
    const term = search.toLowerCase().trim();
    if (!term) return true;
    return (
      v.plate?.toLowerCase().includes(term) ||
      v.manufacturer?.toLowerCase().includes(term) ||
      v.model?.toLowerCase().includes(term) ||
      v.chassis?.toLowerCase().includes(term) ||
      v.customer?.name?.toLowerCase().includes(term)
    );
  });

  return (
    <>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <input
          type="text"
          placeholder="Buscar por placa, modelo, fabricante ou cliente..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm outline-none transition-colors focus:border-black sm:max-w-xs"
        />
        <Link
          href="/vehicles/create"
          className="inline-flex items-center justify-center rounded-lg bg-black px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-gray-800"
        >
          <svg className="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Novo Veículo
        </Link>
      </div>

      <div className="mt-6 overflow-x-auto rounded-xl border border-gray-200 bg-white">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-black" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-20 text-center text-sm text-gray-500">
            {search ? "Nenhum veículo encontrado para essa busca." : "Nenhum veículo cadastrado."}
          </div>
        ) : (
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="px-4 py-3 font-medium text-gray-600">Placa</th>
                <th className="hidden px-4 py-3 font-medium text-gray-600 sm:table-cell">Fabricante</th>
                <th className="px-4 py-3 font-medium text-gray-600">Modelo</th>
                <th className="hidden px-4 py-3 font-medium text-gray-600 md:table-cell">Nº Chassi</th>
                <th className="hidden px-4 py-3 font-medium text-gray-600 lg:table-cell">Cliente</th>
                <th className="hidden px-4 py-3 font-medium text-gray-600 lg:table-cell">Status</th>
                <th className="px-4 py-3 text-right font-medium text-gray-600">Ações</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((vehicle) => (
                <tr
                  key={vehicle.id}
                  className="border-b border-gray-100 transition-colors last:border-0 hover:bg-gray-50"
                >
                  <td className="px-4 py-3 font-medium text-gray-900">{vehicle.plate}</td>
                  <td className="hidden px-4 py-3 text-gray-600 sm:table-cell">{vehicle.manufacturer || "—"}</td>
                  <td className="px-4 py-3 text-gray-600">{vehicle.model || "—"}</td>
                  <td className="hidden px-4 py-3 text-gray-500 md:table-cell text-xs">{vehicle.chassis || "—"}</td>
                  <td className="hidden px-4 py-3 text-gray-600 lg:table-cell">
                    {vehicle.customer?.name || "—"}
                  </td>
                  <td className="hidden px-4 py-3 lg:table-cell">
                    <span
                      className={
                        "inline-flex rounded-full px-2 py-0.5 text-xs font-medium " +
                        (vehicle.status === "Ativo"
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-100 text-gray-600")
                      }
                    >
                      {vehicle.status || "Ativo"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        type="button"
                        title="Visualizar"
                        onClick={() => { setSelected(vehicle); setDetailOpen(true); }}
                        className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
                      >
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      </button>
                      <Link
                        href={`/vehicles/${vehicle.id}/edit`}
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
                        onClick={() => { setSelected(vehicle); setDeleteOpen(true); }}
                        className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-red-50 hover:text-red-600"
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
        )}
      </div>

      <VehicleDetailDialog
        vehicle={selected}
        isOpen={detailOpen}
        onClose={() => { setDetailOpen(false); setSelected(null); }}
      />
      <VehicleDeleteDialog
        vehiclePlate={selected?.plate ?? ""}
        isOpen={deleteOpen}
        isDeleting={deleting}
        onConfirm={handleDelete}
        onCancel={() => { setDeleteOpen(false); setSelected(null); }}
      />
    </>
  );
}
