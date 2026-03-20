"use client";

import { KeyboardEvent, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { companySchema, CompanyFormData } from "../schemas/company.schema";
import { createCompany } from "../services/company.service";
import CompanyFiscalStep from "./steps/CompanyFiscalStep";
import AddressStep from "./steps/AddressStep";
import ContactOthersStep from "./steps/ContactOthersStep";

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

export default function CompanyForm() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<CompanyFormData>({
    resolver: zodResolver(companySchema),
    mode: "onTouched",
    defaultValues: {
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
    },
  });

  async function handleNext() {
    const fieldsToValidate = STEP_FIELDS[currentStep];
    const isValid = await form.trigger(fieldsToValidate);

    if (isValid) {
      setCurrentStep((prev) => Math.min(prev + 1, STEPS.length - 1));
    }
  }

  function handleBack() {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  }

  async function onSubmit(data: CompanyFormData) {
    setIsSubmitting(true);
    try {
      await createCompany(data);
      toast.success("Empresa cadastrada com sucesso!");
      form.reset();
      setCurrentStep(0);
    } catch (error: unknown) {
      const err = error as { statusCode?: number; message?: string };
      if (err.statusCode === 409) {
        toast.error("CNPJ já cadastrado. Verifique os dados e tente novamente.");
      } else {
        toast.error(err.message ?? "Erro ao cadastrar empresa. Tente novamente.");
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

  return (
    <div className="mx-auto w-full max-w-4xl">
      {/* Stepper */}
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
                  (index === currentStep
                    ? " font-semibold text-black"
                    : " text-gray-400")
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

      {/* Form Content */}
      <form onSubmit={(event) => event.preventDefault()} onKeyDown={handleFormEnter}>
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
          {currentStep === 0 && <CompanyFiscalStep form={form} />}
          {currentStep === 1 && <AddressStep form={form} />}
          {currentStep === 2 && <ContactOthersStep form={form} />}
        </div>

        {/* Navigation */}
        <div className="mt-6 flex justify-between">
          <button
            type="button"
            onClick={handleBack}
            disabled={currentStep === 0}
            className="rounded-lg border border-gray-300 px-6 py-3 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:invisible"
          >
            Voltar
          </button>

          {currentStep < STEPS.length - 1 ? (
            <button
              type="button"
              onClick={handleNext}
              className="rounded-lg bg-black px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-gray-800"
            >
              Próximo
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
                  <svg
                    className="h-4 w-4 animate-spin"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
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
                  Enviando...
                </span>
              ) : (
                "Cadastrar Empresa"
              )}
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
