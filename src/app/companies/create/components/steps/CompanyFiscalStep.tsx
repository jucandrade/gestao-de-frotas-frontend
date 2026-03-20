"use client";

import { UseFormReturn } from "react-hook-form";
import { CompanyFormData } from "../../schemas/company.schema";
import Input from "../ui/Input";
import Select from "../ui/Select";

interface CompanyFiscalStepProps {
  form: UseFormReturn<CompanyFormData>;
}

const TAX_REGIME_OPTIONS = [
  { label: "Simples Nacional", value: "Simples Nacional" },
  { label: "Lucro Presumido", value: "Lucro Presumido" },
  { label: "Lucro Real", value: "Lucro Real" },
];

export default function CompanyFiscalStep({ form }: CompanyFiscalStepProps) {
  const {
    register,
    formState: { errors },
  } = form;

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold text-gray-900">
        Dados da Empresa
      </h2>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Input
          label="Código da Empresa"
          name="companyCode"
          placeholder="Ex: 001"
          register={register("companyCode")}
          error={errors.companyCode?.message}
        />
        <Input
          label="Nome da Empresa *"
          name="companyName"
          placeholder="Razão social"
          register={register("companyName")}
          error={errors.companyName?.message}
        />
        <Input
          label="Nome Fantasia"
          name="tradeName"
          placeholder="Nome fantasia"
          register={register("tradeName")}
          error={errors.tradeName?.message}
        />
        <Input
          label="Código FW"
          name="empCodFW"
          placeholder="Código ERP"
          register={register("empCodFW")}
          error={errors.empCodFW?.message}
        />
        <Input
          label="Código da Filial"
          name="branchCode"
          placeholder="Filial"
          register={register("branchCode")}
          error={errors.branchCode?.message}
        />
      </div>

      <hr className="border-gray-200" />

      <h2 className="text-lg font-semibold text-gray-900">Dados Fiscais</h2>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Input
          label="CNPJ *"
          name="cnpj"
          mask="99.999.999/9999-99"
          placeholder="00.000.000/0000-00"
          register={register("cnpj")}
          error={errors.cnpj?.message}
        />
        <Input
          label="Inscrição Estadual"
          name="stateRegistration"
          placeholder="Inscrição estadual"
          register={register("stateRegistration")}
          error={errors.stateRegistration?.message}
        />
        <Input
          label="Inscrição Municipal"
          name="municipalRegistration"
          placeholder="Inscrição municipal"
          register={register("municipalRegistration")}
          error={errors.municipalRegistration?.message}
        />
        <Input
          label="CNAE"
          name="cnae"
          placeholder="Código CNAE"
          register={register("cnae")}
          error={errors.cnae?.message}
        />
        <Select
          label="Regime Tributário"
          name="taxRegime"
          options={TAX_REGIME_OPTIONS}
          register={register("taxRegime")}
          error={errors.taxRegime?.message}
        />
      </div>
    </div>
  );
}
