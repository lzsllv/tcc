import { createContext, useContext, useState, useEffect } from 'react';

// Cria o "armazém" de dados
const AppContext = createContext();

// Hook personalizado para acessar o contexto facilmente
export function useApp() {
  return useContext(AppContext);
}

export function AppProvider({ children }) {
  // --- USUÁRIO ---
  // Tenta carregar usuário salvo no localStorage (para persistir o login)
  const [usuarioLogado, setUsuarioLogado] = useState(() => {
    const salvo = localStorage.getItem('usuarioLogado');
    return salvo ? JSON.parse(salvo) : null;
  });

  // Lista de usuários cadastrados
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
      margemLucro: 20,       // porcentagem padrão
      custoHora: 0,          // custo por hora de trabalho
      regiaoAtuacao: '',     // cidade/estado
    };
  });

  // Salva automaticamente no localStorage sempre que os dados mudarem
  useEffect(() => {
    localStorage.setItem('usuarioLogado', JSON.stringify(usuarioLogado));
  }, [usuarioLogado]);

  useEffect(() => {
    localStorage.setItem('usuarios', JSON.stringify(usuarios));
  }, [usuarios]);

  useEffect(() => {
    localStorage.setItem('produtos', JSON.stringify(produtos));
  }, [produtos]);

  useEffect(() => {
    localStorage.setItem('custosFixos', JSON.stringify(custosFixos));
  }, [custosFixos]);

  useEffect(() => {
    localStorage.setItem('configuracoes', JSON.stringify(configuracoes));
  }, [configuracoes]);

  // --- FUNÇÕES ÚTEIS ---

  // Calcula o total dos custos fixos
  function totalCustosFixos() {
    return Object.values(custosFixos).reduce((acc, val) => acc + Number(val), 0);
  }

  // Calcula o custo fixo por produto (RN06)
  function custoFixoPorProduto() {
    if (produtos.length === 0) return 0;
    return totalCustosFixos() / produtos.length;
  }

  // Calcula o custo total de um produto (RN01)
  function calcularCustoTotal(produto) {
    const fixo = custoFixoPorProduto();
    const maoDeObra = configuracoes.custoHora * (produto.tempoProducao || 0);
    return Number(produto.custo || 0) + fixo + maoDeObra;
  }

  // Calcula o preço sugerido (RN02)
  function calcularPrecoSugerido(produto) {
    const custo = calcularCustoTotal(produto);
    const margem = configuracoes.margemLucro / 100;
    return custo + custo * margem;
  }

  // Calcula o lucro mensal (RN05)
  function calcularLucroMensal(precoVenda, custoTotal, quantidade) {
    return (Number(precoVenda) - Number(custoTotal)) * Number(quantidade);
  }

  // Login
  function login(email, senha) {
    const usuario = usuarios.find(u => u.email === email && u.senha === senha);
    if (usuario) {
      setUsuarioLogado(usuario);
      return true;
    }
    return false;
  }

  // Cadastro
  function cadastrar(nome, email, senha) {
    const jaExiste = usuarios.find(u => u.email === email);
    if (jaExiste) return false;
    const novoUsuario = { id: Date.now(), nome, email, senha };
    setUsuarios(prev => [...prev, novoUsuario]);
    return true;
  }

  // Logout
  function logout() {
    setUsuarioLogado(null);
  }

  // Adicionar produto
  function adicionarProduto(produto) {
    setProdutos(prev => [...prev, { ...produto, id: Date.now() }]);
  }

  // Editar produto
  function editarProduto(id, dadosNovos) {
    setProdutos(prev => prev.map(p => p.id === id ? { ...p, ...dadosNovos } : p));
  }

  // Excluir produto
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
