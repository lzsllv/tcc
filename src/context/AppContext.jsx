import { createContext, useContext, useState, useEffect } from 'react';

const AppContext = createContext();
export function useApp() { return useContext(AppContext); }

export function AppProvider({ children }) {
  const [usuarioLogado, setUsuarioLogado] = useState(() => {
    const s = localStorage.getItem('usuarioLogado');
    return s ? JSON.parse(s) : null;
  });
  const [usuarios, setUsuarios] = useState(() => {
    const s = localStorage.getItem('usuarios');
    return s ? JSON.parse(s) : [];
  });
  const [produtos, setProdutos] = useState(() => {
    const s = localStorage.getItem('produtos');
    return s ? JSON.parse(s) : [];
  });
  const [custosFixos, setCustosFixos] = useState(() => {
    const s = localStorage.getItem('custosFixos');
    if (s) {
      const p = JSON.parse(s);
      if (!p.extras) p.extras = [];
      return p;
    }
    return { aluguel: 0, energia: 0, internet: 0, salarios: 0, outros: 0, extras: [] };
  });
  const [configuracoes, setConfiguracoes] = useState(() => {
    const s = localStorage.getItem('configuracoes');
    if (s) {
      const p = JSON.parse(s);
      // retrocompat
      if (!p.nomeNegocio) p.nomeNegocio = '';
      if (!p.logoNegocio) p.logoNegocio = '';
      return p;
    }
    return { margemLucro: 20, custoHora: 0, regiaoAtuacao: '', nomeNegocio: '', logoNegocio: '' };
  });

  useEffect(() => { localStorage.setItem('usuarioLogado',  JSON.stringify(usuarioLogado));  }, [usuarioLogado]);
  useEffect(() => { localStorage.setItem('usuarios',       JSON.stringify(usuarios));        }, [usuarios]);
  useEffect(() => { localStorage.setItem('produtos',       JSON.stringify(produtos));        }, [produtos]);
  useEffect(() => { localStorage.setItem('custosFixos',    JSON.stringify(custosFixos));     }, [custosFixos]);
  useEffect(() => { localStorage.setItem('configuracoes',  JSON.stringify(configuracoes));   }, [configuracoes]);

  // --- CÁLCULOS ---
  function totalCustosFixos() {
    const fixos  = Object.entries(custosFixos).filter(([k]) => k !== 'extras').reduce((a,[,v]) => a + Number(v), 0);
    const extras = (custosFixos.extras || []).reduce((a, e) => a + Number(e.valor || 0), 0);
    return fixos + extras;
  }
  function totalUnidadesMes() {
    if (!produtos.length) return 1;
    return produtos.reduce((a, p) => a + (Number(p.quantidadeMes) || 1), 0);
  }
  function custoFixoPorUnidade()  { return totalCustosFixos() / totalUnidadesMes(); }
  function custoFixoPorProduto()  { return produtos.length ? totalCustosFixos() / produtos.length : 0; }
  function calcularCustoTotal(p) {
    return Number(p.custo || 0) + custoFixoPorUnidade() + Number(configuracoes.custoHora) * Number(p.tempoProducao || 0);
  }
  function calcularPrecoSugerido(p) {
    return calcularCustoTotal(p) * (1 + Number(configuracoes.margemLucro) / 100);
  }
  function calcularLucroMensal(precoVenda, custoTotal, quantidade) {
    return (Number(precoVenda) - Number(custoTotal)) * Number(quantidade);
  }

  // --- AUTH ---
  function login(email, senha) {
    const u = usuarios.find(u => u.email === email && u.senha === senha);
    if (u) { setUsuarioLogado(u); return true; }
    return false;
  }
  function cadastrar(nome, email, senha) {
    if (usuarios.find(u => u.email === email)) return false;
    setUsuarios(prev => [...prev, { id: Date.now(), nome, email, senha }]);
    return true;
  }
  function logout() { setUsuarioLogado(null); }

  // --- PRODUTOS ---
  function adicionarProduto(p)        { setProdutos(prev => [...prev, { ...p, id: Date.now() }]); }
  function editarProduto(id, dados)   { setProdutos(prev => prev.map(p => p.id === id ? { ...p, ...dados } : p)); }
  function excluirProduto(id)         { setProdutos(prev => prev.filter(p => p.id !== id)); }

  return (
    <AppContext.Provider value={{
      usuarioLogado, usuarios, produtos, custosFixos, configuracoes,
      setCustosFixos, setConfiguracoes,
      totalCustosFixos, totalUnidadesMes, custoFixoPorUnidade, custoFixoPorProduto,
      calcularCustoTotal, calcularPrecoSugerido, calcularLucroMensal,
      login, cadastrar, logout,
      adicionarProduto, editarProduto, excluirProduto,
    }}>
      {children}
    </AppContext.Provider>
  );
}
