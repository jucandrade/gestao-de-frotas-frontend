"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import Input from "@/app/companies/create/components/ui/Input";
import { contractSchema, ContractFormValues } from "@/schemas/contract.schema";
import ContractTabs from "@/components/contract/ContractTabs";
import ContractItemsTab from "@/components/contract/ContractItemsTab";
import { Contract, ContractTabKey, ContractItemPayload } from "@/types/contract.types";
import { createContract, updateContract } from "@/services/contract.service";
import { getCustomers } from "@/services/customer.service";
import { Customer } from "@/types/customer.types";

const defaultValues: ContractFormValues = {
  contractNumber: "",
  customerId: "",
  customerName: "",
  startDate: "",
  endDate: "",
  contractType: "",
  contractYear: "",
  extraCodeDRAC: "",
  deliveryLocation: "",
  totalValue: "",
  generalBalance: "",
  productPercentage: "",
  productValue: "",
  servicePercentage: "",
  serviceValue: "",
  reserved: "",
  reserveBalance: "",
  reservedProduct: "",
  usedProduct: "",
  reservedService: "",
  usedService: "",
};

function parseNumber(v?: string): number | undefined {
  if (!v) return undefined;
  const n = Number(v.replace(",", "."));
  return Number.isNaN(n) ? undefined : n;
}

function formatDateForInput(dateStr?: string): string {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

interface ContractFormProps {
  contractId?: string;
  initialData?: Contract | null;
}

export default function ContractForm({ contractId, initialData }: ContractFormProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<ContractTabKey>("general");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [savedContractId, setSavedContractId] = useState<string | null>(contractId ?? null);
  const [items, setItems] = useState<ContractItemPayload[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loadingCustomers, setLoadingCustomers] = useState(true);

  const form = useForm<ContractFormValues>({
    resolver: zodResolver(contractSchema),
    mode: "onTouched",
    defaultValues,
  });

  const {
    register,
    formState: { errors },
    handleSubmit,
    reset,
    setValue,
    watch,
  } = form;

  useEffect(() => {
    getCustomers()
      .then(setCustomers)
      .catch(() => toast.error("Erro ao carregar clientes."))
      .finally(() => setLoadingCustomers(false));
  }, []);

  useEffect(() => {
    setSavedContractId(contractId ?? null);
  }, [contractId]);

  useEffect(() => {
    if (!initialData) return;

    reset({
      ...defaultValues,
      contractNumber: initialData.contractNumber?.toString() ?? "",
      customerId: initialData.customerId ?? "",
      customerName: initialData.customerName ?? initialData.customer?.name ?? "",
      startDate: formatDateForInput(initialData.startDate),
      endDate: formatDateForInput(initialData.endDate),
      contractType: initialData.contractType ?? "",
      contractYear: initialData.contractYear?.toString() ?? "",
      extraCodeDRAC: initialData.extraCodeDRAC ?? "",
      deliveryLocation: initialData.deliveryLocation ?? "",
      totalValue: initialData.totalValue?.toString() ?? "",
      generalBalance: initialData.generalBalance?.toString() ?? "",
      productPercentage: initialData.productPercentage?.toString() ?? "",
      productValue: initialData.productValue?.toString() ?? "",
      servicePercentage: initialData.servicePercentage?.toString() ?? "",
      serviceValue: initialData.serviceValue?.toString() ?? "",
      reserved: initialData.reserved?.toString() ?? "",
      reserveBalance: initialData.reserveBalance?.toString() ?? "",
      reservedProduct: initialData.reservedProduct?.toString() ?? "",
      usedProduct: initialData.usedProduct?.toString() ?? "",
      reservedService: initialData.reservedService?.toString() ?? "",
      usedService: initialData.usedService?.toString() ?? "",
    });

    if (initialData.items) {
      setItems(
        initialData.items.map((item) => ({
          ctoAcronym: item.ctoAcronym,
          ctoName: item.ctoName,
          productPercentage: item.productPercentage,
          servicePercentage: item.servicePercentage,
          value: item.value,
          reserved: item.reserved,
          productReserve: item.productReserve,
          usedProduct: item.usedProduct,
          productBalance: item.productBalance,
          serviceReserve: item.serviceReserve,
          usedService: item.usedService,
          serviceBalance: item.serviceBalance,
          balance: item.balance,
          ctoCategory: item.ctoCategory,
        }))
      );
    }
  }, [initialData, reset]);

  async function onSubmit(values: ContractFormValues) {
    setIsSubmitting(true);
    try {
      const payload = {
        contractNumber: values.contractNumber ? parseInt(values.contractNumber, 10) : undefined,
        customerId: values.customerId || undefined,
        customerName: values.customerName || undefined,
        startDate: values.startDate || undefined,
        endDate: values.endDate || undefined,
        contractType: values.contractType || undefined,
        contractYear: values.contractYear ? parseInt(values.contractYear, 10) : undefined,
        extraCodeDRAC: values.extraCodeDRAC || undefined,
        deliveryLocation: values.deliveryLocation || undefined,
        totalValue: parseNumber(values.totalValue),
        generalBalance: parseNumber(values.generalBalance),
        productPercentage: parseNumber(values.productPercentage),
        productValue: parseNumber(values.productValue),
        servicePercentage: parseNumber(values.servicePercentage),
        serviceValue: parseNumber(values.serviceValue),
        reserved: parseNumber(values.reserved),
        reserveBalance: parseNumber(values.reserveBalance),
        reservedProduct: parseNumber(values.reservedProduct),
        usedProduct: parseNumber(values.usedProduct),
        reservedService: parseNumber(values.reservedService),
        usedService: parseNumber(values.usedService),
        items,
      };

      if (savedContractId) {
        await updateContract(savedContractId, payload);
        toast.success("Contrato atualizado com sucesso.");
        router.push("/contracts");
        router.refresh();
      } else {
        const created = await createContract(payload);
        setSavedContractId(created.id);
        toast.success("Contrato criado com sucesso.");
        router.push("/contracts");
        router.refresh();
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : "Falha ao salvar contrato.";
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  }

  function renderGeneralTab() {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Input
          label="Nº Contrato"
          name="contractNumber"
          register={register("contractNumber")}
          error={errors.contractNumber?.message}
          placeholder="0"
        />
        <div className="flex flex-col gap-1.5">
          <label htmlFor="customerId" className="text-sm font-medium text-gray-700">
            Cliente
          </label>
          <select
            id="customerId"
            className={
              "w-full rounded-lg border bg-white px-4 py-3 text-sm text-gray-900 outline-none transition-colors focus:border-black focus:ring-1 focus:ring-black" +
              (errors.customerId?.message ? " border-red-500" : " border-gray-300")
            }
            value={watch("customerId") ?? ""}
            onChange={(e) => {
              const selectedId = e.target.value;
              setValue("customerId", selectedId, { shouldDirty: true });
              const customer = customers.find((c) => c.id === selectedId);
              setValue("customerName", customer?.tradeName || customer?.name || "", { shouldDirty: true });
            }}
          >
            <option value="">{loadingCustomers ? "Carregando..." : "Selecione um cliente..."}</option>
            {customers.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}{c.tradeName ? ` (${c.tradeName})` : ""}{c.cnpj ? ` - ${c.cnpj}` : c.cpf ? ` - ${c.cpf}` : ""}
              </option>
            ))}
          </select>
          {errors.customerId?.message ? (
            <span className="text-xs text-red-500">{errors.customerId.message}</span>
          ) : null}
        </div>
        <Input
          label="Nome Reduzido"
          name="customerName"
          register={register("customerName")}
          error={errors.customerName?.message}
          disabled
        />
        <div className="flex flex-col gap-1.5">
          <label htmlFor="startDate" className="text-sm font-medium text-gray-700">
            Início
          </label>
          <input
            id="startDate"
            type="date"
            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition-colors focus:border-black focus:ring-1 focus:ring-black"
            {...register("startDate")}
          />
          {errors.startDate?.message ? (
            <span className="text-xs text-red-500">{errors.startDate.message}</span>
          ) : null}
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="endDate" className="text-sm font-medium text-gray-700">
            Final Contrato
          </label>
          <input
            id="endDate"
            type="date"
            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition-colors focus:border-black focus:ring-1 focus:ring-black"
            {...register("endDate")}
          />
          {errors.endDate?.message ? (
            <span className="text-xs text-red-500">{errors.endDate.message}</span>
          ) : null}
        </div>
        <Input
          label="Tipo do Contrato"
          name="contractType"
          register={register("contractType")}
          error={errors.contractType?.message}
        />
        <Input
          label="Ano Contrato"
          name="contractYear"
          register={register("contractYear")}
          error={errors.contractYear?.message}
          placeholder="0"
        />
        <Input
          label="Código Extra DR-AC"
          name="extraCodeDRAC"
          register={register("extraCodeDRAC")}
          error={errors.extraCodeDRAC?.message}
        />
        <Input
          label="Local de Entrega"
          name="deliveryLocation"
          register={register("deliveryLocation")}
          error={errors.deliveryLocation?.message}
        />
      </div>
    );
  }

  function renderFinancialTab() {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Input
          label="Valor Total Contrato"
          name="totalValue"
          register={register("totalValue")}
          error={errors.totalValue?.message}
          placeholder="0,00"
        />
        <Input
          label="Saldo Geral"
          name="generalBalance"
          register={register("generalBalance")}
          error={errors.generalBalance?.message}
          placeholder="0,00"
        />
        <Input
          label="% Produto"
          name="productPercentage"
          register={register("productPercentage")}
          error={errors.productPercentage?.message}
          placeholder="0,00"
        />
        <Input
          label="Valor Produtos"
          name="productValue"
          register={register("productValue")}
          error={errors.productValue?.message}
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
          label="Valor Serviços"
          name="serviceValue"
          register={register("serviceValue")}
          error={errors.serviceValue?.message}
          placeholder="0,00"
        />
      </div>
    );
  }

  function renderReservesTab() {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Input
          label="Reservado"
          name="reserved"
          register={register("reserved")}
          error={errors.reserved?.message}
          placeholder="0,00"
        />
        <Input
          label="Saldo Reserva"
          name="reserveBalance"
          register={register("reserveBalance")}
          error={errors.reserveBalance?.message}
          placeholder="0,00"
        />
        <Input
          label="Reservado Produto"
          name="reservedProduct"
          register={register("reservedProduct")}
          error={errors.reservedProduct?.message}
          placeholder="0,00"
        />
        <Input
          label="Utilizado Produto"
          name="usedProduct"
          register={register("usedProduct")}
          error={errors.usedProduct?.message}
          placeholder="0,00"
        />
        <Input
          label="Reservado Serviço"
          name="reservedService"
          register={register("reservedService")}
          error={errors.reservedService?.message}
          placeholder="0,00"
        />
        <Input
          label="Utilizados Serviço"
          name="usedService"
          register={register("usedService")}
          error={errors.usedService?.message}
          placeholder="0,00"
        />
      </div>
    );
  }

  function renderActiveTab() {
    if (activeTab === "general") return renderGeneralTab();
    if (activeTab === "financial") return renderFinancialTab();
    if (activeTab === "reserves") return renderReservesTab();
    return <ContractItemsTab items={items} onChange={setItems} />;
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <ContractTabs activeTab={activeTab} onTabChange={setActiveTab} />

      <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
        {renderActiveTab()}
      </section>

      <div className="flex flex-col items-stretch justify-end gap-3 sm:flex-row">
        <button
          type="button"
          onClick={() => {
            setSavedContractId(null);
            reset(defaultValues);
            setItems([]);
            setActiveTab("general");
          }}
          className="rounded-lg border border-gray-300 px-6 py-3 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
        >
          Novo Contrato
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-lg bg-black px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isSubmitting
            ? "Salvando..."
            : savedContractId
              ? "Atualizar Contrato"
              : "Salvar Contrato"}
        </button>
      </div>
    </form>
  );
}
