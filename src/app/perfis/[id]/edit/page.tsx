import { Metadata } from "next";
import Link from "next/link";
import { Toaster } from "react-hot-toast";
import EditUserProfileForm from "./components/EditUserProfileForm";

export const metadata: Metadata = {
  title: "Editar Perfil | Gestão de Frotas",
};

export default async function EditUserProfilePage({
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
          href="/perfis"
          className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-50"
        >
          ← Voltar
        </Link>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Editar Perfil</h2>
          <p className="mt-0.5 text-sm text-gray-500">Atualize os dados e permissões do perfil</p>
        </div>
      </div>
      <EditUserProfileForm profileId={id} />
    </>
  );
}
