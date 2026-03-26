import { Metadata } from "next";
import { Toaster } from "react-hot-toast";
import UserTable from "./components/UserTable";

export const metadata: Metadata = {
  title: "Usuários | Gestão de Frotas",
};

export default function UsuariosPage() {
  return (
    <>
      <Toaster position="top-right" />
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Usuários</h2>
          <p className="mt-1 text-sm text-gray-500">Gerencie os usuários do sistema</p>
        </div>
      </div>
      <UserTable />
    </>
  );
}
