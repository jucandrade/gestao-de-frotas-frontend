"use client";

import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import Link from "next/link";
import {
  Company,
  getCompanies,
  deleteCompany,
} from "@/app/companies/services/company.service";
import CompanyDeleteDialog from "./CompanyDeleteDialog";
import CompanyDetailDialog from "./CompanyDetailDialog";

function formatCnpj(cnpj: string): string {
  const digits = cnpj.replace(/\D/g, "");
  if (digits.length !== 14) return cnpj;
  return digits.replace(
    /^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/,
    "$1.$2.$3/$4-$5"
  );
}

export default function CompanyTable() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    loadCompanies();
  }, []);

  async function loadCompanies() {
    try {
      setLoading(true);
      const data = await getCompanies();
      setCompanies(data);
    } catch {
      toast.error("Erro ao carregar empresas.");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete() {
    if (!selectedCompany) return;
    try {
      setDeleting(true);
      await deleteCompany(selectedCompany.id);
      toast.success("Empresa excluída com sucesso!");
      setDeleteOpen(false);
      setSelectedCompany(null);
      await loadCompanies();
    } catch {
      toast.error("Erro ao excluir empresa.");
    } finally {
      setDeleting(false);
    }
  }

  const filtered = companies.filter((c) => {
    const term = search.toLowerCase();
    return (
      c.companyName?.toLowerCase().includes(term) ||
      c.tradeName?.toLowerCase().includes(term) ||
      c.cnpj?.includes(search.replace(/\D/g, ""))
    );
  });

  return (
    <>
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <input
          type="text"
          placeholder="Buscar por nome ou CNPJ..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm outline-none transition-colors focus:border-black sm:max-w-xs"
        />
        <Link
          href="/companies/create"
          className="inline-flex items-center justify-center rounded-lg bg-black px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-gray-800"
        >
          <svg className="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Nova Empresa
        </Link>
      </div>

      {/* Table */}
      <div className="mt-6 overflow-x-auto rounded-xl border border-gray-200 bg-white">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-black" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-20 text-center text-sm text-gray-500">
            {search
              ? "Nenhuma empresa encontrada para essa busca."
              : "Nenhuma empresa cadastrada."}
          </div>
        ) : (
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="px-4 py-3 font-medium text-gray-600">Empresa</th>
                <th className="px-4 py-3 font-medium text-gray-600">CNPJ</th>
                <th className="hidden px-4 py-3 font-medium text-gray-600 md:table-cell">
                  Cidade
                </th>
                <th className="hidden px-4 py-3 font-medium text-gray-600 lg:table-cell">
                  Contato
                </th>
                <th className="px-4 py-3 text-right font-medium text-gray-600">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((company) => (
                <tr
                  key={company.id}
                  className="border-b border-gray-100 transition-colors last:border-0 hover:bg-gray-50"
                >
                  <td className="px-4 py-3">
                    <div className="font-medium text-gray-900">
                      {company.companyName}
                    </div>
                    {company.tradeName && (
                      <div className="text-xs text-gray-500">
                        {company.tradeName}
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-3 text-gray-600">
                    {company.cnpj ? formatCnpj(company.cnpj) : "—"}
                  </td>
                  <td className="hidden px-4 py-3 text-gray-600 md:table-cell">
                    {company.cityName || "—"}
                  </td>
                  <td className="hidden px-4 py-3 text-gray-600 lg:table-cell">
                    {company.contactName || company.phone || "—"}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      {/* View */}
                      <button
                        type="button"
                        title="Visualizar"
                        onClick={() => {
                          setSelectedCompany(company);
                          setDetailOpen(true);
                        }}
                        className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
                      >
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      </button>
                      {/* Edit */}
                      <Link
                        href={`/companies/${company.id}/edit`}
                        title="Editar"
                        className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
                      >
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </Link>
                      {/* Delete */}
                      <button
                        type="button"
                        title="Excluir"
                        onClick={() => {
                          setSelectedCompany(company);
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

      {/* Dialogs */}
      <CompanyDetailDialog
        company={selectedCompany}
        isOpen={detailOpen}
        onClose={() => {
          setDetailOpen(false);
          setSelectedCompany(null);
        }}
      />
      <CompanyDeleteDialog
        companyName={selectedCompany?.companyName ?? ""}
        isOpen={deleteOpen}
        isDeleting={deleting}
        onConfirm={handleDelete}
        onCancel={() => {
          setDeleteOpen(false);
          setSelectedCompany(null);
        }}
      />
    </>
  );
}
