"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-hot-toast";
import {
  DEFAULT_PERMISSIONS,
  MENU_LABELS,
  PERMISSION_LABELS,
  UserProfile,
  type MenuPermission,
  type Permissions,
} from "@/types/user-profile.types";
import { createUserProfile, updateUserProfile } from "@/services/user-profile.service";

interface UserProfileFormProps {
  initialData?: UserProfile;
}

const MENU_KEYS = Object.keys(MENU_LABELS) as (keyof Permissions)[];
const PERMISSION_KEYS = Object.keys(PERMISSION_LABELS) as (keyof MenuPermission)[];

export default function UserProfileForm({ initialData }: UserProfileFormProps) {
  const router = useRouter();
  const isEdit = !!initialData;

  const [name, setName] = useState(initialData?.name ?? "");
  const [description, setDescription] = useState(initialData?.description ?? "");
  const [permissions, setPermissions] = useState<Permissions>(() => {
    if (initialData?.permissions) {
      // Merge with defaults to ensure all keys exist
      const merged: Permissions = { ...DEFAULT_PERMISSIONS };
      for (const menuKey of MENU_KEYS) {
        merged[menuKey] = {
          ...DEFAULT_PERMISSIONS[menuKey]!,
          ...(initialData.permissions[menuKey] ?? {}),
        } as MenuPermission;
      }
      return merged;
    }
    return { ...DEFAULT_PERMISSIONS };
  });
  const [errors, setErrors] = useState<{ name?: string }>({});
  const [submitting, setSubmitting] = useState(false);

  function togglePermission(menuKey: keyof Permissions, permKey: keyof MenuPermission) {
    setPermissions((prev) => ({
      ...prev,
      [menuKey]: {
        ...prev[menuKey],
        [permKey]: !prev[menuKey]?.[permKey],
      },
    }));
  }

  function toggleAllForMenu(menuKey: keyof Permissions, checked: boolean) {
    const allTrue: MenuPermission = { view: true, create: true, edit: true, delete: true };
    const allFalse: MenuPermission = { view: false, create: false, edit: false, delete: false };
    setPermissions((prev) => ({ ...prev, [menuKey]: checked ? allTrue : allFalse }));
  }

  function isMenuFullyGranted(menuKey: keyof Permissions): boolean {
    const perm = permissions[menuKey];
    if (!perm) return false;
    return PERMISSION_KEYS.every((k) => perm[k]);
  }

  function validate(): boolean {
    const newErrors: { name?: string } = {};
    if (!name.trim()) newErrors.name = "Nome do perfil é obrigatório.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    try {
      setSubmitting(true);
      const payload = { name: name.trim(), description: description.trim() || undefined, permissions };

      if (isEdit) {
        await updateUserProfile(initialData.id, payload);
        toast.success("Perfil atualizado com sucesso!");
      } else {
        await createUserProfile(payload);
        toast.success("Perfil criado com sucesso!");
      }

      router.push("/perfis");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Erro ao salvar perfil.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Dados do Perfil */}
      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <h3 className="mb-5 text-base font-semibold text-gray-900">Dados do Perfil</h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">
              Nome do Perfil <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: Administrador, Cliente, Fornecedor..."
              className={
                "w-full rounded-lg border px-3 py-2 text-sm transition-colors focus:outline-none focus:ring-1 " +
                (errors.name
                  ? "border-red-400 focus:border-red-400 focus:ring-red-400"
                  : "border-gray-300 focus:border-black focus:ring-black")
              }
            />
            {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name}</p>}
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">Descrição</label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Descrição opcional..."
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
            />
          </div>
        </div>
      </div>

      {/* Permissões */}
      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <h3 className="mb-1 text-base font-semibold text-gray-900">Permissões de Acesso</h3>
        <p className="mb-5 text-sm text-gray-500">
          Configure quais operações este perfil pode realizar em cada módulo do sistema.
        </p>

        <div className="overflow-hidden rounded-xl border border-gray-200">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-600">Módulo</th>
                {PERMISSION_KEYS.map((key) => (
                  <th key={key} className="px-4 py-3 text-center text-xs font-semibold text-gray-600">
                    {PERMISSION_LABELS[key]}
                  </th>
                ))}
                <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600">Todos</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {MENU_KEYS.map((menuKey) => (
                <tr key={menuKey} className="hover:bg-gray-50">
                  <td className="px-5 py-3 font-medium text-gray-700">{MENU_LABELS[menuKey]}</td>
                  {PERMISSION_KEYS.map((permKey) => (
                    <td key={permKey} className="px-4 py-3 text-center">
                      <input
                        type="checkbox"
                        checked={permissions[menuKey]?.[permKey] ?? false}
                        onChange={() => togglePermission(menuKey, permKey)}
                        className="h-4 w-4 cursor-pointer rounded border-gray-300 text-black accent-black"
                      />
                    </td>
                  ))}
                  <td className="px-4 py-3 text-center">
                    <input
                      type="checkbox"
                      checked={isMenuFullyGranted(menuKey)}
                      onChange={(e) => toggleAllForMenu(menuKey, e.target.checked)}
                      className="h-4 w-4 cursor-pointer rounded border-gray-300 accent-black"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-3">
        <button
          type="button"
          onClick={() => router.push("/perfis")}
          disabled={submitting}
          className="rounded-lg border border-gray-300 px-5 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:opacity-50"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={submitting}
          className="rounded-lg bg-black px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-gray-800 disabled:opacity-50"
        >
          {submitting ? "Salvando..." : isEdit ? "Salvar Alterações" : "Criar Perfil"}
        </button>
      </div>
    </form>
  );
}
