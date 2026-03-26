import { Metadata } from "next";
import Link from "next/link";
import { Toaster } from "react-hot-toast";
import UserProfileForm from "./components/UserProfileForm";

export const metadata: Metadata = {
  title: "Novo Perfil | Gestão de Frotas",
};

export default function CreateUserProfilePage() {
  return (
    <>
      <Toaster position="top-right" />
      <div className="mb-6 flex items-center gap-3">
        <Link
          href="/perfis"
          className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-50"
        >
          ← Voltar
        </Link>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Novo Perfil</h2>
          <p className="mt-0.5 text-sm text-gray-500">Preencha os dados e configure as permissões</p>
        </div>
      </div>
      <UserProfileForm />
    </>
  );
}
