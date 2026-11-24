import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { afterEach, expect, test, vi } from 'vitest';
import { useApp } from '../../context/AppContext.js';
import FichaTecnica from './page.jsx';

vi.mock('../../context/AppContext.js', () => ({ useApp: vi.fn() }));
vi.mock('../../components/layout/Navbar', () => ({ default: () => <nav>Navbar</nav> }));

afterEach(cleanup);

function renderEditor(path = '/produtos/novo') {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route path="/produtos/novo" element={<FichaTecnica />} />
        <Route path="/produtos/:id/editar" element={<FichaTecnica />} />
      </Routes>
    </MemoryRouter>,
  );
}

test('preserva os estados de carregamento e oferta inexistente', () => {
  useApp.mockReturnValue({ workspaceStatus: 'loading' });
  const view = renderEditor('/produtos/item-a/editar');
  expect(screen.getByText('Carregando ficha técnica...')).toBeTruthy();

  view.unmount();
  useApp.mockReturnValue({ workspaceStatus: 'ready', workspace: { offers: [] } });
  renderEditor('/produtos/item-a/editar');
  expect(screen.getByText('Ficha técnica não encontrada.')).toBeTruthy();
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
