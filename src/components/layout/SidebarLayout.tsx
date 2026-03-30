"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ReactNode, useState } from "react";

interface SidebarLayoutProps {
  children: ReactNode;
}

function navItemClass(active: boolean, isCollapsed: boolean) {
  const base = "flex items-center gap-3 rounded-lg text-sm transition-colors ";
  const state = active
    ? "bg-black text-white"
    : "text-gray-700 hover:bg-gray-100 hover:text-gray-900";
  const padding = isCollapsed ? "justify-center px-2 py-2" : "px-3 py-2";
  return base + state + " " + padding;
}

/* ── SVG Icons (Heroicons outline, 20×20) ── */

function IconBuilding({ className }: { className?: string }) {
  return (
    <svg className={className ?? "h-5 w-5 shrink-0"} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21" />
    </svg>
  );
}

function IconUsers({ className }: { className?: string }) {
  return (
    <svg className={className ?? "h-5 w-5 shrink-0"} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
    </svg>
  );
}

function IconTruck({ className }: { className?: string }) {
  return (
    <svg className={className ?? "h-5 w-5 shrink-0"} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0H21M3.375 14.25h.008M21 12.75V7.5a1.125 1.125 0 00-.748-1.06l-4.5-1.5A1.125 1.125 0 0015 5.25H3.375A1.125 1.125 0 002.25 6.375v7.875m18-4.5h-2.25a1.125 1.125 0 00-1.125 1.125v3h3.375" />
    </svg>
  );
}

function IconBox({ className }: { className?: string }) {
  return (
    <svg className={className ?? "h-5 w-5 shrink-0"} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
    </svg>
  );
}

function IconUser({ className }: { className?: string }) {
  return (
    <svg className={className ?? "h-5 w-5 shrink-0"} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
    </svg>
  );
}

function IconShield({ className }: { className?: string }) {
  return (
    <svg className={className ?? "h-5 w-5 shrink-0"} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
    </svg>
  );
}

function IconLogout({ className }: { className?: string }) {
  return (
    <svg className={className ?? "h-5 w-5 shrink-0"} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
    </svg>
  );
}

function IconPuzzle({ className }: { className?: string }) {
  return (
    <svg className={className ?? "h-5 w-5 shrink-0"} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M14.25 6.087c0-.355.186-.676.401-.959.221-.29.349-.634.349-1.003 0-1.036-1.007-1.875-2.25-1.875s-2.25.84-2.25 1.875c0 .369.128.713.349 1.003.215.283.401.604.401.959v0a.64.64 0 01-.657.643 48.39 48.39 0 01-4.163-.3c.186 1.613.293 3.25.315 4.907a.656.656 0 01-.658.663v0c-.355 0-.676-.186-.959-.401a1.647 1.647 0 00-1.003-.349c-1.036 0-1.875 1.007-1.875 2.25s.84 2.25 1.875 2.25c.369 0 .713-.128 1.003-.349.283-.215.604-.401.959-.401v0c.31 0 .555.26.532.57a48.039 48.039 0 01-.642 5.056c1.518.19 3.058.309 4.616.354a.64.64 0 00.657-.643v0c0-.355-.186-.676-.401-.959a1.647 1.647 0 01-.349-1.003c0-1.035 1.008-1.875 2.25-1.875 1.243 0 2.25.84 2.25 1.875 0 .369-.128.713-.349 1.003-.215.283-.4.604-.4.959v0c0 .333.277.599.61.58a48.1 48.1 0 005.427-.63 48.05 48.05 0 00.582-4.717.532.532 0 00-.533-.57v0c-.355 0-.676.186-.959.401-.29.221-.634.349-1.003.349-1.035 0-1.875-1.007-1.875-2.25s.84-2.25 1.875-2.25c.37 0 .713.128 1.003.349.283.215.604.401.959.401v0a.656.656 0 00.658-.663 48.422 48.422 0 00-.37-5.36c-1.886.342-3.81.574-5.766.689a.578.578 0 01-.61-.58v0z" />
    </svg>
  );
}

function IconClipboard({ className }: { className?: string }) {
  return (
    <svg className={className ?? "h-5 w-5 shrink-0"} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25z" />
    </svg>
  );
}

function IconCog({ className }: { className?: string }) {
  return (
    <svg className={className ?? "h-5 w-5 shrink-0"} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  );
}

function IconChevron({ open, className }: { open: boolean; className?: string }) {
  return (
    <svg
      className={
        (className ?? "h-4 w-4 shrink-0 text-gray-400 transition-transform duration-200") +
        (open ? " rotate-180" : "")
      }
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
    </svg>
  );
}

function IconMenu({ className }: { className?: string }) {
  return (
    <svg className={className ?? "h-5 w-5"} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
    </svg>
  );
}

function IconClose({ className }: { className?: string }) {
  return (
    <svg className={className ?? "h-5 w-5"} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5M12 17.25h8.25" />
    </svg>
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
            "flex flex-col border-r border-gray-200 bg-white p-4 transition-all duration-200 " +
            (collapsed ? "w-[72px]" : "w-72")
          }
        >
          <div className="mb-6 flex items-center justify-between gap-2">
            {!collapsed ? (
              <div>
                <h1 className="text-lg font-bold text-gray-900">Gestão de Frotas</h1>
                <p className="text-xs text-gray-500">Menu principal</p>
              </div>
            ) : null}

            <button
              type="button"
              onClick={() => setCollapsed((prev) => !prev)}
              className={
                "rounded-lg p-2 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700 " +
                (collapsed ? "mx-auto" : "")
              }
              title={collapsed ? "Expandir menu" : "Recolher menu"}
            >
              {collapsed ? <IconMenu /> : <IconClose />}
            </button>
          </div>

          <nav className="flex-1 space-y-3">
            {/* Cadastro */}
            <div className={collapsed ? "" : "rounded-xl border border-gray-200 bg-gray-50 p-2"}>
              {!collapsed ? (
                <button
                  type="button"
                  onClick={() => setCadastroOpen((prev) => !prev)}
                  className="flex w-full items-center justify-between rounded-lg px-2 py-2 text-left text-xs font-semibold uppercase tracking-wide text-gray-500 hover:bg-gray-100"
                >
                  <div className="flex items-center gap-2">
                    <IconClipboard className="h-4 w-4 shrink-0" />
                    <span>Cadastro</span>
                  </div>
                  <IconChevron open={cadastroOpen} />
                </button>
              ) : null}

              {cadastroOpen ? (
                <ul className={collapsed ? "space-y-1" : "mt-1 space-y-1"}>
                  <li>
                    <Link
                      href="/companies"
                      className={navItemClass(pathname.startsWith("/companies"), collapsed)}
                      title="Empresas"
                    >
                      <IconBuilding />
                      {!collapsed ? <span>Empresas</span> : null}
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/customers"
                      className={navItemClass(pathname.startsWith("/customers"), collapsed)}
                      title="Clientes"
                    >
                      <IconUsers />
                      {!collapsed ? <span>Clientes</span> : null}
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/vehicles"
                      className={navItemClass(pathname.startsWith("/vehicles"), collapsed)}
                      title="Veículos"
                    >
                      <IconTruck />
                      {!collapsed ? <span>Veículos</span> : null}
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/suppliers"
                      className={navItemClass(pathname.startsWith("/suppliers"), collapsed)}
                      title="Fornecedores"
                    >
                      <IconBox />
                      {!collapsed ? <span>Fornecedores</span> : null}
                    </Link>
                  </li>
                </ul>
              ) : null}
            </div>

            {collapsed ? <hr className="border-gray-200" /> : null}

            {/* Gestão do Sistema */}
            <div className={collapsed ? "" : "rounded-xl border border-gray-200 bg-gray-50 p-2"}>
              {!collapsed ? (
                <button
                  type="button"
                  onClick={() => setGestaoOpen((prev) => !prev)}
                  className="flex w-full items-center justify-between rounded-lg px-2 py-2 text-left text-xs font-semibold uppercase tracking-wide text-gray-500 hover:bg-gray-100"
                >
                  <div className="flex items-center gap-2">
                    <IconCog className="h-4 w-4 shrink-0" />
                    <span>Gestão do Sistema</span>
                  </div>
                  <IconChevron open={gestaoOpen} />
                </button>
              ) : null}

              {gestaoOpen ? (
                <ul className={collapsed ? "space-y-1" : "mt-1 space-y-1"}>
                  <li>
                    <Link
                      href="/usuarios"
                      className={navItemClass(pathname.startsWith("/usuarios"), collapsed)}
                      title="Usuários"
                    >
                      <IconUser />
                      {!collapsed ? <span>Usuários</span> : null}
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/perfis"
                      className={navItemClass(pathname.startsWith("/perfis"), collapsed)}
                      title="Perfil do Usuário"
                    >
                      <IconShield />
                      {!collapsed ? <span>Perfil do Usuário</span> : null}
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/integrations"
                      className={navItemClass(pathname.startsWith("/integrations"), collapsed)}
                      title="Integrações"
                    >
                      <IconPuzzle />
                      {!collapsed ? <span>Integrações</span> : null}
                    </Link>
                  </li>
                </ul>
              ) : null}
            </div>
          </nav>

          <div className="border-t border-gray-200 pt-4">
            <button
              type="button"
              onClick={handleLogout}
              className={
                "flex w-full items-center gap-3 rounded-lg text-sm text-red-600 transition-colors hover:bg-red-50 hover:text-red-700 " +
                (collapsed ? "justify-center px-2 py-2" : "px-3 py-2")
              }
              title="Sair do sistema"
            >
              <IconLogout />
              {!collapsed ? <span>Sair do sistema</span> : null}
            </button>
          </div>
        </aside>

        <main className="flex-1 p-6 sm:p-8">{children}</main>
      </div>
    </div>
  );
}