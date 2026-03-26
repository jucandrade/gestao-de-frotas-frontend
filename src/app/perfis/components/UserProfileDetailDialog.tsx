"use client";

import {
  MENU_LABELS,
  PERMISSION_LABELS,
  UserProfile,
  type MenuPermission,
  type Permissions,
} from "@/types/user-profile.types";

interface UserProfileDetailDialogProps {
  profile: UserProfile | null;
  isOpen: boolean;
  onClose: () => void;
}

const MENU_KEYS = Object.keys(MENU_LABELS) as (keyof Permissions)[];
const PERMISSION_KEYS = Object.keys(PERMISSION_LABELS) as (keyof MenuPermission)[];

export default function UserProfileDetailDialog({
  profile,
  isOpen,
  onClose,
}: UserProfileDetailDialogProps) {
  if (!isOpen || !profile) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="mx-4 max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-6 shadow-xl">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">Detalhes do Perfil</h3>
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
          <div>
            <p className="text-sm font-semibold text-gray-900">{profile.name}</p>
            {profile.description && (
              <p className="mt-1 text-sm text-gray-500">{profile.description}</p>
            )}
          </div>

          <section>
            <h4 className="mb-3 text-xs font-semibold uppercase tracking-wide text-gray-400">
              Permissões de Acesso
            </h4>
            <div className="overflow-hidden rounded-xl border border-gray-200">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2.5 text-left text-xs font-semibold text-gray-600">Módulo</th>
                    {PERMISSION_KEYS.map((key) => (
                      <th key={key} className="px-3 py-2.5 text-center text-xs font-semibold text-gray-600">
                        {PERMISSION_LABELS[key]}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {MENU_KEYS.map((menuKey) => {
                    const perm = profile.permissions[menuKey];
                    return (
                      <tr key={menuKey}>
                        <td className="px-4 py-2.5 font-medium text-gray-700">
                          {MENU_LABELS[menuKey]}
                        </td>
                        {PERMISSION_KEYS.map((permKey) => (
                          <td key={permKey} className="px-3 py-2.5 text-center">
                            {perm?.[permKey] ? (
                              <span className="inline-block h-4 w-4 rounded-full bg-green-500" title="Permitido" />
                            ) : (
                              <span className="inline-block h-4 w-4 rounded-full bg-gray-200" title="Negado" />
                            )}
                          </td>
                        ))}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </section>
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
