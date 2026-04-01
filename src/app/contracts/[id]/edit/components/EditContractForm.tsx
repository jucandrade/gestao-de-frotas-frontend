"use client";

import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import ContractForm from "@/components/contract/ContractForm";
import { Contract } from "@/types/contract.types";
import { getContract } from "@/services/contract.service";

interface EditContractFormProps {
  contractId: string;
}

export default function EditContractForm({ contractId }: EditContractFormProps) {
  const [contract, setContract] = useState<Contract | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    async function loadContract() {
      try {
        setLoading(true);
        const data = await getContract(contractId);
        if (active) {
          setContract(data);
        }
      } catch (error) {
        const message = error instanceof Error ? error.message : "Erro ao carregar contrato.";
        toast.error(message);
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadContract();

    return () => {
      active = false;
    };
  }, [contractId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-black" />
      </div>
    );
  }

  return <ContractForm contractId={contractId} initialData={contract} />;
}
