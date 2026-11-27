import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { afterEach, expect, test, vi } from 'vitest';
import { useApp } from '../../context/AppContext.js';
import { fetchBackendProducts, updateBackendProduct } from '../../services/products.js';
import FichaTecnica from './page.jsx';

vi.mock('../../context/AppContext.js', () => ({ useApp: vi.fn() }));
vi.mock('../../services/products.js', () => ({
  fetchBackendProducts: vi.fn().mockResolvedValue([]),
  updateBackendProduct: vi.fn(),
}));
vi.mock('../../components/layout/Navbar', () => ({ default: () => <nav>Navbar</nav> }));

afterEach(cleanup);

function renderEditor(path = '/produtos/novo') {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route path="/produtos" element={<p>Lista de produtos</p>} />
        <Route path="/produtos/novo" element={<FichaTecnica />} />
        <Route path="/produtos/:id/editar" element={<FichaTecnica />} />
      </Routes>
    </MemoryRouter>,
  );
}

test('preserva os estados de carregamento e oferta inexistente', async () => {
  useApp.mockReturnValue({ workspaceStatus: 'loading' });
  const view = renderEditor('/produtos/item-a/editar');
  expect(screen.getByText('Carregando ficha técnica...')).toBeTruthy();

  view.unmount();
  fetchBackendProducts.mockResolvedValue([]);
  useApp.mockReturnValue({ workspaceStatus: 'ready', workspace: { offers: [] } });
  renderEditor('/produtos/item-a/editar');
  expect(await screen.findByText('Produto não encontrado.')).toBeTruthy();
});

test('usa o mesmo editor de página para editar um produto carregado do servidor', async () => {
  fetchBackendProducts.mockResolvedValue([{
    id_produto: 24,
    id_empresa: 8,
    nome: 'Bolo do servidor',
    tipo: 'Confeitaria',
    descricao: '',
    custo_direto: '35.00',
    tempo_producao: '2.50',
    preco_minimo: null,
    imagem: null,
  }]);
  updateBackendProduct.mockResolvedValue({ affectedRows: 1 });
  useApp.mockReturnValue({
    workspaceStatus: 'ready',
    workspaceError: null,
    workspace: { offers: [], ingredients: [], settings: { laborHourCents: 0 } },
    atualizarWorkspace: vi.fn(),
  });

  renderEditor('/produtos/24/editar');

  expect(await screen.findByRole('heading', { name: 'Editar produto' })).toBeTruthy();
  expect(screen.getByLabelText('Nome').value).toBe('Bolo do servidor');
  fireEvent.change(screen.getByLabelText('Nome'), { target: { value: 'Bolo atualizado' } });
  fireEvent.click(screen.getByRole('button', { name: 'Salvar alterações' }));

  await waitFor(() => expect(updateBackendProduct).toHaveBeenCalledWith(
    expect.objectContaining({ id_produto: 24, nome: 'Bolo atualizado', custo_direto: 35, tempo_producao: 2.5 }),
    null,
  ));
  expect(await screen.findByText('Lista de produtos')).toBeTruthy();
});

test('permite trocar foto do produto do servidor no editor padronizado', async () => {
  fetchBackendProducts.mockResolvedValue([{
    id_produto: 25,
    id_empresa: 8,
    nome: 'Bolo com foto',
    tipo: 'Confeitaria',
    custo_direto: '35.00',
    tempo_producao: '2.50',
  }]);
  updateBackendProduct.mockResolvedValue({ affectedRows: 1 });
  useApp.mockReturnValue({
    workspaceStatus: 'ready',
    workspaceError: null,
    workspace: { offers: [], ingredients: [], settings: { laborHourCents: 0 } },
    atualizarWorkspace: vi.fn(),
  });

  renderEditor('/produtos/25/editar');
  const image = new File(['image'], 'bolo-novo.png', { type: 'image/png' });
  fireEvent.change(await screen.findByLabelText('Foto do produto'), { target: { files: [image] } });
  expect(await screen.findByAltText('Prévia da nova foto')).toBeTruthy();
  fireEvent.click(screen.getByRole('button', { name: 'Salvar alterações' }));

  await waitFor(() => expect(updateBackendProduct).toHaveBeenCalledWith(
    expect.objectContaining({ id_produto: 25 }),
    image,
  ));
});

test('preserva a composição inicial da nova ficha', () => {
  useApp.mockReturnValue({
    workspaceStatus: 'ready',
    workspaceError: null,
    workspace: {
      offers: [], ingredients: [],
      settings: { laborHourCents: 0 },
    },
    atualizarWorkspace: vi.fn(),
  });

  renderEditor();

  expect(screen.getByRole('heading', { name: 'Nova ficha técnica' })).toBeTruthy();
  expect(screen.getByLabelText('Nome').value).toBe('');
  expect(screen.getByText('Nenhum insumo adicionado.')).toBeTruthy();
  expect(screen.getByRole('button', { name: 'Criar ficha técnica' })).toBeTruthy();
});

test('permite selecionar e remover a foto de uma ficha', async () => {
  useApp.mockReturnValue({
    workspaceStatus: 'ready',
    workspaceError: null,
    workspace: {
      offers: [], ingredients: [],
      settings: { laborHourCents: 0 },
    },
    atualizarWorkspace: vi.fn(),
  });

  renderEditor();
  const file = new File(['photo'], 'produto.png', { type: 'image/png' });
  fireEvent.change(screen.getByLabelText('Foto do produto'), { target: { files: [file] } });

  expect(await screen.findByAltText('Prévia da foto')).toBeTruthy();
  fireEvent.click(screen.getByRole('button', { name: 'Remover foto' }));
  await waitFor(() => expect(screen.getByText('Escolher uma foto')).toBeTruthy());
});
