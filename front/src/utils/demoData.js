// Dados de demonstração para avaliadores e banca
// Carregue via botão em Configurações → Demonstração

export const DEMO_CONFIGURACOES = {
  margemLucro: 35,
  custoHora: 20,
  regiaoAtuacao: 'Tupã - SP',
  nomeNegocio: 'Doces da Maria — DEMO',
  logoNegocio: '',
};

export const DEMO_PRODUTOS = [
  {
    id: 'demo-1',
    nome: 'Bolo no pote (250ml)',
    categoria: 'Alimento',
    custo: 6.5,
    tempoProducao: 0.4,
    quantidadeMes: 120,
  },
  {
    id: 'demo-2',
    nome: 'Brownie recheado',
    categoria: 'Alimento',
    custo: 4.2,
    tempoProducao: 0.25,
    quantidadeMes: 180,
  },
  {
    id: 'demo-3',
    nome: 'Caixa de trufas (12 un.)',
    categoria: 'Presente',
    custo: 18.0,
    tempoProducao: 0.75,
    quantidadeMes: 60,
  },
  {
    id: 'demo-4',
    nome: 'Torta gelada (forma P)',
    categoria: 'Alimento',
    custo: 22.0,
    tempoProducao: 1.0,
    quantidadeMes: 30,
  },
  {
    id: 'demo-5',
    nome: 'Brigadeiro gourmet (caixa 20 un.)',
    categoria: 'Alimento',
    custo: 14.5,
    tempoProducao: 0.5,
    quantidadeMes: 90,
  },
];

export const DEMO_CUSTOS_FIXOS = {
  aluguel: 650,
  energia: 180,
  internet: 90,
  salarios: 0,
  outros: 75,
  extras: [
    { id: 'demo-extra-1', descricao: 'Embalagens e descartáveis', valor: 120 },
    { id: 'demo-extra-2', descricao: 'Gás de cozinha', valor: 85 },
    { id: 'demo-extra-3', descricao: 'Taxa plataforma delivery', valor: 60 },
  ],
};
