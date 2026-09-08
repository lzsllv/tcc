# Precifique

Aplicação de precificação para pequenos empreendedores, desenvolvida como TCC de Análise e Desenvolvimento de Sistemas.

## Estrutura

```text
front/    frontend React 19, Vite 8 e testes
backend/  API Node.js 22, Express, TypeScript, Prisma e testes
docs/     documentação técnica e registros de validação
```

O Supabase fornece autenticação, PostgreSQL e o bucket privado de logos. O motor financeiro permanece no frontend; a API valida e persiste o workspace v2.

## Pré-requisitos

- Node.js 22.12 ou mais recente;
- npm;
- projeto Supabase de desenvolvimento com Auth, Database e Storage.

## Configuração

No PowerShell, a partir da raiz do repositório:

```powershell
Copy-Item front/.env.example front/.env.local
Copy-Item backend/.env.example backend/.env
```

Preencha os dois arquivos locais. `SUPABASE_SECRET_KEY` deve existir somente em `backend/.env` e nunca no frontend.

Instale as dependências:

```powershell
Set-Location front
npm install
Set-Location ../backend
npm install
npm run prisma:generate
npm run prisma:validate
npm run prisma:migrate
```

## Execução local

Backend, em um terminal:

```powershell
Set-Location backend
npm run dev
```

Frontend, em outro terminal:

```powershell
Set-Location front
npm run dev
```

Abra `http://localhost:5173`. A API usa `http://localhost:3333`.

## Verificação

```powershell
Set-Location front
npm test
npm run lint
npm run build

Set-Location ../backend
npm test
npm run lint
npm run prisma:generate
npm run prisma:validate
npm run build
```

## API

- `GET /health`
- `POST /api/v1/workspace/bootstrap`
- `GET /api/v1/workspace`
- `PUT /api/v1/workspace`
- `GET /api/v1/workspace/export`
- `PUT /api/v1/workspace/logo`
- `DELETE /api/v1/workspace/logo`

As rotas de workspace exigem Bearer token do Supabase. Conflitos de edição retornam `409 WORKSPACE_CONFLICT`.

## Autores

Luiz Fernando, Stefany Marques, Maria Ramiro e Maria Eduarda Gianzanti.
