import { useState } from 'react';
import { act, cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { afterEach, expect, test, vi } from 'vitest';
import { AppContext } from '../../context/AppContext.js';
import { fetchBackendSettings, saveBackendSettings } from '../../features/workspace/services/backendSettings.js';
import Configuracoes from './page.jsx';

vi.mock('../../features/workspace/services/backendSettings.js', () => ({
  fetchBackendSettings: vi.fn(),
  saveBackendSettings: vi.fn(),
}));
vi.mock('../../components/layout/Navbar', () => ({ default: () => <nav>Navbar</nav> }));

const initialSettings = {
  nomeNegocio: '',
  logoNegocio: '',
  regiaoAtuacao: '',
  custoHora: 0,
  margemLucro: 20,
};

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

function renderSettings() {
  const saveLocalSettings = vi.fn().mockResolvedValue({});
  function Harness() {
    const [configuracoes, setConfiguracoes] = useState(initialSettings);
    return (
      <AppContext.Provider value={{
        usuarioLogado: { id: 3 },
        workspaceStatus: 'ready',
        configuracoes,
        setConfiguracoes,
        salvarConfiguracoes: saveLocalSettings,
      }}>
        <MemoryRouter><Configuracoes /></MemoryRouter>
      </AppContext.Provider>
    );
  }
  return { ...render(<Harness />), saveLocalSettings };
}

test('carrega e exibe as configurações da empresa no backend', async () => {
  fetchBackendSettings.mockResolvedValue({
    companyId: 8,
    settings: {
      nomeNegocio: 'Doce Sabor',
      logoNegocio: '',
      regiaoAtuacao: 'São Paulo',
      custoHora: 35,
      margemLucro: 25,
    },
  });

  renderSettings();

  await waitFor(() => expect(screen.getByDisplayValue('Doce Sabor')).toBeTruthy());
  expect(fetchBackendSettings).toHaveBeenCalledWith(3, expect.objectContaining({ signal: expect.any(AbortSignal) }));
  expect(screen.getByDisplayValue('25')).toBeTruthy();
  expect(screen.getByDisplayValue('35')).toBeTruthy();
});

test('salva no backend e preserva a gravação local do workspace', async () => {
  fetchBackendSettings.mockResolvedValue({
    companyId: 8,
    settings: {
      nomeNegocio: 'Doce Sabor',
      logoNegocio: '',
      regiaoAtuacao: 'São Paulo',
      custoHora: 35,
      margemLucro: 25,
    },
  });
  saveBackendSettings.mockResolvedValue(undefined);

  const { saveLocalSettings } = renderSettings();
  await waitFor(() => expect(screen.getByDisplayValue('Doce Sabor')).toBeTruthy());
  fireEvent.change(screen.getByDisplayValue('Doce Sabor'), { target: { value: 'Doce Sabor Novo' } });

  await act(async () => {
    fireEvent.click(screen.getByRole('button', { name: 'Salvar configurações' }));
  });

  await waitFor(() => expect(saveBackendSettings).toHaveBeenCalledTimes(1));
  expect(saveBackendSettings).toHaveBeenCalledWith(8, expect.objectContaining({
    nomeNegocio: 'Doce Sabor Novo',
    custoHora: 35,
    margemLucro: 25,
  }));
  expect(saveLocalSettings).toHaveBeenCalledTimes(1);
  expect(await screen.findByText('Configurações salvas com sucesso!')).toBeTruthy();
});
