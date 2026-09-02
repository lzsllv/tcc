/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect, useReducer } from 'react';
import { WorkspaceService } from '../application/WorkspaceService.js';
import { initialWorkspaceState, workspaceReducer } from '../application/workspaceState.js';
import { RemoteWorkspaceRepository } from '../persistence/RemoteWorkspaceRepository.js';
import { isDemoAccountEmpty, persistDemoAccount } from '../application/demoAccount.js';
import { SupabaseAuthService } from '../auth/SupabaseAuthService.js';
import { createBrowserSupabaseClient } from '../auth/supabaseClient.js';
import { sessionUser } from '../auth/session.js';
import { calculateOfferVariableCost } from '../domain/pricing/offers.js';

const AppContext = createContext();
export function useApp() { return useContext(AppContext); }

function legacyFixedCosts(fixedCosts) {
  return {
    ...Object.fromEntries(['aluguel', 'energia', 'internet', 'salarios', 'outros'].map(key => [key, (fixedCosts?.[key] ?? 0) / 100])),
    extras: (fixedCosts?.extras ?? []).map(extra => ({ id: extra.id, descricao: extra.name, valor: extra.valueCents / 100 })),
  };
}

function remoteFixedCosts(fixedCosts) {
  const cents = value => Math.round(Number(value || 0) * 100);
  return {
    ...Object.fromEntries(['aluguel', 'energia', 'internet', 'salarios', 'outros'].map(key => [key, cents(fixedCosts[key])])),
    extras: (fixedCosts.extras ?? [])
      .filter(extra => extra.descricao.trim() || Number(extra.valor || 0) > 0)
      .map(extra => ({ id: String(extra.id), name: extra.descricao.trim(), valueCents: cents(extra.valor) })),
  };
}

function legacySettings(settings) {
  return {
    margemLucro: settings.defaultMarginBps / 100,
    custoHora: settings.laborHourCents / 100,
    regiaoAtuacao: settings.region,
    nomeNegocio: settings.businessName,
    logoNegocio: settings.logo,
  };
}

function legacyProducts(workspace) {
  const ingredientsById = Object.fromEntries(workspace.ingredients.map(item => [item.id, item]));
  return workspace.offers.filter(offer => offer.active).map(offer => {
    let unitCostCents = 0;
    try {
      unitCostCents = calculateOfferVariableCost(offer, ingredientsById, 0).unitCostCents;
    } catch { /* uma ficha inconsistente permanece visível com custo zero */ }
    return {
      id: offer.id,
      nome: offer.name,
      categoria: offer.category,
      custo: unitCostCents / 100,
      tempoProducao: offer.batchTimeMinutes / offer.batchYield / 60,
      quantidadeMes: offer.expectedMonthlySales,
    };
  });
}

export function AppProvider({ children }) {
  const [authService] = useState(() => new SupabaseAuthService(createBrowserSupabaseClient()));
  const [workspaceService] = useState(() => new WorkspaceService(new RemoteWorkspaceRepository({
    baseUrl: import.meta.env.VITE_API_URL || 'http://localhost:3333',
    getAccessToken: () => authService.getAccessToken(),
    storage: localStorage,
  }), localStorage));
  const [workspaceState, dispatchWorkspace] = useReducer(workspaceReducer, initialWorkspaceState);
  const [usuarioLogado, setUsuarioLogado] = useState(null);
  const [authStatus, setAuthStatus] = useState('loading');
  const [produtos, setProdutos] = useState([]);
  const [custosFixos, setCustosFixos] = useState({ aluguel: 0, energia: 0, internet: 0, salarios: 0, outros: 0, extras: [] });
  const [configuracoes, setConfiguracoes] = useState({ margemLucro: 20, custoHora: 0, regiaoAtuacao: '', nomeNegocio: '', logoNegocio: '' });

  function clearLegacyView() {
    setProdutos([]);
    setCustosFixos({ aluguel: 0, energia: 0, internet: 0, salarios: 0, outros: 0, extras: [] });
    setConfiguracoes({ margemLucro: 20, custoHora: 0, regiaoAtuacao: '', nomeNegocio: '', logoNegocio: '' });
  }

  useEffect(() => {
    let active = true;
    authService.getSession()
      .then(session => { if (active) { setUsuarioLogado(sessionUser(session)); if (!session) clearLegacyView(); } })
      .catch(() => { if (active) { setUsuarioLogado(null); clearLegacyView(); } })
      .finally(() => { if (active) setAuthStatus('ready'); });
    const unsubscribe = authService.subscribe(session => {
      if (active) {
        setUsuarioLogado(sessionUser(session));
        if (!session) clearLegacyView();
        setAuthStatus('ready');
      }
    });
    return () => { active = false; unsubscribe(); };
  }, [authService]);

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
        if (active) {
          dispatchWorkspace({ type: 'loadSucceeded', workspace });
          setProdutos(legacyProducts(workspace));
          setCustosFixos(legacyFixedCosts(workspace.fixedCosts));
          setConfiguracoes(legacySettings(workspace.settings));
        }
      })
      .catch(error => {
        if (active) dispatchWorkspace({ type: 'failed', error });
      });

    return () => { active = false; };
  }, [usuarioLogado, workspaceService]);

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
    const margin = Number(configuracoes.margemLucro) / 100;
    return margin >= 1 ? 0 : calcularCustoTotal(p) / (1 - margin);
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
  async function login(email, senha) {
    const { session } = await authService.signIn(email, senha);
    setUsuarioLogado(sessionUser(session));
    return true;
  }

  async function cadastrar(nome, email, senha) {
    return authService.signUp(nome, email, senha);
  }

  async function logout() {
    await authService.signOut();
    setUsuarioLogado(null);
    clearLegacyView();
  }

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
      setProdutos(legacyProducts(workspace));
      setCustosFixos(legacyFixedCosts(workspace.fixedCosts));
      setConfiguracoes(legacySettings(workspace.settings));
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

  async function salvarCustosFixos() {
    return atualizarWorkspace(current => ({ ...current, fixedCosts: remoteFixedCosts(custosFixos) }));
  }

  async function salvarConfiguracoes() {
    const logoDraft = configuracoes.logoNegocio || '';
    let workspace = await atualizarWorkspace(current => ({
      ...current,
      settings: {
        ...current.settings,
        businessName: configuracoes.nomeNegocio.trim(),
        region: configuracoes.regiaoAtuacao.trim(),
        laborHourCents: Math.round(Number(configuracoes.custoHora || 0) * 100),
        defaultMarginBps: Math.round(Number(configuracoes.margemLucro || 0) * 100),
      },
    }));
    if (logoDraft.startsWith('data:image/')) {
      workspace = await workspaceService.saveLogo(String(usuarioLogado.id), logoDraft);
    } else if (!logoDraft && workspace.settings.logo) {
      workspace = await workspaceService.deleteLogo(String(usuarioLogado.id));
    }
    dispatchWorkspace({ type: 'saveSucceeded', workspace });
    setConfiguracoes(legacySettings(workspace.settings));
    return workspace;
  }
  return (
    <AppContext.Provider value={{
      usuarioLogado, authStatus, produtos, custosFixos, configuracoes,
      workspace: workspaceState.data, workspaceStatus: workspaceState.status, workspaceError: workspaceState.error,
      setCustosFixos, setConfiguracoes,
      totalCustosFixos, totalUnidadesMes, custoFixoPorUnidade, custoFixoPorProduto,
      calcularCustoTotal, calcularPrecoSugerido, calcularLucroMensal,
      login, cadastrar, logout,
      adicionarProduto, editarProduto, excluirProduto,
      podeCarregarDemo, carregarDemo, atualizarWorkspace, exportarWorkspace,
      salvarCustosFixos, salvarConfiguracoes,
    }}>
      {children}
    </AppContext.Provider>
  );
}
