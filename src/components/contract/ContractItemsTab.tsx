"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Input from "@/app/companies/create/components/ui/Input";
import { contractItemSchema, ContractItemFormValues } from "@/schemas/contract.schema";
import { ContractItemPayload } from "@/types/contract.types";

interface ContractItemsTabProps {
  items: ContractItemPayload[];
  onChange: (items: ContractItemPayload[]) => void;
}

const defaultItemValues: ContractItemFormValues = {
  ctoAcronym: "",
  ctoName: "",
  productPercentage: "",
  servicePercentage: "",
  value: "",
  reserved: "",
  productReserve: "",
  usedProduct: "",
  productBalance: "",
  serviceReserve: "",
  usedService: "",
  serviceBalance: "",
  balance: "",
  ctoCategory: "",
};

function parseNumber(v?: string): number | undefined {
  if (!v) return undefined;
  const n = Number(v.replace(",", "."));
  return Number.isNaN(n) ? undefined : n;
}

function formatNumber(v?: number): string {
  if (v === undefined || v === null) return "0,00";
  return v.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export default function ContractItemsTab({ items, onChange }: ContractItemsTabProps) {
  const [formOpen, setFormOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ContractItemFormValues>({
    resolver: zodResolver(contractItemSchema),
    mode: "onTouched",
    defaultValues: defaultItemValues,
  });

  function openNewForm() {
    setEditingIndex(null);
    reset(defaultItemValues);
    setFormOpen(true);
  }

  function openEditForm(index: number) {
    const item = items[index];
    setEditingIndex(index);
    reset({
      ctoAcronym: item.ctoAcronym ?? "",
      ctoName: item.ctoName ?? "",
      productPercentage: item.productPercentage?.toString() ?? "",
      servicePercentage: item.servicePercentage?.toString() ?? "",
      value: item.value?.toString() ?? "",
      reserved: item.reserved?.toString() ?? "",
      productReserve: item.productReserve?.toString() ?? "",
      usedProduct: item.usedProduct?.toString() ?? "",
      productBalance: item.productBalance?.toString() ?? "",
      serviceReserve: item.serviceReserve?.toString() ?? "",
      usedService: item.usedService?.toString() ?? "",
      serviceBalance: item.serviceBalance?.toString() ?? "",
      balance: item.balance?.toString() ?? "",
      ctoCategory: item.ctoCategory ?? "",
    });
    setFormOpen(true);
  }

  function cancelForm() {
    setFormOpen(false);
    setEditingIndex(null);
    reset(defaultItemValues);
  }

  function onSubmit(values: ContractItemFormValues) {
    const payload: ContractItemPayload = {
      ctoAcronym: values.ctoAcronym || undefined,
      ctoName: values.ctoName || undefined,
      productPercentage: parseNumber(values.productPercentage),
      servicePercentage: parseNumber(values.servicePercentage),
      value: parseNumber(values.value),
      reserved: parseNumber(values.reserved),
      productReserve: parseNumber(values.productReserve),
      usedProduct: parseNumber(values.usedProduct),
      productBalance: parseNumber(values.productBalance),
      serviceReserve: parseNumber(values.serviceReserve),
      usedService: parseNumber(values.usedService),
      serviceBalance: parseNumber(values.serviceBalance),
      balance: parseNumber(values.balance),
      ctoCategory: values.ctoCategory || undefined,
    };

    if (editingIndex !== null) {
      const updated = [...items];
      updated[editingIndex] = payload;
      onChange(updated);
    } else {
      onChange([...items, payload]);
    }
    cancelForm();
  }

  function handleRemove(index: number) {
    onChange(items.filter((_, i) => i !== index));
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
          Novo Registro
        </button>
      </div>

      {formOpen && (
        <div className="rounded-xl border border-gray-200 bg-white p-6">
          <h3 className="mb-4 text-sm font-semibold text-gray-800">
            {editingIndex !== null ? "Editar Item CTO" : "Novo Item CTO"}
          </h3>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Input
              label="Sigla da CTO"
              name="ctoAcronym"
              register={register("ctoAcronym")}
              error={errors.ctoAcronym?.message}
            />
            <Input
              label="Nome CTO"
              name="ctoName"
              register={register("ctoName")}
              error={errors.ctoName?.message}
            />
            <Input
              label="% Produto"
              name="productPercentage"
              register={register("productPercentage")}
              error={errors.productPercentage?.message}
              placeholder="0,00"
            />
            <Input
              label="% Serviço"
              name="servicePercentage"
              register={register("servicePercentage")}
              error={errors.servicePercentage?.message}
              placeholder="0,00"
            />
            <Input
              label="Valor"
              name="value"
              register={register("value")}
              error={errors.value?.message}
              placeholder="0,00"
            />
            <Input
              label="Reservado"
              name="reserved"
              register={register("reserved")}
              error={errors.reserved?.message}
              placeholder="0,00"
            />
            <Input
              label="Reserva Produto"
              name="productReserve"
              register={register("productReserve")}
              error={errors.productReserve?.message}
              placeholder="0,00"
            />
            <Input
              label="Util. Produto"
              name="usedProduct"
              register={register("usedProduct")}
              error={errors.usedProduct?.message}
              placeholder="0,00"
            />
            <Input
              label="Saldo Produtos"
              name="productBalance"
              register={register("productBalance")}
              error={errors.productBalance?.message}
              placeholder="0,00"
            />
            <Input
              label="Reserva Serviço"
              name="serviceReserve"
              register={register("serviceReserve")}
              error={errors.serviceReserve?.message}
              placeholder="0,00"
            />
            <Input
              label="Util. Serviço"
              name="usedService"
              register={register("usedService")}
              error={errors.usedService?.message}
              placeholder="0,00"
            />
            <Input
              label="Saldo Serviço"
              name="serviceBalance"
              register={register("serviceBalance")}
              error={errors.serviceBalance?.message}
              placeholder="0,00"
            />
            <Input
              label="Saldo"
              name="balance"
              register={register("balance")}
              error={errors.balance?.message}
              placeholder="0,00"
            />
            <Input
              label="CTO Categ."
              name="ctoCategory"
              register={register("ctoCategory")}
              error={errors.ctoCategory?.message}
            />
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
              onClick={handleSubmit(onSubmit)}
              className="rounded-lg bg-black px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-gray-800"
            >
              {editingIndex !== null ? "Atualizar" : "Adicionar"}
            </button>
          </div>
        </div>
      )}

      {items.length === 0 ? (
        <div className="rounded-xl border border-dashed border-gray-300 bg-gray-50 p-8 text-center">
          <p className="text-sm text-gray-500">Nenhum item CTO adicionado.</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="px-3 py-2 font-medium text-gray-600">Sigla</th>
                <th className="px-3 py-2 font-medium text-gray-600">Nome CTO</th>
                <th className="px-3 py-2 font-medium text-gray-600">% Prod</th>
                <th className="px-3 py-2 font-medium text-gray-600">% Serv</th>
                <th className="px-3 py-2 font-medium text-gray-600">Valor</th>
                <th className="px-3 py-2 font-medium text-gray-600">Reservado</th>
                <th className="hidden px-3 py-2 font-medium text-gray-600 md:table-cell">Res. Prod</th>
                <th className="hidden px-3 py-2 font-medium text-gray-600 md:table-cell">Util. Prod</th>
                <th className="hidden px-3 py-2 font-medium text-gray-600 lg:table-cell">Saldo Prod</th>
                <th className="hidden px-3 py-2 font-medium text-gray-600 lg:table-cell">Res. Serv</th>
                <th className="hidden px-3 py-2 font-medium text-gray-600 lg:table-cell">Util. Serv</th>
                <th className="hidden px-3 py-2 font-medium text-gray-600 lg:table-cell">Saldo Serv</th>
                <th className="px-3 py-2 font-medium text-gray-600">Saldo</th>
                <th className="hidden px-3 py-2 font-medium text-gray-600 md:table-cell">Categ.</th>
                <th className="px-3 py-2 text-right font-medium text-gray-600">Ações</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, index) => (
                <tr key={index} className="border-b border-gray-100 last:border-0 hover:bg-gray-50">
                  <td className="px-3 py-2 text-gray-900">{item.ctoAcronym || "—"}</td>
                  <td className="px-3 py-2 text-gray-600">{item.ctoName || "—"}</td>
                  <td className="px-3 py-2 text-gray-600">{formatNumber(item.productPercentage)}</td>
                  <td className="px-3 py-2 text-gray-600">{formatNumber(item.servicePercentage)}</td>
                  <td className="px-3 py-2 text-gray-600">{formatNumber(item.value)}</td>
                  <td className="px-3 py-2 text-gray-600">{formatNumber(item.reserved)}</td>
                  <td className="hidden px-3 py-2 text-gray-600 md:table-cell">{formatNumber(item.productReserve)}</td>
                  <td className="hidden px-3 py-2 text-gray-600 md:table-cell">{formatNumber(item.usedProduct)}</td>
                  <td className="hidden px-3 py-2 text-gray-600 lg:table-cell">{formatNumber(item.productBalance)}</td>
                  <td className="hidden px-3 py-2 text-gray-600 lg:table-cell">{formatNumber(item.serviceReserve)}</td>
                  <td className="hidden px-3 py-2 text-gray-600 lg:table-cell">{formatNumber(item.usedService)}</td>
                  <td className="hidden px-3 py-2 text-gray-600 lg:table-cell">{formatNumber(item.serviceBalance)}</td>
                  <td className="px-3 py-2 text-gray-600">{formatNumber(item.balance)}</td>
                  <td className="hidden px-3 py-2 text-gray-600 md:table-cell">{item.ctoCategory || "—"}</td>
                  <td className="px-3 py-2">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        type="button"
                        title="Editar"
                        onClick={() => openEditForm(index)}
                        className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
                      >
                        <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <button
                        type="button"
                        title="Excluir"
                        onClick={() => handleRemove(index)}
                        className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-red-50 hover:text-red-600"
                      >
                        <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
