import { afterEach, expect, test, vi } from 'vitest';
import api from '../../../services/api.js';
import { BackendAuthService } from './BackendAuthService.js';

vi.mock('../../../services/api.js', () => ({ default: { post: vi.fn() } }));

class MemoryStorage {
  constructor() { this.values = new Map(); }
  getItem(key) { return this.values.get(key) ?? null; }
  setItem(key, value) { this.values.set(key, String(value)); }
  removeItem(key) { this.values.delete(key); }
}

afterEach(() => vi.clearAllMocks());

test('autentica no backend e restaura a sessão persistida', async () => {
  const storage = new MemoryStorage();
  const service = new BackendAuthService(storage);
  const events = [];
  service.subscribe(session => events.push(session));
  api.post.mockResolvedValue({
    data: {
      sucesso: true,
      dados: { id_usuario: 15, nome_usuario: 'Ana', email_usuario: 'ana@example.com' },
    },
  });

  const result = await service.signIn(' ANA@EXAMPLE.COM ', 'senha');

  expect(api.post).toHaveBeenCalledWith('/login', {
    email_usuario: 'ana@example.com',
    senha_usuario: 'senha',
  });
  expect(result.user).toEqual({ id: 15, name: 'Ana', email: 'ana@example.com' });
  expect((await service.getSession()).user).toEqual(result.user);
  expect(events).toHaveLength(1);
});

test('cadastra no backend e inicia a sessão', async () => {
  const service = new BackendAuthService(new MemoryStorage());
  api.post
    .mockResolvedValueOnce({ data: { sucesso: true, dados: { insertId: 15 } } })
    .mockResolvedValueOnce({
      data: {
        sucesso: true,
        dados: { id_usuario: 15, nome_usuario: 'Ana', email_usuario: 'ana@example.com' },
      },
    });

  await service.signUp('Ana', 'ana@example.com', 'senha');

  expect(api.post).toHaveBeenNthCalledWith(1, '/usuarios', {
    nome_usuario: 'Ana',
    email_usuario: 'ana@example.com',
    senha_usuario: 'senha',
  });
  expect(api.post).toHaveBeenNthCalledWith(2, '/login', {
    email_usuario: 'ana@example.com',
    senha_usuario: 'senha',
  });
});

test('retorna a mensagem de erro do backend e remove sessão no logout', async () => {
  const storage = new MemoryStorage();
  const service = new BackendAuthService(storage);
  api.post.mockRejectedValue({ response: { data: { mensagem: 'Credenciais inválidas.' } } });

  await expect(service.signIn('ana@example.com', 'errada')).rejects.toThrow('Credenciais inválidas.');
  api.post.mockResolvedValueOnce({
    data: { sucesso: true, dados: { id_usuario: 15, nome_usuario: 'Ana', email_usuario: 'ana@example.com' } },
  });
  await service.signIn('ana@example.com', 'senha');
  await service.signOut();
  expect(await service.getSession()).toBeNull();
});
