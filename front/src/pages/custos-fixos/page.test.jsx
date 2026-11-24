import { useState } from 'react';
import { act, cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { afterEach, expect, test, vi } from 'vitest';
import { AppContext } from '../../context/AppContext.js';
import { fetchBackendFixedCosts, saveBackendFixedCosts } from '../../features/workspace/services/backendFixedCosts.js';
import CustosFixos from './page.jsx';

vi.mock('../../features/workspace/services/backendFixedCosts.js', () => ({
  fetchBackendFixedCosts: vi.fn(),
  saveBackendFixedCosts: vi.fn(),
}));
vi.mock('../../components/layout/Navbar', () => ({ default: () => <nav>Navbar</nav> }));

const initialCosts = {
  aluguel: 0,
  energia: 0,
  internet: 0,
  salarios: 0,
  outros: 0,
  extras: [],
};

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

function renderFixedCosts() {
  const saveLocalCosts = vi.fn().mockResolvedValue({});
  function Harness() {
    const [custosFixos, setCustosFixos] = useState(initialCosts);
    return (
      <AppContext.Provider value={{
        usuarioLogado: { id: 3 },
        workspaceStatus: 'ready',
        custosFixos,
        setCustosFixos,
        totalCustosFixos: () => Object.entries(custosFixos)
          .filter(([key]) => key !== 'extras')
          .reduce((sum, [, value]) => sum + Number(value || 0), 0)
          + custosFixos.extras.reduce((sum, extra) => sum + Number(extra.valor || 0), 0),
        produtos: [],
        salvarCustosFixos: saveLocalCosts,
      }}>
        <MemoryRouter><CustosFixos /></MemoryRouter>
      </AppContext.Provider>
    );
  }
  return { ...render(<Harness />), saveLocalCosts };
}

test('carrega e exibe custos fixos e extras da empresa no backend', async () => {
  fetchBackendFixedCosts.mockResolvedValue({
    companyId: 8,
    costs: {
      aluguel: 1200,
      energia: 250,
      internet: 100,
      salarios: 3000,
      outros: 0,
      extras: [{ id: 'extra-1', descricao: 'Embalagens', valor: 70 }],
    },
  });

  renderFixedCosts();

  await waitFor(() => expect(screen.getByDisplayValue('1200')).toBeTruthy());
  expect(fetchBackendFixedCosts).toHaveBeenCalledWith(3, expect.objectContaining({ signal: expect.any(AbortSignal) }));
  fireEvent.click(screen.getByRole('button', { name: /Outros gastos personalizados/ }));
  expect(screen.getByDisplayValue('Embalagens')).toBeTruthy();
  expect(screen.getByText('R$ 4.620,00')).toBeTruthy();
});

test('salva no backend e mantém o salvamento local para a precificação', async () => {
  fetchBackendFixedCosts.mockResolvedValue({
    companyId: 8,
    costs: { ...initialCosts, aluguel: 1200, extras: [] },
  });
  saveBackendFixedCosts.mockResolvedValue(undefined);

  const { saveLocalCosts } = renderFixedCosts();
  await waitFor(() => expect(screen.getByDisplayValue('1200')).toBeTruthy());
  fireEvent.change(screen.getByDisplayValue('1200'), { target: { value: '1500' } });

  await act(async () => {
    fireEvent.click(screen.getByRole('button', { name: 'Salvar custos' }));
  });

  await waitFor(() => expect(saveBackendFixedCosts).toHaveBeenCalledTimes(1));
  expect(saveBackendFixedCosts).toHaveBeenCalledWith(8, expect.objectContaining({ aluguel: '1500' }));
  expect(saveLocalCosts).toHaveBeenCalledTimes(1);
  expect(await screen.findByText('Custos fixos salvos com sucesso!')).toBeTruthy();
});
