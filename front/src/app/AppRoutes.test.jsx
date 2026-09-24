import { cleanup, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { afterEach, beforeEach, expect, test } from 'vitest';
import { LocalAccountStore } from '../auth/localAccountStore.js';
import { AppProvider } from '../context/AppProvider.jsx';
import AppRoutes from './AppRoutes.jsx';

beforeEach(() => {
  localStorage.clear();
});

afterEach(() => {
  cleanup();
});

test('redireciona uma rota protegida para o login sem sessão', async () => {
  render(
    <AppProvider>
      <MemoryRouter initialEntries={['/dashboard']}>
        <AppRoutes />
      </MemoryRouter>
    </AppProvider>,
  );

  expect(await screen.findByRole('heading', { name: 'Bem-vindo de volta' })).toBeTruthy();
});

test('redireciona a raiz para o dashboard com sessão local', async () => {
  const store = new LocalAccountStore(localStorage);
  store.addAccount({
    id: 'user-1',
    name: 'Ana Local',
    email: 'ana@example.com',
    salt: 'salt',
    passwordHash: 'hash',
    iterations: 1,
    algorithm: 'test',
  });
  store.setSessionAccountId('user-1');

  render(
    <AppProvider>
      <MemoryRouter initialEntries={['/']}>
        <AppRoutes />
      </MemoryRouter>
    </AppProvider>,
  );

  expect(await screen.findByRole('heading', { name: 'Olá, Ana' })).toBeTruthy();
});
