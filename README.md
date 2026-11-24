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

A tela de login e o cadastro usam os endpoints do backend (`POST /login` e `POST /usuarios`). As fichas técnicas e os insumos são carregados e persistidos pelo backend (`/ofertas` e `/insumos`); assim, as telas **Dashboard**, **Produtos e serviços**, **Insumos**, **Simulação** e **Relatório** usam o workspace da empresa no MySQL. A tela **Produtos e serviços** também consulta a lista antiga de produtos (`GET /produtos`), exibida no mesmo catálogo das fichas técnicas. Para habilitar o arquivamento dos produtos antigos, aplique uma vez o script `backend/src/dataBase/create_db/008-STATUS_PRODUTO.sql` no banco existente. **Canais de venda** carrega a empresa vinculada ao usuário (`GET /empresas`) e persiste canais e taxas no backend (`/canais-venda`). **Custos fixos** e **Configurações** também carregam e salvam dados no backend. No desenvolvimento, `VITE_API_URL=/api` e o proxy do Vite encaminha as chamadas para `http://localhost:3333`; inicie o backend na porta 3333. Em produção, defina `VITE_API_URL` com a URL pública da API ou configure o servidor para encaminhar `/api` ao backend.

A autenticação e o cadastro de usuários são feitos no backend. A sessão fica no navegador para manter o acesso entre recargas. O workspace do frontend mantém um cache local, mas insumos e fichas técnicas são sincronizados com o backend e recarregados do MySQL. Para gerenciar esses dados, canais, custos fixos e configurações, a conta precisa ter exatamente uma empresa vinculada no backend. A exportação disponível na aplicação pode ser usada como backup do workspace.

## Verificação

```powershell
Set-Location C:\TCC\tcc\front
npm test
npm run lint
npm run build
```

## Autores

Luiz Fernando, Stefany Marques, Maria Ramiro e Maria Eduarda Gianzanti.
