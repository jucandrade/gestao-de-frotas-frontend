import { Metadata } from "next";
import Link from "next/link";
import { Toaster } from "react-hot-toast";
import EditUserForm from "./components/EditUserForm";

export const metadata: Metadata = {
  title: "Editar Usuário | Gestão de Frotas",
};

export default async function EditUserPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

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
          <h2 className="text-2xl font-bold text-gray-900">Editar Usuário</h2>
          <p className="mt-0.5 text-sm text-gray-500">Atualize os dados do usuário</p>
        </div>
      </div>
      <EditUserForm userId={id} />
    </>
  );
}
