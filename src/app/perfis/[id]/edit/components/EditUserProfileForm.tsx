"use client";

import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { getUserProfile } from "@/services/user-profile.service";
import { UserProfile } from "@/types/user-profile.types";
import UserProfileForm from "@/app/perfis/create/components/UserProfileForm";

interface EditUserProfileFormProps {
  profileId: string;
}

export default function EditUserProfileForm({ profileId }: EditUserProfileFormProps) {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getUserProfile(profileId)
      .then(setProfile)
      .catch((error) => toast.error(error instanceof Error ? error.message : "Erro ao carregar perfil."))
      .finally(() => setLoading(false));
  }, [profileId]);

  if (loading) {
    return <div className="py-12 text-center text-sm text-gray-500">Carregando...</div>;
  }

  if (!profile) {
    return <div className="py-12 text-center text-sm text-red-500">Perfil não encontrado.</div>;
  }

  return <UserProfileForm initialData={profile} />;
}
