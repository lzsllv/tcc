# Organização do Repositório Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Deixar apenas o frontend atual, backend, documentação e configurações necessárias para executar o Precifique.

**Architecture:** Preservar os pacotes independentes `front/` e `backend/`, remover o protótipo e artefatos reproduzíveis, e manter dependências e ambientes fora do Git. Remover o worktree antigo somente pela interface do Git após incorporar sua proteção de ambiente.

**Tech Stack:** Git, Node.js 22, npm, React/Vite/Vitest, Express/TypeScript/Prisma.

**Spec:** `docs/superpowers/specs/2026-09-08-organizacao-repositorio-design.md`

## Global Constraints

- Não exibir nem copiar o conteúdo de arquivos `.env`.
- Não alterar banco, Supabase Auth ou Supabase Storage.
- Arquivos versionados removidos devem continuar recuperáveis pelo histórico Git.
- Não reescrever o histórico remoto nem executar `force push`.

---

### Task 1: Proteger configurações locais

**Files:**
- Create: `.gitignore`
- Move locally: `.env.local` → `front/.env.local`
- Untrack: `.env.local`, `backend/.env`

**Interfaces:**
- Consumes: variáveis Vite existentes e configuração privada do backend.
- Produces: ambientes locais nos diretórios dos pacotes, ausentes do índice Git.

- [x] **Step 1: Verificar os caminhos sem ler os valores**

Run: `Test-Path .env.local; Test-Path backend/.env; git ls-files .env.local backend/.env`

- [x] **Step 2: Criar o `.gitignore` raiz**

Ignorar `node_modules/`, `dist/`, `.worktrees/`, `.env`, `.env.*` e liberar `!**/.env.example`.

- [x] **Step 3: Mover a configuração do frontend e retirar ambientes do índice**

Mover `.env.local` para `front/.env.local` e executar `git rm --cached --ignore-unmatch .env.local front/.env.local backend/.env`.

- [x] **Step 4: Confirmar a proteção**

Run: `git check-ignore front/.env.local backend/.env; git ls-files "*.env*"`

Expected: os ambientes reais estão ignorados; somente exemplos permanecem versionados.

### Task 2: Remover fontes redundantes e artefatos

**Files:**
- Delete: `api-node/`, `front/tcc/`
- Delete generated: `dist/`, `backend/dist/`, `node_modules/`
- Untrack generated: `front/node_modules/`, `backend/node_modules/`, `front/dist/`, `backend/src/generated/`

**Interfaces:**
- Consumes: estrutura identificada no commit `ab95a50f`.
- Produces: apenas `front/`, `backend/` e `docs/` como diretórios de projeto.

- [x] **Step 1: Remover os protótipos pelo Git**

Run: `git rm -r -- api-node front/tcc`

- [x] **Step 2: Retirar dependências e builds do índice**

Run: `git rm -r --cached --ignore-unmatch -- front/node_modules backend/node_modules front/dist backend/dist backend/src/generated node_modules dist`

- [x] **Step 3: Validar alvos absolutos e remover somente cópias geradas da raiz**

Confirmar que `C:\TCC\tcc\node_modules` e `C:\TCC\tcc\dist` resolvem dentro de `C:\TCC\tcc`, então removê-los. Preservar dependências instaladas dentro de `front/` e `backend/`.

- [x] **Step 4: Confirmar que nenhum artefato gerado permanece rastreado**

Run: `git ls-files | rg "(^|/)(node_modules|dist|src/generated)/"`

Expected: nenhuma saída.

### Task 3: Atualizar documentação e retirar o worktree antigo

**Files:**
- Create: `README.md`
- Remove safely: `.worktrees/backend-inicial/`
- Modify: `docs/superpowers/specs/2026-09-08-organizacao-repositorio-design.md`

**Interfaces:**
- Consumes: scripts existentes em `front/package.json` e `backend/package.json`.
- Produces: instruções únicas de instalação, execução e testes.

- [x] **Step 1: Escrever o README da estrutura atual**

Documentar pré-requisitos, configuração baseada nos dois `.env.example`, `npm install`, `npm run dev`, testes e portas 5173/3333.

- [x] **Step 2: Incorporar a proteção exclusiva do worktree**

Confirmar que `backend/.env` não está mais rastreado na branch atual; não fazer cherry-pick do commit antigo, pois o mesmo efeito já foi produzido.

- [x] **Step 3: Remover o worktree pelo Git**

Run: `git worktree remove C:/TCC/tcc/.worktrees/backend-inicial` e depois `git worktree prune`.

- [x] **Step 4: Verificar a árvore final**

Expected directories: `front`, `backend`, `docs`. `.git` e dependências locais internas são permitidas.

### Task 4: Verificação e commit

**Files:**
- Verify: `front/`, `backend/`, `.gitignore`, `README.md`

**Interfaces:**
- Consumes: pacotes organizados.
- Produces: repositório validado e commit de limpeza.

- [x] **Step 1: Instalar dependências se necessário**

Run `npm install` em `front/` e `backend/` somente se seus `node_modules` internos estiverem ausentes.

- [x] **Step 2: Verificar o frontend**

Run em `front/`: `npm test`, `npm run lint`, `npm run build`.

- [x] **Step 3: Verificar o backend**

Run em `backend/`: `npm test`, `npm run lint`, `npm run prisma:generate`, `npm run prisma:validate`, `npm run build`.

- [x] **Step 4: Verificar higiene do Git**

Confirmar ausência de ambientes reais, dependências e builds no índice; executar `git diff --check` e revisar `git status --short`.

- [ ] **Step 5: Criar o commit**

Run: `git commit -m "chore: organize project files"` após adicionar somente arquivos esperados.
