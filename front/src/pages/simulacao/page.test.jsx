import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { afterEach, expect, test, vi } from 'vitest';
import { useApp } from '../../context/AppContext.js';
import { fetchBackendProducts } from '../../services/products.js';
import Simulacao from './page.jsx';

vi.mock('../../context/AppContext.js', () => ({ useApp: vi.fn() }));
vi.mock('../../services/products.js', () => ({ fetchBackendProducts: vi.fn() }));
vi.mock('../../components/layout/Navbar', () => ({ default: () => <nav>Navbar</nav> }));

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

function renderSimulation(overrides = {}) {
  useApp.mockReturnValue({
    produtos: [{ id: 'offer-1', nome: 'Ficha técnica' }],
    custosFixos: { aluguel: 100, extras: [] },
    configuracoes: { custoHora: 10, margemLucro: 20 },
    workspace: {
      settings: { selectedSalesChannelId: 'direct' },
      salesChannels: [{ id: 'direct', active: true, isDefault: true, fees: [] }],
    },
    workspaceStatus: 'ready',
    workspaceError: null,
    calcularCustoTotal: () => 10,
    calcularLucroMensal: (price, cost, quantity) => (Number(price) - cost) * Number(quantity),
    calcularPrecoSugerido: () => 15,
    ...overrides,
  });
  return render(<MemoryRouter><Simulacao /></MemoryRouter>);
}

test('exibe produtos do workspace e produtos ativos cadastrados no servidor', async () => {
  fetchBackendProducts.mockResolvedValue([
    { id_produto: 24, nome: 'Bolo do servidor', ativo: 1 },
    { id_produto: 25, nome: 'Produto arquivado', ativo: 0 },
  ]);

  renderSimulation();

  expect(await screen.findByRole('option', { name: 'Bolo do servidor' })).toBeTruthy();
  expect(screen.getByRole('option', { name: 'Ficha técnica' })).toBeTruthy();
  expect(screen.queryByRole('option', { name: 'Produto arquivado' })).toBeNull();
});

test('permite simular o lucro de um produto carregado do servidor', async () => {
  fetchBackendProducts.mockResolvedValue([{
    id_produto: 24,
    nome: 'Bolo do servidor',
    custo_direto: '20.00',
    tempo_producao: '1.00',
    ativo: 1,
  }]);

  renderSimulation();

  fireEvent.change(await screen.findByLabelText('Selecione o produto'), { target: { value: 'server:24' } });
  fireEvent.change(screen.getByLabelText('Quantidade vendida por mês'), { target: { value: '10' } });
  fireEvent.change(screen.getByLabelText('Preço de venda (R$)'), { target: { value: '60' } });
  fireEvent.click(screen.getByRole('button', { name: 'Simular' }));

  await waitFor(() => expect(screen.getAllByText('Bolo do servidor')).toHaveLength(2));
  expect(screen.getByText('R$ 40,00')).toBeTruthy();
  expect(screen.getByText('R$ 200,00')).toBeTruthy();
});
