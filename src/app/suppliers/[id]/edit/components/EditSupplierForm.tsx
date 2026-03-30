"use client";

import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import SupplierForm from "@/components/supplier/SupplierForm";
import { Supplier } from "@/types/supplier.types";
import { getSupplier } from "@/services/supplier.service";

interface EditSupplierFormProps {
  supplierId: string;
}

export default function EditSupplierForm({ supplierId }: EditSupplierFormProps) {
  const [supplier, setSupplier] = useState<Supplier | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    async function loadSupplier() {
      try {
        setLoading(true);
        const data = await getSupplier(supplierId);
        if (active) {
          setSupplier(data);
        }
      } catch (error) {
        const message = error instanceof Error ? error.message : "Erro ao carregar fornecedor.";
        toast.error(message);
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadSupplier();

    return () => {
      active = false;
    };
  }, [supplierId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-black" />
      </div>
    );
  }

  return <SupplierForm supplierId={supplierId} initialData={supplier} />;
}
