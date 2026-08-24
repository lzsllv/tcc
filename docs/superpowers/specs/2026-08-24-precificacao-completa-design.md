# Precificacao completa frontend-first

## Objetivo

Evoluir o Precifique de um calculador baseado em custo direto para um sistema didatico de formacao de precos, ainda com persistencia local, mas com regras e interfaces preparadas para a futura integracao com backend.

O primeiro ciclo deve permitir cadastrar insumos reutilizaveis, montar fichas tecnicas de produtos e servicos, configurar canais de venda e calcular tres referencias de preco: minimo, sustentavel e recomendado. Dashboard, simulacao e relatorio passam a consumir a mesma camada financeira.

## Escopo aprovado

- Manter React, Vite, React Router, CSS e a identidade visual atual.
- Continuar usando armazenamento local nesta etapa.
- Separar regras financeiras, casos de uso, persistencia e estado de interface.
- Cadastrar insumos reutilizaveis com conversao de unidades.
- Tratar produtos e servicos em uma entidade unificada chamada oferta.
- Configurar canais de venda com taxas percentuais e fixas.
- Usar margem sobre a venda como regra do preco recomendado.
- Exibir preco minimo, sustentavel e recomendado.
- Calcular contribuicao e ponto de equilibrio por oferta e para o mix mensal.
- Migrar automaticamente os dados existentes sem alterar o preco equivalente.
- Separar localmente os dados por usuario enquanto o backend nao existe.

## Fora do primeiro ciclo

- Backend, banco de dados remoto e autenticacao remota.
- Sincronizacao entre dispositivos.
- Historico real de vendas e comparacao entre meses.
- Compartilhamento publico de relatorios.
- Emissao fiscal, estoque e integracao com meios de pagamento.
- Reestruturacao visual completa da landing page.

## Arquitetura

A aplicacao sera dividida em quatro camadas:

1. **Dominio financeiro:** funcoes puras para dinheiro, percentuais, unidades, custos, precos, contribuicao e ponto de equilibrio.
2. **Casos de uso:** operacoes como salvar insumo, montar ficha tecnica, precificar oferta e comparar canais.
3. **Repositorio:** contrato assincrono de persistencia. A primeira implementacao usa `localStorage`; o backend implementara o mesmo contrato posteriormente.
4. **Estado React:** carrega snapshots, executa casos de uso e apresenta estados de carregamento, sucesso e erro. Nao contem formulas financeiras.

O fluxo sera `tela -> caso de uso -> dominio -> repositorio`. Calculos derivados nunca serao persistidos como fonte de verdade; serao recalculados a partir dos dados de entrada.

### Contrato do repositorio

```js
repository.loadWorkspace(ownerId)
repository.saveWorkspace(ownerId, workspace)
repository.createBackup(ownerId, workspace)
repository.migrateWorkspace(ownerId, legacyData)
repository.exportWorkspace(ownerId)
```

Todos os metodos retornam `Promise`, inclusive na implementacao local, para que a troca por chamadas remotas nao altere os consumidores.

## Modelo de dados

Valores monetarios sao inteiros em centavos. Percentuais sao inteiros em pontos-base, em que `10000` representa `100%`. Quantidades podem ser decimais e sao normalizadas pela camada de unidades.

### Workspace

- `schemaVersion`: inicia em `2`.
- `ownerId`: identificador do usuario local.
- `ingredients`: lista de insumos.
- `offers`: lista de produtos e servicos.
- `salesChannels`: lista de canais.
- `fixedCosts`: estrutura atual de custos fixos, convertida para centavos.
- `settings`: identidade do negocio, custo da hora e margem padrao.
- `updatedAt`: data ISO da ultima alteracao.

### Insumo

- `id`, `ownerId`, `name`, `category`.
- `purchasePriceCents`.
- `purchaseQuantity` e `purchaseUnit`.
- `active`, `createdAt`, `updatedAt`.

Categorias iniciais: materia-prima, embalagem e outros. Unidades iniciais:

- Massa: `mg`, `g`, `kg`.
- Volume: `ml`, `l`.
- Contagem: `un`.
- Tempo: `min`, `h`.

Conversoes so podem ocorrer dentro da mesma familia. O custo por unidade-base e derivado do preco e da quantidade de compra.

### Oferta

- `id`, `ownerId`, `kind`: `product` ou `service`.
- `name`, `category`, `active`.
- `batchYield`: rendimento do lote, sempre maior que zero.
- `batchTimeMinutes`: tempo de trabalho do lote.
- `expectedMonthlySales`: quantidade planejada por mes.
- `desiredMarginBps`: substituicao opcional da margem padrao.
- `components`: itens da ficha tecnica.
- `createdAt`, `updatedAt`.

Cada componente possui `id`, `ingredientId`, `quantity`, `unit` e `wasteBps`. Servicos usam rendimento padrao igual a `1`, priorizam horas de trabalho e podem possuir insumos opcionais.

### Canal de venda

- `id`, `ownerId`, `name`, `active`, `isDefault`.
- `fees`: lista de cobrancas.
- `createdAt`, `updatedAt`.

Cada cobranca possui `id`, `name`, `kind` (`percentage` ou `fixed`), `category` (`tax`, `payment`, `marketplace` ou `other`) e `value`. Percentuais usam pontos-base; cobrancas fixas usam centavos por venda.

O workspace deve possuir exatamente um canal padrao ativo.

## Regras financeiras

### Custo variavel

Para cada componente:

```text
quantidade efetiva = quantidade usada * (1 + perda)
custo do componente = quantidade efetiva convertida para unidade-base * custo por unidade-base
```

Para cada oferta:

```text
custo de materiais do lote = soma dos componentes
custo de mao de obra do lote = tempo do lote em horas * custo da hora
custo variavel unitario = (materiais + mao de obra) / rendimento do lote
```

O rateio fixo unitario mantem a regra atual:

```text
rateio fixo unitario = total de custos fixos / total de unidades mensais planejadas
```

Ofertas sem quantidade mensal nao entram no denominador. Se nenhuma oferta tiver quantidade valida, o rateio fica indisponivel em vez de usar divisor artificial igual a um.

### Tres referencias de preco

Se `t` for a soma das taxas percentuais do canal, `f` a soma das taxas fixas, `v` o custo variavel unitario, `r` o rateio fixo e `m` a margem desejada:

```text
preco minimo = (v + f) / (1 - t)
preco sustentavel = (v + r + f) / (1 - t)
preco recomendado = (v + r + f) / (1 - t - m)
```

- O preco minimo cobre a venda individual, mas nao sustenta os custos fixos mensais.
- O preco sustentavel cobre custos variaveis, taxas e rateio fixo, sem margem adicional.
- O preco recomendado inclui a margem liquida desejada.
- A formula e invalida quando qualquer denominador for menor ou igual a zero.

Cada resultado monetario e arredondado para centavos somente no limite publico da funcao. Calculos intermediarios preservam precisao.

### Contribuicao e ponto de equilibrio

Para um preco escolhido `p`:

```text
contribuicao unitaria = p * (1 - t) - f - v
ponto de equilibrio da oferta = arredondar para cima(custos fixos / contribuicao unitaria)
```

O ponto de equilibrio individual assume que a oferta selecionada sustenta sozinha os custos fixos. Se a contribuicao for menor ou igual a zero, o ponto de equilibrio e inalcançavel.

O indicador geral usa a media ponderada das contribuicoes pelo mix de quantidades mensais planejadas. Sem quantidades validas, o indicador aparece como indisponivel.

## Migracao dos dados atuais

Na primeira carga do esquema `2`:

1. Ler as chaves legadas e criar uma copia em `precifique:backup:v1:<timestamp>` antes de qualquer gravacao nova.
2. Atribuir os dados ao `id` do usuario logado. Sem usuario logado, adiar a migracao.
3. Para cada produto antigo, criar um insumo chamado `Custo direto anterior - <produto>`, com uma unidade comprada e preco igual ao custo direto existente.
4. Criar uma oferta do tipo produto, rendimento `1`, componente de uma unidade, tempo convertido de horas para minutos e quantidade mensal preservada.
5. Criar o canal padrao `Venda direta`, sem taxas.
6. Converter o markup legado em margem equivalente por `margem = markup / (1 + markup)`. Assim, markup de `20%` vira margem aproximada de `16,67%` e preserva o preco anterior.
7. Converter dinheiro para centavos e salvar o workspace versionado.
8. Marcar a migracao como concluida sem apagar as chaves antigas neste ciclo.

A migracao deve ser idempotente. Recarregar a pagina nao pode duplicar entidades.

## Experiencia e navegacao

A barra superior permanece. No desktop, os cadastros ficam agrupados em um menu acessivel por teclado:

- Inicio.
- Cadastros: Produtos e servicos, Insumos, Custos fixos, Canais de venda.
- Simulacao.
- Relatorio.
- Configuracoes.

No menu movel, os itens aparecem diretamente, sem submenu aninhado.

### Insumos

Rota `/insumos` com busca, filtro por categoria, lista, criacao e edicao. Cada item mostra embalagem de compra e custo derivado por unidade-base. Insumo referenciado nao pode ser excluido; pode ser arquivado e deixa de aparecer em novos cadastros.

### Canais de venda

Rota `/canais-venda` com lista de canais e editor de cobrancas. Deve ser possivel definir o canal padrao, duplicar um canal e arquivar canais nao utilizados. Um canal referenciado permanece disponivel nos registros existentes.

### Produtos e servicos

- `/produtos`: lista com busca, filtro por tipo e categoria, canal selecionado e as tres referencias de preco.
- `/produtos/novo`: formulario dedicado.
- `/produtos/:id/editar`: mesmo formulario carregando os dados existentes.

O formulario possui secoes verticais para identificacao, ficha tecnica, producao, margem e resumo. No desktop, o resumo de precificacao fica fixo ao lado; no celular, aparece depois dos campos. Nao sera um wizard, evitando bloquear a revisao de dados entre etapas.

Ao trocar o tipo para servico, o rendimento assume `1` e a interface enfatiza tempo de trabalho. Insumos continuam opcionais.

### Simulacao

A tela permite escolher oferta, canal, preco praticado e quantidade. O resultado mostra custo variavel, taxas, contribuicao, margem efetiva, lucro projetado e ponto de equilibrio. Tambem compara o preco informado com as tres referencias.

### Dashboard e relatorio

O dashboard mostra o ponto de equilibrio geral, ofertas abaixo do preco sustentavel e melhor contribuicao planejada. O relatorio inclui canal selecionado, tres referencias de preco e explicacao resumida das formulas. O seletor de mes continua identificado como projecao, pois historico real esta fora deste ciclo.

## Estados e tratamento de erros

- Toda tela possui carregamento estrutural, estado vazio, erro contextual e confirmacao de sucesso.
- Campos monetarios aceitam formato brasileiro e sao convertidos para centavos no envio.
- Quantidades e percentuais nao aceitam valores negativos.
- Rendimento deve ser maior que zero.
- Componentes devem usar unidades compativeis com o insumo.
- Margem mais taxas percentuais deve ser menor que `100%`.
- Exclusao de entidade referenciada e bloqueada com explicacao e opcao de arquivamento.
- Falha de leitura mantem a aplicacao em modo seguro, sem sobrescrever os dados existentes.
- Falha de gravacao informa que as alteracoes nao foram persistidas e permite tentar novamente.
- O estado visual distingue `salvando`, `salvo` e `erro ao salvar`.

## Estrategia de implementacao

1. Adicionar ambiente de testes e criar o dominio financeiro com TDD.
2. Implementar workspace, repositorio local, backup e migracao idempotente.
3. Adaptar o provider React para consumir casos de uso sem formulas internas.
4. Implementar insumos e canais de venda.
5. Implementar editor e listagem de produtos e servicos.
6. Integrar os novos resultados na simulacao.
7. Atualizar dashboard e relatorio.
8. Executar testes, lint, build e verificacao responsiva.

## Testes obrigatorios

### Unidade

- Conversoes entre unidades da mesma familia e rejeicao entre familias diferentes.
- Custo de compra por unidade-base.
- Perda por componente, rendimento do lote e mao de obra.
- Precos minimo, sustentavel e recomendado com taxas fixas e percentuais.
- Denominadores invalidos e arredondamento monetario.
- Contribuicao positiva, nula e negativa.
- Ponto de equilibrio individual e ponderado.
- Conversao de markup legado para margem equivalente.

### Integracao

- CRUD e arquivamento de insumos, ofertas e canais.
- Bloqueio de exclusao de registros referenciados.
- Persistencia isolada por usuario.
- Backup antes da migracao, idempotencia e preservacao dos dados antigos.
- Recalculo de ofertas quando um insumo, custo fixo, custo/hora ou canal muda.

### Interface

- Cadastro completo de produto e de servico.
- Validacoes de unidades, margem e rendimento.
- Comparacao das tres referencias na simulacao.
- Navegacao desktop por teclado e menu movel.
- Estados vazio, carregando, salvo e erro de persistencia.
- Layout funcional em `320px`, `768px`, `1024px` e largura ampla.

## Criterios de aceite

- Um usuario consegue cadastrar um insumo comprado em kg, consumi-lo em g e obter o custo correto.
- Um produto em lote distribui materiais e mao de obra pelo rendimento informado.
- Um servico pode ser precificado apenas por tempo ou por tempo mais insumos.
- Canais diferentes produzem precos diferentes sem alterar a ficha tecnica.
- As tres referencias explicam claramente cobertura variavel, sustentabilidade e margem.
- O ponto de equilibrio responde ao preco e canal selecionados.
- Produtos antigos aparecem no novo modelo sem duplicacao e com preco equivalente.
- Duas contas locais nao compartilham dados de negocio.
- Recarregar a pagina preserva o workspace e nao repete a migracao.
- Testes, lint e build terminam sem erros.

