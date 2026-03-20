"use client";

import { Company } from "@/app/companies/services/company.service";

interface CompanyDetailDialogProps {
  company: Company | null;
  isOpen: boolean;
  onClose: () => void;
}

function formatCnpj(cnpj: string): string {
  const digits = cnpj.replace(/\D/g, "");
  if (digits.length !== 14) return cnpj;
  return digits.replace(
    /^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/,
    "$1.$2.$3/$4-$5"
  );
}

function InfoRow({ label, value }: { label: string; value?: string }) {
  if (!value) return null;
  return (
    <div className="flex flex-col gap-0.5 sm:flex-row sm:gap-2">
      <span className="text-sm font-medium text-gray-500">{label}:</span>
      <span className="text-sm text-gray-900">{value}</span>
    </div>
  );
}

export default function CompanyDetailDialog({
  company,
  isOpen,
  onClose,
}: CompanyDetailDialogProps) {
  if (!isOpen || !company) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="mx-4 max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-2xl bg-white p-6 shadow-xl">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">
            Detalhes da Empresa
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="mt-5 space-y-5">
          <section>
            <h4 className="mb-2 text-sm font-semibold uppercase tracking-wide text-gray-400">
              Dados da Empresa
            </h4>
            <div className="space-y-1.5">
              <InfoRow label="Razão Social" value={company.companyName} />
              <InfoRow label="Nome Fantasia" value={company.tradeName} />
              <InfoRow label="CNPJ" value={company.cnpj ? formatCnpj(company.cnpj) : undefined} />
              <InfoRow label="Inscrição Estadual" value={company.stateRegistration} />
              <InfoRow label="Inscrição Municipal" value={company.municipalRegistration} />
            </div>
          </section>

          <section>
            <h4 className="mb-2 text-sm font-semibold uppercase tracking-wide text-gray-400">
              Endereço
            </h4>
            <div className="space-y-1.5">
              <InfoRow label="CEP" value={company.zipCode} />
              <InfoRow label="Logradouro" value={company.streetName} />
              <InfoRow label="Número" value={company.number} />
              <InfoRow label="Complemento" value={company.complement} />
              <InfoRow label="Bairro" value={company.neighborhood} />
              <InfoRow label="Cidade" value={company.cityName} />
              <InfoRow label="Estado" value={company.state} />
            </div>
          </section>

          <section>
            <h4 className="mb-2 text-sm font-semibold uppercase tracking-wide text-gray-400">
              Contato
            </h4>
            <div className="space-y-1.5">
              <InfoRow label="Nome do Contato" value={company.contactName} />
              <InfoRow label="Telefone" value={company.phone} />
              <InfoRow label="WhatsApp" value={company.whatsapp} />
              <InfoRow label="E-mail" value={company.email} />
            </div>
          </section>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg bg-black px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-gray-800"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
}
