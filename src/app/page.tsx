import Link from "next/link";

export default function Home() {
  return (
    <div className="mx-auto w-full max-w-6xl">
      <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
        <h2 className="text-2xl font-bold text-gray-900">Inicio</h2>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-gray-600">
          Selecione uma opcao no menu lateral para acessar os modulos de cadastro.
          Esta estrutura foi preparada para crescimento, incluindo futuras areas como
          fornecedores e veiculos.
        </p>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <Link
            href="/companies"
            className="rounded-xl border border-gray-200 bg-gray-50 p-4 transition-colors hover:bg-gray-100"
          >
            <p className="text-sm font-semibold text-gray-900">Empresas</p>
            <p className="mt-1 text-xs text-gray-600">Gerenciar cadastro de empresas</p>
          </Link>

          <Link
            href="/customers"
            className="rounded-xl border border-gray-200 bg-gray-50 p-4 transition-colors hover:bg-gray-100"
          >
            <p className="text-sm font-semibold text-gray-900">Clientes</p>
            <p className="mt-1 text-xs text-gray-600">Gerenciar cadastro de clientes</p>
          </Link>
        </div>
      </div>
    </div>
  );
}
