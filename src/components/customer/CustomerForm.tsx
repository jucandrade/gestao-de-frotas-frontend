"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import Input from "@/app/companies/create/components/ui/Input";
import Select from "@/app/companies/create/components/ui/Select";
import { customerSchema, CustomerFormValues } from "@/schemas/customer.schema";
import CustomerTabs from "@/components/customer/CustomerTabs";
import CustomerVehiclesTab from "@/components/customer/CustomerVehiclesTab";
import { Customer, CustomerTabKey } from "@/types/customer.types";
import { createCustomer, updateCustomer } from "@/services/customer.service";

const CUSTOMER_TYPE_OPTIONS = [
  { label: "Pessoa Fisica", value: "INDIVIDUAL" },
  { label: "Pessoa Juridica", value: "COMPANY" },
];

const IE_INDICATOR_OPTIONS = [
  { label: "Nao informado", value: "NOT_INFORMED" },
  { label: "Isento", value: "EXEMPT" },
  { label: "Contribuinte", value: "CONTRIBUTOR" },
];

const ORIGIN_CODE_OPTIONS = [
  { label: "01 - Interno", value: "01" },
  { label: "02 - Indicacao", value: "02" },
  { label: "03 - Marketing", value: "03" },
];

const PAYMENT_METHOD_OPTIONS = [
  { label: "PIX", value: "PIX" },
  { label: "Cartao de Credito", value: "CREDIT_CARD" },
  { label: "Cartao de Debito", value: "DEBIT_CARD" },
  { label: "Boleto", value: "BANK_SLIP" },
  { label: "Dinheiro", value: "CASH" },
];

const PAYMENT_CONDITION_OPTIONS = [
  { label: "A vista", value: "IMMEDIATE" },
  { label: "15 dias", value: "15_DAYS" },
  { label: "30 dias", value: "30_DAYS" },
  { label: "45 dias", value: "45_DAYS" },
];

const CLIENT_TYPE_OPTIONS = [
  { label: "Varejo", value: "RETAIL" },
  { label: "Atacado", value: "WHOLESALE" },
  { label: "Parceiro", value: "PARTNER" },
];

const defaultValues: CustomerFormValues = {
  code: "",
  name: "",
  tradeName: "",
  type: "COMPANY",
  cpf: "",
  cnpj: "",
  stateRegistration: "",
  ieIndicator: "NOT_INFORMED",
  originCode: "",
  origin: "",
  mainContact: "",
  email: "",
  phone: "",
  commercialPhone: "",
  mobile: "",
  whatsapp: "",
  allowWhatsapp: true,
  allowEmail: true,
  allowSMS: false,
  allowPhone: true,
  zipCode: "",
  street: "",
  number: "",
  complement: "",
  neighborhood: "",
  city: "",
  state: "",
  cityCode: "",
  country: "Brasil",
  occupationCode: "",
  occupation: "",
  discountPercentage: "",
  paymentMethod: "",
  paymentCondition: "",
  clientType: "",
  clientTypeDescription: "",
  createdAt: "",
  updatedAt: "",
  lastVisit: "",
  status: "Ativo",
  observations: "",
};

interface CustomerFormProps {
  customerId?: string;
  initialData?: Customer | null;
}

export default function CustomerForm({ customerId, initialData }: CustomerFormProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<CustomerTabKey>("general");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [savedCustomerId, setSavedCustomerId] = useState<string | null>(customerId ?? null);
  const [zipStatus, setZipStatus] = useState("");

  const nowIso = useMemo(() => new Date().toISOString(), []);

  const form = useForm<CustomerFormValues>({
    resolver: zodResolver(customerSchema),
    mode: "onTouched",
    defaultValues: {
      ...defaultValues,
      createdAt: nowIso,
      updatedAt: nowIso,
    },
  });

  const {
    register,
    formState: { errors },
    handleSubmit,
    watch,
    setValue,
    reset,
  } = form;

  const customerType = watch("type");
  const isIndividual = customerType === "INDIVIDUAL";
  const zipCode = watch("zipCode");

  const fetchZip = useCallback(
    async (raw: string) => {
      const sanitized = raw.replace(/\D/g, "");
      if (sanitized.length !== 8) { setZipStatus(""); return; }
      setZipStatus("Buscando CEP...");
      try {
        const res = await fetch(`https://viacep.com.br/ws/${sanitized}/json/`);
        const data = await res.json() as { erro?: boolean; logradouro?: string; bairro?: string; localidade?: string; uf?: string; ibge?: string };
        if (data.erro) { setZipStatus("CEP não encontrado."); return; }
        setValue("street", data.logradouro ?? "", { shouldDirty: true });
        setValue("neighborhood", data.bairro ?? "", { shouldDirty: true });
        setValue("city", data.localidade ?? "", { shouldDirty: true });
        setValue("state", data.uf ?? "", { shouldDirty: true });
        setValue("cityCode", data.ibge ?? "", { shouldDirty: true });
        setValue("country", "Brasil", { shouldDirty: true });
        setZipStatus("Endereço preenchido automaticamente.");
      } catch {
        setZipStatus("Não foi possível consultar o CEP.");
      }
    },
    [setValue],
  );

  useEffect(() => {
    fetchZip(zipCode ?? "");
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [zipCode]);

  useEffect(() => {
    setSavedCustomerId(customerId ?? null);
  }, [customerId]);

  useEffect(() => {
    if (!initialData) {
      return;
    }

    reset({
      ...defaultValues,
      code: initialData.code ?? "",
      name: initialData.name ?? "",
      tradeName: initialData.tradeName ?? "",
      type: (initialData.type as "INDIVIDUAL" | "COMPANY") ?? "COMPANY",
      cpf: initialData.cpf ?? "",
      cnpj: initialData.cnpj ?? "",
      stateRegistration: initialData.stateRegistration ?? "",
      ieIndicator: initialData.ieIndicator ?? "NOT_INFORMED",
      originCode: initialData.originCode ?? "",
      origin: initialData.origin ?? "",
      mainContact: initialData.mainContact ?? "",
      email: initialData.email ?? "",
      phone: initialData.phone ?? "",
      commercialPhone: initialData.commercialPhone ?? "",
      mobile: initialData.mobile ?? "",
      whatsapp: initialData.whatsapp ?? "",
      allowWhatsapp: initialData.allowWhatsapp ?? false,
      allowEmail: initialData.allowEmail ?? false,
      allowSMS: initialData.allowSMS ?? false,
      allowPhone: initialData.allowPhone ?? false,
      zipCode: initialData.zipCode ?? "",
      street: initialData.street ?? "",
      number: initialData.number ?? "",
      complement: initialData.complement ?? "",
      neighborhood: initialData.neighborhood ?? "",
      city: initialData.city ?? "",
      state: initialData.state ?? "",
      cityCode: initialData.cityCode ?? "",
      country: initialData.country ?? "Brasil",
      occupationCode: initialData.occupationCode ?? "",
      occupation: initialData.occupation ?? "",
      discountPercentage:
        initialData.discountPercentage === undefined || initialData.discountPercentage === null
          ? ""
          : String(initialData.discountPercentage),
      paymentMethod: initialData.paymentMethod ?? "",
      paymentCondition: initialData.paymentCondition ?? "",
      clientType: initialData.clientType ?? "",
      clientTypeDescription: initialData.clientTypeDescription ?? "",
      observations: initialData.observations ?? "",
    });
  }, [initialData, reset]);

  async function onSubmit(values: CustomerFormValues) {
    setIsSubmitting(true);
    try {
      const payload = {
        code: values.code || undefined,
        name: values.name,
        tradeName: values.tradeName || undefined,
        type: values.type || undefined,
        cpf: values.type === "INDIVIDUAL" && values.cpf ? values.cpf.replace(/\D/g, "") : undefined,
        cnpj: values.type === "COMPANY" && values.cnpj ? values.cnpj.replace(/\D/g, "") : undefined,
        stateRegistration: values.stateRegistration || undefined,
        ieIndicator: values.ieIndicator || undefined,
        originCode: values.originCode || undefined,
        origin: values.origin || undefined,
        mainContact: values.mainContact || undefined,
        email: values.email || undefined,
        phone: values.phone || undefined,
        commercialPhone: values.commercialPhone || undefined,
        mobile: values.mobile || undefined,
        whatsapp: values.whatsapp || undefined,
        allowWhatsapp: values.allowWhatsapp ?? false,
        allowEmail: values.allowEmail ?? false,
        allowSMS: values.allowSMS ?? false,
        allowPhone: values.allowPhone ?? false,
        zipCode: values.zipCode || undefined,
        street: values.street || undefined,
        number: values.number || undefined,
        complement: values.complement || undefined,
        neighborhood: values.neighborhood || undefined,
        city: values.city || undefined,
        state: values.state || undefined,
        cityCode: values.cityCode || undefined,
        country: values.country || undefined,
        occupationCode: values.occupationCode || undefined,
        occupation: values.occupation || undefined,
        discountPercentage: values.discountPercentage
          ? Number(values.discountPercentage.replace(",", "."))
          : null,
        paymentMethod: values.paymentMethod || undefined,
        paymentCondition: values.paymentCondition || undefined,
        clientType: values.clientType || undefined,
        clientTypeDescription: values.clientTypeDescription || undefined,
        observations: values.observations || undefined,
      };

      if (savedCustomerId) {
        await updateCustomer(savedCustomerId, payload);
        toast.success("Cliente atualizado com sucesso.");
        router.push("/customers");
        router.refresh();
      } else {
        const created = await createCustomer(payload);
        setSavedCustomerId(created.id);
        toast.success("Cliente criado com sucesso.");
        router.push("/customers");
        router.refresh();
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : "Falha ao salvar cliente.";
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  }

  function renderGeneralDataTab() {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Input
          label="Codigo"
          name="code"
          register={register("code")}
          error={errors.code?.message}
          disabled
          placeholder="Gerado automaticamente"
        />
        <Input
          label="Nome *"
          name="name"
          register={register("name")}
          error={errors.name?.message}
          placeholder="Razao social"
        />
        <Input
          label="Nome Fantasia"
          name="tradeName"
          register={register("tradeName")}
          error={errors.tradeName?.message}
          placeholder="Nome fantasia"
        />
        <Select
          label="Tipo *"
          name="type"
          options={CUSTOMER_TYPE_OPTIONS}
          register={register("type")}
          error={errors.type?.message}
        />
        {isIndividual ? (
          <Input
            label="CPF *"
            name="cpf"
            mask="999.999.999-99"
            register={register("cpf")}
            error={errors.cpf?.message}
            placeholder="000.000.000-00"
          />
        ) : (
          <Input
            label="CNPJ *"
            name="cnpj"
            mask="99.999.999/9999-99"
            register={register("cnpj")}
            error={errors.cnpj?.message}
            placeholder="00.000.000/0000-00"
          />
        )}
        <Input
          label="Inscricao Estadual"
          name="stateRegistration"
          register={register("stateRegistration")}
          error={errors.stateRegistration?.message}
        />
        <Select
          label="Indicador IE"
          name="ieIndicator"
          options={IE_INDICATOR_OPTIONS}
          register={register("ieIndicator")}
          error={errors.ieIndicator?.message}
        />
        <Select
          label="Codigo de Origem"
          name="originCode"
          options={ORIGIN_CODE_OPTIONS}
          register={register("originCode")}
          error={errors.originCode?.message}
        />
        <Input
          label="Origem"
          name="origin"
          register={register("origin")}
          error={errors.origin?.message}
        />
        <Input
          label="Contato Principal"
          name="mainContact"
          register={register("mainContact")}
          error={errors.mainContact?.message}
        />
        <Input
          label="Email"
          name="email"
          register={register("email")}
          error={errors.email?.message}
          placeholder="contato@empresa.com"
        />
      </div>
    );
  }

  function renderAddressTab() {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Input
          label="CEP"
          name="zipCode"
          mask="99999-999"
          register={register("zipCode")}
          error={errors.zipCode?.message}
          placeholder="00000-000"
        />
        {zipStatus && (
          <p className="text-xs text-gray-500 sm:col-span-2 lg:col-span-3">{zipStatus}</p>
        )}
        <Input
          label="Logradouro"
          name="street"
          register={register("street")}
          error={errors.street?.message}
        />
        <Input
          label="Numero"
          name="number"
          register={register("number")}
          error={errors.number?.message}
        />
        <Input
          label="Complemento"
          name="complement"
          register={register("complement")}
          error={errors.complement?.message}
        />
        <Input
          label="Bairro"
          name="neighborhood"
          register={register("neighborhood")}
          error={errors.neighborhood?.message}
        />
        <Input
          label="Cidade"
          name="city"
          register={register("city")}
          error={errors.city?.message}
        />
        <Input
          label="Estado"
          name="state"
          register={register("state")}
          error={errors.state?.message}
        />
        <Input
          label="Codigo da Cidade"
          name="cityCode"
          register={register("cityCode")}
          error={errors.cityCode?.message}
        />
        <Input
          label="Pais"
          name="country"
          register={register("country")}
          error={errors.country?.message}
        />
      </div>
    );
  }

  function renderContactTab() {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Input
            label="Telefone"
            name="phone"
            mask="(99) 99999-9999"
            register={register("phone")}
            error={errors.phone?.message}
          />
          <Input
            label="Telefone Comercial"
            name="commercialPhone"
            mask="(99) 99999-9999"
            register={register("commercialPhone")}
            error={errors.commercialPhone?.message}
          />
          <Input
            label="Celular"
            name="mobile"
            mask="(99) 99999-9999"
            register={register("mobile")}
            error={errors.mobile?.message}
          />
          <Input
            label="WhatsApp"
            name="whatsapp"
            mask="(99) 99999-9999"
            register={register("whatsapp")}
            error={errors.whatsapp?.message}
          />
        </div>

        <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
          <h3 className="mb-3 text-sm font-semibold text-gray-800">Preferencias de comunicacao</h3>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <label className="flex items-center gap-2 text-sm text-gray-700">
              <input
                type="checkbox"
                className="h-4 w-4 rounded border-gray-300"
                checked={watch("allowWhatsapp")}
                onChange={(event) => setValue("allowWhatsapp", event.target.checked)}
              />
              Permitir WhatsApp
            </label>
            <label className="flex items-center gap-2 text-sm text-gray-700">
              <input
                type="checkbox"
                className="h-4 w-4 rounded border-gray-300"
                checked={watch("allowEmail")}
                onChange={(event) => setValue("allowEmail", event.target.checked)}
              />
              Permitir E-mail
            </label>
            <label className="flex items-center gap-2 text-sm text-gray-700">
              <input
                type="checkbox"
                className="h-4 w-4 rounded border-gray-300"
                checked={watch("allowSMS")}
                onChange={(event) => setValue("allowSMS", event.target.checked)}
              />
              Permitir SMS
            </label>
            <label className="flex items-center gap-2 text-sm text-gray-700">
              <input
                type="checkbox"
                className="h-4 w-4 rounded border-gray-300"
                checked={watch("allowPhone")}
                onChange={(event) => setValue("allowPhone", event.target.checked)}
              />
              Permitir Ligacao
            </label>
          </div>
        </div>
      </div>
    );
  }

  function renderFinancialTab() {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Input
            label="Codigo de Ocupacao"
            name="occupationCode"
            register={register("occupationCode")}
            error={errors.occupationCode?.message}
          />
          <Input
            label="Ocupacao"
            name="occupation"
            register={register("occupation")}
            error={errors.occupation?.message}
          />
          <Input
            label="Percentual de Desconto"
            name="discountPercentage"
            register={register("discountPercentage")}
            error={errors.discountPercentage?.message}
            placeholder="0 a 100"
          />
          <Select
            label="Forma de Pagamento"
            name="paymentMethod"
            options={PAYMENT_METHOD_OPTIONS}
            register={register("paymentMethod")}
            error={errors.paymentMethod?.message}
          />
          <Select
            label="Condicao de Pagamento"
            name="paymentCondition"
            options={PAYMENT_CONDITION_OPTIONS}
            register={register("paymentCondition")}
            error={errors.paymentCondition?.message}
          />
          <Select
            label="Tipo de Cliente"
            name="clientType"
            options={CLIENT_TYPE_OPTIONS}
            register={register("clientType")}
            error={errors.clientType?.message}
          />
          <div className="sm:col-span-2 lg:col-span-3">
            <Input
              label="Descricao do Tipo de Cliente"
              name="clientTypeDescription"
              register={register("clientTypeDescription")}
              error={errors.clientTypeDescription?.message}
            />
          </div>
        </div>

        <div>
          <label htmlFor="observations" className="mb-1.5 block text-sm font-medium text-gray-700">
            Observacoes
          </label>
          <textarea
            id="observations"
            rows={4}
            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition-colors placeholder:text-gray-400 focus:border-black focus:ring-1 focus:ring-black"
            placeholder="Adicione observacoes sobre este cliente"
            {...register("observations")}
          />
          {errors.observations?.message ? (
            <span className="mt-1 block text-xs text-red-500">{errors.observations.message}</span>
          ) : null}
        </div>
      </div>
    );
  }

  function renderVehiclesTab() {
    return <CustomerVehiclesTab customerId={savedCustomerId} />;
  }

  function renderHistoryTab() {
    const events = ["manutencao", "visitas", "atualizacoes"];

    return (
      <div className="rounded-xl border border-dashed border-gray-300 bg-gray-50 p-6">
        <h3 className="mb-4 text-sm font-semibold text-gray-800">Linha do tempo (placeholder)</h3>
        <ul className="space-y-3">
          {events.map((event) => (
            <li key={event} className="flex items-center gap-3 text-sm text-gray-600">
              <span className="h-2 w-2 rounded-full bg-gray-400" />
              Evento futuro: {event}
            </li>
          ))}
        </ul>
        <p className="mt-4 text-xs text-gray-400">
          Estrutura pronta para logs de auditoria/historico vinculados por customerId.
        </p>
      </div>
    );
  }

  function renderActiveTab() {
    if (activeTab === "general") return renderGeneralDataTab();
    if (activeTab === "address") return renderAddressTab();
    if (activeTab === "contact") return renderContactTab();
    if (activeTab === "financial") return renderFinancialTab();
    if (activeTab === "vehicles") return renderVehiclesTab();
    return renderHistoryTab();
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <CustomerTabs activeTab={activeTab} onTabChange={setActiveTab} />

      <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
        {renderActiveTab()}
      </section>

      <div className="flex flex-col items-stretch justify-end gap-3 sm:flex-row">
        <button
          type="button"
          onClick={() => {
            setSavedCustomerId(null);
            reset({ ...defaultValues, createdAt: nowIso, updatedAt: nowIso });
            setActiveTab("general");
          }}
          className="rounded-lg border border-gray-300 px-6 py-3 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
        >
          Novo Cliente
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-lg bg-black px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isSubmitting ? "Salvando..." : savedCustomerId ? "Atualizar Cliente" : "Salvar Cliente"}
        </button>
      </div>
    </form>
  );
}