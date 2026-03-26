"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { UserProfile } from "@/types/user-profile.types";
import { deleteUserProfile, getUserProfiles } from "@/services/user-profile.service";
import UserProfileDeleteDialog from "./UserProfileDeleteDialog";
import UserProfileDetailDialog from "./UserProfileDetailDialog";

export default function UserProfileTable() {
  const [profiles, setProfiles] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<UserProfile | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    loadProfiles();
  }, []);

  async function loadProfiles() {
    try {
      setLoading(true);
      setProfiles(await getUserProfiles());
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Erro ao carregar perfis.");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete() {
    if (!selected) return;

    try {
      setDeleting(true);
      await deleteUserProfile(selected.id);
      toast.success("Perfil excluído com sucesso!");
      setDeleteOpen(false);
      setSelected(null);
      await loadProfiles();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Erro ao excluir perfil.");
    } finally {
      setDeleting(false);
    }
  }

  const filtered = profiles.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase().trim()) ||
    (p.description ?? "").toLowerCase().includes(search.toLowerCase().trim())
  );

  return (
    <>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <input
          type="text"
          placeholder="Buscar por nome ou descrição..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm shadow-sm focus:border-black focus:outline-none focus:ring-1 focus:ring-black sm:max-w-sm"
        />
        <Link
          href="/perfis/create"
          className="rounded-lg bg-black px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-gray-800"
        >
          + Novo Perfil
        </Link>
      </div>

      <div className="mt-4 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
        {loading ? (
          <div className="px-6 py-12 text-center text-sm text-gray-500">Carregando...</div>
        ) : filtered.length === 0 ? (
          <div className="px-6 py-12 text-center text-sm text-gray-500">
            {search ? "Nenhum perfil encontrado." : "Nenhum perfil cadastrado ainda."}
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead className="border-b border-gray-200 bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left font-semibold text-gray-700">Nome</th>
                <th className="px-6 py-3 text-left font-semibold text-gray-700">Descrição</th>
                <th className="px-6 py-3 text-right font-semibold text-gray-700">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map((profile) => (
                <tr key={profile.id} className="transition-colors hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-gray-900">{profile.name}</td>
                  <td className="px-6 py-4 text-gray-600">{profile.description ?? "—"}</td>
                  <td className="px-6 py-4">
                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => { setSelected(profile); setDetailOpen(true); }}
                        className="rounded-lg px-3 py-1.5 text-xs font-medium text-gray-600 transition-colors hover:bg-gray-100"
                      >
                        Ver
                      </button>
                      <Link
                        href={`/perfis/${profile.id}/edit`}
                        className="rounded-lg px-3 py-1.5 text-xs font-medium text-blue-600 transition-colors hover:bg-blue-50"
                      >
                        Editar
                      </Link>
                      <button
                        type="button"
                        onClick={() => { setSelected(profile); setDeleteOpen(true); }}
                        className="rounded-lg px-3 py-1.5 text-xs font-medium text-red-600 transition-colors hover:bg-red-50"
                      >
                        Excluir
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <UserProfileDetailDialog
        profile={selected}
        isOpen={detailOpen}
        onClose={() => setDetailOpen(false)}
      />

      <UserProfileDeleteDialog
        profileName={selected?.name ?? ""}
        isOpen={deleteOpen}
        isDeleting={deleting}
        onConfirm={handleDelete}
        onCancel={() => setDeleteOpen(false)}
      />
    </>
  );
}
