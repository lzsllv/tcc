# Task 2 — Persistência coordenada

## Resultado

Implementada a conta demonstrativa como uma única fonte de dados: `createDemoAccount(account, now)` agora retorna `{ workspace, produtos, custosFixos, configuracoes }`.

- O pacote legado é derivado do workspace: nomes e categorias das ofertas, horas a partir de minutos, planejamento mensal, custos em reais positivos e conversões de custos fixos/configurações.
- O logo usa uma data URL SVG válida para uso direto em imagens.
- `AppContext` removeu a constante duplicada e expõe `podeCarregarDemo` e `carregarDemo`.
- A elegibilidade exige workspace pronto e a conta inteira vazia. `carregarDemo` recalcula essa validação pelo caso de uso, persiste primeiro o workspace e só sincroniza o estado legado após sucesso; erros de persistência são propagados sem alterar o legado.
- Nenhum formulário de simulação foi preenchido ou executado.

## TDD

### RED

Após adaptar os testes para o contrato desejado, `node --test src/application/demoAccount.test.js` foi executado em uma cópia temporária local (o Node não abre o worktree em caminho UNC). Resultado: 5 aprovações e 3 falhas esperadas, porque a implementação ainda retornava o workspace v2 diretamente. As falhas mostraram `workspace` ausente e as chaves retornadas antigas em vez de `configuracoes`, `custosFixos`, `produtos`, `workspace`.

### GREEN

Após a implementação mínima, o teste focal aprovou 8/8. O teste novo valida o pacote legado derivado, as conversões de centavos, os nomes de extras e configurações, os tempos e planejamentos, e a data URL SVG.

## Verificação final

Executadas em cópia temporária local com dependências instaladas isoladamente:

- `node --test` — 95 aprovados, 0 falhas.
- `npm run lint` — concluído sem erros.
- `git diff --check` — sem problemas de whitespace.

O `npm ci` da cópia temporária informou 7 vulnerabilidades já presentes nas dependências; não foram alteradas por esta tarefa.

## Auto-revisão

Revisei o diff contra o briefing. Não há dados demo duplicados no contexto; a atualização legada ocorre após `await atualizarWorkspace`; a exceção impede as três atualizações legadas. Não foi usada uma dependência de testes React nem testes por inspeção textual.
## Fix round 1

### Causa raiz

`isDemoAccountEmpty` usava o predicado de configuração inicial legada para `workspace.settings`. O formato real v2 de `createEmptyWorkspace` usa campos em inglês e inclui `selectedSalesChannelId`; por isso seus valores baseline eram interpretados como dados preenchidos.

### Correção

- Separei `isInitialWorkspaceSettings` de `isInitialLegacySettings`.
- Extraí `persistDemoAccount(account, persistWorkspace, now)`: exige `workspaceStatus === 'ready'`, monta a demonstração, aguarda a persistência do workspace e só então devolve o pacote legado.
- O contexto chama esse caso de uso; somente após seu retorno aplica os setters legados.

### TDD e verificação

RED: `node --test src/application/demoAccount.test.js` em cópia local retornou 7 aprovações e 4 falhas: o workspace v2 baseline foi recusado e `persistDemoAccount` ainda não existia.

GREEN focal: 11/11 aprovados.

Verificação final em cópia local com dependências isoladas:

- `node --test` — 98 aprovados, 0 falhas.
- `npm run lint` — concluído sem erros.

Os testes novos usam `createEmptyWorkspace('owner-1', now)` real, alteram cada campo relevante de `settings`, recusam status `saving`, verificam a promessa pendente antes do retorno, e verificam propagação da rejeição sem pacote devolvido.
## Fix round 2

### Causa raiz

Depois de o predicado estrito v2 retornar `false`, a condição ainda caía em `hasUserEntries(settings)`. Portanto, divergências estruturalmente inválidas cujos valores eram vazios — como `selectedSalesChannelId: ''`, chave ausente ou campo extra vazio — permaneciam elegíveis.

### Correção e TDD

RED: `node --test src/application/demoAccount.test.js` em cópia local retornou 10 aprovações e 1 falha esperada: o canal selecionado vazio foi aceito.

GREEN: `isDemoAccountEmpty` agora exige que qualquer `workspace.settings` presente corresponda exatamente ao baseline v2 completo. O teste cobre todos os seis campos alterados, canal vazio, canal ausente e campo extra vazio; o baseline de `createEmptyWorkspace` continua aceito.

Verificação final em cópia local:

- `node --test` — 98 aprovados, 0 falhas.
- `npm run lint` — concluído sem erros.

## Fix round 4

### Causa raiz e correção

`migrateLegacyData` converte a margem legada inicial de 20% para a margem financeira equivalente no workspace v2, enquanto a elegibilidade aceitava somente `defaultMarginBps: 0`. `isDemoAccountEmpty` agora também aceita essa margem convertida, derivada por `percentToBps` e `markupBpsToMarginBps`, somente quando `configuracoes` está presente e corresponde exatamente ao baseline legado. Todos os demais campos v2 continuam obrigados ao baseline estrito.

### TDD

RED: `node --test src/application/demoAccount.test.js` em espelho local, com `migrateLegacyData` real e as três estruturas legadas iniciais completas, retornou 12 aprovações e 1 falha esperada: o workspace migrado foi recusado (`false !== true`).

GREEN focal: o mesmo comando retornou 13 aprovações e 0 falhas. Os casos negativos recusam `configuracoes` ausente ou alterada, margem divergente, chave extra em settings, custos, produtos, insumos, ofertas e canais alterados.

### Verificação final e auto-revisão

Executada em espelho local limpo após `npm ci`:

- `node --test` — 100 aprovados, 0 falhas.
- `npm run lint` — concluído sem erros.
- `npm run build` — Vite concluiu em 17,01 s; houve apenas o aviso de tempo do plugin `rolldown:vite-resolve`.
- `git diff --check` — sem erros de whitespace.

O `npm ci` informou as mesmas 7 vulnerabilidades preexistentes (2 baixas e 5 altas). A auto-revisão confirmou que somente o caso contextual da configuração inicial migrada foi aberto; UI e migração não foram alteradas.
## Fix round 3

RED: `node --test src/application/demoAccount.test.js` em cópia local retornou 10 aprovações e 1 falha esperada: um workspace v2 de `createEmptyWorkspace` sem a propriedade `settings` ainda era aceito.

GREEN: a detecção de workspace v2 usa `schemaVersion === 2`; para esse formato, `settings` é obrigatório e deve corresponder exatamente ao baseline. Contas simplificadas sem workspace v2 mantêm o contrato anterior. O teste remove `settings` de uma cópia imutável do workspace real.

Verificação final em cópia local:

- `node --test` — 98 aprovados, 0 falhas.
- `npm run lint` — concluído sem erros.
