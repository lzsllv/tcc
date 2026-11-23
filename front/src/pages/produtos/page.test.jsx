import { cleanup, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { afterEach, expect, test, vi } from 'vitest';
import { useApp } from '../../context/AppContext.js';
import { fetchBackendProducts } from '../../services/products.js';
import Produtos from './page.jsx';

vi.mock('../../context/AppContext.js', () => ({ useApp: vi.fn() }));
vi.mock('../../services/products.js', () => ({ fetchBackendProducts: vi.fn() }));
vi.mock('../../components/layout/Navbar', () => ({ default: () => <nav>Navbar</nav> }));

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

function renderProducts() {
  useApp.mockReturnValue({
    workspace: { offers: [], ingredients: [], salesChannels: [], settings: {} },
    workspaceStatus: 'ready',
    workspaceError: null,
    atualizarWorkspace: vi.fn(),
  });
  return render(<MemoryRouter><Produtos /></MemoryRouter>);
}

test('exibe produtos carregados do backend sem remover a tela de fichas técnicas', async () => {
  fetchBackendProducts.mockResolvedValue([{
    id_produto: 12,
    nome: 'Bolo de chocolate',
    tipo: 'Confeitaria',
    descricao: 'Bolo com cobertura',
    custo_direto: '35.00',
    tempo_producao: '2.50',
    preco_minimo: null,
    imagem: 'http://localhost:3333/imagens/bolo.jpg',
  }]);

  renderProducts();

  expect(screen.getByRole('heading', { name: 'Produtos e serviços' })).toBeTruthy();
  expect(screen.getByText('Carregando produtos do servidor...')).toBeTruthy();
  await waitFor(() => expect(screen.getByText('Bolo de chocolate')).toBeTruthy());
  expect(screen.getByText('R$ 35,00')).toBeTruthy();
  expect(screen.getByText('Não definido')).toBeTruthy();
  expect(screen.getByAltText('')).toBeTruthy();
});

test('mostra erro da API e permite solicitar uma nova tentativa', async () => {
  fetchBackendProducts.mockRejectedValue(new Error('Servidor indisponível.'));

  renderProducts();

  await waitFor(() => expect(screen.getByRole('alert').textContent).toContain('Servidor indisponível.'));
  screen.getByRole('button', { name: 'Tentar novamente' }).click();
  await waitFor(() => expect(fetchBackendProducts).toHaveBeenCalledTimes(2));
});
