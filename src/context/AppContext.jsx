/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect, useReducer } from 'react';
import { WorkspaceService } from '../application/WorkspaceService.js';
import { initialWorkspaceState, workspaceReducer } from '../application/workspaceState.js';
import { LocalWorkspaceRepository } from '../persistence/index.js';
import { isDemoAccountEmpty, persistDemoAccount } from '../application/demoAccount.js';

const AppContext = createContext();
export function useApp() { return useContext(AppContext); }

function hashSenha(senha) {
  return btoa(unescape(encodeURIComponent(senha + ':precifique')));
}

export function AppProvider({ children }) {
  const [workspaceService] = useState(() => (
    typeof localStorage !== 'undefined'
      ? new WorkspaceService(new LocalWorkspaceRepository(localStorage), localStorage)
      : null
  ));
  const [workspaceState, dispatchWorkspace] = useReducer(workspaceReducer, initialWorkspaceState);
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
    let active = true;
    if (!usuarioLogado) {
      dispatchWorkspace({ type: 'reset' });
      return undefined;
    }

    const service = workspaceService;
    dispatchWorkspace({ type: 'loadStarted' });
    service.initialize(String(usuarioLogado.id))
      .then(workspace => {
        if (active) dispatchWorkspace({ type: 'loadSucceeded', workspace });
      })
      .catch(error => {
        if (active) dispatchWorkspace({ type: 'failed', error });
      });

    return () => { active = false; };
  }, [usuarioLogado, workspaceService]);
  useEffect(() => {
    try { localStorage.setItem('usuarioLogado', JSON.stringify(usuarioLogado)); } catch { /* storage cheio */ }
  }, [usuarioLogado, workspaceService]);
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
    const parasSalvar = { ...configuracoes };
    if (parasSalvar.logoNegocio && parasSalvar.logoNegocio.length > 400000) {
      parasSalvar.logoNegocio = '';
    }
    try { localStorage.setItem('configuracoes', JSON.stringify(parasSalvar)); } catch { /* storage cheio */ }
  }, [configuracoes]);

  // ── CALCULOS ──
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
  const podeCarregarDemo = workspaceState.status === 'ready' && isDemoAccountEmpty({
    workspace: workspaceState.data,
    produtos,
    custosFixos,
    configuracoes,
  });

  async function carregarDemo() {
    const demo = await persistDemoAccount({
      workspaceStatus: workspaceState.status,
      workspace: workspaceState.data,
      produtos,
      custosFixos,
      configuracoes,
    }, workspace => atualizarWorkspace(() => workspace));
    setProdutos(demo.produtos);
    setCustosFixos(demo.custosFixos);
    setConfiguracoes(demo.configuracoes);
  }
  // ── AUTH ──
  function login(email, senha) {
    const hash = hashSenha(senha);
    const u = usuarios.find(u => u.email === email && (u.senha === hash || u.senha === senha));
    if (u) {
      if (u.senha === senha) {
        setUsuarios(prev => prev.map(x => x.id === u.id ? { ...x, senha: hash } : x));
      }
      const semSenha = { ...u };
      delete semSenha.senha;
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
  function adicionarProduto(p)      { setProdutos(prev => [...prev, { ...p, id: crypto.randomUUID() }]); }
  function editarProduto(id, dados) { setProdutos(prev => prev.map(p => p.id === id ? { ...p, ...dados } : p)); }
  function excluirProduto(id)       { setProdutos(prev => prev.filter(p => p.id !== id)); }

  async function atualizarWorkspace(updater) {
    if (!usuarioLogado || !workspaceState.data || !workspaceService) {
      throw new Error('Workspace ainda não está pronto para atualização.');
    }
    dispatchWorkspace({ type: 'saveStarted' });
    try {
      const workspace = await workspaceService.update(
        String(usuarioLogado.id),
        workspaceState.data,
        updater,
      );
      dispatchWorkspace({ type: 'saveSucceeded', workspace });
      return workspace;
    } catch (error) {
      dispatchWorkspace({ type: 'failed', error });
      throw error;
    }
  }

  async function exportarWorkspace() {
    if (!usuarioLogado || !workspaceService) {
      throw new Error('Entre na sua conta para exportar os dados.');
    }
    return workspaceService.export(String(usuarioLogado.id));
  }
  return (
    <AppContext.Provider value={{
      usuarioLogado, usuarios, produtos, custosFixos, configuracoes,
      workspace: workspaceState.data, workspaceStatus: workspaceState.status, workspaceError: workspaceState.error,
      setCustosFixos, setConfiguracoes,
      totalCustosFixos, totalUnidadesMes, custoFixoPorUnidade, custoFixoPorProduto,
      calcularCustoTotal, calcularPrecoSugerido, calcularLucroMensal,
      login, cadastrar, logout,
      adicionarProduto, editarProduto, excluirProduto,
      podeCarregarDemo, carregarDemo, atualizarWorkspace, exportarWorkspace,
    }}>
      {children}
    </AppContext.Provider>
  );
}
