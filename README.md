# Precifique

Aplicação local de precificação para pequenos empreendedores, desenvolvida como TCC de Análise e Desenvolvimento de Sistemas.

## Estrutura

```text
front/    aplicação React 19, Vite 8 e testes
backend/  implementação legada, fora do fluxo atual
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

## Dados locais

Contas, senhas derivadas e dados de negócio ficam armazenados somente no navegador atual. Não há sincronização entre dispositivos. Limpar os dados do site remove as contas e os workspaces locais. A exportação disponível na aplicação pode ser usada como backup.

## Verificação

```powershell
Set-Location C:\TCC\tcc\front
npm test
npm run lint
npm run build
```

## Autores

Luiz Fernando, Stefany Marques, Maria Ramiro e Maria Eduarda Gianzanti.
