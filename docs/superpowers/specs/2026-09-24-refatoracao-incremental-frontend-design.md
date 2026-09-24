# Refatoração incremental do frontend Precifique

**Data:** 24 de setembro de 2026

## Objetivo

Reduzir responsabilidades concentradas no frontend sem alterar funcionalidades, regras de negócio, comportamento visual, rotas, autenticação, persistência ou formatos de dados. A refatoração preservará a arquitetura atual e atuará apenas onde a separação oferece benefício comprovado.

## Estado de referência

O frontend ativo usa React 19, Vite 8, React Router 7, JavaScript ESM, armazenamento local e Web Crypto. O backend Express, Prisma e Supabase está fora do fluxo atual e não faz parte desta refatoração.

O baseline verificado antes do trabalho possui 139 testes unitários, 8 testes de interface, lint e build do frontend aprovados. O backend também estava aprovado em 36 testes, lint, build e validação do schema Prisma, mas não será modificado.

## Escopo

- Simplificar `Relatorio.jsx`, separando projeções puras e blocos extensos de apresentação.
- Simplificar `FichaTecnica.jsx`, separando transformações do formulário e seções visuais.
- Reduzir responsabilidades de `AppProvider.jsx` sem alterar o contrato consumido pelas páginas.
- Remover somente código e recursos comprovadamente sem consumidores.
- Reavaliar `Insumos.jsx` e `CanaisVenda.jsx` ao final, sem divisão obrigatória.
- Manter os arquivos de rota como pontos de composição.

## Fora do escopo

- Backend, Prisma, banco de dados, migrations e Supabase.
- Autenticação, autorização, formato de sessão e chaves do `localStorage`.
- Funcionalidades, fluxos, textos, traduções, CSS, responsividade e URLs.
- Formatos persistidos, contratos públicos e regras financeiras.
- Migração completa para uma arquitetura por `features/`.
- Carregamento preguiçoso, otimização de bundle ou novas dependências.

## Restrições

- O comportamento observável deve permanecer idêntico.
- A API de `useApp()` efetivamente consumida pelas páginas permanecerá compatível.
- Cálculos existentes serão reutilizados, nunca reimplementados em componentes.
- Valores monetários, percentuais e arredondamentos manterão os resultados atuais.
- Alterações preexistentes ou concorrentes permanecerão fora dos commits.
- Cada etapa terá testes focados e validação integral antes da seguinte.
- Arquivos novos terão uma responsabilidade principal e ficarão próximos da página consumidora.
- Componentes não serão extraídos apenas para reduzir contagem de linhas.

## Arquitetura

### Relatório

`front/src/pages/Relatorio.jsx` continuará controlando o período, obtendo dados de `useApp()` e compondo a rota.

`front/src/pages/relatorio/reportProjection.js` conterá funções puras que recebem produtos e as funções financeiras existentes e devolvem os totais derivados. A apresentação será dividida em `ReportHeader.jsx`, `ReportSummary.jsx`, `FixedCostsTable.jsx` e `ProductionProjectionTable.jsx`.

Classes CSS, textos, ordem visual e marcação necessária para impressão serão preservados.

### Ficha técnica

`front/src/pages/FichaTecnica.jsx` continuará tratando carregamento, oferta inexistente e composição do editor.

`front/src/pages/ficha-tecnica/offerForm.js` concentrará transformações puras entre oferta, formulário e payload. A validação de negócio continuará em `application/offers.js`.

As seções visuais serão separadas em `OfferIdentificationSection.jsx`, `OfferCompositionSection.jsx`, `OfferProductionSection.jsx` e `OfferCostSummary.jsx`. Elas receberão dados e callbacks explícitos e não acessarão persistência diretamente.

### Contexto e provider

`front/src/context/AppProvider.jsx` continuará montando o valor de `AppContext.Provider`.

A restauração da conta poderá ser extraída para `useLocalSession.js`, e a inicialização protegida do workspace poderá ser extraída para `useWorkspaceSession.js`. Isso só ocorrerá se testes preservarem restauração, login, logout, isolamento de contas, rejeição de resultados assíncronos antigos e preservação do último workspace válido.

Se a extração aumentar a complexidade ou exigir mudança contratual, o provider permanecerá intacto e somente funções puras serão movidas.

### Código sem consumidores

`adicionarProduto`, `editarProduto` e `excluirProduto` aparecem somente na definição e no valor do provider. Sua remoção dependerá de teste de caracterização e nova busca de consumidores.

`hero.png`, `react.svg` e `vite.svg` não possuem referências atuais. Sua remoção dependerá de nova busca, inspeção de HTML e CSS e build aprovado.

## Dependências

O fluxo continuará sendo:

```text
Rota/página -> componentes específicos da página
             -> contexto
             -> casos de uso
             -> domínio e persistência
```

Componentes específicos não importarão arquivos de rota. Módulos globais não dependerão de componentes de página. Não serão criados arquivos `index` para esconder dependências.

## Erros e concorrência

- Mensagens existentes serão preservadas.
- Exceções continuarão chegando aos mesmos estados de erro.
- A prévia da ficha continuará indisponível para dados incompletos.
- Falhas de persistência não produzirão sucesso nem apagarão o último estado válido.
- A identidade de escopo que impede uma sessão antiga de atualizar a conta atual será preservada e testada.
- Nenhum erro será ocultado com desativação de lint ou captura vazia adicionada pela refatoração.

## Sequência

1. Caracterizar contratos observáveis e o contexto.
2. Extrair projeções e componentes do relatório.
3. Extrair transformações e componentes da ficha técnica.
4. Reduzir o provider somente com testes de concorrência e isolamento.
5. Remover código e recursos comprovadamente mortos.
6. Reavaliar páginas moderadas sem forçar abstrações.
7. Executar validação integral e inspecionar o diff.

Cada etapa produzirá um commit pequeno e reversível.

## Validação

Cada etapa executará testes focados. A matriz final será:

```powershell
Set-Location C:\TCC\tcc\front
npm test
npm run lint
npm run build
```

Também serão executados busca por imports antigos, verificação estática de ciclos sem instalar dependências, `git diff --check`, inspeção dos arquivos incluídos nos commits e comparação de rotas, textos, classes e contratos persistidos.

A validação manual cobrirá cadastro, login, restauração, logout, navegação, insumos, produtos, ficha técnica, custos fixos, canais, simulação, relatório, configurações, logo, demonstração e exportação. Jornadas não executadas serão declaradas como pendentes.

## Critérios de conclusão

- `Relatorio.jsx` e `FichaTecnica.jsx` funcionam como arquivos de rota e composição.
- Funções puras extraídas possuem testes diretos.
- Componentes específicos permanecem próximos de suas páginas e não acessam persistência.
- O contrato consumido de `useApp()` permanece compatível.
- Operações de uma sessão antiga não alteram a conta atual.
- Rotas, textos, classes, regras financeiras e formatos persistidos permanecem iguais.
- Backend e alterações concorrentes não entram nos commits.
- Nenhuma dependência ou ciclo é introduzido.
- Código e recursos só são removidos após comprovação de desuso.
- Testes, lint e build terminam com exit code zero.
