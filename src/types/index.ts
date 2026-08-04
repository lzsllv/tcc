/* ============================================================
   TIPOS GLOBAIS — alinhados com contrato futuro da API backend
   ============================================================ */

// ── Resposta genérica da API ──
export interface ApiResponse<T> {
  data: T
  meta?: {
    total: number
    page: number
    perPage: number
  }
  error?: string
}

// ── Entidades de domínio ──
export interface Usuario {
  id: string
  nome: string
  email: string
  role: 'admin' | 'user' | 'viewer'
  createdAt: string
  avatarUrl?: string
}

export interface Produto {
  id: string
  nome: string
  custo: number
  tempoProducao: number  // horas
  quantidadeMes: number
  preco?: number         // preço definido pelo usuário (pode ser diferente do sugerido)
  createdAt?: string
}

export interface CustoExtra {
  id: string
  nome: string
  valor: number
}

export interface CustosFixos {
  aluguel:  number
  energia:  number
  internet: number
  salarios: number
  outros:   number
  extras:   CustoExtra[]
}

export interface Configuracoes {
  margemLucro:    number   // % markup desejado
  custoHora:      number   // R$/hora de trabalho
  regiaoAtuacao:  string
  nomeNegocio:    string
  logoNegocio:    string   // base64 ou URL
}

// ── Resultado de cálculo de produto ──
export interface ResultadoProduto {
  produto:          Produto
  custoFixoUnit:    number
  custoMaoObra:     number
  custoTotal:       number
  precoSugerido:    number
  lucroUnit:        number
  lucroMensal:      number
  margemReal:       number  // %
}

// ── Resultado de simulação ──
export interface SimulacaoInput {
  produtoId: string
  precoVenda: number
}

export interface SimulacaoResult extends ResultadoProduto {
  precoVenda:   number
  lucroSimulado: number
  prejuizo:      boolean
}

// ── Estado de auth ──
export interface AuthState {
  usuarioLogado: Omit<Usuario, 'role'> & { role?: string } | null
  isLoading: boolean
}

// ── Props utilitárias ── 
export type WithChildren = { children: React.ReactNode }
export type ClassName    = { className?: string }
