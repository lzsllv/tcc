/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect, useReducer, useRef, useCallback } from 'react';
import { WorkspaceService } from '../application/WorkspaceService.js';
import { initialWorkspaceState, workspaceReducer } from '../application/workspaceState.js';
import { LocalWorkspaceRepository } from '../persistence/LocalWorkspaceRepository.js';
import { isDemoAccountEmpty, persistDemoAccount } from '../application/demoAccount.js';
import { LocalAuthService } from '../auth/LocalAuthService.js';
import { LocalAccountStore } from '../auth/localAccountStore.js';
import { sessionUser } from '../auth/session.js';
import { fixedCostsFromView, workspaceToView } from './workspaceView.js';

const AppContext = createContext();
export function useApp() { return useContext(AppContext); }

const createAuthService = () => new LocalAuthService(new LocalAccountStore(localStorage));
const createWorkspaceRepository = storage => new LocalWorkspaceRepository(storage);

export function AppProvider({
  children,
  authServiceFactory = createAuthService,
  workspaceRepositoryFactory = createWorkspaceRepository,
}) {
  const sessionScope = useRef({ ownerId: null });
  const [authService] = useState(() => authServiceFactory());
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

  const applyWorkspaceView = useCallback((workspace) => {
    const view = workspaceToView(workspace);
    setProdutos(view.produtos);
    setCustosFixos(view.custosFixos);
    setConfiguracoes(view.configuracoes);
  }, []);

  const acceptSession = useCallback((session) => {
    const user = sessionUser(session);
    const ownerId = user?.id ?? null;
    if (sessionScope.current.ownerId !== ownerId) {
      const scope = { ownerId };
      sessionScope.current = scope;
      setWorkspaceService(ownerId
        ? new WorkspaceService(workspaceRepositoryFactory(localStorage), localStorage)
        : null);
      dispatchWorkspace({ type: 'reset' });
      clearLegacyView();
    }
    setUsuarioLogado(previous => previous?.id === user?.id ? previous : user);
  }, [clearLegacyView, workspaceRepositoryFactory]);

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
          applyWorkspaceView(workspace);
        }
      })
      .catch(error => {
        if (active && scope === sessionScope.current) dispatchWorkspace({ type: 'failed', error });
      });

    return () => { active = false; };
  }, [applyWorkspaceView, usuarioLogado, workspaceService]);

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
      applyWorkspaceView(workspace);
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
    return atualizarWorkspace(current => ({ ...current, fixedCosts: fixedCostsFromView(custosFixos) }));
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
    if (logoDraft && logoDraft !== workspace.settings.logo) {
      workspace = await workspaceService.saveLogo(String(usuarioLogado.id), logoDraft);
    } else if (!logoDraft && workspace.settings.logo) {
      workspace = await workspaceService.deleteLogo(String(usuarioLogado.id));
    }
    assertCurrentSession(scope);
    dispatchWorkspace({ type: 'saveSucceeded', workspace });
    setConfiguracoes(workspaceToView(workspace).configuracoes);
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
