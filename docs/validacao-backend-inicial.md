# Validação do backend inicial — 03/09/2026

Branch de correções: `fix/workspace-fetch-context`, na pasta `C:/TCC/tcc`.

## Validado nesta rodada

- 128 testes unitários de frontend e 11 testes do componente real `AppProvider`.
- 34 testes de backend (dependências externas simuladas; não são testes do PostgreSQL real).
- Lint e build dos dois pacotes, `prisma validate` e geração do client Prisma.
- HTTP: edição de ingrediente/oferta/custos, exportação, exclusão de ingrediente referenciado recusada sem modificar o agregado, conflito de revisão sem sobrescrever a primeira gravação.
- Logo: limite de 400 KB, formatos permitidos, substituição, exclusão, compensação e conflito, utilizando Storage em memória.
- Sessão: resposta de save/upload/delete anterior não atualiza a conta atual; logout, novo login na mesma conta, restauração inicial atrasada e renovação de token.
- Token obtido após trocar de conta não é utilizado para enviar uma gravação da conta anterior.

Os testes de sessão montam o contexto real, o serviço de workspace e o repositório remoto. Apenas Auth e a rede são simulados. Três testes inicialmente reproduziram atualização indevida do estado por resposta antiga; outro reproduziu payload de A enviado com token de B. A correção faz ambos serem recusados. Isto não demonstra acesso arbitrário a outros usuários pelo backend.

## Correções

- `fetch` padrão vinculado ao contexto global do navegador (rodada anterior).
- Operações vinculadas à identidade da sessão, invalidada em logout/troca de conta/desmontagem.
- Serviço/repositório e seus caches recriados por sessão; carregamentos e conversões de logo antigos não são reutilizados após novo login na mesma conta.
- Conferência do proprietário e da sessão ao obter token para cada requisição.
- Respostas de sessão antiga não atualizam dados, mensagens de erro, configurações ou logo.
- Eventos da mesma conta não reinicializam o workspace nem apagam rascunhos.

## Pendências de aceite

- Exercitar duas contas reais e duas abas no navegador contra o Supabase de desenvolvimento.
- Upload, substituição, exclusão e expiração de URL assinada de um logo real.
- Testes de integração transacional usando PostgreSQL real, incluindo rollback por falha.
- Concluir formalmente a auditoria Codex Security. O checkpoint anterior é parcial; estes testes não são um relatório final de auditoria.
- Exportação pela interface: existe contrato HTTP, mas ainda é necessário verificar/disponibilizar a ação na tela.

Nenhum registro de negócio, conta ou objeto de Storage do usuário foi criado, alterado ou removido por estes testes. Não houve nova migration aplicada nesta rodada. As alterações ainda não foram commitadas nem enviadas ao remoto.

## Reexecutar

Na raiz: `npm test`, `npm run lint`, `npm run build`.

Em `backend`: `npm test`, `npm run lint`, `npm run prisma:generate`, `npm run prisma:validate`, `npm run build`.
