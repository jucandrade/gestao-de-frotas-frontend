"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-hot-toast";
import Input from "@/app/companies/create/components/ui/Input";
import { supplierContactSchema, SupplierContactFormValues } from "@/schemas/supplier.schema";
import { SupplierContact } from "@/types/supplier.types";
import {
  createSupplierContact,
  deleteSupplierContact,
  getSupplierContacts,
  updateSupplierContact,
} from "@/services/supplier-contact.service";

interface SupplierContactsTabProps {
  supplierId: string | null;
}

const defaultContactValues: SupplierContactFormValues = {
  sequence: "",
  name: "",
  positionCode: "",
  positionDescription: "",
  phone: "",
  email: "",
  active: true,
};

export default function SupplierContactsTab({ supplierId }: SupplierContactsTabProps) {
  const [contacts, setContacts] = useState<SupplierContact[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    setValue,
  } = useForm<SupplierContactFormValues>({
    resolver: zodResolver(supplierContactSchema),
    mode: "onTouched",
    defaultValues: defaultContactValues,
  });

  useEffect(() => {
    if (!supplierId) return;
    setLoading(true);
    getSupplierContacts(supplierId)
      .then(setContacts)
      .catch((err) =>
        toast.error(err instanceof Error ? err.message : "Erro ao carregar contatos.")
      )
      .finally(() => setLoading(false));
  }, [supplierId]);

  function openNewForm() {
    setEditingId(null);
    reset(defaultContactValues);
    setFormOpen(true);
  }

  function openEditForm(contact: SupplierContact) {
    setEditingId(contact.id);
    reset({
      sequence: contact.sequence?.toString() ?? "",
      name: contact.name,
      positionCode: contact.positionCode ?? "",
      positionDescription: contact.positionDescription ?? "",
      phone: contact.phone ?? "",
      email: contact.email ?? "",
      active: contact.active,
    });
    setFormOpen(true);
  }

  function cancelForm() {
    setFormOpen(false);
    setEditingId(null);
    reset(defaultContactValues);
  }

  async function onSubmit(values: SupplierContactFormValues) {
    if (!supplierId) return;
    setSubmitting(true);
    try {
      const payload = {
        sequence: values.sequence ? parseInt(values.sequence, 10) : undefined,
        name: values.name,
        positionCode: values.positionCode || undefined,
        positionDescription: values.positionDescription || undefined,
        phone: values.phone || undefined,
        email: values.email || undefined,
        active: values.active,
        supplierId,
      };

      if (editingId) {
        const updated = await updateSupplierContact(editingId, payload);
        setContacts((prev) => prev.map((c) => (c.id === editingId ? updated : c)));
        toast.success("Contato atualizado com sucesso.");
      } else {
        const created = await createSupplierContact(payload);
        setContacts((prev) => [...prev, created]);
        toast.success("Contato criado com sucesso.");
      }
      cancelForm();
    } catch (error) {
      const message = error instanceof Error ? error.message : "Erro ao salvar contato.";
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(contact: SupplierContact) {
    if (!confirm(`Deseja excluir o contato ${contact.name}?`)) return;
    try {
      setDeletingId(contact.id);
      await deleteSupplierContact(contact.id);
      toast.success("Contato excluído.");
      setContacts((prev) => prev.filter((c) => c.id !== contact.id));
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erro ao excluir contato.");
    } finally {
      setDeletingId(null);
    }
  }

  if (!supplierId) {
    return (
      <div className="rounded-xl border border-dashed border-gray-300 bg-gray-50 p-8 text-center">
        <p className="text-sm text-gray-500">
          Salve o fornecedor primeiro para adicionar contatos.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <button
          type="button"
          onClick={openNewForm}
          className="inline-flex items-center gap-2 rounded-lg bg-black px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-gray-800"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Adicionar Contato
        </button>
      </div>

      {formOpen && (
        <div className="rounded-xl border border-gray-200 bg-white p-6">
          <h3 className="mb-4 text-sm font-semibold text-gray-800">
            {editingId ? "Editar Contato" : "Novo Contato"}
          </h3>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <Input
              label="Seq. Contato"
              name="sequence"
              register={register("sequence")}
              error={errors.sequence?.message}
              placeholder="1"
            />
            <Input
              label="Nome do Contato *"
              name="name"
              register={register("name")}
              error={errors.name?.message}
            />
            <Input
              label="Cód. Cargo"
              name="positionCode"
              register={register("positionCode")}
              error={errors.positionCode?.message}
            />
            <Input
              label="Descrição do Cargo"
              name="positionDescription"
              register={register("positionDescription")}
              error={errors.positionDescription?.message}
            />
            <Input
              label="Telefone do Contato"
              name="phone"
              mask="(99) 99999-9999"
              register={register("phone")}
              error={errors.phone?.message}
            />
            <Input
              label="Email do Contato"
              name="email"
              register={register("email")}
              error={errors.email?.message}
            />
          </div>
          <div className="mt-4">
            <label className="flex items-center gap-2 text-sm text-gray-700">
              <input
                type="checkbox"
                className="h-4 w-4 rounded border-gray-300"
                checked={watch("active")}
                onChange={(event) => setValue("active", event.target.checked)}
              />
              Ativo
            </label>
          </div>
          <div className="mt-4 flex justify-end gap-3">
            <button
              type="button"
              onClick={cancelForm}
              className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
            >
              Cancelar
            </button>
            <button
              type="button"
              disabled={submitting}
              onClick={handleSubmit(onSubmit)}
              className="rounded-lg bg-black px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-gray-800 disabled:opacity-50"
            >
              {submitting ? "Salvando..." : editingId ? "Atualizar" : "Salvar"}
            </button>
          </div>
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="h-6 w-6 animate-spin rounded-full border-4 border-gray-200 border-t-black" />
        </div>
      ) : contacts.length === 0 ? (
        <div className="rounded-xl border border-dashed border-gray-300 bg-gray-50 p-8 text-center">
          <p className="text-sm text-gray-500">Nenhum contato cadastrado para este fornecedor.</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="px-4 py-3 font-medium text-gray-600">Seq</th>
                <th className="px-4 py-3 font-medium text-gray-600">Nome</th>
                <th className="hidden px-4 py-3 font-medium text-gray-600 sm:table-cell">Cargo</th>
                <th className="hidden px-4 py-3 font-medium text-gray-600 md:table-cell">Telefone</th>
                <th className="hidden px-4 py-3 font-medium text-gray-600 lg:table-cell">Email</th>
                <th className="px-4 py-3 font-medium text-gray-600">Ativo</th>
                <th className="px-4 py-3 text-right font-medium text-gray-600">Ações</th>
              </tr>
            </thead>
            <tbody>
              {contacts.map((c) => (
                <tr key={c.id} className="border-b border-gray-100 last:border-0 hover:bg-gray-50">
                  <td className="px-4 py-3 text-gray-600">{c.sequence ?? "—"}</td>
                  <td className="px-4 py-3 font-medium text-gray-900">{c.name}</td>
                  <td className="hidden px-4 py-3 text-gray-600 sm:table-cell">
                    {c.positionDescription || c.positionCode || "—"}
                  </td>
                  <td className="hidden px-4 py-3 text-gray-600 md:table-cell">{c.phone || "—"}</td>
                  <td className="hidden px-4 py-3 text-gray-600 lg:table-cell">{c.email || "—"}</td>
                  <td className="px-4 py-3">
                    <span
                      className={
                        "inline-flex rounded-full px-2 py-0.5 text-xs font-medium " +
                        (c.active
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-100 text-gray-600")
                      }
                    >
                      {c.active ? "Sim" : "Não"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        type="button"
                        title="Editar"
                        onClick={() => openEditForm(c)}
                        className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
                      >
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <button
                        type="button"
                        title="Excluir"
                        disabled={deletingId === c.id}
                        onClick={() => handleDelete(c)}
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
