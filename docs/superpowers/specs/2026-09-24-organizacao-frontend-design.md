# Organização profissional do frontend

## Objetivo

Reorganizar o código do frontend do Precifique para tornar responsabilidades, dependências e fluxos mais fáceis de compreender, sem alterar comportamento, interface, armazenamento, regras de negócio ou contratos públicos usados pelas páginas.

## Escopo

- Separar contexto React, provider, estados iniciais e cálculos de apresentação.
- Extrair a configuração de rotas do componente principal.
- Manter páginas, componentes compartilhados, domínio, aplicação, autenticação e persistência em suas camadas atuais.
- Atualizar imports e testes afetados pela redistribuição dos módulos.
- Remover comentários JavaScript, JSX e CSS do frontend.
- Preservar URLs, expressões regulares, strings, data URLs e conteúdo SVG que contenham barras como parte dos dados.
- Manter o backend e suas alterações pendentes fora do escopo.

## Restrições

- Nenhum fluxo funcional será adicionado, removido ou alterado.
- Nenhum texto visível, estilo, rota ou formato persistido será alterado.
- Nenhuma dependência será adicionada.
- O login, a sessão e os workspaces continuarão locais ao navegador.
- A API pública exposta por `useApp` permanecerá compatível com todas as páginas atuais.
- Arquivos de código não conterão comentários de observação, documentação, seção ou processo.

## Estrutura proposta

### Aplicação e rotas

`front/src/App.jsx` ficará responsável somente por montar o provider, o router e o componente de rotas.

`front/src/app/AppRoutes.jsx` concentrará:

- imports das páginas;
- definição das rotas públicas e protegidas;
- proteção de rota autenticada;
- redirecionamento da página inicial conforme a sessão.

### Contexto React

`front/src/context/AppContext.js` conterá apenas a criação do contexto e o hook `useApp`.

`front/src/context/AppProvider.jsx` será responsável por compor autenticação, workspace e o valor público do contexto. O provider continuará usando `LocalAuthService`, `LocalAccountStore`, `LocalWorkspaceRepository` e `WorkspaceService`.

`front/src/context/appDefaults.js` conterá fábricas para os estados vazios de custos fixos e configurações. Fábricas serão usadas para evitar compartilhamento acidental de objetos mutáveis.

`front/src/context/pricingView.js` conterá as funções puras usadas pelo contexto para totalizar custos, calcular rateios, custo total, preço sugerido e lucro mensal.

`front/src/context/workspaceView.js` continuará convertendo dados entre o workspace persistido e o formato consumido pelas telas.

### Camadas preservadas

- `auth/`: credenciais, contas e sessão local.
- `persistence/`: estrutura, migração e armazenamento do workspace.
- `domain/`: regras financeiras sem React.
- `application/`: casos de uso e operações sobre workspace.
- `pages/`: composição de cada tela.
- `components/`: componentes compartilhados.
- `styles/`: estilos por tela ou componente.

Não haverá redistribuição completa por funcionalidade, pois isso produziria muitos movimentos de arquivos sem benefício proporcional para o tamanho atual do projeto.

## Fluxo de dados

1. `App.jsx` monta `AppProvider` e `BrowserRouter`.
2. `AppRoutes` consulta `useApp` para proteger ou redirecionar rotas.
3. `AppProvider` restaura a conta local e cria o serviço do workspace correspondente.
4. O workspace persistido é convertido por `workspaceView` para o formato das páginas.
5. Cálculos de apresentação são delegados a funções puras de `pricingView`.
6. Atualizações continuam sendo persistidas pelo mesmo `WorkspaceService` e repositório local.

## Remoção de comentários

Serão removidos:

- comentários de linha JavaScript;
- comentários em bloco e JSDoc;
- comentários JSX;
- cabeçalhos, divisores e observações em CSS;
- comentários usados para desabilitar regras do ESLint.

A separação de `AppContext.js` e `AppProvider.jsx` elimina a necessidade da desativação de `react-refresh/only-export-components`. Blocos `catch` vazios serão substituídos por construções equivalentes sem comentários e sem mudança de resultado.

## Testes e validação

Os testes existentes permanecerão como garantia de comportamento. Os imports serão atualizados para os novos módulos, e funções puras extraídas receberão testes diretos quando ainda não estiverem cobertas por testes equivalentes.

A conclusão exige:

- todos os testes do frontend aprovados;
- lint sem erros ou comentários de desativação;
- build de produção aprovado;
- nenhuma referência importada para arquivos removidos;
- nenhuma ocorrência de comentários JavaScript, JSX ou CSS nos arquivos de código do frontend;
- confirmação de que login, cadastro, restauração, logout, isolamento de contas, workspace, logo, demonstração e exportação continuam cobertos.

## Critérios de conclusão

- `App.jsx` e os módulos do contexto apresentam uma responsabilidade principal clara.
- As páginas continuam consumindo `useApp` sem mudança funcional.
- A estrutura de diretórios comunica as camadas da aplicação.
- Não existem comentários de observação no código do frontend.
- Não existem alterações no backend atribuídas a esta reorganização.
- O frontend mantém os mesmos resultados funcionais antes e depois da mudança.
