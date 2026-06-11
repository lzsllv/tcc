import { createContext, useContext, useState, useEffect } from 'react';

const AppContext = createContext();
export function useApp() { return useContext(AppContext); }

// Ofuscação simples de senha (não é criptografia real, mas evita texto puro visível)
function hashSenha(senha) {
  return btoa(unescape(encodeURIComponent(senha + ':precifique')));
}

export function AppProvider({ children }) {
  const [usuarioLogado, setUsuarioLogado] = useState(() => {
    try { const s = localStorage.getItem('usuarioLogado'); return s ? JSON.parse(s) : null; }
    catch { return null; }
  });
  const [usuarios, setUsuarios] = useState(() => {
    try { const s = localStorage.getItem('usuarios'); return s ? JSON.parse(s) : []; }
    catch { return []; }
  });
  const [produtos, setProdutos] = useState(() => {
    try { const s = localStorage.getItem('produtos'); return s ? JSON.parse(s) : []; }
    catch { return []; }
  });
  const [custosFixos, setCustosFixos] = useState(() => {
    try {
      const s = localStorage.getItem('custosFixos');
      if (s) {
        const p = JSON.parse(s);
        if (!p.extras) p.extras = [];
        return p;
      }
    } catch { /* ignora */ }
    return { aluguel: 0, energia: 0, internet: 0, salarios: 0, outros: 0, extras: [] };
  });
  const [configuracoes, setConfiguracoes] = useState(() => {
    try {
      const s = localStorage.getItem('configuracoes');
      if (s) {
        const p = JSON.parse(s);
        if (!p.nomeNegocio) p.nomeNegocio = '';
        if (!p.logoNegocio) p.logoNegocio = '';
        if (!p.regiaoAtuacao) p.regiaoAtuacao = '';
        return p;
      }
    } catch { /* ignora */ }
    return { margemLucro: 20, custoHora: 0, regiaoAtuacao: '', nomeNegocio: '', logoNegocio: '' };
  });

  useEffect(() => {
    try { localStorage.setItem('usuarioLogado', JSON.stringify(usuarioLogado)); } catch { /* storage cheio */ }
  }, [usuarioLogado]);
  useEffect(() => {
    try { localStorage.setItem('usuarios', JSON.stringify(usuarios)); } catch { /* storage cheio */ }
  }, [usuarios]);
  useEffect(() => {
    try { localStorage.setItem('produtos', JSON.stringify(produtos)); } catch { /* storage cheio */ }
  }, [produtos]);
  useEffect(() => {
    try { localStorage.setItem('custosFixos', JSON.stringify(custosFixos)); } catch { /* storage cheio */ }
  }, [custosFixos]);
  useEffect(() => {
    // Não salva o base64 do logo se for muito grande (>400KB em base64 ≈ 300KB de arquivo)
    const parasSalvar = { ...configuracoes };
    if (parasSalvar.logoNegocio && parasSalvar.logoNegocio.length > 400000) {
      parasSalvar.logoNegocio = '';
    }
    try { localStorage.setItem('configuracoes', JSON.stringify(parasSalvar)); } catch { /* storage cheio */ }
  }, [configuracoes]);

  // ── CÁLCULOS ──
  function totalCustosFixos() {
    const fixos  = Object.entries(custosFixos).filter(([k]) => k !== 'extras').reduce((a, [, v]) => a + Number(v), 0);
    const extras = (custosFixos.extras || []).reduce((a, e) => a + Number(e.valor || 0), 0);
    return fixos + extras;
  }

  function totalUnidadesMes() {
    if (!produtos.length) return 1;
    const total = produtos.reduce((a, p) => a + (Number(p.quantidadeMes) || 0), 0);
    return total > 0 ? total : 1;
  }

  function custoFixoPorUnidade()  { return totalCustosFixos() / totalUnidadesMes(); }
  function custoFixoPorProduto()  { return produtos.length ? totalCustosFixos() / produtos.length : 0; }

  function calcularCustoTotal(p) {
    return (
      Number(p.custo || 0) +
      custoFixoPorUnidade() +
      Number(configuracoes.custoHora) * Number(p.tempoProducao || 0)
    );
  }

  function calcularPrecoSugerido(p) {
    return calcularCustoTotal(p) * (1 + Number(configuracoes.margemLucro) / 100);
  }

  function calcularLucroMensal(precoVenda, custoTotal, quantidade) {
    return (Number(precoVenda) - Number(custoTotal)) * Number(quantidade);
  }

  // ── AUTH ──
  function login(email, senha) {
    const hash = hashSenha(senha);
    const u = usuarios.find(u => u.email === email && (u.senha === hash || u.senha === senha));
    if (u) {
      if (u.senha === senha) {
        setUsuarios(prev => prev.map(x => x.id === u.id ? { ...x, senha: hash } : x));
      }
      const { senha: _s, ...semSenha } = u;
      setUsuarioLogado(semSenha);
      return true;
    }
    return false;
  }

  function cadastrar(nome, email, senha) {
    if (usuarios.find(u => u.email === email)) return false;
    setUsuarios(prev => [...prev, { id: Date.now(), nome, email, senha: hashSenha(senha) }]);
    return true;
  }

  function logout() { setUsuarioLogado(null); }

  // ── PRODUTOS ──
  // IDs como string (UUID) para compatibilidade com o valor do <select> na Simulacao
  function adicionarProduto(p)      { setProdutos(prev => [...prev, { ...p, id: crypto.randomUUID() }]); }
  function editarProduto(id, dados) { setProdutos(prev => prev.map(p => p.id === id ? { ...p, ...dados } : p)); }
  function excluirProduto(id)       { setProdutos(prev => prev.filter(p => p.id !== id)); }

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
