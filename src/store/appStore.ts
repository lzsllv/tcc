import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Produto, CustosFixos, Configuracoes } from '@/types'
import { generateId } from '@/lib/utils'

interface AppStore {
  // Estado
  produtos:     Produto[]
  custosFixos:  CustosFixos
  configuracoes: Configuracoes

  // Produtos
  adicionarProduto: (p: Omit<Produto, 'id' | 'createdAt'>) => void
  editarProduto:    (id: string, dados: Partial<Produto>) => void
  excluirProduto:   (id: string) => void

  // Custos Fixos
  setCustosFixos: (c: Partial<CustosFixos>) => void

  // Configurações
  setConfiguracoes: (c: Partial<Configuracoes>) => void

  // Cálculos
  totalCustosFixos:    () => number
  totalUnidadesMes:    () => number
  custoFixoPorUnidade: () => number
  calcularCustoTotal:  (p: Produto) => number
  calcularPrecoSugerido: (p: Produto) => number
  calcularLucroMensal: (precoVenda: number, custoTotal: number, quantidade: number) => number
}

const defaultCustosFixos: CustosFixos = {
  aluguel: 0, energia: 0, internet: 0, salarios: 0, outros: 0, extras: [],
}

const defaultConfiguracoes: Configuracoes = {
  margemLucro: 20, custoHora: 0, regiaoAtuacao: '', nomeNegocio: '', logoNegocio: '',
}

export const useAppStore = create<AppStore>()(
  persist(
    (set, get) => ({
      produtos:      [],
      custosFixos:   defaultCustosFixos,
      configuracoes: defaultConfiguracoes,

      adicionarProduto: (p) =>
        set(s => ({ produtos: [...s.produtos, { ...p, id: generateId(), createdAt: new Date().toISOString() }] })),

      editarProduto: (id, dados) =>
        set(s => ({ produtos: s.produtos.map(p => p.id === id ? { ...p, ...dados } : p) })),

      excluirProduto: (id) =>
        set(s => ({ produtos: s.produtos.filter(p => p.id !== id) })),

      setCustosFixos: (c) =>
        set(s => ({ custosFixos: { ...s.custosFixos, ...c } })),

      setConfiguracoes: (c) =>
        set(s => ({ configuracoes: { ...s.configuracoes, ...c } })),

      // ── Cálculos (mesma lógica do AppContext original) ──
      totalCustosFixos: () => {
        const { custosFixos } = get()
        const fixos = (Object.entries(custosFixos) as [string, unknown][])
          .filter(([k]) => k !== 'extras')
          .reduce((a, [, v]) => a + Number(v), 0)
        const extras = custosFixos.extras.reduce((a, e) => a + Number(e.valor || 0), 0)
        return fixos + extras
      },

      totalUnidadesMes: () => {
        const { produtos } = get()
        if (!produtos.length) return 1
        const total = produtos.reduce((a, p) => a + (Number(p.quantidadeMes) || 0), 0)
        return total > 0 ? total : 1
      },

      custoFixoPorUnidade: () => get().totalCustosFixos() / get().totalUnidadesMes(),

      calcularCustoTotal: (p) => {
        const { configuracoes, custoFixoPorUnidade } = get()
        return (
          Number(p.custo || 0) +
          custoFixoPorUnidade() +
          Number(configuracoes.custoHora) * Number(p.tempoProducao || 0)
        )
      },

      calcularPrecoSugerido: (p) => {
        const { configuracoes, calcularCustoTotal } = get()
        return calcularCustoTotal(p) * (1 + Number(configuracoes.margemLucro) / 100)
      },

      calcularLucroMensal: (precoVenda, custoTotal, quantidade) =>
        (Number(precoVenda) - Number(custoTotal)) * Number(quantidade),
    }),
    {
      name: 'precifique-app',
      // Não persiste logoNegocio grande (>400KB)
      partialize: (s) => ({
        ...s,
        configuracoes: {
          ...s.configuracoes,
          logoNegocio: s.configuracoes.logoNegocio.length > 400000 ? '' : s.configuracoes.logoNegocio,
        },
      }),
    },
  ),
)
