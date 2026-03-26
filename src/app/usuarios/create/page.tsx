import { Metadata } from "next";
import Link from "next/link";
import { Toaster } from "react-hot-toast";
import UserForm from "./components/UserForm";

export const metadata: Metadata = {
  title: "Novo Usuário | Gestão de Frotas",
};

export default function CreateUserPage() {
  return (
    <>
      <Toaster position="top-right" />
      <div className="mb-6 flex items-center gap-3">
        <Link
          href="/usuarios"
          className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-50"
        >
          ← Voltar
        </Link>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Novo Usuário</h2>
          <p className="mt-0.5 text-sm text-gray-500">Preencha os dados para criar um novo usuário</p>
        </div>
      </div>
      <UserForm />
    </>
  );
}
