"use client";

import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";

interface IntegrationSetting {
  id: string;
  key: string;
  value: string;
  enabled: boolean;
}

export default function IntegrationsPage() {
  const [apiKey, setApiKey] = useState("");
  const [maskedKey, setMaskedKey] = useState("");
  const [keyEdited, setKeyEdited] = useState(false);
  const [enabled, setEnabled] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showKey, setShowKey] = useState(false);

  useEffect(() => {
    fetch("/api/integrations")
      .then((res) => res.json())
      .then((data: IntegrationSetting[]) => {
        const openai = data.find((s) => s.key === "openai");
        if (openai) {
          setMaskedKey(openai.value);
          setEnabled(openai.enabled);
        }
      })
      .catch(() => toast.error("Erro ao carregar configurações"))
      .finally(() => setLoading(false));
  }, []);

  async function handleSave() {
    setSaving(true);
    try {
      const body: Record<string, unknown> = { key: "openai", enabled };
      if (keyEdited) {
        body.value = apiKey;
      }

      const res = await fetch("/api/integrations", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.message ?? "Erro ao salvar");
      }

      const saved = await res.json().catch(() => null);
      if (saved?.value) {
        setMaskedKey(saved.value);
      }
      setApiKey("");
      setKeyEdited(false);
      setShowKey(false);
      toast.success("Configuração salva com sucesso!");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erro ao salvar configuração");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500">Carregando...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Toaster position="top-right" />

      <div>
        <h1 className="text-2xl font-bold text-gray-900">Integrações</h1>
        <p className="mt-1 text-sm text-gray-500">
          Configure as integrações externas do sistema.
        </p>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm max-w-2xl">
        <div className="flex items-center gap-3 mb-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100">
            <svg className="h-6 w-6 text-green-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
            </svg>
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">OpenAI</h2>
            <p className="text-sm text-gray-500">Assistente virtual com inteligência artificial</p>
          </div>
        </div>

        <div className="space-y-5">
          {/* Toggle */}
          <div className="flex items-center justify-between rounded-lg border border-gray-200 bg-gray-50 px-4 py-3">
            <div>
              <p className="text-sm font-medium text-gray-900">Módulo de Chat</p>
              <p className="text-xs text-gray-500">
                {enabled ? "O assistente está ativo e visível para os usuários" : "O assistente está desativado"}
              </p>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={enabled}
              onClick={() => setEnabled(!enabled)}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                enabled ? "bg-blue-600" : "bg-gray-300"
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                  enabled ? "translate-x-5" : "translate-x-0"
                }`}
              />
            </button>
          </div>

          {/* API Key */}
          <div>
            <label htmlFor="apiKey" className="block text-sm font-medium text-gray-700 mb-1">
              API Key
            </label>
            {maskedKey && !keyEdited && (
              <div className="flex items-center gap-2 mb-2 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2">
                <span className="flex-1 text-sm font-mono text-gray-600">{maskedKey}</span>
                <button
                  type="button"
                  onClick={() => setKeyEdited(true)}
                  className="rounded px-2 py-1 text-xs font-medium text-blue-600 hover:bg-blue-50"
                >
                  Alterar
                </button>
              </div>
            )}
            {(keyEdited || !maskedKey) && (
              <div className="relative">
                <input
                  id="apiKey"
                  type={showKey ? "text" : "password"}
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="sk-..."
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 pr-20 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  autoFocus={keyEdited}
                />
                <button
                  type="button"
                  onClick={() => setShowKey(!showKey)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 rounded px-2 py-1 text-xs text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                >
                  {showKey ? "Ocultar" : "Mostrar"}
                </button>
              </div>
            )}
            <p className="mt-1 text-xs text-gray-400">
              Sua chave é criptografada (AES-256-GCM) antes de ser salva no banco de dados.
            </p>
          </div>

          {/* Save */}
          <div className="flex justify-end pt-2">
            <button
              type="button"
              onClick={handleSave}
              disabled={saving}
              className="rounded-lg bg-blue-600 px-5 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
              {saving ? "Salvando..." : "Salvar"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
