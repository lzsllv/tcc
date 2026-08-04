// ── Rotas da aplicação ──
export const ROUTES = {
  HOME:          '/',
  LOGIN:         '/login',
  CADASTRO:      '/cadastro',
  DASHBOARD:     '/dashboard',
  PRODUTOS:      '/produtos',
  CUSTOS_FIXOS:  '/custos-fixos',
  CONFIGURACOES: '/configuracoes',
  SIMULACAO:     '/simulacao',
  RELATORIO:     '/relatorio',
  NOT_FOUND:     '/404',
} as const

// ── Itens de navegação (sidebar/menu) ──
export const NAV_ITEMS = [
  { label: 'Dashboard',    href: ROUTES.DASHBOARD,     icon: 'LayoutDashboard' },
  { label: 'Produtos',     href: ROUTES.PRODUTOS,      icon: 'Package' },
  { label: 'Custos Fixos', href: ROUTES.CUSTOS_FIXOS,  icon: 'Wallet' },
  { label: 'Simulação',    href: ROUTES.SIMULACAO,     icon: 'TrendingUp' },
  { label: 'Relatório',    href: ROUTES.RELATORIO,     icon: 'FileBarChart' },
  { label: 'Configurações',href: ROUTES.CONFIGURACOES, icon: 'Settings' },
] as const

// ── Breakpoints (espelham Tailwind) ──
export const BREAKPOINTS = {
  sm:  640,
  md:  768,
  lg:  1024,
  xl:  1280,
  '2xl': 1536,
} as const

// ── Mensagens de erro padrão ──
export const ERROR_MESSAGES = {
  REQUIRED:      'Este campo é obrigatório',
  INVALID_EMAIL: 'Email inválido',
  MIN_LENGTH:    (n: number) => `Mínimo ${n} caracteres`,
  MAX_LENGTH:    (n: number) => `Máximo ${n} caracteres`,
  MIN_VALUE:     (n: number) => `Valor mínimo: ${n}`,
  POSITIVE:      'Digite um valor positivo',
} as const
