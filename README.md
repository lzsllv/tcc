# Precifique

Aplicação local de precificação para pequenos empreendedores, desenvolvida como TCC de Análise e Desenvolvimento de Sistemas.

## Estrutura

```text
front/    aplicação React 19, Vite 8 e testes
backend/  API Node.js/Express e persistência MySQL
docs/     documentação técnica e registros de validação
```

## Execução

Requer Node.js 22.13 ou superior e npm.

```powershell
Set-Location C:\TCC\tcc\front
npm install
npm run dev
```

A aplicação fica disponível em `http://localhost:5173`.

Em outro terminal, inicie o backend para disponibilizar os produtos:

```powershell
Set-Location C:\TCC\tcc\backend
npm start
```

## Dados

A tela de login e o cadastro usam os endpoints do backend (`POST /login` e `POST /usuarios`). A tela **Produtos e serviços** mantém as fichas técnicas e os recursos de precificação do frontend e também consulta os produtos cadastrados no backend (`GET /produtos`). A tela **Canais de venda** carrega a empresa vinculada ao usuário (`GET /empresas`) e persiste os canais e suas taxas no backend (`/canais-venda`). A tela **Custos fixos** também carrega e salva as despesas e gastos extras na rota do workspace do backend (`/workspace/:id_empresa/custos-fixos`). Para configurar a URL da API, defina `VITE_API_URL` no ambiente do Vite (o padrão é `http://localhost:3333`) e inicie o backend na porta correspondente.

A autenticação e o cadastro de usuários são feitos no backend. A sessão fica no navegador para manter o acesso entre recargas. Os canais e custos fixos carregados do backend também são espelhados no workspace local para manter a precificação funcionando. As fichas técnicas e os demais dados de negócio continuam armazenados localmente; consultar produtos da API não sincroniza nem altera esse workspace. Para gerenciar canais, custos fixos e configurações, a conta precisa ter exatamente uma empresa vinculada no backend. A exportação disponível na aplicação pode ser usada como backup do workspace local.

## Verificação

```powershell
Set-Location C:\TCC\tcc\front
npm test
npm run lint
npm run build
```

## Autores

Luiz Fernando, Stefany Marques, Maria Ramiro e Maria Eduarda Gianzanti.
