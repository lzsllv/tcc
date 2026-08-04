import type { Produto } from '@/types'

export const mockProdutos: Produto[] = [
  { id: '1', nome: 'Bolo de Chocolate',    custo: 25.00, tempoProducao: 2,   quantidadeMes: 20, createdAt: '2024-01-01T00:00:00Z' },
  { id: '2', nome: 'Brigadeiro (caixa 20)',custo: 8.50,  tempoProducao: 0.5, quantidadeMes: 50, createdAt: '2024-01-02T00:00:00Z' },
  { id: '3', nome: 'Torta de Limão',       custo: 18.00, tempoProducao: 1.5, quantidadeMes: 15, createdAt: '2024-01-03T00:00:00Z' },
  { id: '4', nome: 'Cupcake (unidade)',    custo: 3.20,  tempoProducao: 0.25,quantidadeMes: 100,createdAt: '2024-01-04T00:00:00Z' },
]
