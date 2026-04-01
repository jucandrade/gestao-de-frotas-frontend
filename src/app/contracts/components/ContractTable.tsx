"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import ContractDeleteDialog from "./ContractDeleteDialog";
import ContractDetailDialog from "./ContractDetailDialog";
import { Contract } from "@/types/contract.types";
import { deleteContract, getContracts } from "@/services/contract.service";

function formatDate(dateStr?: string): string {
  if (!dateStr) return "—";
  const d = new Date(dateStr);
  return d.toLocaleDateString("pt-BR");
}

function formatCurrency(value: number): string {
  return value.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export default function ContractTable() {
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedContract, setSelectedContract] = useState<Contract | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    loadContracts();
  }, []);

  async function loadContracts() {
    try {
      setLoading(true);
      const data = await getContracts();
      setContracts(data);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Erro ao carregar contratos.";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete() {
    if (!selectedContract) return;

    try {
      setDeleting(true);
      await deleteContract(selectedContract.id);
      toast.success("Contrato excluído com sucesso!");
      setDeleteOpen(false);
      setSelectedContract(null);
      await loadContracts();
    } catch (error) {
      const message = error instanceof Error ? error.message : "Erro ao excluir contrato.";
      toast.error(message);
    } finally {
      setDeleting(false);
    }
  }

  const filtered = contracts.filter((contract) => {
    const term = search.toLowerCase().trim();
    return (
      contract.customerName?.toLowerCase().includes(term) ||
      contract.contractType?.toLowerCase().includes(term) ||
      contract.contractNumber?.toString().includes(term) ||
      contract.deliveryLocation?.toLowerCase().includes(term)
    );
  });

  return (
    <>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <input
          type="text"
          placeholder="Buscar por cliente, tipo ou nº contrato..."
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm outline-none transition-colors focus:border-black sm:max-w-xs"
        />

        <Link
          href="/contracts/create"
          className="inline-flex items-center justify-center rounded-lg bg-black px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-gray-800"
        >
          <svg className="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Novo Contrato
        </Link>
      </div>

      <div className="mt-6 overflow-x-auto rounded-xl border border-gray-200 bg-white">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-black" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-20 text-center text-sm text-gray-500">
            {search ? "Nenhum contrato encontrado para essa busca." : "Nenhum contrato cadastrado."}
          </div>
        ) : (
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="px-4 py-3 font-medium text-gray-600">Nº</th>
                <th className="px-4 py-3 font-medium text-gray-600">Cliente</th>
                <th className="hidden px-4 py-3 font-medium text-gray-600 md:table-cell">Tipo</th>
                <th className="hidden px-4 py-3 font-medium text-gray-600 lg:table-cell">Início</th>
                <th className="hidden px-4 py-3 font-medium text-gray-600 lg:table-cell">Final</th>
                <th className="hidden px-4 py-3 font-medium text-gray-600 md:table-cell">Valor Total</th>
                <th className="px-4 py-3 text-right font-medium text-gray-600">Ações</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((contract) => (
                <tr
                  key={contract.id}
                  className="border-b border-gray-100 transition-colors last:border-0 hover:bg-gray-50"
                >
                  <td className="px-4 py-3 font-medium text-gray-900">
                    {contract.contractNumber ?? "—"}
                  </td>
                  <td className="px-4 py-3">
                    <div className="font-medium text-gray-900">
                      {contract.customer?.name || contract.customerName || "—"}
                    </div>
                    {contract.customer?.tradeName ? (
                      <div className="text-xs text-gray-500">{contract.customer.tradeName}</div>
                    ) : null}
                  </td>
                  <td className="hidden px-4 py-3 text-gray-600 md:table-cell">
                    {contract.contractType || "—"}
                  </td>
                  <td className="hidden px-4 py-3 text-gray-600 lg:table-cell">
                    {formatDate(contract.startDate)}
                  </td>
                  <td className="hidden px-4 py-3 text-gray-600 lg:table-cell">
                    {formatDate(contract.endDate)}
                  </td>
                  <td className="hidden px-4 py-3 text-gray-600 md:table-cell">
                    {formatCurrency(contract.totalValue)}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        type="button"
                        title="Visualizar"
                        onClick={() => {
                          setSelectedContract(contract);
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
                        href={`/contracts/${contract.id}/edit`}
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
                          setSelectedContract(contract);
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

      <ContractDetailDialog
        contract={selectedContract}
        isOpen={detailOpen}
        onClose={() => {
          setDetailOpen(false);
          setSelectedContract(null);
        }}
      />

      <ContractDeleteDialog
        contractLabel={
          selectedContract
            ? `Contrato ${selectedContract.contractNumber ?? selectedContract.id.slice(0, 8)}`
            : ""
        }
        isOpen={deleteOpen}
        isDeleting={deleting}
        onConfirm={handleDelete}
        onCancel={() => {
          setDeleteOpen(false);
          setSelectedContract(null);
        }}
      />
    </>
  );
}
