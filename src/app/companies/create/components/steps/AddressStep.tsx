"use client";

import { useEffect, useState } from "react";
import { UseFormReturn } from "react-hook-form";
import { CompanyFormData } from "../../schemas/company.schema";
import Input from "../ui/Input";
import Select from "../ui/Select";

interface AddressStepProps {
  form: UseFormReturn<CompanyFormData>;
}

const STREET_TYPE_OPTIONS = [
  { label: "Rua", value: "Rua" },
  { label: "Avenida", value: "Avenida" },
  { label: "Travessa", value: "Travessa" },
  { label: "Alameda", value: "Alameda" },
  { label: "Praça", value: "Praça" },
];

const STATE_LABELS: Record<string, string> = {
  AC: "Acre",
  AL: "Alagoas",
  AP: "Amapá",
  AM: "Amazonas",
  BA: "Bahia",
  CE: "Ceará",
  DF: "Distrito Federal",
  ES: "Espírito Santo",
  GO: "Goiás",
  MA: "Maranhão",
  MT: "Mato Grosso",
  MS: "Mato Grosso do Sul",
  MG: "Minas Gerais",
  PA: "Pará",
  PB: "Paraíba",
  PR: "Paraná",
  PE: "Pernambuco",
  PI: "Piauí",
  RJ: "Rio de Janeiro",
  RN: "Rio Grande do Norte",
  RS: "Rio Grande do Sul",
  RO: "Rondônia",
  RR: "Roraima",
  SC: "Santa Catarina",
  SP: "São Paulo",
  SE: "Sergipe",
  TO: "Tocantins",
};

type ViaCepResponse = {
  cep?: string;
  logradouro?: string;
  bairro?: string;
  localidade?: string;
  uf?: string;
  ibge?: string;
  erro?: boolean;
};

function splitStreet(logradouro: string): { streetType: string; streetName: string } {
  const normalized = logradouro.trim();
  if (!normalized) {
    return { streetType: "", streetName: "" };
  }

  const knownTypes = ["Rua", "Avenida", "Travessa", "Alameda", "Praça"];
  const matchedType = knownTypes.find((type) => normalized.startsWith(`${type} `));

  if (!matchedType) {
    return { streetType: "", streetName: normalized };
  }

  return {
    streetType: matchedType,
    streetName: normalized.replace(`${matchedType} `, ""),
  };
}

export default function AddressStep({ form }: AddressStepProps) {
  const [zipStatus, setZipStatus] = useState("");

  const {
    register,
    watch,
    setValue,
    formState: { errors },
  } = form;

  const streetType = watch("streetType");
  const streetName = watch("streetName");
  const number = watch("number");
  const complement = watch("complement");
  const neighborhood = watch("neighborhood");
  const cityName = watch("cityName");
  const state = watch("state");
  const zipCode = watch("zipCode");

  useEffect(() => {
    const parts = [
      streetType && streetName ? `${streetType} ${streetName}` : streetName,
      number,
      complement,
      neighborhood,
      cityName,
      state,
    ].filter(Boolean);

    setValue("fullAddress", parts.join(", "));
  }, [streetType, streetName, number, complement, neighborhood, cityName, state, setValue]);

  useEffect(() => {
    const sanitizedZip = (zipCode ?? "").replace(/\D/g, "");

    if (sanitizedZip.length !== 8) {
      setZipStatus("");
      return;
    }

    let cancelled = false;

    async function fetchZipData() {
      try {
        setZipStatus("Buscando CEP...");
        const response = await fetch(`https://viacep.com.br/ws/${sanitizedZip}/json/`);
        const data = (await response.json()) as ViaCepResponse;

        if (cancelled) {
          return;
        }

        if (data.erro) {
          setZipStatus("CEP não encontrado.");
          return;
        }

        const { streetType: parsedStreetType, streetName: parsedStreetName } =
          splitStreet(data.logradouro ?? "");

        if (parsedStreetType) {
          setValue("streetType", parsedStreetType, { shouldDirty: true });
        }

        if (parsedStreetName) {
          setValue("streetName", parsedStreetName, { shouldDirty: true });
        }

        setValue("neighborhood", data.bairro ?? "", { shouldDirty: true });
        setValue("cityName", data.localidade ?? "", { shouldDirty: true });
        setValue("cityCode", data.ibge ?? "", { shouldDirty: true });
        setValue("stateCode", data.uf ?? "", { shouldDirty: true });
        setValue("state", STATE_LABELS[data.uf ?? ""] ?? data.uf ?? "", {
          shouldDirty: true,
        });
        setValue("country", "Brasil", { shouldDirty: true });

        setZipStatus("Endereço preenchido automaticamente.");
      } catch {
        if (!cancelled) {
          setZipStatus("Não foi possível consultar o CEP agora.");
        }
      }
    }

    fetchZipData();

    return () => {
      cancelled = true;
    };
  }, [zipCode, setValue]);

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold text-gray-900">Endereço</h2>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Input
          label="CEP"
          name="zipCode"
          mask="99999-999"
          placeholder="00000-000"
          register={register("zipCode")}
          error={errors.zipCode?.message}
        />
        {zipStatus && (
          <p className="-mt-2 text-xs text-gray-500 sm:col-span-2 lg:col-span-3">{zipStatus}</p>
        )}
        <Select
          label="Tipo de Logradouro"
          name="streetType"
          options={STREET_TYPE_OPTIONS}
          register={register("streetType")}
          error={errors.streetType?.message}
        />
        <Input
          label="Logradouro"
          name="streetName"
          placeholder="Nome da rua"
          register={register("streetName")}
          error={errors.streetName?.message}
        />
        <Input
          label="Número"
          name="number"
          placeholder="Nº"
          register={register("number")}
          error={errors.number?.message}
        />
        <Input
          label="Complemento"
          name="complement"
          placeholder="Apto, sala, etc."
          register={register("complement")}
          error={errors.complement?.message}
        />
        <Input
          label="Bairro"
          name="neighborhood"
          placeholder="Bairro"
          register={register("neighborhood")}
          error={errors.neighborhood?.message}
        />
        <Input
          label="Código da Cidade"
          name="cityCode"
          placeholder="Código IBGE"
          register={register("cityCode")}
          error={errors.cityCode?.message}
        />
        <Input
          label="Cidade"
          name="cityName"
          placeholder="Nome da cidade"
          register={register("cityName")}
          error={errors.cityName?.message}
        />
        <Input
          label="Estado"
          name="state"
          placeholder="Nome do estado"
          register={register("state")}
          error={errors.state?.message}
        />
        <Input
          label="UF"
          name="stateCode"
          placeholder="Ex: SP"
          register={register("stateCode")}
          error={errors.stateCode?.message}
          maxLength={2}
        />
        <Input
          label="País"
          name="country"
          placeholder="País"
          register={register("country")}
          error={errors.country?.message}
        />
      </div>

      <div>
        <Input
          label="Endereço Completo"
          name="fullAddress"
          placeholder="Gerado automaticamente"
          register={register("fullAddress")}
          error={errors.fullAddress?.message}
          disabled
        />
      </div>
    </div>
  );
}
