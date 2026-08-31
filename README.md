# 💰 Precifique

> Sistema de precificação para pequenos empreendedores — calcule custos, defina preços e projete seu lucro mensal.

🌐 **[precifique-app.vercel.app](https://precifique-app.vercel.app)**

---

## 📌 Sobre o projeto

O **Precifique** é uma aplicação web desenvolvida como Trabalho de Conclusão de Curso (TCC) do curso de Análise e Desenvolvimento de Sistemas.

O sistema foi criado para ajudar pequenos empreendedores — artesãos, doceiras, costureiras e outros profissionais — a **precificar seus produtos de forma correta**, levando em conta custos diretos, custos fixos rateados, tempo de produção e margem de lucro desejada.

---

## ✨ Funcionalidades

- 🔐 **Autenticação** — cadastro e login com senha criptografada (hash SHA-256)
- 📦 **Produtos** — cadastro de produtos com custo direto, tempo de produção e quantidade mensal
- 💸 **Custos Fixos** — registro de despesas mensais (aluguel, energia, salários e extras personalizados)
- ⚙️ **Configurações** — custo/hora de trabalho, markup desejado, nome e logo do negócio
- 📈 **Simulação de Lucro** — simule cenários de preço antes de vender, com alerta de prejuízo
- 📊 **Relatório** — projeção mensal com receita, lucro e tabela detalhada por produto
- 🖨️ **Impressão** — relatório otimizado para impressão/PDF

---

## 🧮 Como funciona o cálculo

```
Custo fixo por unidade  = Total de custos fixos ÷ Total de unidades/mês (todos os produtos)
Custo de mão de obra    = Tempo de produção (horas) × Custo/hora configurado
Custo total unitário    = Custo direto + Custo fixo/un + Mão de obra
Preço sugerido          = Custo total × (1 + Markup / 100)
Lucro por unidade       = Preço sugerido − Custo total
Lucro mensal            = Lucro por unidade × Quantidade/mês
```

---

## 🛠️ Tecnologias

| Camada | Tecnologia |
|--------|-----------|
| Framework | [React 19](https://react.dev/) |
| Roteamento | [React Router DOM 7](https://reactrouter.com/) |
| Build tool | [Vite 8](https://vitejs.dev/) |
| Estilização | CSS puro com variáveis customizadas |
| Persistência | `localStorage` (client-side) |
| Autenticação | Hash SHA-256 via Web Crypto API |

---

## 🚀 Como rodar localmente

### Pré-requisitos

- [Node.js](https://nodejs.org/) v18 ou superior
- npm (já vem com o Node)

### Instalação

```bash
# Clone o repositório
git clone https://github.com/lzsllv/tcc.git

# Entre na pasta
cd tcc

# Instale as dependências
npm install

# Inicie o servidor de desenvolvimento
npm run dev
```

A aplicação estará disponível em `http://localhost:5173`.

### Build para produção

```bash
npm run build
npm run preview
```

---

## 📁 Estrutura do projeto

```
src/
├── components/       # Navbar e componentes reutilizáveis
├── context/          # AppContext — estado global e toda a lógica de cálculo
├── pages/            # Páginas da aplicação
│   ├── LandingPage.jsx
│   ├── Login.jsx
│   ├── Cadastro.jsx
│   ├── Dashboard.jsx
│   ├── Produtos.jsx
│   ├── CustosFixos.jsx
│   ├── Configuracoes.jsx
│   ├── Simulacao.jsx
│   ├── Relatorio.jsx
│   └── NotFound.jsx
└── styles/           # Arquivos CSS por página/componente
```

---

## 👨‍💻 Autor

Desenvolvido por **Luiz Fernando, Stefany Marques, Maria Ramiro e Maria Eduarda Gianzanti**

---

## 📄 Licença

Este projeto é de uso acadêmico. Todos os direitos reservados ao autor.
