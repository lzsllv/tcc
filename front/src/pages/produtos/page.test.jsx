import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { afterEach, expect, test, vi } from 'vitest';
import { useApp } from '../../context/AppContext.js';
import {
  archiveBackendProduct,
  deleteBackendProduct,
  fetchBackendProducts,
  updateBackendProduct,
} from '../../services/products.js';
import Produtos from './page.jsx';

vi.mock('../../context/AppContext.js', () => ({ useApp: vi.fn() }));
vi.mock('../../services/products.js', () => ({
  fetchBackendProducts: vi.fn(),
  updateBackendProduct: vi.fn(),
  archiveBackendProduct: vi.fn(),
  deleteBackendProduct: vi.fn(),
}));
vi.mock('../../components/layout/Navbar', () => ({ default: () => <nav>Navbar</nav> }));

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

function renderProducts(workspace = { offers: [], ingredients: [], salesChannels: [], settings: {} }) {
  useApp.mockReturnValue({
    workspace,
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

test('exibe no mesmo catálogo produtos do servidor e fichas cadastradas no workspace', async () => {
  fetchBackendProducts.mockResolvedValue([{
    id_produto: 12,
    nome: 'Bolo do servidor',
    tipo: 'Confeitaria',
    custo_direto: '35.00',
  }]);

  renderProducts({
    offers: [{
      id: 'offer-1',
      name: 'Brigadeiro cadastrado',
      kind: 'product',
      category: 'Doces',
      active: true,
      components: [],
      batchYield: 10,
      batchTimeMinutes: 0,
      expectedMonthlySales: 0,
    }],
    ingredients: [],
    salesChannels: [],
    settings: { laborHourCents: 0 },
  });

  await waitFor(() => expect(screen.getByText('Bolo do servidor')).toBeTruthy());
  expect(screen.getByText('Brigadeiro cadastrado')).toBeTruthy();
  expect(screen.getByText('2 itens')).toBeTruthy();
});

test('exibe a foto cadastrada junto da ficha técnica', async () => {
  const image = 'data:image/png;base64,cG5n';
  fetchBackendProducts.mockResolvedValue([]);

  renderProducts({
    offers: [{
      id: 'offer-1',
      name: 'Bolo com foto',
      image,
      kind: 'product',
      category: 'Doces',
      active: true,
      components: [],
      batchYield: 1,
      batchTimeMinutes: 0,
      expectedMonthlySales: 0,
    }],
    ingredients: [],
    salesChannels: [],
    settings: { laborHourCents: 0 },
  });

  const photo = await screen.findByAltText('Foto de Bolo com foto');
  expect(photo.getAttribute('src')).toBe(image);
});

test('edita um produto do servidor e recarrega a lista atualizada', async () => {
  const product = {
    id_produto: 24,
    id_empresa: 8,
    nome: 'Bolo antigo',
    tipo: 'Confeitaria',
    descricao: 'Descrição antiga',
    custo_direto: '35.00',
    tempo_producao: '2.50',
    preco_minimo: null,
    imagem: 'http://localhost:3333/imagens/bolo.jpg',
  };
  fetchBackendProducts.mockResolvedValue([product]);
  updateBackendProduct.mockResolvedValue({ affectedRows: 1 });

  renderProducts();
  fireEvent.click(await screen.findByRole('button', { name: 'Editar Bolo antigo' }));
  fireEvent.change(screen.getByLabelText('Nome'), { target: { value: 'Bolo atualizado' } });
  fireEvent.change(screen.getByLabelText('Preço mínimo (R$)'), { target: { value: '42.50' } });
  fireEvent.click(screen.getByRole('button', { name: 'Salvar alterações' }));

  await waitFor(() => expect(updateBackendProduct).toHaveBeenCalledWith(
    expect.objectContaining({
      id_produto: 24,
      id_empresa: 8,
      nome: 'Bolo atualizado',
      custo_direto: 35,
      tempo_producao: 2.5,
      preco_minimo: 42.5,
    }),
    null,
  ));
  await waitFor(() => expect(fetchBackendProducts).toHaveBeenCalledTimes(2));
  expect((await screen.findByRole('status')).textContent).toContain('Produto do servidor atualizado com sucesso.');
});

test('arquiva produto do servidor e mantém visível o item arquivado', async () => {
  const product = { id_produto: 32, nome: 'Pão artesanal', tipo: 'Padaria', ativo: 1 };
  fetchBackendProducts
    .mockResolvedValueOnce([product])
    .mockResolvedValueOnce([{ ...product, ativo: 0 }]);
  archiveBackendProduct.mockResolvedValue({ affectedRows: 1 });
  vi.spyOn(window, 'confirm').mockReturnValue(true);

  renderProducts();
  fireEvent.click(await screen.findByRole('button', { name: 'Arquivar Pão artesanal' }));

  await waitFor(() => expect(archiveBackendProduct).toHaveBeenCalledWith(32));
  expect(await screen.findByText('Arquivado')).toBeTruthy();
  expect(screen.queryByRole('button', { name: 'Arquivar Pão artesanal' })).toBeNull();
  expect((await screen.findByRole('status')).textContent).toContain('O histórico foi preservado.');
});

test('exclui produto do servidor após confirmação', async () => {
  fetchBackendProducts
    .mockResolvedValueOnce([{ id_produto: 41, nome: 'Bolo removido', tipo: 'Confeitaria' }])
    .mockResolvedValueOnce([]);
  deleteBackendProduct.mockResolvedValue({ affectedRows: 1 });
  vi.spyOn(window, 'confirm').mockReturnValue(true);

  renderProducts();
  fireEvent.click(await screen.findByRole('button', { name: 'Excluir Bolo removido' }));

  await waitFor(() => expect(deleteBackendProduct).toHaveBeenCalledWith(41));
  expect(await screen.findByText('Nenhum produto ou ficha técnica cadastrado ainda.')).toBeTruthy();
  expect((await screen.findByRole('status')).textContent).toContain('Produto excluído do servidor.');
});

test('mostra erro da API e permite solicitar uma nova tentativa', async () => {
  fetchBackendProducts.mockRejectedValue(new Error('Servidor indisponível.'));

  renderProducts();

  await waitFor(() => expect(screen.getByRole('alert').textContent).toContain('Servidor indisponível.'));
  screen.getByRole('button', { name: 'Tentar novamente' }).click();
  await waitFor(() => expect(fetchBackendProducts).toHaveBeenCalledTimes(2));
});

test('aplica busca e categoria aos produtos cadastrados no backend', async () => {
  fetchBackendProducts.mockResolvedValue([
    { id_produto: 12, nome: 'Bolo de chocolate', tipo: 'Confeitaria', descricao: 'Bolo com cobertura' },
    { id_produto: 13, nome: 'Sabonete artesanal', tipo: 'Artesanato', descricao: 'Sabonete natural' },
  ]);

  renderProducts();

  await waitFor(() => expect(screen.getByText('Bolo de chocolate')).toBeTruthy());
  const search = screen.getByPlaceholderText('Buscar por nome ou categoria');
  fireEvent.change(search, { target: { value: 'natural' } });

  expect(screen.getByText('Sabonete artesanal')).toBeTruthy();
  expect(screen.queryByText('Bolo de chocolate')).toBeNull();

  fireEvent.change(search, { target: { value: '' } });
  fireEvent.change(screen.getByRole('combobox', { name: 'Filtrar por categoria' }), {
    target: { value: 'Confeitaria' },
  });

  expect(screen.getByText('Bolo de chocolate')).toBeTruthy();
  expect(screen.queryByText('Sabonete artesanal')).toBeNull();
});
