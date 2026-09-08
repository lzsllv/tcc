# Organização do repositório Precifique

**Data:** 8 de setembro de 2026

## Objetivo

Manter no repositório apenas a aplicação Precifique atual, composta pelo frontend React/Vite, backend Express/TypeScript, documentação e configurações necessárias. Protótipos antigos, cópias duplicadas e artefatos gerados serão removidos.

## Estrutura preservada

```text
front/                frontend React/Vite e seus testes
backend/              API, Prisma, migrations e testes do backend
docs/                 documentação do projeto
.gitignore            regras para arquivos locais e gerados
README.md             instruções atuais do projeto
```

O frontend permanecerá em `front/` e o backend continuará em `backend/`. Esta limpeza não altera importações, contratos HTTP ou schema do banco. Os comandos serão executados dentro da pasta de cada pacote.

## Conteúdo removido

- `api-node/`: protótipo de negócio antigo anteriormente chamado `aula_node/`.
- `dist/` e `backend/dist/`: builds reproduzíveis.
- `.worktrees/backend-inicial/`: worktree já substituído pelas alterações incorporadas na branch principal.

Os diretórios `node_modules/`, `front/node_modules/` e `backend/node_modules/` não pertencem ao Git. Dependências existentes em `front/` e `backend/` podem continuar localmente para desenvolvimento e permanecem ignoradas. Cópias geradas na raiz serão removidas.

## Proteção de credenciais

- `.env.local` será movido para `front/.env.local`; `front/.env.local` e `backend/.env` continuarão fisicamente no computador e ignorados pelo Git.
- `backend/.env` será removido somente do índice do Git, preservando seu conteúdo local.
- Apenas `.env.example` e `backend/.env.example`, sem credenciais reais, permanecerão versionados.
- Nenhum conteúdo de arquivo de ambiente será exibido, copiado para documentação ou commitado.

## Atualização da configuração e documentação

- Preservar as configurações do frontend dentro de `front/` e eliminar referências a projetos excluídos quando existirem.
- Atualizar o `README.md` para refletir apenas o frontend atual e o backend.
- Manter `.gitignore` cobrindo dependências, builds, worktrees e arquivos de ambiente.

## Segurança e recuperação

Os arquivos versionados removidos continuam recuperáveis no histórico Git. O worktree será removido pelo comando do próprio Git, após confirmar que está limpo e que sua única mudança exclusiva é a remoção de `backend/.env`. Não haverá exclusão de dados do Supabase, registros de usuários ou objetos do Storage. Como arquivos de ambiente já chegaram ao histórico remoto, as credenciais potencialmente expostas deverão ser rotacionadas; reescrever o histórico Git fica fora desta limpeza para evitar um `force push` não autorizado.

## Verificação

Após a organização serão executados:

- frontend: testes unitários e de componentes, lint e build;
- backend: testes, lint, build, geração e validação do Prisma Client;
- inspeção do Git para garantir que nenhum `.env`, `node_modules` ou `dist` esteja versionado;
- inspeção final da árvore para confirmar a ausência dos três projetos antigos e do worktree removido.

Se alguma verificação falhar por causa da limpeza, a configuração ou documentação será corrigida antes da conclusão.
