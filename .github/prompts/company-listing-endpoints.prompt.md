---
description: "Adiciona os endpoints de listagem, visualização, edição e exclusão de empresas no backend NestJS já existente. Use quando o POST já estiver funcionando e precisar completar o CRUD."
agent: "agent"
---

# Backend: Endpoints de Listagem e Gerenciamento de Empresas

O endpoint `POST /companies` já existe. Adicione os endpoints restantes para que o frontend consiga **listar**, **visualizar**, **editar** e **excluir** empresas.

## Endpoints a Implementar

| Método | Rota | Descrição |
|--------|------|-----------|
| `GET` | `/companies` | Listar todas as empresas |
| `GET` | `/companies/:id` | Buscar empresa por ID |
| `PUT` | `/companies/:id` | Atualizar empresa |
| `DELETE` | `/companies/:id` | Excluir empresa |

---

## Service — adicionar métodos em `companies.service.ts`

```typescript
async findAll(): Promise<Company[]> {
  return this.companyRepository.find({ order: { companyName: "ASC" } });
}

async findOne(id: string): Promise<Company> {
  const company = await this.companyRepository.findOne({ where: { id } });
  if (!company) {
    throw new NotFoundException("Empresa não encontrada.");
  }
  return company;
}

async update(id: string, dto: UpdateCompanyDto): Promise<Company> {
  const company = await this.findOne(id);

  if (dto.cnpj && dto.cnpj !== company.cnpj) {
    const exists = await this.companyRepository.findOne({ where: { cnpj: dto.cnpj } });
    if (exists) {
      throw new ConflictException("Já existe uma empresa com este CNPJ.");
    }
  }

  Object.assign(company, dto);
  return this.companyRepository.save(company);
}

async remove(id: string): Promise<void> {
  const company = await this.findOne(id);
  await this.companyRepository.remove(company);
}
```

Imports necessários no service:
```typescript
import { NotFoundException, ConflictException } from "@nestjs/common";
```

---

## DTO — criar `update-company.dto.ts`

```typescript
import { PartialType } from "@nestjs/mapped-types";
import { CreateCompanyDto } from "./create-company.dto";

export class UpdateCompanyDto extends PartialType(CreateCompanyDto) {}
```

Se `@nestjs/mapped-types` não estiver instalado:
```bash
npm install @nestjs/mapped-types
```

---

## Controller — adicionar rotas em `companies.controller.ts`

```typescript
@Get()
findAll() {
  return this.companiesService.findAll();
}

@Get(":id")
findOne(@Param("id", ParseUUIDPipe) id: string) {
  return this.companiesService.findOne(id);
}

@Put(":id")
update(@Param("id", ParseUUIDPipe) id: string, @Body() dto: UpdateCompanyDto) {
  return this.companiesService.update(id, dto);
}

@Delete(":id")
remove(@Param("id", ParseUUIDPipe) id: string) {
  return this.companiesService.remove(id);
}
```

Imports necessários no controller:
```typescript
import { Get, Put, Delete, Param, Body, ParseUUIDPipe } from "@nestjs/common";
import { UpdateCompanyDto } from "./dto/update-company.dto";
```

---

## Tratamento de Erros

| Cenário | Exceção | HTTP |
|---------|---------|------|
| Empresa não encontrada | `NotFoundException` | `404` |
| CNPJ duplicado no update | `ConflictException` | `409` |

---

## Contrato com o Frontend

- **GET `/companies`** → array ordenado por `companyName`
- **GET `/companies/:id`** → objeto completo da empresa
- **PUT `/companies/:id`** → corpo parcial (só os campos alterados), retorna objeto atualizado
- **DELETE `/companies/:id`** → retorna `200` ou `204`
- O `cnpj` chega sempre com **14 dígitos** (sem máscara)
