"use client";

import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import CustomerForm from "@/components/customer/CustomerForm";
import { Customer } from "@/types/customer.types";
import { getCustomer } from "@/services/customer.service";

interface EditCustomerFormProps {
  customerId: string;
}

export default function EditCustomerForm({ customerId }: EditCustomerFormProps) {
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    async function loadCustomer() {
      try {
        setLoading(true);
        const data = await getCustomer(customerId);
        if (active) {
          setCustomer(data);
        }
      } catch (error) {
        const message = error instanceof Error ? error.message : "Erro ao carregar cliente.";
        toast.error(message);
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadCustomer();

    return () => {
      active = false;
    };
  }, [customerId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-black" />
      </div>
    );
  }

  return <CustomerForm customerId={customerId} initialData={customer} />;
}