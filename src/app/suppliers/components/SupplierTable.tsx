"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import SupplierDeleteDialog from "./SupplierDeleteDialog";
import SupplierDetailDialog from "./SupplierDetailDialog";
import { Supplier } from "@/types/supplier.types";
import {
  deleteSupplier,
  getSuppliers,
} from "@/services/supplier.service";

function formatCnpj(cnpj: string): string {
  const digits = cnpj.replace(/\D/g, "");
  if (digits.length !== 14) return cnpj;
  return digits.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, "$1.$2.$3/$4-$5");
}

export default function SupplierTable() {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    loadSuppliers();
  }, []);

  async function loadSuppliers() {
    try {
      setLoading(true);
      const data = await getSuppliers();
      setSuppliers(data);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Erro ao carregar fornecedores.";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete() {
    if (!selectedSupplier) return;

    try {
      setDeleting(true);
      await deleteSupplier(selectedSupplier.id);
      toast.success("Fornecedor excluído com sucesso!");
      setDeleteOpen(false);
      setSelectedSupplier(null);
      await loadSuppliers();
    } catch (error) {
      const message = error instanceof Error ? error.message : "Erro ao excluir fornecedor.";
      toast.error(message);
    } finally {
      setDeleting(false);
    }
  }

  const filtered = suppliers.filter((supplier) => {
    const term = search.toLowerCase().trim();
    const cnpjTerm = search.replace(/\D/g, "");

    return (
      supplier.name?.toLowerCase().includes(term) ||
      supplier.tradeName?.toLowerCase().includes(term) ||
      (cnpjTerm.length > 0 && supplier.cnpj?.includes(cnpjTerm))
    );
  });

  return (
    <>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <input
          type="text"
          placeholder="Buscar por nome ou CNPJ..."
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm outline-none transition-colors focus:border-black sm:max-w-xs"
        />

        <Link
          href="/suppliers/create"
          className="inline-flex items-center justify-center rounded-lg bg-black px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-gray-800"
        >
          <svg className="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Novo Fornecedor
        </Link>
      </div>

      <div className="mt-6 overflow-x-auto rounded-xl border border-gray-200 bg-white">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-black" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-20 text-center text-sm text-gray-500">
            {search ? "Nenhum fornecedor encontrado para essa busca." : "Nenhum fornecedor cadastrado."}
          </div>
        ) : (
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="px-4 py-3 font-medium text-gray-600">Fornecedor</th>
                <th className="px-4 py-3 font-medium text-gray-600">CNPJ</th>
                <th className="hidden px-4 py-3 font-medium text-gray-600 md:table-cell">Cidade</th>
                <th className="hidden px-4 py-3 font-medium text-gray-600 lg:table-cell">Contato</th>
                <th className="px-4 py-3 text-right font-medium text-gray-600">Ações</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((supplier) => (
                <tr
                  key={supplier.id}
                  className="border-b border-gray-100 transition-colors last:border-0 hover:bg-gray-50"
                >
                  <td className="px-4 py-3">
                    <div className="font-medium text-gray-900">{supplier.name}</div>
                    {supplier.tradeName ? (
                      <div className="text-xs text-gray-500">{supplier.tradeName}</div>
                    ) : null}
                  </td>
                  <td className="px-4 py-3 text-gray-600">{supplier.cnpj ? formatCnpj(supplier.cnpj) : "—"}</td>
                  <td className="hidden px-4 py-3 text-gray-600 md:table-cell">{supplier.city || "—"}</td>
                  <td className="hidden px-4 py-3 text-gray-600 lg:table-cell">
                    {supplier.contactName || supplier.phone || "—"}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        type="button"
                        title="Visualizar"
                        onClick={() => {
                          setSelectedSupplier(supplier);
                          setDetailOpen(true);
                        }}
                        className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
                      >
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      </button>

                      <Link
                        href={`/suppliers/${supplier.id}/edit`}
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
                        onClick={() => {
                          setSelectedSupplier(supplier);
                          setDeleteOpen(true);
                        }}
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

      <SupplierDetailDialog
        supplier={selectedSupplier}
        isOpen={detailOpen}
        onClose={() => {
          setDetailOpen(false);
          setSelectedSupplier(null);
        }}
      />

      <SupplierDeleteDialog
        supplierName={selectedSupplier?.name ?? ""}
        isOpen={deleteOpen}
        isDeleting={deleting}
        onConfirm={handleDelete}
        onCancel={() => {
          setDeleteOpen(false);
          setSelectedSupplier(null);
        }}
      />
    </>
  );
}
