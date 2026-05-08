import { createContext, useContext, useState, useEffect } from 'react';

const AppContext = createContext();

export function useApp() {
  return useContext(AppContext);
}

export function AppProvider({ children }) {
  const [usuarioLogado, setUsuarioLogado] = useState(() => {
    const salvo = localStorage.getItem('usuarioLogado');
    return salvo ? JSON.parse(salvo) : null;
  });

  const [usuarios, setUsuarios] = useState(() => {
    const salvo = localStorage.getItem('usuarios');
    return salvo ? JSON.parse(salvo) : [];
  });

  const [produtos, setProdutos] = useState(() => {
    const salvo = localStorage.getItem('produtos');
    return salvo ? JSON.parse(salvo) : [];
  });

  const [custosFixos, setCustosFixos] = useState(() => {
    const salvo = localStorage.getItem('custosFixos');
    return salvo ? JSON.parse(salvo) : {
      aluguel: 0, energia: 0, internet: 0, salarios: 0, outros: 0,
    };
  });

  const [configuracoes, setConfiguracoes] = useState(() => {
    const salvo = localStorage.getItem('configuracoes');
    return salvo ? JSON.parse(salvo) : {
      margemLucro: 20, custoHora: 0, regiaoAtuacao: '',
    };
  });

  useEffect(() => { localStorage.setItem('usuarioLogado', JSON.stringify(usuarioLogado)); }, [usuarioLogado]);
  useEffect(() => { localStorage.setItem('usuarios', JSON.stringify(usuarios)); }, [usuarios]);
  useEffect(() => { localStorage.setItem('produtos', JSON.stringify(produtos)); }, [produtos]);
  useEffect(() => { localStorage.setItem('custosFixos', JSON.stringify(custosFixos)); }, [custosFixos]);
  useEffect(() => { localStorage.setItem('configuracoes', JSON.stringify(configuracoes)); }, [configuracoes]);

  // --- FUNÇÕES DE CÁLCULO ---

  /** Soma de todos os custos fixos mensais. */
  function totalCustosFixos() {
    return Object.values(custosFixos).reduce((acc, val) => acc + Number(val), 0);
  }

  /**
   * Total de unidades produzidas por mês considerando TODOS os produtos.
   * Usado como divisor do rateio de custo fixo.
   */
  function totalUnidadesMes() {
    if (produtos.length === 0) return 1;
    return produtos.reduce((acc, p) => acc + (Number(p.quantidadeMes) || 1), 0);
  }

  /**
   * Custo fixo rateado por unidade produzida (RN06).
   *
   * Fórmula correta:
   *   custo_fixo_por_unidade = total_custos_fixos / total_unidades_de_todos_produtos
   *
   * ATENÇÃO: A divisão deve ser feita pelo TOTAL de unidades de TODOS os produtos
   * juntos, não pela quantidade de cada produto individualmente.
   *
   * Exemplo: custos fixos R$ 1.500, 3 produtos (60+40+20 = 120 un/mês)
   *   custo_fixo_por_unidade = 1500 / 120 = R$ 12,50 por qualquer unidade
   *
   * Se dividisse por produto separado:
   *   Produto A (60 un): 1500/60 = R$25 × 60 = R$1.500 embutido
   *   Produto B (40 un): 1500/40 = R$37.50 × 40 = R$1.500 embutido
   *   Total embutido: R$3.000 — O DOBRO do custo real!
   */
  function custoFixoPorUnidade() {
    const totalUn = totalUnidadesMes();
    return totalCustosFixos() / totalUn;
  }

  /**
   * Média de custo fixo por TIPO de produto (apenas informativo no resumo).
   * Não usado nos cálculos de preço.
   */
  function custoFixoPorProduto() {
    if (produtos.length === 0) return 0;
    return totalCustosFixos() / produtos.length;
  }

  /**
   * Custo total de um produto (RN01):
   *   custo_direto + custo_fixo_por_unidade + mão_de_obra
   *
   * O custo_fixo_por_unidade é o mesmo para todos os produtos
   * (rateado sobre o total de unidades de todos os produtos).
   */
  function calcularCustoTotal(produto) {
    const fixo     = custoFixoPorUnidade();
    const maoDeObra = Number(configuracoes.custoHora) * Number(produto.tempoProducao || 0);
    return Number(produto.custo || 0) + fixo + maoDeObra;
  }

  /**
   * Preço sugerido (RN02):
   *   custo_total × (1 + margem/100)
   */
  function calcularPrecoSugerido(produto) {
    const custo  = calcularCustoTotal(produto);
    const margem = Number(configuracoes.margemLucro) / 100;
    return custo * (1 + margem);
  }

  /**
   * Lucro mensal estimado (RN05):
   *   (preco_venda - custo_total) × quantidade_vendida
   */
  function calcularLucroMensal(precoVenda, custoTotal, quantidade) {
    return (Number(precoVenda) - Number(custoTotal)) * Number(quantidade);
  }

  // --- AUTENTICAÇÃO ---
  function login(email, senha) {
    const usuario = usuarios.find(u => u.email === email && u.senha === senha);
    if (usuario) { setUsuarioLogado(usuario); return true; }
    return false;
  }

  function cadastrar(nome, email, senha) {
    if (usuarios.find(u => u.email === email)) return false;
    setUsuarios(prev => [...prev, { id: Date.now(), nome, email, senha }]);
    return true;
  }

  function logout() { setUsuarioLogado(null); }

  // --- CRUD PRODUTOS ---
  function adicionarProduto(produto) {
    setProdutos(prev => [...prev, { ...produto, id: Date.now() }]);
  }

  function editarProduto(id, dadosNovos) {
    setProdutos(prev => prev.map(p => p.id === id ? { ...p, ...dadosNovos } : p));
  }

  function excluirProduto(id) {
    setProdutos(prev => prev.filter(p => p.id !== id));
  }

  return (
    <AppContext.Provider value={{
      usuarioLogado,
      usuarios,
      produtos,
      custosFixos,
      configuracoes,
      setCustosFixos,
      setConfiguracoes,
      totalCustosFixos,
      totalUnidadesMes,
      custoFixoPorUnidade,
      custoFixoPorProduto,
      calcularCustoTotal,
      calcularPrecoSugerido,
      calcularLucroMensal,
      login,
      cadastrar,
      logout,
      adicionarProduto,
      editarProduto,
      excluirProduto,
    }}>
      {children}
    </AppContext.Provider>
  );
}
