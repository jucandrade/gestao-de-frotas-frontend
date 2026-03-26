"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import Input from "@/app/companies/create/components/ui/Input";
import Select from "@/app/companies/create/components/ui/Select";
import { vehicleSchema, VehicleFormValues } from "@/schemas/vehicle.schema";
import { Vehicle } from "@/types/vehicle.types";
import { createVehicle, updateVehicle } from "@/services/vehicle.service";
import { getCustomers } from "@/services/customer.service";
import { Customer } from "@/types/customer.types";

const FUEL_OPTIONS = [
  { label: "Selecione", value: "" },
  { label: "Gasolina", value: "GASOLINA" },
  { label: "Etanol", value: "ETANOL" },
  { label: "Flex", value: "FLEX" },
  { label: "Diesel", value: "DIESEL" },
  { label: "GNV", value: "GNV" },
  { label: "Elétrico", value: "ELETRICO" },
  { label: "Híbrido", value: "HIBRIDO" },
];

const STATUS_OPTIONS = [
  { label: "Ativo", value: "Ativo" },
  { label: "Inativo", value: "Inativo" },
];

const defaultValues: VehicleFormValues = {
  plate: "",
  chassis: "",
  prefix: "",
  manufacturer: "",
  model: "",
  year: "",
  color: "",
  fuel: "",
  renavam: "",
  status: "Ativo",
  customerId: "",
};

interface VehicleFormProps {
  vehicleId?: string;
  initialData?: Vehicle | null;
  preselectedCustomerId?: string;
}

export default function VehicleForm({ vehicleId, initialData, preselectedCustomerId }: VehicleFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [savedVehicleId, setSavedVehicleId] = useState<string | null>(vehicleId ?? null);
  const [customers, setCustomers] = useState<Customer[]>([]);

  const {
    register,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm<VehicleFormValues>({
    resolver: zodResolver(vehicleSchema),
    mode: "onTouched",
    defaultValues: {
      ...defaultValues,
      customerId: preselectedCustomerId ?? "",
    },
  });

  useEffect(() => {
    getCustomers()
      .then(setCustomers)
      .catch(() => {/* silently ignore */});
  }, []);

  useEffect(() => {
    setSavedVehicleId(vehicleId ?? null);
  }, [vehicleId]);

  useEffect(() => {
    if (!initialData) return;
    reset({
      plate: initialData.plate ?? "",
      chassis: initialData.chassis ?? "",
      prefix: initialData.prefix ?? "",
      manufacturer: initialData.manufacturer ?? "",
      model: initialData.model ?? "",
      year: initialData.year !== undefined && initialData.year !== null ? String(initialData.year) : "",
      color: initialData.color ?? "",
      fuel: initialData.fuel ?? "",
      renavam: initialData.renavam ?? "",
      status: initialData.status ?? "Ativo",
      customerId: initialData.customerId ?? "",
    });
  }, [initialData, reset]);

  const customerOptions = [
    { label: "Nenhum", value: "" },
    ...customers.map((c) => ({ label: c.name, value: c.id })),
  ];

  async function onSubmit(values: VehicleFormValues) {
    setIsSubmitting(true);
    try {
      const payload = {
        plate: values.plate.toUpperCase().replace(/[^A-Z0-9]/g, ""),
        chassis: values.chassis || undefined,
        prefix: values.prefix || undefined,
        manufacturer: values.manufacturer || undefined,
        model: values.model || undefined,
        year: values.year ? Number(values.year) : undefined,
        color: values.color || undefined,
        fuel: values.fuel || undefined,
        renavam: values.renavam || undefined,
        status: values.status || "Ativo",
        customerId: values.customerId || undefined,
      };

      if (savedVehicleId) {
        await updateVehicle(savedVehicleId, payload);
        toast.success("Veículo atualizado com sucesso.");
        router.push("/vehicles");
        router.refresh();
      } else {
        const created = await createVehicle(payload);
        setSavedVehicleId(created.id);
        toast.success("Veículo cadastrado com sucesso.");
        router.push("/vehicles");
        router.refresh();
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : "Falha ao salvar veículo.";
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Dados do Veículo */}
      <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
        <h2 className="mb-5 text-base font-semibold text-gray-800">Dados do Veículo</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Input
            label="Placa *"
            name="plate"
            register={register("plate")}
            error={errors.plate?.message}
            placeholder="ABC1D23"
          />
          <Input
            label="Nº Chassi"
            name="chassis"
            register={register("chassis")}
            error={errors.chassis?.message}
            placeholder="Número do chassi"
          />
          <Input
            label="Prefixo / Tipo"
            name="prefix"
            register={register("prefix")}
            error={errors.prefix?.message}
            placeholder="Prefixo ou tipo"
          />
          <Input
            label="Fabricante / Marca"
            name="manufacturer"
            register={register("manufacturer")}
            error={errors.manufacturer?.message}
            placeholder="Ex: Honda, Fiat"
          />
          <Input
            label="Modelo"
            name="model"
            register={register("model")}
            error={errors.model?.message}
            placeholder="Ex: NXR160 Bros, Fiorino"
          />
          <Input
            label="Ano"
            name="year"
            register={register("year")}
            error={errors.year?.message}
            placeholder="Ex: 2023"
          />
          <Input
            label="Cor"
            name="color"
            register={register("color")}
            error={errors.color?.message}
            placeholder="Ex: Prata"
          />
          <Select
            label="Combustível"
            name="fuel"
            options={FUEL_OPTIONS}
            register={register("fuel")}
            error={errors.fuel?.message}
          />
          <Input
            label="Renavam"
            name="renavam"
            register={register("renavam")}
            error={errors.renavam?.message}
            placeholder="Número do Renavam"
          />
          <Select
            label="Status"
            name="status"
            options={STATUS_OPTIONS}
            register={register("status")}
            error={errors.status?.message}
          />
        </div>
      </section>

      {/* Vínculo com Cliente */}
      <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
        <h2 className="mb-5 text-base font-semibold text-gray-800">Vínculo com Cliente</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Select
            label="Cliente"
            name="customerId"
            options={customerOptions}
            register={register("customerId")}
            error={errors.customerId?.message}
          />
        </div>
      </section>

      <div className="flex flex-col items-stretch justify-end gap-3 sm:flex-row">
        <button
          type="button"
          onClick={() => {
            setSavedVehicleId(null);
            reset({ ...defaultValues, customerId: preselectedCustomerId ?? "" });
          }}
          className="rounded-lg border border-gray-300 px-6 py-3 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
        >
          Novo Veículo
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="rounded-lg border border-gray-300 px-6 py-3 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-lg bg-black px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isSubmitting ? "Salvando..." : savedVehicleId ? "Atualizar Veículo" : "Salvar Veículo"}
        </button>
      </div>
    </form>
  );
}
