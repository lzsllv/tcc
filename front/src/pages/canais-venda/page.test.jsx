import { act, cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { afterEach, expect, test, vi } from 'vitest';
import { useApp } from '../../context/AppContext.js';
import {
  createBackendSalesChannel,
  fetchBackendSalesChannels,
} from '../../features/sales-channels/services/backendSalesChannels.js';
import { createEmptyWorkspace } from '../../features/workspace/persistence/workspace.js';
import CanaisVenda from './page.jsx';

vi.mock('../../context/AppContext.js', () => ({ useApp: vi.fn() }));
vi.mock('../../features/sales-channels/services/backendSalesChannels.js', () => ({
  createBackendSalesChannel: vi.fn(),
  deleteBackendSalesChannel: vi.fn(),
  fetchBackendSalesChannels: vi.fn(),
  updateBackendSalesChannel: vi.fn(),
}));
vi.mock('../../components/layout/Navbar', () => ({ default: () => <nav>Navbar</nav> }));

let currentWorkspace;
let updateWorkspace;

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

function renderChannels() {
  currentWorkspace = createEmptyWorkspace('user-3');
  updateWorkspace = vi.fn(async updater => {
    currentWorkspace = updater(currentWorkspace);
    return currentWorkspace;
  });
  useApp.mockImplementation(() => ({
    usuarioLogado: { id: 3 },
    workspace: currentWorkspace,
    workspaceStatus: 'ready',
    workspaceError: null,
    atualizarWorkspace: updateWorkspace,
  }));
  return render(<MemoryRouter><CanaisVenda /></MemoryRouter>);
}

test('carrega e espelha os canais da empresa vinculada no workspace', async () => {
  fetchBackendSalesChannels.mockResolvedValue({
    companyId: 17,
    channels: [{
      id: 'canal-direto',
      name: 'Venda direta',
      active: true,
      isDefault: true,
      fees: [],
    }],
  });

  renderChannels();

  await waitFor(() => expect(screen.getByText('Venda direta')).toBeTruthy());
  expect(fetchBackendSalesChannels).toHaveBeenCalledWith(3, expect.objectContaining({ signal: expect.any(AbortSignal) }));
  expect(currentWorkspace.salesChannels.map(channel => channel.id)).toEqual(['canal-direto']);
});

test('cria o canal no backend e atualiza o workspace local', async () => {
  fetchBackendSalesChannels.mockResolvedValue({
    companyId: 17,
    channels: [{
      id: 'canal-direto',
      name: 'Venda direta',
      active: true,
      isDefault: true,
      fees: [],
    }],
  });
  createBackendSalesChannel.mockImplementation(async (companyId, channel) => channel);

  renderChannels();
  await waitFor(() => expect(screen.getByText('Venda direta')).toBeTruthy());

  fireEvent.change(screen.getByLabelText('Nome do canal'), { target: { value: 'Loja virtual' } });
  await act(async () => {
    fireEvent.click(screen.getByRole('button', { name: 'Criar canal' }));
  });

  await waitFor(() => expect(createBackendSalesChannel).toHaveBeenCalledTimes(1));
  const [companyId, createdChannel] = createBackendSalesChannel.mock.calls[0];
  expect(companyId).toBe(17);
  expect(createdChannel.name).toBe('Loja virtual');
  expect(currentWorkspace.salesChannels.some(channel => channel.name === 'Loja virtual')).toBe(true);
});
