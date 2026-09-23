# Autenticação e persistência locais do Precifique

## Objetivo

Manter o SaaS Precifique completamente utilizável sem Supabase, PostgreSQL ou backend. O usuário continuará criando conta, entrando e saindo pelas telas atuais, mas credenciais, sessão e workspaces serão armazenados somente no navegador em uso.

## Escopo

- Substituir o cliente e o serviço de autenticação Supabase por autenticação local.
- Preservar as telas e rotas de cadastro, login, logout e áreas protegidas.
- Isolar os dados de cada conta local por um identificador estável.
- Persistir o workspace com o `LocalWorkspaceRepository` existente.
- Manter exportação, logo, demonstração, produtos, insumos, custos, canais, simulações e configurações.
- Remover do fluxo do frontend qualquer chamada ao Supabase ou à API do backend.
- Atualizar a documentação de execução para o modo exclusivamente local.

Não fazem parte desta mudança sincronização entre dispositivos, recuperação de senha, envio de e-mail, banco remoto, migração de usuários do Supabase ou proteção contra alguém com acesso ao perfil local do navegador.

## Arquitetura

### Serviço de autenticação local

Um `LocalAuthService` fornecerá o mesmo contrato de alto nível consumido pelo contexto da aplicação:

- `getSession()` restaura a sessão ativa.
- `subscribe(callback)` notifica alterações de sessão.
- `signUp(name, email, password)` cria uma conta local e inicia a sessão.
- `signIn(email, password)` valida as credenciais e inicia a sessão.
- `signOut()` encerra a sessão.

As contas serão armazenadas sob uma chave versionada no `localStorage`. E-mails serão aparados e normalizados para letras minúsculas antes de comparação. Cada conta receberá um UUID gerado pelo navegador.

Senhas não serão armazenadas em texto puro. O serviço usará Web Crypto com PBKDF2, salt aleatório exclusivo por conta e SHA-256. O registro persistirá somente salt, hash e os parâmetros necessários à verificação. Essa proteção reduz a exposição acidental, mas não transforma o armazenamento do navegador em um cofre contra usuários com acesso ao dispositivo.

### Sessão local

A chave de sessão guardará apenas o ID da conta ativa. Ao restaurar a aplicação, o serviço localizará a conta correspondente e devolverá um objeto de sessão com usuário local. Sessões inválidas ou contas ausentes serão descartadas.

As notificações ocorrerão dentro da mesma instância do aplicativo após cadastro, login e logout. Uma nova abertura ou atualização de página restaurará a sessão pelo `localStorage`.

### Persistência do workspace

O `AppContext` criará `WorkspaceService` com `LocalWorkspaceRepository` para o ID da conta ativa. A estrutura atual de workspace continuará sendo a fonte de verdade para os dados do SaaS.

Cada conta usará a chave já suportada pelo repositório local, `precifique:workspace:v2:<ownerId>`, garantindo isolamento entre usuários. Dados legados existentes continuarão passando pela migração já implementada quando a conta ainda não possuir workspace v2.

Logos serão persistidos como data URL dentro das configurações do workspace. O repositório local receberá operações explícitas para salvar e remover logo, preservando o contrato esperado por `WorkspaceService`.

### Interface e navegação

As rotas `/cadastro`, `/login` e as rotas protegidas permanecerão. Após cadastro ou login bem-sucedido, o usuário seguirá para o dashboard. Logout limpará apenas a sessão ativa e não excluirá a conta ou seus dados.

Os textos que prometem conta remota ou proteção em servidor serão ajustados para explicar que os dados ficam neste navegador. Não será criado um novo layout nem alterado o sistema visual existente.

## Fluxos principais

### Cadastro

1. A tela envia nome, e-mail e senha ao serviço local.
2. O serviço valida campos e normaliza o e-mail.
3. Se o e-mail já existir, retorna erro legível.
4. O serviço gera ID, salt e hash, persiste a conta e abre a sessão.
5. O contexto inicializa um workspace vazio ou migra dados legados.
6. A interface navega para o dashboard.

### Login

1. O serviço normaliza o e-mail e procura a conta.
2. Recalcula o hash com o salt persistido.
3. Em caso de divergência, retorna a mesma mensagem segura para e-mail inexistente ou senha incorreta.
4. Em caso de sucesso, persiste a sessão e inicializa o workspace da conta.

### Logout

1. O serviço remove a sessão ativa.
2. O contexto invalida operações em andamento e limpa a visão atual.
3. A interface volta para o login sem apagar os dados persistidos.

## Tratamento de erros

- Cadastro duplicado: “Já existe uma conta com este e-mail.”
- Credenciais inválidas: “E-mail ou senha inválidos.”
- Dados locais corrompidos: a aplicação não sobrescreverá silenciosamente o conteúdo; exibirá erro de leitura e manterá os dados existentes para possível recuperação.
- Falha de armazenamento, incluindo cota excedida: a operação falhará com mensagem clara, sem informar sucesso.
- API Web Crypto indisponível: cadastro e login falharão com mensagem de incompatibilidade do navegador.

## Segurança e privacidade

- Nenhuma chave secreta, senha em texto puro ou credencial Supabase será incluída no bundle.
- Comparações de senha usarão os bytes derivados, sem converter a senha para armazenamento persistente.
- A aplicação informará que contas e dados existem somente no navegador atual.
- Limpar dados do site, usar outro navegador ou outro dispositivo não preserva a conta; a exportação do workspace será a forma de backup disponível neste escopo.

## Testes

O desenvolvimento seguirá testes primeiro. A cobertura incluirá:

- cadastro cria conta, hash e sessão sem persistir a senha em texto puro;
- e-mail é normalizado e duplicatas são recusadas;
- senha correta entra e senha incorreta falha com mensagem segura;
- sessão válida é restaurada e sessão inválida é removida;
- logout preserva conta e workspace;
- duas contas mantêm workspaces independentes;
- logo local é salvo e removido;
- `AppContext` não depende de `fetch`, Supabase ou backend;
- fluxos existentes de dashboard, demonstração e exportação continuam passando;
- lint e build de produção permanecem verdes.

## Critérios de conclusão

- O frontend inicia sem variáveis de ambiente do Supabase ou URL da API.
- Um usuário consegue cadastrar, entrar, editar dados, atualizar a página, sair e entrar novamente mantendo seu workspace.
- Duas contas no mesmo navegador não veem os dados uma da outra.
- A aplicação não emite requisições para Supabase ou backend durante esses fluxos.
- Todos os testes, lint e build do frontend passam.
