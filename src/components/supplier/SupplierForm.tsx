"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import Input from "@/app/companies/create/components/ui/Input";
import Select from "@/app/companies/create/components/ui/Select";
import { supplierSchema, SupplierFormValues } from "@/schemas/supplier.schema";
import SupplierTabs from "@/components/supplier/SupplierTabs";
import SupplierContactsTab from "@/components/supplier/SupplierContactsTab";
import { Supplier, SupplierTabKey } from "@/types/supplier.types";
import { createSupplier, updateSupplier } from "@/services/supplier.service";

const PERSON_TYPE_OPTIONS = [
  { label: "Jurídica", value: "Juridica" },
  { label: "Física", value: "Fisica" },
];

const IE_INDICATOR_OPTIONS = [
  { label: "Não informado", value: "NOT_INFORMED" },
  { label: "Contr. ICMS", value: "CONTRIBUTOR" },
  { label: "Isento", value: "EXEMPT" },
];

const SUPPLIER_TYPE_OPTIONS = [
  { label: "001 - Fornecedor Padrão", value: "001" },
  { label: "002 - Fornecedor de Serviços", value: "002" },
  { label: "003 - Fornecedor de Peças", value: "003" },
];

const PAYMENT_CONDITION_OPTIONS = [
  { label: "À vista", value: "IMMEDIATE" },
  { label: "15 dias", value: "15_DAYS" },
  { label: "30 dias", value: "30_DAYS" },
  { label: "45 dias", value: "45_DAYS" },
  { label: "60 dias", value: "60_DAYS" },
];

const defaultValues: SupplierFormValues = {
  code: "",
  name: "",
  tradeName: "",
  supplierType: "",
  contactName: "",
  quotationContact: "",
  personType: "Juridica",
  cnpj: "",
  cpf: "",
  stateRegistration: "",
  ieIndicator: "",
  rg: "",
  zipCode: "",
  streetType: "",
  street: "",
  number: "",
  complement: "",
  neighborhood: "",
  city: "",
  state: "",
  stateName: "",
  email: "",
  phone: "",
  phone2: "",
  mobile: "",
  fax: "",
  paymentCondition: "",
  paymentDescription: "",
  discountPercentage: "",
  site: "",
  observations: "",
};

interface SupplierFormProps {
  supplierId?: string;
  initialData?: Supplier | null;
}

export default function SupplierForm({ supplierId, initialData }: SupplierFormProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<SupplierTabKey>("general");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [savedSupplierId, setSavedSupplierId] = useState<string | null>(supplierId ?? null);
  const [zipStatus, setZipStatus] = useState("");

  const form = useForm<SupplierFormValues>({
    resolver: zodResolver(supplierSchema),
    mode: "onTouched",
    defaultValues,
  });

  const {
    register,
    formState: { errors },
    handleSubmit,
    watch,
    setValue,
    reset,
  } = form;

  const personType = watch("personType");
  const isJuridica = personType === "Juridica";
  const zipCode = watch("zipCode");

  const fetchZip = useCallback(
    async (raw: string) => {
      const sanitized = raw.replace(/\D/g, "");
      if (sanitized.length !== 8) {
        setZipStatus("");
        return;
      }
      setZipStatus("Buscando CEP...");
      try {
        const res = await fetch(`https://viacep.com.br/ws/${sanitized}/json/`);
        const data = (await res.json()) as {
          erro?: boolean;
          logradouro?: string;
          bairro?: string;
          localidade?: string;
          uf?: string;
        };
        if (data.erro) {
          setZipStatus("CEP não encontrado.");
          return;
        }
        setValue("street", data.logradouro ?? "", { shouldDirty: true });
        setValue("neighborhood", data.bairro ?? "", { shouldDirty: true });
        setValue("city", data.localidade ?? "", { shouldDirty: true });
        setValue("state", data.uf ?? "", { shouldDirty: true });
        setZipStatus("Endereço preenchido automaticamente.");
      } catch {
        setZipStatus("Não foi possível consultar o CEP.");
      }
    },
    [setValue]
  );

  useEffect(() => {
    fetchZip(zipCode ?? "");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [zipCode]);

  useEffect(() => {
    setSavedSupplierId(supplierId ?? null);
  }, [supplierId]);

  useEffect(() => {
    if (!initialData) return;

    reset({
      ...defaultValues,
      code: initialData.code ?? "",
      name: initialData.name ?? "",
      tradeName: initialData.tradeName ?? "",
      supplierType: initialData.supplierType ?? "",
      contactName: initialData.contactName ?? "",
      quotationContact: initialData.quotationContact ?? "",
      personType: (initialData.personType as "Juridica" | "Fisica") ?? "Juridica",
      cnpj: initialData.cnpj ?? "",
      cpf: initialData.cpf ?? "",
      stateRegistration: initialData.stateRegistration ?? "",
      ieIndicator: initialData.ieIndicator ?? "",
      rg: initialData.rg ?? "",
      zipCode: initialData.zipCode ?? "",
      streetType: initialData.streetType ?? "",
      street: initialData.street ?? "",
      number: initialData.number ?? "",
      complement: initialData.complement ?? "",
      neighborhood: initialData.neighborhood ?? "",
      city: initialData.city ?? "",
      state: initialData.state ?? "",
      stateName: initialData.stateName ?? "",
      email: initialData.email ?? "",
      phone: initialData.phone ?? "",
      phone2: initialData.phone2 ?? "",
      mobile: initialData.mobile ?? "",
      fax: initialData.fax ?? "",
      paymentCondition: initialData.paymentCondition ?? "",
      paymentDescription: initialData.paymentDescription ?? "",
      discountPercentage:
        initialData.discountPercentage === undefined || initialData.discountPercentage === null
          ? ""
          : String(initialData.discountPercentage),
      site: initialData.site ?? "",
      observations: initialData.observations ?? "",
    });
  }, [initialData, reset]);

  async function onSubmit(values: SupplierFormValues) {
    setIsSubmitting(true);
    try {
      const payload = {
        code: values.code || undefined,
        name: values.name,
        tradeName: values.tradeName || undefined,
        supplierType: values.supplierType || undefined,
        contactName: values.contactName || undefined,
        quotationContact: values.quotationContact || undefined,
        personType: values.personType || undefined,
        cnpj:
          values.personType === "Juridica" && values.cnpj
            ? values.cnpj.replace(/\D/g, "")
            : undefined,
        cpf:
          values.personType === "Fisica" && values.cpf
            ? values.cpf.replace(/\D/g, "")
            : undefined,
        stateRegistration: values.stateRegistration || undefined,
        ieIndicator: values.ieIndicator || undefined,
        rg: values.rg || undefined,
        zipCode: values.zipCode || undefined,
        streetType: values.streetType || undefined,
        street: values.street || undefined,
        number: values.number || undefined,
        complement: values.complement || undefined,
        neighborhood: values.neighborhood || undefined,
        city: values.city || undefined,
        state: values.state || undefined,
        stateName: values.stateName || undefined,
        email: values.email || undefined,
        phone: values.phone || undefined,
        phone2: values.phone2 || undefined,
        mobile: values.mobile || undefined,
        fax: values.fax || undefined,
        paymentCondition: values.paymentCondition || undefined,
        paymentDescription: values.paymentDescription || undefined,
        discountPercentage: values.discountPercentage
          ? Number(values.discountPercentage.replace(",", "."))
          : null,
        site: values.site || undefined,
        observations: values.observations || undefined,
      };

      if (savedSupplierId) {
        await updateSupplier(savedSupplierId, payload);
        toast.success("Fornecedor atualizado com sucesso.");
        router.push("/suppliers");
        router.refresh();
      } else {
        const created = await createSupplier(payload);
        setSavedSupplierId(created.id);
        toast.success("Fornecedor criado com sucesso.");
        router.push("/suppliers");
        router.refresh();
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : "Falha ao salvar fornecedor.";
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  }

  function renderGeneralDataTab() {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Input
          label="Código do Fornecedor"
          name="code"
          register={register("code")}
          error={errors.code?.message}
          disabled
          placeholder="Gerado automaticamente"
        />
        <Input
          label="Nome do Fornecedor *"
          name="name"
          register={register("name")}
          error={errors.name?.message}
          placeholder="Razão social"
        />
        <Input
          label="Nome Reduzido"
          name="tradeName"
          register={register("tradeName")}
          error={errors.tradeName?.message}
          placeholder="Nome fantasia"
        />
        <Select
          label="Tipo de Fornecedor"
          name="supplierType"
          options={SUPPLIER_TYPE_OPTIONS}
          register={register("supplierType")}
          error={errors.supplierType?.message}
        />
        <Input
          label="Nome do Contato"
          name="contactName"
          register={register("contactName")}
          error={errors.contactName?.message}
        />
        <Input
          label="Contato de Cotação"
          name="quotationContact"
          register={register("quotationContact")}
          error={errors.quotationContact?.message}
        />
      </div>
    );
  }

  function renderDocumentsTab() {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Select
          label="Tipo de Pessoa"
          name="personType"
          options={PERSON_TYPE_OPTIONS}
          register={register("personType")}
          error={errors.personType?.message}
        />
        {isJuridica ? (
          <Input
            label="C.N.P.J."
            name="cnpj"
            mask="99.999.999/9999-99"
            register={register("cnpj")}
            error={errors.cnpj?.message}
            placeholder="00.000.000/0000-00"
          />
        ) : (
          <Input
            label="C.P.F."
            name="cpf"
            mask="999.999.999-99"
            register={register("cpf")}
            error={errors.cpf?.message}
            placeholder="000.000.000-00"
          />
        )}
        <Input
          label="Inscrição Estadual"
          name="stateRegistration"
          register={register("stateRegistration")}
          error={errors.stateRegistration?.message}
        />
        <Select
          label="Indic. IE"
          name="ieIndicator"
          options={IE_INDICATOR_OPTIONS}
          register={register("ieIndicator")}
          error={errors.ieIndicator?.message}
        />
        {!isJuridica && (
          <>
            <Input
              label="C.P.F."
              name="cpf"
              mask="999.999.999-99"
              register={register("cpf")}
              error={errors.cpf?.message}
              placeholder="000.000.000-00"
            />
            <Input
              label="R.G."
              name="rg"
              register={register("rg")}
              error={errors.rg?.message}
            />
          </>
        )}
        {isJuridica && (
          <Input
            label="R.G."
            name="rg"
            register={register("rg")}
            error={errors.rg?.message}
            disabled
          />
        )}
      </div>
    );
  }

  function renderAddressTab() {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Input
          label="C.E.P."
          name="zipCode"
          mask="99999-999"
          register={register("zipCode")}
          error={errors.zipCode?.message}
          placeholder="00000-000"
        />
        {zipStatus && (
          <p className="text-xs text-gray-500 sm:col-span-2 lg:col-span-2">{zipStatus}</p>
        )}
        <Input
          label="Tip. Logr."
          name="streetType"
          register={register("streetType")}
          error={errors.streetType?.message}
          placeholder="Rua, Av., etc."
        />
        <Input
          label="Endereço"
          name="street"
          register={register("street")}
          error={errors.street?.message}
        />
        <Input
          label="Número"
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
          label="Nome do Estado"
          name="stateName"
          register={register("stateName")}
          error={errors.stateName?.message}
        />
        <Input
          label="Email do Fornecedor"
          name="email"
          register={register("email")}
          error={errors.email?.message}
          placeholder="contato@empresa.com"
        />
      </div>
    );
  }

  function renderContactTab() {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Input
          label="Telefone"
          name="phone"
          mask="(99) 99999-9999"
          register={register("phone")}
          error={errors.phone?.message}
        />
        <Input
          label="Telefone 2"
          name="phone2"
          mask="(99) 99999-9999"
          register={register("phone2")}
          error={errors.phone2?.message}
        />
        <Input
          label="Celular"
          name="mobile"
          mask="(99) 99999-9999"
          register={register("mobile")}
          error={errors.mobile?.message}
        />
        <Input
          label="Fax"
          name="fax"
          register={register("fax")}
          error={errors.fax?.message}
        />
      </div>
    );
  }

  function renderFinancialTab() {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Select
            label="Cond. Pagto"
            name="paymentCondition"
            options={PAYMENT_CONDITION_OPTIONS}
            register={register("paymentCondition")}
            error={errors.paymentCondition?.message}
          />
          <Input
            label="Descrição"
            name="paymentDescription"
            register={register("paymentDescription")}
            error={errors.paymentDescription?.message}
          />
          <Input
            label="% Desc"
            name="discountPercentage"
            register={register("discountPercentage")}
            error={errors.discountPercentage?.message}
            placeholder="0 a 100"
          />
          <Input
            label="Site"
            name="site"
            register={register("site")}
            error={errors.site?.message}
            placeholder="https://www.exemplo.com"
          />
        </div>

        <div>
          <label htmlFor="observations" className="mb-1.5 block text-sm font-medium text-gray-700">
            Observações
          </label>
          <textarea
            id="observations"
            rows={4}
            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition-colors placeholder:text-gray-400 focus:border-black focus:ring-1 focus:ring-black"
            placeholder="Adicione observações sobre este fornecedor"
            {...register("observations")}
          />
          {errors.observations?.message ? (
            <span className="mt-1 block text-xs text-red-500">{errors.observations.message}</span>
          ) : null}
        </div>
      </div>
    );
  }

  function renderContactsTab() {
    return <SupplierContactsTab supplierId={savedSupplierId} />;
  }

  function renderActiveTab() {
    if (activeTab === "general") return renderGeneralDataTab();
    if (activeTab === "documents") return renderDocumentsTab();
    if (activeTab === "address") return renderAddressTab();
    if (activeTab === "contact") return renderContactTab();
    if (activeTab === "financial") return renderFinancialTab();
    return renderContactsTab();
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <SupplierTabs activeTab={activeTab} onTabChange={setActiveTab} />

      <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
        {renderActiveTab()}
      </section>

      <div className="flex flex-col items-stretch justify-end gap-3 sm:flex-row">
        <button
          type="button"
          onClick={() => {
            setSavedSupplierId(null);
            reset(defaultValues);
            setActiveTab("general");
          }}
          className="rounded-lg border border-gray-300 px-6 py-3 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
        >
          Novo Fornecedor
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-lg bg-black px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isSubmitting
            ? "Salvando..."
            : savedSupplierId
              ? "Atualizar Fornecedor"
              : "Salvar Fornecedor"}
        </button>
      </div>
    </form>
  );
}
