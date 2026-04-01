"use client";

import { ContractTabKey } from "@/types/contract.types";

interface TabItem {
  key: ContractTabKey;
  label: string;
}

interface ContractTabsProps {
  activeTab: ContractTabKey;
  onTabChange: (tab: ContractTabKey) => void;
}

const TABS: TabItem[] = [
  { key: "general", label: "Dados Gerais" },
  { key: "financial", label: "Valores" },
  { key: "reserves", label: "Reservas" },
  { key: "items", label: "Itens CTO" },
];

export default function ContractTabs({ activeTab, onTabChange }: ContractTabsProps) {
  return (
    <nav className="mb-6 overflow-x-auto" aria-label="Contract tabs">
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
