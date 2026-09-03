/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect, useReducer, useRef, useCallback } from 'react';
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
  const sessionScope = useRef({ ownerId: null });
  const [authService] = useState(() => new SupabaseAuthService(createBrowserSupabaseClient()));
  const [workspaceService, setWorkspaceService] = useState(null);
  const [workspaceState, dispatchWorkspace] = useReducer(workspaceReducer, initialWorkspaceState);
  const [usuarioLogado, setUsuarioLogado] = useState(null);
  const [authStatus, setAuthStatus] = useState('loading');
  const [produtos, setProdutos] = useState([]);
  const [custosFixos, setCustosFixos] = useState({ aluguel: 0, energia: 0, internet: 0, salarios: 0, outros: 0, extras: [] });
  const [configuracoes, setConfiguracoes] = useState({ margemLucro: 20, custoHora: 0, regiaoAtuacao: '', nomeNegocio: '', logoNegocio: '' });

  const clearLegacyView = useCallback(() => {
    setProdutos([]);
    setCustosFixos({ aluguel: 0, energia: 0, internet: 0, salarios: 0, outros: 0, extras: [] });
    setConfiguracoes({ margemLucro: 20, custoHora: 0, regiaoAtuacao: '', nomeNegocio: '', logoNegocio: '' });
  }, []);

  const acceptSession = useCallback((session) => {
    const user = sessionUser(session);
    const ownerId = user?.id ?? null;
    if (sessionScope.current.ownerId !== ownerId) {
      // A identidade do objeto também invalida operações em logout + login da mesma conta.
      const scope = { ownerId };
      sessionScope.current = scope;
      // Cache, revisões e credenciais pertencem a esta sessão, não apenas ao usuário.
      setWorkspaceService(ownerId ? new WorkspaceService(new RemoteWorkspaceRepository({
        baseUrl: import.meta.env.VITE_API_URL || 'http://localhost:3333',
        getAccessToken: async requestedOwner => {
          const session = await authService.getSession();
          if (scope !== sessionScope.current || session?.user?.id !== requestedOwner) {
            throw new Error('A sessão mudou. Reabra os dados da conta atual.');
          }
          return session.access_token;
        },
        storage: localStorage,
      }), localStorage) : null);
      dispatchWorkspace({ type: 'reset' });
      clearLegacyView();
    }
    setUsuarioLogado(previous => previous?.id === user?.id ? previous : user);
  }, [authService, clearLegacyView]);

  function assertCurrentSession(scope) {
    if (scope !== sessionScope.current || !scope.ownerId) {
      const error = new Error('A sessão mudou. Reabra os dados da conta atual.');
      error.code = 'SESSION_CHANGED';
      throw error;
    }
  }

  useEffect(() => {
    let active = true;
    let receivedAuthEvent = false;
    authService.getSession()
      .then(session => { if (active && !receivedAuthEvent) acceptSession(session); })
      .catch(() => { if (active && !receivedAuthEvent) acceptSession(null); })
      .finally(() => { if (active) setAuthStatus('ready'); });
    const unsubscribe = authService.subscribe(session => {
      if (active) {
        receivedAuthEvent = true;
        acceptSession(session);
        setAuthStatus('ready');
      }
    });
    return () => { active = false; sessionScope.current = { ownerId: null }; unsubscribe(); };
  }, [authService, acceptSession]);

  useEffect(() => {
    let active = true;
    if (!usuarioLogado || !workspaceService) {
      dispatchWorkspace({ type: 'reset' });
      return undefined;
    }

    const service = workspaceService;
    const scope = sessionScope.current;
    dispatchWorkspace({ type: 'loadStarted' });
    service.initialize(String(usuarioLogado.id))
      .then(workspace => {
        if (active && scope === sessionScope.current) {
          dispatchWorkspace({ type: 'loadSucceeded', workspace });
          setProdutos(legacyProducts(workspace));
          setCustosFixos(legacyFixedCosts(workspace.fixedCosts));
          setConfiguracoes(legacySettings(workspace.settings));
        }
      })
      .catch(error => {
        if (active && scope === sessionScope.current) dispatchWorkspace({ type: 'failed', error });
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
    const scope = sessionScope.current;
    const demo = await persistDemoAccount({
      workspaceStatus: workspaceState.status,
      workspace: workspaceState.data,
      produtos,
      custosFixos,
      configuracoes,
    }, workspace => atualizarWorkspace(() => workspace));
    assertCurrentSession(scope);
    setProdutos(demo.produtos);
    setCustosFixos(demo.custosFixos);
    setConfiguracoes(demo.configuracoes);
  }
  // ── AUTH ──
  async function login(email, senha) {
    await authService.signIn(email, senha);
    return true;
  }

  async function cadastrar(nome, email, senha) {
    return authService.signUp(nome, email, senha);
  }

  async function logout() {
    await authService.signOut();
  }

  // ── PRODUTOS ──
  function adicionarProduto(p)      { setProdutos(prev => [...prev, { ...p, id: crypto.randomUUID() }]); }
  function editarProduto(id, dados) { setProdutos(prev => prev.map(p => p.id === id ? { ...p, ...dados } : p)); }
  function excluirProduto(id)       { setProdutos(prev => prev.filter(p => p.id !== id)); }

  async function atualizarWorkspace(updater) {
    const scope = sessionScope.current;
    assertCurrentSession(scope);
    if (!usuarioLogado || !workspaceState.data || !workspaceService || workspaceState.data.ownerId !== scope.ownerId) {
      throw new Error('Workspace ainda não está pronto para atualização.');
    }
    dispatchWorkspace({ type: 'saveStarted' });
    try {
      const workspace = await workspaceService.update(
        String(usuarioLogado.id),
        workspaceState.data,
        updater,
      );
      assertCurrentSession(scope);
      dispatchWorkspace({ type: 'saveSucceeded', workspace });
      setProdutos(legacyProducts(workspace));
      setCustosFixos(legacyFixedCosts(workspace.fixedCosts));
      setConfiguracoes(legacySettings(workspace.settings));
      return workspace;
    } catch (error) {
      if (scope === sessionScope.current) dispatchWorkspace({ type: 'failed', error });
      throw error;
    }
  }

  async function exportarWorkspace() {
    const scope = sessionScope.current;
    if (!usuarioLogado || !workspaceService) {
      throw new Error('Entre na sua conta para exportar os dados.');
    }
    const exported = await workspaceService.export(String(usuarioLogado.id));
    assertCurrentSession(scope);
    return exported;
  }

  async function salvarCustosFixos() {
    return atualizarWorkspace(current => ({ ...current, fixedCosts: remoteFixedCosts(custosFixos) }));
  }

  async function salvarConfiguracoes() {
    const scope = sessionScope.current;
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
    assertCurrentSession(scope);
    if (logoDraft.startsWith('data:image/')) {
      workspace = await workspaceService.saveLogo(String(usuarioLogado.id), logoDraft);
    } else if (!logoDraft && workspace.settings.logo) {
      workspace = await workspaceService.deleteLogo(String(usuarioLogado.id));
    }
    assertCurrentSession(scope);
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
