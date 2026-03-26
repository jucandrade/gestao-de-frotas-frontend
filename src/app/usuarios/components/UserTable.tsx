"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { User } from "@/types/user.types";
import { deleteUser, getUsers } from "@/services/user.service";
import UserDeleteDialog from "./UserDeleteDialog";
import UserDetailDialog from "./UserDetailDialog";

function formatCpf(cpf: string): string {
  const digits = cpf.replace(/\D/g, "");
  if (digits.length !== 11) return cpf;
  return digits.replace(/^(\d{3})(\d{3})(\d{3})(\d{2})$/, "$1.$2.$3-$4");
}

export default function UserTable() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<User | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    loadUsers();
  }, []);

  async function loadUsers() {
    try {
      setLoading(true);
      setUsers(await getUsers());
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Erro ao carregar usuários.");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete() {
    if (!selected) return;

    try {
      setDeleting(true);
      await deleteUser(selected.id);
      toast.success("Usuário excluído com sucesso!");
      setDeleteOpen(false);
      setSelected(null);
      await loadUsers();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Erro ao excluir usuário.");
    } finally {
      setDeleting(false);
    }
  }

  const filtered = users.filter((u) => {
    const term = search.toLowerCase().trim();
    return (
      u.name.toLowerCase().includes(term) ||
      u.email.toLowerCase().includes(term) ||
      (u.profile?.name ?? "").toLowerCase().includes(term)
    );
  });

  return (
    <>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <input
          type="text"
          placeholder="Buscar por nome, e-mail ou perfil..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm shadow-sm focus:border-black focus:outline-none focus:ring-1 focus:ring-black sm:max-w-sm"
        />
        <Link
          href="/usuarios/create"
          className="rounded-lg bg-black px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-gray-800"
        >
          + Novo Usuário
        </Link>
      </div>

      <div className="mt-4 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
        {loading ? (
          <div className="px-6 py-12 text-center text-sm text-gray-500">Carregando...</div>
        ) : filtered.length === 0 ? (
          <div className="px-6 py-12 text-center text-sm text-gray-500">
            {search ? "Nenhum usuário encontrado." : "Nenhum usuário cadastrado ainda."}
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead className="border-b border-gray-200 bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left font-semibold text-gray-700">Nome</th>
                <th className="px-6 py-3 text-left font-semibold text-gray-700">E-mail</th>
                <th className="px-6 py-3 text-left font-semibold text-gray-700">CPF</th>
                <th className="px-6 py-3 text-left font-semibold text-gray-700">Perfil</th>
                <th className="px-6 py-3 text-right font-semibold text-gray-700">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map((user) => (
                <tr key={user.id} className="transition-colors hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-gray-900">{user.name}</td>
                  <td className="px-6 py-4 text-gray-600">{user.email}</td>
                  <td className="px-6 py-4 text-gray-600">
                    {user.cpf ? formatCpf(user.cpf) : "—"}
                  </td>
                  <td className="px-6 py-4">
                    {user.profile?.name ? (
                      <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-700">
                        {user.profile.name}
                      </span>
                    ) : (
                      "—"
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => { setSelected(user); setDetailOpen(true); }}
                        className="rounded-lg px-3 py-1.5 text-xs font-medium text-gray-600 transition-colors hover:bg-gray-100"
                      >
                        Ver
                      </button>
                      <Link
                        href={`/usuarios/${user.id}/edit`}
                        className="rounded-lg px-3 py-1.5 text-xs font-medium text-blue-600 transition-colors hover:bg-blue-50"
                      >
                        Editar
                      </Link>
                      <button
                        type="button"
                        onClick={() => { setSelected(user); setDeleteOpen(true); }}
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

      <UserDetailDialog
        user={selected}
        isOpen={detailOpen}
        onClose={() => setDetailOpen(false)}
      />

      <UserDeleteDialog
        userName={selected?.name ?? ""}
        isOpen={deleteOpen}
        isDeleting={deleting}
        onConfirm={handleDelete}
        onCancel={() => setDeleteOpen(false)}
      />
    </>
  );
}
