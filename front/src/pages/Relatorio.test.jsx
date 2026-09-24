import { cleanup, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { afterEach, expect, test, vi } from 'vitest';
import { useApp } from '../context/AppContext.js';
import Relatorio from './Relatorio.jsx';

vi.mock('../context/AppContext.js', () => ({ useApp: vi.fn() }));
vi.mock('../components/Navbar', () => ({ default: () => <nav>Navbar</nav> }));

afterEach(cleanup);

test('mantém totais, avisos e linhas da projeção', () => {
  useApp.mockReturnValue({
    produtos: [{ id: 'p1', nome: 'Bolo', categoria: 'Doces', custo: 10, quantidadeMes: '2' }],
    custosFixos: { aluguel: 100, energia: 0, internet: 0, salarios: 0, outros: 0, extras: [] },
    configuracoes: {
      nomeNegocio: 'Ateliê', logoNegocio: '', regiaoAtuacao: 'SP',
      margemLucro: 20, custoHora: 15,
    },
    totalCustosFixos: () => 100,
    totalUnidadesMes: () => 2,
    custoFixoPorUnidade: () => 50,
    calcularCustoTotal: () => 60,
    calcularPrecoSugerido: () => 75,
  });

  render(<MemoryRouter><Relatorio /></MemoryRouter>);

  expect(screen.getByText('R$ 150,00')).toBeTruthy();
  expect(screen.getAllByText('R$ 30,00').length).toBeGreaterThan(0);
  expect(screen.getByText('Bolo')).toBeTruthy();
  expect(screen.getByText('Ateliê')).toBeTruthy();
});

test('mantém os estados vazios e os atalhos de correção', () => {
  useApp.mockReturnValue({
    produtos: [],
    custosFixos: { aluguel: 0, energia: 0, internet: 0, salarios: 0, outros: 0, extras: [] },
    configuracoes: { nomeNegocio: '', logoNegocio: '', regiaoAtuacao: '', margemLucro: 0, custoHora: 0 },
    totalCustosFixos: () => 0,
    totalUnidadesMes: () => 0,
    custoFixoPorUnidade: () => 0,
    calcularCustoTotal: () => 0,
    calcularPrecoSugerido: () => 0,
  });

  render(<MemoryRouter><Relatorio /></MemoryRouter>);

  expect(screen.getByText('Seus custos fixos estão zerados.')).toBeTruthy();
  expect(screen.getByText('Nenhum custo fixo registrado.')).toBeTruthy();
  expect(screen.getByText('Nenhum produto cadastrado.')).toBeTruthy();
  expect(screen.getByRole('link', { name: 'Configurações' }).getAttribute('href')).toBe('/configuracoes');
});
