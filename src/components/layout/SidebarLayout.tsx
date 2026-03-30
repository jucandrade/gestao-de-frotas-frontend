"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ReactNode, useState } from "react";

interface SidebarLayoutProps {
  children: ReactNode;
}

function navItemClass(active: boolean) {
  return (
    "block rounded-lg px-3 py-2 text-sm transition-colors " +
    (active
      ? "bg-black text-white"
      : "text-gray-700 hover:bg-gray-100 hover:text-gray-900")
  );
}

export default function SidebarLayout({ children }: SidebarLayoutProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);
  const [cadastroOpen, setCadastroOpen] = useState(true);
  const [gestaoOpen, setGestaoOpen] = useState(true);

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="flex min-h-screen w-full">
        <aside
          className={
            "border-r border-gray-200 bg-white p-4 transition-all duration-200 " +
            (collapsed ? "w-20" : "w-72")
          }
        >
          <div className="mb-6 flex items-center justify-between gap-2">
            {!collapsed ? (
              <div>
                <h1 className="text-lg font-bold text-gray-900">Gestao de Frotas</h1>
                <p className="text-xs text-gray-500">Menu principal</p>
              </div>
            ) : (
              <span className="text-sm font-bold text-gray-900">GF</span>
            )}

            <button
              type="button"
              onClick={() => setCollapsed((prev) => !prev)}
              className="rounded-md border border-gray-300 px-2 py-1 text-xs font-medium text-gray-700 hover:bg-gray-50"
              title={collapsed ? "Expandir menu" : "Recolher menu"}
            >
              {collapsed ? ">" : "<"}
            </button>
          </div>

          <nav className="space-y-3">
            {/* Cadastro */}
            <div className="rounded-xl border border-gray-200 bg-gray-50 p-2">
              <button
                type="button"
                onClick={() => setCadastroOpen((prev) => !prev)}
                className="flex w-full items-center justify-between rounded-lg px-2 py-2 text-left text-xs font-semibold uppercase tracking-wide text-gray-500 hover:bg-gray-100"
              >
                <span>{collapsed ? "Cad" : "Cadastro"}</span>
                {!collapsed ? <span>{cadastroOpen ? "-" : "+"}</span> : null}
              </button>

              {cadastroOpen ? (
                <ul className="mt-1 space-y-1">
                  <li>
                    <Link
                      href="/companies"
                      className={navItemClass(pathname.startsWith("/companies"))}
                    >
                      {collapsed ? "Emp" : "Empresas"}
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/customers"
                      className={navItemClass(pathname.startsWith("/customers"))}
                    >
                      {collapsed ? "Cli" : "Clientes"}
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/vehicles"
                      className={navItemClass(pathname.startsWith("/vehicles"))}
                    >
                      {collapsed ? "Vei" : "Veículos"}
                    </Link>
                  </li>
                  <li>
                    <button
                      type="button"
                      disabled
                      className="w-full rounded-lg px-3 py-2 text-left text-sm text-gray-400"
                    >
                      {collapsed ? "For" : "Fornecedores (em breve)"}
                    </button>
                  </li>
                </ul>
              ) : null}
            </div>

            {/* Gestão do Sistema */}
            <div className="rounded-xl border border-gray-200 bg-gray-50 p-2">
              <button
                type="button"
                onClick={() => setGestaoOpen((prev) => !prev)}
                className="flex w-full items-center justify-between rounded-lg px-2 py-2 text-left text-xs font-semibold uppercase tracking-wide text-gray-500 hover:bg-gray-100"
              >
                <span>{collapsed ? "Gest" : "Gestão do Sistema"}</span>
                {!collapsed ? <span>{gestaoOpen ? "-" : "+"}</span> : null}
              </button>

              {gestaoOpen ? (
                <ul className="mt-1 space-y-1">
                  <li>
                    <Link
                      href="/usuarios"
                      className={navItemClass(pathname.startsWith("/usuarios"))}
                    >
                      {collapsed ? "Usr" : "Usuários"}
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/perfis"
                      className={navItemClass(pathname.startsWith("/perfis"))}
                    >
                      {collapsed ? "Prf" : "Perfil do Usuário"}
                    </Link>
                  </li>
                </ul>
              ) : null}
            </div>
          </nav>

          <div className="mt-4 border-t border-gray-200 pt-4">
            <button
              type="button"
              onClick={handleLogout}
              className="w-full rounded-lg px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors"
            >
              {collapsed ? "Sair" : "Sair do sistema"}
            </button>
          </div>
        </aside>

        <main className="flex-1 p-6 sm:p-8">{children}</main>
      </div>
    </div>
  );
}