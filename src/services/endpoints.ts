// ── Endpoints da API REST (alinhados com contrato backend) ──
export const endpoints = {
  // Auth
  auth: {
    login:   '/api/auth/login',
    logout:  '/api/auth/logout',
    me:      '/api/auth/me',
    refresh: '/api/auth/refresh',
    register:'/api/auth/register',
  },
  // Produtos
  produtos: {
    list:   '/api/produtos',
    create: '/api/produtos',
    get:    (id: string) => `/api/produtos/${id}`,
    update: (id: string) => `/api/produtos/${id}`,
    delete: (id: string) => `/api/produtos/${id}`,
  },
  // Custos Fixos
  custosFixos: {
    get:    '/api/custos-fixos',
    update: '/api/custos-fixos',
  },
  // Configurações
  configuracoes: {
    get:    '/api/configuracoes',
    update: '/api/configuracoes',
  },
  // Relatório
  relatorio: {
    get: '/api/relatorio',
  },
} as const
