"use client";

import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { getUser } from "@/services/user.service";
import { User } from "@/types/user.types";
import UserForm from "@/app/usuarios/create/components/UserForm";

interface EditUserFormProps {
  userId: string;
}

export default function EditUserForm({ userId }: EditUserFormProps) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getUser(userId)
      .then(setUser)
      .catch((error) => toast.error(error instanceof Error ? error.message : "Erro ao carregar usuário."))
      .finally(() => setLoading(false));
  }, [userId]);

  if (loading) {
    return <div className="py-12 text-center text-sm text-gray-500">Carregando...</div>;
  }

  if (!user) {
    return <div className="py-12 text-center text-sm text-red-500">Usuário não encontrado.</div>;
  }

  return <UserForm initialData={user} />;
}
