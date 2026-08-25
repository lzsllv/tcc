# Canais de venda e referências de preço

## Objetivo

Conectar as fichas técnicas a canais de venda configuráveis e apresentar preços mínimo, sustentável e recomendado. O usuário deve compreender quanto cobrar em venda direta, cartão ou marketplace sem alterar a composição do produto.

Esta etapa continua frontend-first, usa o workspace v2 e não adiciona backend, estoque, histórico de vendas ou integrações com pagamentos.

## Escopo

- CRUD de canais de venda em `/canais-venda`.
- Taxas percentuais e fixas por canal.
- Categorias de taxa: imposto, pagamento, marketplace e outros.
- Canal padrão único, ativo e obrigatório.
- Duplicação e arquivamento de canais.
- Bloqueio da exclusão do canal padrão e de canais usados como seleção persistida.
- Seletor de canal na listagem de produtos e serviços.
- Cálculo das três referências de preço para cada oferta e canal.
- Explicação curta sobre a cobertura de cada referência.
- Estados de carregamento, vazio, salvamento, sucesso e erro.
- Persistência local pelo `WorkspaceService` existente.

## Modelo de dados

O formato existente de `salesChannels` será mantido:

```js
{
  id,
  ownerId,
  name,
  active,
  isDefault,
  fees: [{ id, name, kind, category, value }],
  createdAt,
  updatedAt,
}
```

`kind` aceita `percentage` ou `fixed`. Percentuais usam pontos-base e taxas fixas usam centavos por venda. `category` aceita `tax`, `payment`, `marketplace` ou `other`.

O workspace recebe `settings.selectedSalesChannelId` para preservar a escolha atual da listagem. A migração em memória preenche esse campo com o canal padrão quando ele estiver ausente; não haverá alteração de versão do schema porque o campo é opcional e retrocompatível.

## Casos de uso

Um módulo `src/application/salesChannels.js` fornecerá funções puras e imutáveis:

- `createSalesChannel(workspace, input, options)`.
- `updateSalesChannel(workspace, channelId, input, now)`.
- `duplicateSalesChannel(workspace, channelId, options)`.
- `setDefaultSalesChannel(workspace, channelId, now)`.
- `archiveSalesChannel(workspace, channelId, now)`.
- `deleteSalesChannel(workspace, channelId, now)`.
- `selectSalesChannel(workspace, channelId, now)`.

As validações rejeitam nome vazio, taxa negativa, percentual acima de 100%, tipo ou categoria desconhecidos, identificadores duplicados e soma de taxas percentuais igual ou superior a 100%. Definir um novo padrão remove `isDefault` dos demais canais. O último canal ativo não pode ser arquivado.

O canal padrão não pode ser excluído. Um canal selecionado deve ser substituído por outro antes da exclusão. Canais arquivados permanecem disponíveis apenas para registros históricos e não podem ser selecionados como padrão.

## Serviço de precificação

Um módulo `src/application/offerPricing.js` compõe funções já testadas no domínio:

1. Calcula o custo variável unitário pela ficha técnica.
2. Calcula o rateio fixo usando ofertas ativas com vendas mensais positivas.
3. Resolve a margem específica da oferta ou a margem padrão do workspace.
4. Calcula preços mínimo, sustentável e recomendado com as taxas do canal.

A interface pública será:

```js
priceOfferForChannel(workspace, offerId, channelId)
```

O retorno inclui custos de materiais, mão de obra, custo variável unitário, rateio fixo, margem efetiva, resumo das taxas e as três referências. Quando não houver planejamento mensal válido, o preço sustentável e recomendado ficam indisponíveis, enquanto o preço mínimo continua calculável. Denominadores inválidos retornam erro contextual e não valores infinitos.

## Interface de canais

A rota `/canais-venda` terá editor à esquerda e lista à direita no desktop, empilhando no celular. O editor contém nome e uma lista dinâmica de taxas. Cada taxa permite escolher natureza, categoria e valor.

Cada cartão mostra:

- Status padrão ou arquivado.
- Total de taxas percentuais.
- Total de taxas fixas.
- Ações editar, duplicar, tornar padrão, arquivar e excluir conforme as regras.

O canal inicial `Venda direta` aparece normalmente e pode ser editado, mas só pode ser arquivado quando existir outro canal ativo e padrão.

## Integração em produtos e serviços

A página `/produtos` ganha um seletor de canal persistido. Cada oferta ativa mostra:

- Preço mínimo: cobre custo variável e taxas da venda.
- Preço sustentável: também cobre o rateio dos custos fixos.
- Preço recomendado: adiciona a margem líquida desejada.

Quando o rateio estiver indisponível, a interface exibe `Planejamento mensal necessário` nos preços sustentável e recomendado. Quando margem e taxas invalidarem a fórmula, o cartão apresenta uma mensagem contextual e mantém visíveis os custos da ficha técnica.

O custo por unidade continua exibido. A troca de canal recalcula os preços imediatamente sem alterar a ficha técnica.

## Navegação e responsividade

`Canais de venda` será incluído no menu principal depois de `Custos Fixos`. A navegação móvel continua com itens diretos, sem submenu. Os layouts serão funcionais em 320px, 768px, 1024px e largura ampla, com controles acessíveis por teclado e rótulos associados.

## Tratamento de erros

- Operações ficam desabilitadas durante salvamento para evitar atualizações concorrentes.
- Erros de persistência usam alerta de erro e preservam o último snapshot válido.
- Mensagens de sucesso usam região anunciável.
- Ações destrutivas exigem confirmação.
- Fórmulas inválidas explicam se o problema está nas taxas, margem ou planejamento mensal.

## Testes

### Casos de uso

- Criar, editar, duplicar, selecionar e arquivar canais sem mutar o workspace original.
- Manter exatamente um canal padrão ativo.
- Validar tipos, categorias e valores das taxas.
- Bloquear exclusão do padrão, do selecionado e arquivamento do último ativo.

### Precificação integrada

- Calcular as três referências com taxa fixa e percentual.
- Aplicar margem específica ou padrão.
- Recalcular quando insumo, custo da hora, custo fixo ou canal mudar.
- Manter preço mínimo disponível sem planejamento mensal.
- Retornar indisponibilidade contextual para rateio ou denominador inválido.

### Verificação de aplicação

- Executar suíte completa, lint e build.
- Revisar estados e responsividade das duas páginas alteradas.

## Critérios de aceite

- O usuário cria um canal com taxa de cartão e vê preços diferentes da venda direta.
- Trocar o canal não altera a ficha técnica nem persiste valores derivados.
- Apenas um canal permanece padrão.
- O preço mínimo cobre custo variável e taxas; o sustentável inclui fixos; o recomendado inclui margem.
- Dados recarregam pelo workspace local e permanecem isolados por usuário.
- Testes, lint e build terminam sem erros.
