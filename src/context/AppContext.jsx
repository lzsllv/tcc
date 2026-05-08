import { createContext, useContext, useState, useEffect } from 'react';

const AppContext = createContext();

export function useApp() {
  return useContext(AppContext);
}

export function AppProvider({ children }) {
  // --- USUÁRIO ---
  const [usuarioLogado, setUsuarioLogado] = useState(() => {
    const salvo = localStorage.getItem('usuarioLogado');
    return salvo ? JSON.parse(salvo) : null;
  });

  const [usuarios, setUsuarios] = useState(() => {
    const salvo = localStorage.getItem('usuarios');
    return salvo ? JSON.parse(salvo) : [];
  });

  // --- PRODUTOS ---
  const [produtos, setProdutos] = useState(() => {
    const salvo = localStorage.getItem('produtos');
    return salvo ? JSON.parse(salvo) : [];
  });

  // --- CUSTOS FIXOS ---
  const [custosFixos, setCustosFixos] = useState(() => {
    const salvo = localStorage.getItem('custosFixos');
    return salvo ? JSON.parse(salvo) : {
      aluguel: 0,
      energia: 0,
      internet: 0,
      salarios: 0,
      outros: 0,
    };
  });

  // --- CONFIGURAÇÕES ---
  const [configuracoes, setConfiguracoes] = useState(() => {
    const salvo = localStorage.getItem('configuracoes');
    return salvo ? JSON.parse(salvo) : {
      margemLucro: 20,
      custoHora: 0,
      regiaoAtuacao: '',
    };
  });

  // Persistência automática
  useEffect(() => { localStorage.setItem('usuarioLogado', JSON.stringify(usuarioLogado)); }, [usuarioLogado]);
  useEffect(() => { localStorage.setItem('usuarios', JSON.stringify(usuarios)); }, [usuarios]);
  useEffect(() => { localStorage.setItem('produtos', JSON.stringify(produtos)); }, [produtos]);
  useEffect(() => { localStorage.setItem('custosFixos', JSON.stringify(custosFixos)); }, [custosFixos]);
  useEffect(() => { localStorage.setItem('configuracoes', JSON.stringify(configuracoes)); }, [configuracoes]);

  // --- FUNÇÕES DE CÁLCULO ---

  // Total dos custos fixos mensais
  function totalCustosFixos() {
    return Object.values(custosFixos).reduce((acc, val) => acc + Number(val), 0);
  }

  /**
   * Custo fixo rateado por UNIDADE de um produto específico.
   * 
   * Fórmula correta:
   *   custo_fixo_por_unidade = total_custos_fixos / quantidadeMes
   * 
   * Antes estava dividindo pelo nº de tipos de produto cadastrados,
   * o que causava valores absurdos (ex: 1 produto absorvia R$4.000 inteiros).
   * 
   * @param {object} produto - o produto com campo quantidadeMes
   */
  function custoFixoPorUnidade(produto) {
    const qtd = Number(produto?.quantidadeMes) || 1;
    return totalCustosFixos() / qtd;
  }

  /**
   * Mantido por compatibilidade — retorna o custo fixo médio entre produtos.
   * Usado apenas no Relatório (resumo geral).
   */
  function custoFixoPorProduto() {
    if (produtos.length === 0) return 0;
    return totalCustosFixos() / produtos.length;
  }

  /**
   * Custo total de um produto (RN01):
   *   custo_direto + custo_fixo_rateado_por_unidade + mao_de_obra
   */
  function calcularCustoTotal(produto) {
    const fixo = custoFixoPorUnidade(produto);
    const maoDeObra = Number(configuracoes.custoHora) * Number(produto.tempoProducao || 0);
    return Number(produto.custo || 0) + fixo + maoDeObra;
  }

  /**
   * Preço sugerido (RN02):
   *   custo_total × (1 + margem/100)
   */
  function calcularPrecoSugerido(produto) {
    const custo = calcularCustoTotal(produto);
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
      custoFixoPorProduto,
      custoFixoPorUnidade,
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
