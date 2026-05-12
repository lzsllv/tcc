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
    if (salvo) {
      const parsed = JSON.parse(salvo);
      // garante retrocompatibilidade: adiciona extras se não existir
      if (!parsed.extras) parsed.extras = [];
      return parsed;
    }
    return { aluguel: 0, energia: 0, internet: 0, salarios: 0, outros: 0, extras: [] };
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

  function totalCustosFixos() {
    const fixos = Object.entries(custosFixos)
      .filter(([k]) => k !== 'extras')
      .reduce((acc, [, val]) => acc + Number(val), 0);
    const extras = (custosFixos.extras || []).reduce((acc, e) => acc + Number(e.valor || 0), 0);
    return fixos + extras;
  }

  function totalUnidadesMes() {
    if (produtos.length === 0) return 1;
    return produtos.reduce((acc, p) => acc + (Number(p.quantidadeMes) || 1), 0);
  }

  function custoFixoPorUnidade() {
    return totalCustosFixos() / totalUnidadesMes();
  }

  function custoFixoPorProduto() {
    if (produtos.length === 0) return 0;
    return totalCustosFixos() / produtos.length;
  }

  function calcularCustoTotal(produto) {
    const fixo = custoFixoPorUnidade();
    const maoDeObra = Number(configuracoes.custoHora) * Number(produto.tempoProducao || 0);
    return Number(produto.custo || 0) + fixo + maoDeObra;
  }

  function calcularPrecoSugerido(produto) {
    const custo = calcularCustoTotal(produto);
    const margem = Number(configuracoes.margemLucro) / 100;
    return custo * (1 + margem);
  }

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
