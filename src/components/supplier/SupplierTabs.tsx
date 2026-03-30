"use client";

import { SupplierTabKey } from "@/types/supplier.types";

interface TabItem {
  key: SupplierTabKey;
  label: string;
}

interface SupplierTabsProps {
  activeTab: SupplierTabKey;
  onTabChange: (tab: SupplierTabKey) => void;
}

const TABS: TabItem[] = [
  { key: "general", label: "Dados Gerais" },
  { key: "documents", label: "Documentos" },
  { key: "address", label: "Endereço" },
  { key: "contact", label: "Telefones" },
  { key: "financial", label: "Financeiro" },
  { key: "contacts", label: "Contatos" },
];

export default function SupplierTabs({ activeTab, onTabChange }: SupplierTabsProps) {
  return (
    <nav className="mb-6 overflow-x-auto" aria-label="Supplier tabs">
      <ul className="flex min-w-max items-center gap-2 rounded-xl border border-gray-200 bg-white p-2">
        {TABS.map((tab) => {
          const isActive = tab.key === activeTab;
          return (
            <li key={tab.key}>
              <button
                type="button"
                onClick={() => onTabChange(tab.key)}
                className={
                  "rounded-lg px-4 py-2 text-sm font-medium transition-colors " +
                  (isActive
                    ? "bg-black text-white"
                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900")
                }
              >
                {tab.label}
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
