"use client";

import { KeyboardEvent, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { CompanyFormData, companySchema } from "@/app/companies/create/schemas/company.schema";
import CompanyFiscalStep from "@/app/companies/create/components/steps/CompanyFiscalStep";
import AddressStep from "@/app/companies/create/components/steps/AddressStep";
import ContactOthersStep from "@/app/companies/create/components/steps/ContactOthersStep";
import { getCompany, updateCompany } from "@/app/companies/services/company.service";

const STEPS = [
  { title: "Empresa e Fiscal", fields: ["companyName", "cnpj"] as const },
  { title: "Endereço", fields: [] as const },
  { title: "Contato e Outros", fields: [] as const },
];

const STEP_FIELDS: Record<number, (keyof CompanyFormData)[]> = {
  0: [
    "companyCode",
    "companyName",
    "tradeName",
    "empCodFW",
    "branchCode",
    "cnpj",
    "stateRegistration",
    "municipalRegistration",
    "cnae",
    "taxRegime",
  ],
  1: [
    "zipCode",
    "streetType",
    "streetName",
    "number",
    "complement",
    "neighborhood",
    "cityCode",
    "cityName",
    "state",
    "stateCode",
    "country",
    "fullAddress",
  ],
  2: ["contactName", "phone", "whatsapp", "email"],
};

interface EditCompanyFormProps {
  companyId: string;
}

function toText(value: unknown): string {
  return typeof value === "string" ? value : "";
}

export default function EditCompanyForm({ companyId }: EditCompanyFormProps) {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const [isLoadingCompany, setIsLoadingCompany] = useState(true);

  const defaultValues = useMemo<CompanyFormData>(
    () => ({
      companyCode: "",
      companyName: "",
      tradeName: "",
      empCodFW: "",
      branchCode: "",
      cnpj: "",
      stateRegistration: "",
      municipalRegistration: "",
      cnae: "",
      taxRegime: "",
      zipCode: "",
      streetType: "",
      streetName: "",
      number: "",
      complement: "",
      neighborhood: "",
      cityCode: "",
      cityName: "",
      state: "",
      stateCode: "",
      country: "",
      fullAddress: "",
      contactName: "",
      phone: "",
      whatsapp: "",
      email: "",
    }),
    []
  );

  const form = useForm<CompanyFormData>({
    resolver: zodResolver(companySchema),
    mode: "onTouched",
    defaultValues,
  });

  useEffect(() => {
    let active = true;

    async function loadCompany() {
      try {
        setIsLoadingCompany(true);
        const company = await getCompany(companyId);

        if (!active) {
          return;
        }

        form.reset({
          companyCode: toText(company.companyCode),
          companyName: toText(company.companyName),
          tradeName: toText(company.tradeName),
          empCodFW: toText(company.empCodFW),
          branchCode: toText(company.branchCode),
          cnpj: toText(company.cnpj),
          stateRegistration: toText(company.stateRegistration),
          municipalRegistration: toText(company.municipalRegistration),
          cnae: toText(company.cnae),
          taxRegime: toText(company.taxRegime),
          zipCode: toText(company.zipCode),
          streetType: toText(company.streetType),
          streetName: toText(company.streetName),
          number: toText(company.number),
          complement: toText(company.complement),
          neighborhood: toText(company.neighborhood),
          cityCode: toText(company.cityCode),
          cityName: toText(company.cityName),
          state: toText(company.state),
          stateCode: toText(company.stateCode),
          country: toText(company.country),
          fullAddress: toText(company.fullAddress),
          contactName: toText(company.contactName),
          phone: toText(company.phone),
          whatsapp: toText(company.whatsapp),
          email: toText(company.email),
        });
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Erro ao carregar dados da empresa.";
        toast.error(message);
      } finally {
        if (active) {
          setIsLoadingCompany(false);
        }
      }
    }

    loadCompany();

    return () => {
      active = false;
    };
  }, [companyId, form]);

  async function handleNext() {
    try {
      setIsValidating(true);
      const fieldsToValidate = STEP_FIELDS[currentStep];
      const isValid = await form.trigger(fieldsToValidate);

      if (isValid) {
        setCurrentStep((prev) => Math.min(prev + 1, STEPS.length - 1));
      } else {
        const errors = form.formState.errors;
        const firstError = Object.values(errors)
          .find((field) => field?.message)?.message as string | undefined;

        if (firstError) {
          toast.error(firstError);
        } else {
          toast.error("Por favor, preencha os campos obrigatórios corretamente.");
        }
      }
    } catch (error) {
      console.error("Validation error:", error);
      toast.error("Erro ao validar formulário. Tente novamente.");
    } finally {
      setIsValidating(false);
    }
  }

  function handleBack() {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  }

  async function onSubmit(data: CompanyFormData) {
    setIsSubmitting(true);
    try {
      const payload = { ...data, cnpj: data.cnpj.replace(/\D/g, "") };
      await updateCompany(companyId, payload);
      toast.success("Empresa atualizada com sucesso!");
      router.push("/companies");
      router.refresh();
    } catch (error: unknown) {
      const err = error as { statusCode?: number; message?: string };
      if (err.statusCode === 409) {
        toast.error("CNPJ já cadastrado. Verifique os dados e tente novamente.");
      } else {
        toast.error(err.message ?? "Erro ao atualizar empresa. Tente novamente.");
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleFinalSubmit() {
    await form.handleSubmit(onSubmit)();
  }

  async function handleFormEnter(event: KeyboardEvent<HTMLFormElement>) {
    if (event.key !== "Enter") {
      return;
    }

    event.preventDefault();

    if (currentStep < STEPS.length - 1) {
      await handleNext();
      return;
    }

    await handleFinalSubmit();
  }

  if (isLoadingCompany) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-black" />
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-4xl">
      <nav className="mb-8" aria-label="Progresso">
        <ol className="flex items-center justify-center gap-2">
          {STEPS.map((step, index) => (
            <li key={step.title} className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => index < currentStep && setCurrentStep(index)}
                disabled={index > currentStep}
                className={
                  "flex h-9 w-9 items-center justify-center rounded-full text-sm font-semibold transition-colors" +
                  (index === currentStep
                    ? " bg-black text-white"
                    : index < currentStep
                      ? " bg-black/10 text-black hover:bg-black/20"
                      : " bg-gray-100 text-gray-400")
                }
              >
                {index + 1}
              </button>
              <span
                className={
                  "hidden text-sm sm:inline" +
                  (index === currentStep ? " font-semibold text-black" : " text-gray-400")
                }
              >
                {step.title}
              </span>
              {index < STEPS.length - 1 && (
                <div
                  className={
                    "mx-2 h-px w-8 sm:w-12" +
                    (index < currentStep ? " bg-black" : " bg-gray-200")
                  }
                />
              )}
            </li>
          ))}
        </ol>
      </nav>

      <form onSubmit={(event) => event.preventDefault()} onKeyDown={handleFormEnter}>
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
          {currentStep === 0 && <CompanyFiscalStep form={form} />}
          {currentStep === 1 && <AddressStep form={form} />}
          {currentStep === 2 && <ContactOthersStep form={form} />}
        </div>

        <div className="mt-6 flex justify-between">
          {currentStep === 0 ? (
            <Link
              href="/companies"
              className="rounded-lg border border-gray-300 px-6 py-3 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
            >
              Cancelar
            </Link>
          ) : (
            <button
              type="button"
              onClick={handleBack}
              className="rounded-lg border border-gray-300 px-6 py-3 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
            >
              Voltar
            </button>
          )}

          {currentStep < STEPS.length - 1 ? (
            <button
              type="button"
              onClick={handleNext}
              disabled={isValidating}
              className="flex items-center gap-2 rounded-lg bg-black px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isValidating ? (
                <>
                  <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                    />
                  </svg>
                  Validando...
                </>
              ) : (
                "Próximo"
              )}
            </button>
          ) : (
            <button
              type="button"
              onClick={handleFinalSubmit}
              disabled={isSubmitting}
              className="rounded-lg bg-black px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                    />
                  </svg>
                  Salvando...
                </span>
              ) : (
                "Salvar Alterações"
              )}
            </button>
          )}
        </div>
      </form>
    </div>
  );
}