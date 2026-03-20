---
description: "Gera os endpoints CRUD completos de empresas no backend NestJS. Use quando precisar criar o módulo de empresas com POST, GET, PUT e DELETE."
agent: "agent"
---

# Backend: CRUD de Empresas (NestJS)

Crie o módulo completo de **empresas** no backend **NestJS** com **TypeORM** e **PostgreSQL**, incluindo entity, DTOs, service, controller e module.

## Endpoints Esperados

| Método | Rota | Descrição | Status Sucesso |
|--------|------|-----------|----------------|
| `POST` | `/companies` | Criar empresa | `201 Created` |
| `GET` | `/companies` | Listar todas as empresas | `200 OK` |
| `GET` | `/companies/:id` | Buscar empresa por ID | `200 OK` |
| `PUT` | `/companies/:id` | Atualizar empresa | `200 OK` |
| `DELETE` | `/companies/:id` | Excluir empresa | `200 OK` ou `204 No Content` |

---

## Entity (`entities/company.entity.ts`)

Crie a entity TypeORM com as seguintes colunas. Apenas `companyName` e `cnpj` são obrigatórios; todo o restante é `nullable: true`.

```typescript
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from "typeorm";

@Entity("companies")
export class Company {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  // Dados da Empresa
  @Column({ nullable: true })
  companyCode?: string;

  @Column()
  companyName: string;

  @Column({ nullable: true })
  tradeName?: string;

  @Column({ nullable: true })
  empCodFW?: string;

  @Column({ nullable: true })
  branchCode?: string;

  // Fiscal
  @Column({ unique: true })
  cnpj: string;

  @Column({ nullable: true })
  stateRegistration?: string;

  @Column({ nullable: true })
  municipalRegistration?: string;

  @Column({ nullable: true })
  cnae?: string;

  @Column({ nullable: true })
  taxRegime?: string;

  // Endereço
  @Column({ nullable: true })
  zipCode?: string;

  @Column({ nullable: true })
  streetType?: string;

  @Column({ nullable: true })
  streetName?: string;

  @Column({ nullable: true })
  number?: string;

  @Column({ nullable: true })
  complement?: string;

  @Column({ nullable: true })
  neighborhood?: string;

  @Column({ nullable: true })
  cityCode?: string;

  @Column({ nullable: true })
  cityName?: string;

  @Column({ nullable: true })
  state?: string;

  @Column({ nullable: true, length: 2 })
  stateCode?: string;

  @Column({ nullable: true })
  country?: string;

  @Column({ nullable: true })
  fullAddress?: string;

  // Contato
  @Column({ nullable: true })
  contactName?: string;

  @Column({ nullable: true })
  phone?: string;

  @Column({ nullable: true })
  whatsapp?: string;

  @Column({ nullable: true })
  email?: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
```

---

## DTOs

### `create-company.dto.ts`

Usar `class-validator` e `class-transformer`. Campos obrigatórios: `companyName` e `cnpj`. Todos os outros são opcionais.

```typescript
import { IsNotEmpty, IsOptional, IsString, Length } from "class-validator";

export class CreateCompanyDto {
  @IsOptional() @IsString()
  companyCode?: string;

  @IsNotEmpty({ message: "Nome da empresa é obrigatório" })
  @IsString()
  companyName: string;

  @IsOptional() @IsString()
  tradeName?: string;

  @IsOptional() @IsString()
  empCodFW?: string;

  @IsOptional() @IsString()
  branchCode?: string;

  @IsNotEmpty({ message: "CNPJ é obrigatório" })
  @IsString()
  @Length(14, 14, { message: "CNPJ deve conter exatamente 14 dígitos" })
  cnpj: string;

  @IsOptional() @IsString()
  stateRegistration?: string;

  @IsOptional() @IsString()
  municipalRegistration?: string;

  @IsOptional() @IsString()
  cnae?: string;

  @IsOptional() @IsString()
  taxRegime?: string;

  @IsOptional() @IsString()
  zipCode?: string;

  @IsOptional() @IsString()
  streetType?: string;

  @IsOptional() @IsString()
  streetName?: string;

  @IsOptional() @IsString()
  number?: string;

  @IsOptional() @IsString()
  complement?: string;

  @IsOptional() @IsString()
  neighborhood?: string;

  @IsOptional() @IsString()
  cityCode?: string;

  @IsOptional() @IsString()
  cityName?: string;

  @IsOptional() @IsString()
  state?: string;

  @IsOptional() @IsString()
  @Length(2, 2)
  stateCode?: string;

  @IsOptional() @IsString()
  country?: string;

  @IsOptional() @IsString()
  fullAddress?: string;

  @IsOptional() @IsString()
  contactName?: string;

  @IsOptional() @IsString()
  phone?: string;

  @IsOptional() @IsString()
  whatsapp?: string;

  @IsOptional() @IsString()
  email?: string;
}
```

### `update-company.dto.ts`

```typescript
import { PartialType } from "@nestjs/mapped-types";
import { CreateCompanyDto } from "./create-company.dto";

export class UpdateCompanyDto extends PartialType(CreateCompanyDto) {}
```

---

## Service (`companies.service.ts`)

```typescript
import { Injectable, NotFoundException, ConflictException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Company } from "./entities/company.entity";
import { CreateCompanyDto } from "./dto/create-company.dto";
import { UpdateCompanyDto } from "./dto/update-company.dto";

@Injectable()
export class CompaniesService {
  constructor(
    @InjectRepository(Company)
    private readonly companyRepository: Repository<Company>,
  ) {}

  async create(dto: CreateCompanyDto): Promise<Company> {
    const exists = await this.companyRepository.findOne({ where: { cnpj: dto.cnpj } });
    if (exists) {
      throw new ConflictException("Já existe uma empresa com este CNPJ.");
    }
    const company = this.companyRepository.create(dto);
    return this.companyRepository.save(company);
  }

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
}
```

---

## Controller (`companies.controller.ts`)

```typescript
import { Controller, Get, Post, Put, Delete, Param, Body, ParseUUIDPipe } from "@nestjs/common";
import { CompaniesService } from "./companies.service";
import { CreateCompanyDto } from "./dto/create-company.dto";
import { UpdateCompanyDto } from "./dto/update-company.dto";

@Controller("companies")
export class CompaniesController {
  constructor(private readonly companiesService: CompaniesService) {}

  @Post()
  create(@Body() dto: CreateCompanyDto) {
    return this.companiesService.create(dto);
  }

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
}
```

---

## Module (`companies.module.ts`)

```typescript
import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Company } from "./entities/company.entity";
import { CompaniesService } from "./companies.service";
import { CompaniesController } from "./companies.controller";

@Module({
  imports: [TypeOrmModule.forFeature([Company])],
  controllers: [CompaniesController],
  providers: [CompaniesService],
  exports: [CompaniesService],
})
export class CompaniesModule {}
```

> **Importante**: Registre o `CompaniesModule` no `imports` do `AppModule`.

---

## Estrutura de Arquivos

```
src/companies/
├── companies.module.ts
├── companies.service.ts
├── companies.controller.ts
├── dto/
│   ├── create-company.dto.ts
│   └── update-company.dto.ts
└── entities/
    └── company.entity.ts
```

---

## Tratamento de Erros

| Cenário | Exceção | Status HTTP |
|---------|---------|-------------|
| CNPJ duplicado (create/update) | `ConflictException` | `409` |
| Empresa não encontrada (get/update/delete) | `NotFoundException` | `404` |
| Validação de campos falhou | `BadRequestException` (automático via `ValidationPipe`) | `400` |

---

## Configuração Necessária

1. **ValidationPipe global** no `main.ts`:
```typescript
app.useGlobalPipes(new ValidationPipe({
  whitelist: true,
  forbidNonWhitelisted: true,
  transform: true,
}));
```

2. **CORS** habilitado para o frontend (porta 3001):
```typescript
app.enableCors({
  origin: "http://localhost:3001",
});
```

3. **Dependências** necessárias:
```bash
npm install class-validator class-transformer @nestjs/mapped-types @nestjs/typeorm typeorm pg
```

---

## Contrato com o Frontend

O frontend espera os seguintes comportamentos:

- **POST `/companies`** — recebe JSON com todos os campos, `cnpj` já chega sem máscara (14 dígitos). Retorna o objeto criado com `id`.
- **GET `/companies`** — retorna array de empresas ordenadas por `companyName`.
- **GET `/companies/:id`** — retorna o objeto empresa completo.
- **PUT `/companies/:id`** — recebe JSON parcial, retorna o objeto atualizado.
- **DELETE `/companies/:id`** — retorna `200` ou `204`.
- **409** para CNPJ duplicado — o frontend exibe toast de erro.
- **404** para empresa não encontrada.
