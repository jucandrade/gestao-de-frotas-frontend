---
description: "Gera o front-end completo de cadastro de empresas com Next.js, formulário multi-step, validação Zod e integração com a API backend. Use quando precisar criar a página de cadastro de empresas."
agent: "agent"
---

# Front-end: Cadastro de Empresas

Crie o front-end completo de cadastro de empresas usando **Next.js (App Router)**, **React**, **TypeScript**, **Tailwind CSS**, **React Hook Form** e **Zod**.

## Contrato com o Backend

O DTO do backend define os campos e validações que o front deve espelhar:
- [create-company.dto.ts](../src/companies/dto/create-company.dto.ts)
- Endpoint: `POST http://localhost:3001/companies`
- Campos obrigatórios: `companyName`, `cnpj` (14 dígitos)
- Todos os outros campos são opcionais (`string | undefined`)

## Estrutura de Arquivos

app/companies/create/
├── page.tsx # Página principal com stepper
├── components/
│ ├── CompanyForm.tsx # Container do formulário multi-step
│ ├── steps/
│ │ ├── CompanyFiscalStep.tsx # Step 1: Dados da Empresa + Fiscal
│ │ ├── AddressStep.tsx # Step 2: Endereço
│ │ └── ContactOthersStep.tsx # Step 3: Contato + Outros
│ └── ui/
│ ├── Input.tsx # Input reutilizável com label, erro e máscara
│ ├── Select.tsx # Select reutilizável com label e erro
│ └── FileUpload.tsx # Upload de arquivo (logo)
├── schemas/
│ └── company.schema.ts # Schema Zod espelhando o DTO do backend
└── services/
└── company.service.ts # Chamada POST para a API


## Schema Zod (`schemas/company.schema.ts`)

Criar schema Zod que espelhe exatamente o [DTO do backend](../src/companies/dto/create-company.dto.ts):
- `companyName`: `z.string().min(1)` — obrigatório
- `cnpj`: `z.string().regex(/^\d{14}$/)` — obrigatório, 14 dígitos numéricos (strip máscara antes de validar)
- Todos os outros campos: `z.string().optional().or(z.literal(""))` — opcionais
- Use `z.object()` com todos os campos e exporte o tipo `CompanyFormData` via `z.infer`

## Formulário Multi-Step

### Step 1 — Dados da Empresa + Fiscal
| Campo | Tipo | Obrigatório | Máscara |
|-------|------|-------------|---------|
| companyCode | Input texto | Não | — |
| companyName | Input texto | **Sim** | — |
| tradeName | Input texto | Não | — |
| empCodFW | Input texto | Não | — |
| branchCode | Input texto | Não | — |
| cnpj | Input texto | **Sim** | `XX.XXX.XXX/XXXX-XX` |
| stateRegistration | Input texto | Não | — |
| municipalRegistration | Input texto | Não | — |
| cnae | Input texto | Não | — |
| taxRegime | Select | Não | Opções: Simples Nacional, Lucro Presumido, Lucro Real |

### Step 2 — Endereço
| Campo | Tipo | Obrigatório | Máscara |
|-------|------|-------------|---------|
| zipCode | Input texto | Não | `XXXXX-XXX` |
| streetType | Select | Não | Opções: Rua, Avenida, Travessa, Alameda, Praça |
| streetName | Input texto | Não | — |
| number | Input texto | Não | — |
| complement | Input texto | Não | — |
| neighborhood | Input texto | Não | — |
| cityCode | Input texto | Não | — |
| cityName | Input texto | Não | — |
| state | Input texto | Não | — |
| stateCode | Input texto | Não | 2 caracteres (UF) |
| country | Input texto | Não | — |
| fullAddress | Input texto (readonly, montado automaticamente) | Não | — |

### Step 3 — Contato + Outros
| Campo | Tipo | Obrigatório | Máscara |
|-------|------|-------------|---------|
| phone | Input texto | Não | `(XX) XXXXX-XXXX` |
| fax | Input texto | Não | `(XX) XXXX-XXXX` |
| reportPhones | Input texto | Não | — |
| logoType | Select | Não | Opções: URL, Upload |
| logo | Input texto ou FileUpload (dinâmico conforme logoType) | Não | — |

## Componentes Reutilizáveis (`components/ui/`)

### Input
- Props: `label`, `name`, `mask?`, `error?`, `register` (React Hook Form), `disabled?`, `placeholder?`
- Mostrar mensagem de erro abaixo do campo em vermelho
- Usar `react-input-mask` ou implementar máscara manualmente

### Select
- Props: `label`, `name`, `options`, `error?`, `register`, `placeholder?`
- Opções como array: `{ label: string, value: string }[]`

### FileUpload
- Props: `label`, `name`, `error?`, `onChange`
- Preview da imagem selecionada
- Aceitar apenas imagens (jpg, png, svg)

## Service (`services/company.service.ts`)

```typescript
const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";

export async function createCompany(data: CompanyFormData) {
  const response = await fetch(`${API_URL}/companies`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw error;
  }

  return response.json();
}

UI e UX
Design limpo e minimalista (inspiração Uber)
Responsivo (mobile-first)
Stepper visual no topo mostrando os 3 passos e o passo atual
Botões de navegação: Voltar e Próximo entre steps, Enviar no último step
Validar apenas os campos do step atual antes de avançar
Estado de loading no botão de envio
Toast/notificação de sucesso ao criar empresa
Mostrar erros da API (ex: CNPJ duplicado → 409) em alerta

Convenções

Código em inglês (nomes de variáveis, componentes, funções)
Mensagens de erro e labels em português brasileiro
Tipagem forte — sem any
Cada componente em seu próprio arquivo
"use client" nos componentes que usam hooks