"use client";

import { Contract } from "@/types/contract.types";

interface ContractDetailDialogProps {
  contract: Contract | null;
  isOpen: boolean;
  onClose: () => void;
}

function formatDate(dateStr?: string): string {
  if (!dateStr) return "—";
  const d = new Date(dateStr);
  return d.toLocaleDateString("pt-BR");
}

function formatCurrency(value: number): string {
  return value.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
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

export default function ContractDetailDialog({
  contract,
  isOpen,
  onClose,
}: ContractDetailDialogProps) {
  if (!isOpen || !contract) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="mx-4 max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white p-6 shadow-xl">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">Detalhes do Contrato</h3>
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
              Dados Gerais
            </h4>
            <div className="space-y-1.5">
              <InfoRow label="Nº Contrato" value={contract.contractNumber?.toString()} />
              <InfoRow label="Cliente" value={contract.customer?.name || contract.customerName} />
              <InfoRow label="Início" value={formatDate(contract.startDate)} />
              <InfoRow label="Final" value={formatDate(contract.endDate)} />
              <InfoRow label="Tipo" value={contract.contractType} />
              <InfoRow label="Ano" value={contract.contractYear?.toString()} />
              <InfoRow label="Código Extra DR-AC" value={contract.extraCodeDRAC} />
              <InfoRow label="Local de Entrega" value={contract.deliveryLocation} />
            </div>
          </section>

          <section>
            <h4 className="mb-2 text-sm font-semibold uppercase tracking-wide text-gray-400">
              Valores
            </h4>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              <InfoRow label="Valor Total" value={formatCurrency(contract.totalValue)} />
              <InfoRow label="Saldo Geral" value={formatCurrency(contract.generalBalance)} />
              <InfoRow label="% Produto" value={formatCurrency(contract.productPercentage)} />
              <InfoRow label="Valor Produtos" value={formatCurrency(contract.productValue)} />
              <InfoRow label="% Serviço" value={formatCurrency(contract.servicePercentage)} />
              <InfoRow label="Valor Serviços" value={formatCurrency(contract.serviceValue)} />
            </div>
          </section>

          <section>
            <h4 className="mb-2 text-sm font-semibold uppercase tracking-wide text-gray-400">
              Reservas
            </h4>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              <InfoRow label="Reservado" value={formatCurrency(contract.reserved)} />
              <InfoRow label="Saldo Reserva" value={formatCurrency(contract.reserveBalance)} />
              <InfoRow label="Reservado Produto" value={formatCurrency(contract.reservedProduct)} />
              <InfoRow label="Utilizado Produto" value={formatCurrency(contract.usedProduct)} />
              <InfoRow label="Reservado Serviço" value={formatCurrency(contract.reservedService)} />
              <InfoRow label="Utilizados Serviço" value={formatCurrency(contract.usedService)} />
            </div>
          </section>

          {contract.items && contract.items.length > 0 ? (
            <section>
              <h4 className="mb-2 text-sm font-semibold uppercase tracking-wide text-gray-400">
                Itens CTO ({contract.items.length})
              </h4>
              <div className="overflow-x-auto rounded-lg border border-gray-200">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-gray-200 bg-gray-50">
                      <th className="px-3 py-2 font-medium text-gray-600">Sigla</th>
                      <th className="px-3 py-2 font-medium text-gray-600">Nome</th>
                      <th className="px-3 py-2 font-medium text-gray-600">Valor</th>
                      <th className="px-3 py-2 font-medium text-gray-600">Saldo</th>
                    </tr>
                  </thead>
                  <tbody>
                    {contract.items.map((item) => (
                      <tr key={item.id} className="border-b border-gray-100 last:border-0">
                        <td className="px-3 py-2 text-gray-900">{item.ctoAcronym || "—"}</td>
                        <td className="px-3 py-2 text-gray-600">{item.ctoName || "—"}</td>
                        <td className="px-3 py-2 text-gray-600">{formatCurrency(item.value)}</td>
                        <td className="px-3 py-2 text-gray-600">{formatCurrency(item.balance)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          ) : null}
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
