# Precifique

Aplicação de precificação para pequenos empreendedores, desenvolvida como TCC de Análise e Desenvolvimento de Sistemas.

O projeto possui um frontend React/Vite e uma API Express/TypeScript. Autenticação, PostgreSQL e armazenamento privado de logos são fornecidos pelo Supabase. O motor de cálculo financeiro continua no frontend; a API valida e persiste o workspace v2.

## Tecnologias

| Camada | Tecnologia |
| --- | --- |
| Frontend | React 19, React Router 7 e Vite 8 |
| Backend | Node.js 22.12+, Express 5, TypeScript 5.9 e Zod 4 |
| Banco | PostgreSQL do Supabase e Prisma 7 |
| Autenticação | Supabase Auth |
| Arquivos | Supabase Storage, bucket privado `business-logos` |
| Testes | Node Test Runner, Vitest e Supertest |

## Pré-requisitos

- Node.js 22.12 ou mais recente;
- npm;
- um projeto Supabase de desenvolvimento com Auth, Database e Storage.

## Configuração do Supabase

Copie os arquivos de exemplo e preencha os dados do projeto Supabase:

```bash
cp .env.example .env.local
cp backend/.env.example backend/.env
```

No Windows PowerShell, use `Copy-Item` no lugar de `cp` se necessário. A chave `SUPABASE_SECRET_KEY` deve existir somente em `backend/.env` e nunca pode ser exposta ao frontend.

Instale as dependências e gere o Prisma Client:

```bash
npm ci
cd backend
npm ci
npm run prisma:generate
npm run prisma:validate
npm run prisma:migrate
```

A migration cria o schema privado `app_private`, as tabelas normalizadas, restrições, RLS defensiva e o bucket privado de logos. `DIRECT_URL` é usada pela CLI de migrations; `DATABASE_URL` é usada pela API em execução.

## Execução local

Em um terminal:

```bash
cd backend
npm run dev
```

A API ficará disponível em `http://localhost:3333`. Em outro terminal, na raiz:

```bash
npm run dev
```

O frontend ficará disponível em `http://localhost:5173`.

Quando a confirmação de e-mail estiver ativa no Supabase, o cadastro informa que o usuário deve confirmar o endereço antes de entrar. No primeiro login de uma conta antiga, o frontend mantém o backup local, importa o workspace v2 de modo idempotente e envia o logo em uma etapa separada.

## API

- `GET /health` — diagnóstico público;
- `POST /api/v1/workspace/bootstrap` — cria ou importa o workspace;
- `GET /api/v1/workspace` — lê workspace e revisão;
- `PUT /api/v1/workspace` — substitui o agregado com revisão otimista;
- `GET /api/v1/workspace/export` — exporta o workspace v2;
- `PUT /api/v1/workspace/logo` — envia PNG, JPEG ou WebP de até 400 KB;
- `DELETE /api/v1/workspace/logo` — remove o vínculo do logo.

As rotas de workspace exigem `Authorization: Bearer <access-token>`. Conflitos de edição retornam `409 WORKSPACE_CONFLICT`, e erros seguem o envelope `{ "error": { "code", "message", "details?" } }`.

## Verificação

Frontend:

```bash
npm test
npm run lint
npm run build
```

Backend:

```bash
cd backend
npm test
npm run lint
npm run build
npm run prisma:validate
npm run prisma:generate
```

## Estrutura principal

```text
backend/
├── prisma/             # schema e migrations PostgreSQL
├── src/
│   ├── application/    # casos de uso do workspace e logo
│   ├── auth/           # validação de JWT do Supabase
│   ├── domain/         # contrato Zod do workspace v2
│   ├── http/           # rotas e middleware
│   └── infrastructure/ # Prisma e Supabase Storage
└── tests/
src/
├── auth/               # sessão e operações do Supabase Auth
├── application/        # serviços do workspace
├── domain/             # motor financeiro
└── persistence/        # repositórios local e remoto/migração
```

## Autores

Luiz Fernando, Stefany Marques, Maria Ramiro e Maria Eduarda Gianzanti.

Projeto acadêmico. Todos os direitos reservados aos autores.
