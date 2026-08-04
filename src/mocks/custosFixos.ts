import type { CustosFixos } from '@/types'

export const mockCustosFixos: CustosFixos = {
  aluguel:  800,
  energia:  150,
  internet: 100,
  salarios: 0,
  outros:   50,
  extras: [
    { id: '1', nome: 'Gás', valor: 80 },
    { id: '2', nome: 'Embalagens', valor: 120 },
  ],
}
