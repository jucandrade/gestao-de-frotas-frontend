"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { User, UserPayload } from "@/types/user.types";
import { UserProfile } from "@/types/user-profile.types";
import { createUser, updateUser } from "@/services/user.service";
import { getUserProfiles } from "@/services/user-profile.service";

interface UserFormProps {
  initialData?: User;
}

export default function UserForm({ initialData }: UserFormProps) {
  const router = useRouter();
  const isEdit = !!initialData;

  const [profiles, setProfiles] = useState<UserProfile[]>([]);
  const [form, setForm] = useState<UserPayload>({
    name: initialData?.name ?? "",
    email: initialData?.email ?? "",
    cpf: initialData?.cpf ?? "",
    mobile: initialData?.mobile ?? "",
    password: "",
    profileId: initialData?.profileId ?? "",
  });
  const [errors, setErrors] = useState<Partial<Record<keyof UserPayload, string>>>({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    getUserProfiles()
      .then(setProfiles)
      .catch(() => toast.error("Erro ao carregar perfis."));
  }, []);

  function setField<K extends keyof UserPayload>(key: K, value: UserPayload[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: undefined }));
  }

  function validate(): boolean {
    const newErrors: Partial<Record<keyof UserPayload, string>> = {};

    if (!form.name.trim()) newErrors.name = "Nome é obrigatório.";
    if (!form.email.trim()) newErrors.email = "E-mail é obrigatório.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      newErrors.email = "E-mail inválido.";
    if (!isEdit && !form.password?.trim()) newErrors.password = "Senha é obrigatória.";
    if (form.password && form.password.length < 6)
      newErrors.password = "A senha deve ter no mínimo 6 caracteres.";
    if (!form.profileId) newErrors.profileId = "Perfil é obrigatório.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    try {
      setSubmitting(true);

      const payload: Partial<UserPayload> = {
        name: form.name.trim(),
        email: form.email.trim(),
        cpf: form.cpf?.trim() || undefined,
        mobile: form.mobile?.trim() || undefined,
        profileId: form.profileId,
      };

      if (form.password?.trim()) {
        payload.password = form.password;
      }

      if (isEdit) {
        await updateUser(initialData.id, payload);
        toast.success("Usuário atualizado com sucesso!");
      } else {
        await createUser(payload as UserPayload);
        toast.success("Usuário criado com sucesso!");
      }

      router.push("/usuarios");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Erro ao salvar usuário.");
    } finally {
      setSubmitting(false);
    }
  }

  function fieldClass(error?: string) {
    return (
      "w-full rounded-lg border px-3 py-2 text-sm transition-colors focus:outline-none focus:ring-1 " +
      (error
        ? "border-red-400 focus:border-red-400 focus:ring-red-400"
        : "border-gray-300 focus:border-black focus:ring-black")
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <h3 className="mb-5 text-base font-semibold text-gray-900">Dados do Usuário</h3>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {/* Nome */}
          <div className="sm:col-span-2">
            <label className="mb-1.5 block text-sm font-medium text-gray-700">
              Nome <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setField("name", e.target.value)}
              placeholder="Nome completo"
              className={fieldClass(errors.name)}
            />
            {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name}</p>}
          </div>

          {/* E-mail */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">
              E-mail <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setField("email", e.target.value)}
              placeholder="usuario@exemplo.com"
              className={fieldClass(errors.email)}
            />
            {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
          </div>

          {/* CPF */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">CPF</label>
            <input
              type="text"
              value={form.cpf ?? ""}
              onChange={(e) => setField("cpf", e.target.value)}
              placeholder="000.000.000-00"
              maxLength={14}
              className={fieldClass(errors.cpf)}
            />
            {errors.cpf && <p className="mt-1 text-xs text-red-500">{errors.cpf}</p>}
          </div>

          {/* Celular */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">Celular</label>
            <input
              type="text"
              value={form.mobile ?? ""}
              onChange={(e) => setField("mobile", e.target.value)}
              placeholder="(00) 00000-0000"
              maxLength={15}
              className={fieldClass(errors.mobile)}
            />
            {errors.mobile && <p className="mt-1 text-xs text-red-500">{errors.mobile}</p>}
          </div>

          {/* Perfil */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">
              Perfil do Usuário <span className="text-red-500">*</span>
            </label>
            <select
              value={form.profileId}
              onChange={(e) => setField("profileId", e.target.value)}
              className={fieldClass(errors.profileId)}
            >
              <option value="">Selecione um perfil...</option>
              {profiles.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
            {errors.profileId && <p className="mt-1 text-xs text-red-500">{errors.profileId}</p>}
          </div>
        </div>
      </div>

      {/* Senha */}
      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <h3 className="mb-5 text-base font-semibold text-gray-900">
          {isEdit ? "Alterar Senha" : "Senha de Acesso"}
        </h3>
        {isEdit && (
          <p className="mb-4 text-sm text-gray-500">
            Deixe em branco para manter a senha atual.
          </p>
        )}
        <div className="max-w-sm">
          <label className="mb-1.5 block text-sm font-medium text-gray-700">
            {isEdit ? "Nova Senha" : "Senha"}{" "}
            {!isEdit && <span className="text-red-500">*</span>}
          </label>
          <input
            type="password"
            value={form.password ?? ""}
            onChange={(e) => setField("password", e.target.value)}
            placeholder="Mínimo 6 caracteres"
            autoComplete="new-password"
            className={fieldClass(errors.password)}
          />
          {errors.password && <p className="mt-1 text-xs text-red-500">{errors.password}</p>}
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-3">
        <button
          type="button"
          onClick={() => router.push("/usuarios")}
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
          {submitting ? "Salvando..." : isEdit ? "Salvar Alterações" : "Criar Usuário"}
        </button>
      </div>
    </form>
  );
}
