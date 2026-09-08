# Organização do repositório Precifique

**Data:** 8 de setembro de 2026

## Objetivo

Manter no repositório apenas a aplicação Precifique atual, composta pelo frontend React/Vite, backend Express/TypeScript, documentação e configurações necessárias. Protótipos antigos, cópias duplicadas e artefatos gerados serão removidos.

## Estrutura preservada

```text
backend/              API, Prisma, migrations e testes do backend
docs/                 documentação do projeto
public/               arquivos públicos do frontend
src/                  aplicação e testes do frontend
.env.example          exemplo público das variáveis do frontend
.gitignore            regras para arquivos locais e gerados
eslint.config.js      lint do frontend
index.html            entrada do frontend
package.json          dependências e scripts do frontend
package-lock.json     versões bloqueadas do frontend
README.md             instruções atuais do projeto
vite.config.js        build e servidor de desenvolvimento
vitest.config.js      testes de componentes do frontend
```

O frontend continuará na raiz e o backend continuará em `backend/`. Esta limpeza não altera importações, contratos HTTP, schema do banco ou comandos existentes.

## Conteúdo removido

- `aula_node/`: protótipo de negócio antigo.
- `tcc/`: cópia antiga do frontend.
- `vite-project/`: scaffold antigo do Vite.
- `dist/` e `backend/dist/`: builds reproduzíveis.
- `.worktrees/backend-inicial/`: worktree já substituído pelas alterações incorporadas na branch principal.

Os diretórios `node_modules/` e `backend/node_modules/` não pertencem ao Git. Eles podem continuar localmente para desenvolvimento e permanecem ignorados.

## Proteção de credenciais

- `.env.local` e `backend/.env` continuarão fisicamente no computador e ignorados pelo Git.
- `backend/.env` será removido somente do índice do Git, preservando seu conteúdo local.
- Apenas `.env.example` e `backend/.env.example`, sem credenciais reais, permanecerão versionados.
- Nenhum conteúdo de arquivo de ambiente será exibido, copiado para documentação ou commitado.

## Atualização da configuração e documentação

- Remover do `eslint.config.js` as exceções específicas dos três projetos excluídos.
- Atualizar o `README.md` para refletir apenas o frontend atual e o backend.
- Manter `.gitignore` cobrindo dependências, builds, worktrees e arquivos de ambiente.

## Segurança e recuperação

Os arquivos versionados removidos continuam recuperáveis no histórico Git. O worktree será removido pelo comando do próprio Git, após confirmar que está limpo e que sua única mudança exclusiva é a remoção de `backend/.env`. Não haverá exclusão de dados do Supabase, registros de usuários ou objetos do Storage.

## Verificação

Após a organização serão executados:

- frontend: testes unitários e de componentes, lint e build;
- backend: testes, lint, build, geração e validação do Prisma Client;
- inspeção do Git para garantir que nenhum `.env`, `node_modules` ou `dist` esteja versionado;
- inspeção final da árvore para confirmar a ausência dos três projetos antigos e do worktree removido.

Se alguma verificação falhar por causa da limpeza, a configuração ou documentação será corrigida antes da conclusão.
