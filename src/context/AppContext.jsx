import { createContext, useContext, useState, useEffect } from 'react';

const AppContext = createContext();
export function useApp() { return useContext(AppContext); }

// AVISO: btoa é ofuscação simples, não criptografia real.
// Para produção real, use bcrypt no servidor. Para este TCC (client-only) é suficiente.
function hashSenha(senha) {
  return btoa(unescape(encodeURIComponent(senha + ':precifique')));
}

// ── DADOS DE DEMONSTRAÇÃO ──
const DEMO_CONFIGURACOES = {
  margemLucro: 30,
  custoHora: 25,
  regiaoAtuacao: 'São Paulo - SP',
  nomeNegocio: 'Doces da Maria 🍰',
  logoNegocio: '',
};

const DEMO_CUSTOS_FIXOS = {
  aluguel: 800,
  energia: 180,
  internet: 100,
  salarios: 0,
  outros: 120,
  extras: [
    { id: 'demo-extra-1', nome: 'Embalagens avulsas', valor: 90 },
    { id: 'demo-extra-2', nome: 'Material de limpeza', valor: 60 },
  ],
};

const DEMO_PRODUTOS = [
  {
    id: 'demo-prod-1',
    nome: 'Bolo de Chocolate',
    categoria: 'alimento',
    custo: 38.50,
    tempoProducao: 2.5,
    quantidadeMes: 20,
    descricao: 'Bolo recheado com ganache e cobertura de chocolate belga',
  },
  {
    id: 'demo-prod-2',
    nome: 'Brigadeiro Gourmet (caixa 30un)',
    categoria: 'alimento',
    custo: 22.00,
    tempoProducao: 1.5,
    quantidadeMes: 40,
    descricao: 'Caixa com 30 brigadeiros gourmet sortidos',
  },
  {
    id: 'demo-prod-3',
    nome: 'Torta de Limão',
    categoria: 'alimento',
    custo: 31.00,
    tempoProducao: 2,
    quantidadeMes: 15,
    descricao: 'Torta com massa amanteigada, creme de limão e merengue',
  },
  {
    id: 'demo-prod-4',
    nome: 'Cupcake Decorado (kit 6un)',
    categoria: 'alimento',
    custo: 18.00,
    tempoProducao: 1,
    quantidadeMes: 30,
    descricao: 'Kit com 6 cupcakes decorados com chantilly e confeitos',
  },
  {
    id: 'demo-prod-5',
    nome: 'Consultoria de Cardápio',
    categoria: 'servico',
    custo: 0,
    tempoProducao: 3,
    quantidadeMes: 5,
    descricao: 'Montagem de cardápio personalizado para eventos',
  },
];

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
        if (!p.nomeNegocio)    p.nomeNegocio    = '';
        if (!p.logoNegocio)    p.logoNegocio    = '';
        if (!p.regiaoAtuacao)  p.regiaoAtuacao  = '';
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
    const paraSalvar = { ...configuracoes };
    if (paraSalvar.logoNegocio && paraSalvar.logoNegocio.length > 400000) {
      paraSalvar.logoNegocio = '';
    }
    try { localStorage.setItem('configuracoes', JSON.stringify(paraSalvar)); } catch { /* storage cheio */ }
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

  // ── DEMO ──
  function carregarDadosDemo() {
    setProdutos(DEMO_PRODUTOS);
    setCustosFixos(DEMO_CUSTOS_FIXOS);
    setConfiguracoes(prev => ({ ...DEMO_CONFIGURACOES, logoNegocio: prev.logoNegocio || '' }));
  }

  function limparDadosDemo() {
    setProdutos([]);
    setCustosFixos({ aluguel: 0, energia: 0, internet: 0, salarios: 0, outros: 0, extras: [] });
    setConfiguracoes({ margemLucro: 20, custoHora: 0, regiaoAtuacao: '', nomeNegocio: '', logoNegocio: '' });
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
    setUsuarios(prev => [...prev, { id: crypto.randomUUID(), nome, email, senha: hashSenha(senha) }]);
    return true;
  }

  function logout() { setUsuarioLogado(null); }

  // ── PRODUTOS ──
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
      carregarDadosDemo, limparDadosDemo,
    }}>
      {children}
    </AppContext.Provider>
  );
}
