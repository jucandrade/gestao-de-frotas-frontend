import { Metadata } from "next";
import { Toaster } from "react-hot-toast";
import UserProfileTable from "./components/UserProfileTable";

export const metadata: Metadata = {
  title: "Perfil do Usuário | Gestão de Frotas",
};

export default function PerfisPage() {
  return (
    <>
      <Toaster position="top-right" />
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Perfil do Usuário</h2>
          <p className="mt-1 text-sm text-gray-500">Gerencie os perfis e permissões de acesso</p>
        </div>
      </div>
      <UserProfileTable />
    </>
  );
}
