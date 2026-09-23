import { act, cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, expect, test, vi } from 'vitest';
import App from './App.jsx';

beforeEach(() => {
  localStorage.clear();
  window.history.pushState({}, '', '/cadastro');
});

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

test('cadastra, restaura e autentica uma conta sem rede remota', async () => {
  const requests = vi.fn(() => {
    throw new Error('fetch não deve ser chamado');
  });
  vi.stubGlobal('fetch', requests);
  render(<App />);

  expect(screen.getByText('Seus dados ficam salvos somente neste navegador.')).toBeTruthy();
  fireEvent.change(screen.getByLabelText('Nome completo'), { target: { value: 'Ana Local' } });
  fireEvent.change(screen.getByLabelText('E-mail'), { target: { value: 'ANA@EXAMPLE.COM' } });
  fireEvent.change(screen.getByLabelText('Senha'), { target: { value: 'segredo-local' } });
  fireEvent.change(screen.getByLabelText('Confirmar senha'), { target: { value: 'segredo-local' } });
  await act(async () => fireEvent.click(screen.getByRole('button', { name: 'Criar conta' })));

  expect(await screen.findByRole('heading', { name: 'Olá, Ana' })).toBeTruthy();
  await act(async () => fireEvent.click(screen.getByRole('button', { name: /Sair/ })));
  expect(await screen.findByRole('heading', { name: 'Bem-vindo de volta' })).toBeTruthy();

  fireEvent.change(screen.getByLabelText('E-mail'), { target: { value: ' ana@example.com ' } });
  fireEvent.change(screen.getByLabelText('Senha'), { target: { value: 'segredo-local' } });
  await act(async () => fireEvent.click(screen.getByRole('button', { name: 'Entrar' })));

  expect(await screen.findByRole('heading', { name: 'Olá, Ana' })).toBeTruthy();
  expect(requests).not.toHaveBeenCalled();
});
