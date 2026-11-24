import { afterEach, expect, test, vi } from 'vitest';
import api from './api.js';
import { fetchBackendProducts } from './products.js';

vi.mock('./api.js', () => ({ default: { get: vi.fn() } }));

afterEach(() => vi.clearAllMocks());

test('carrega e retorna os produtos do envelope da API', async () => {
  const products = [{ id_produto: 7, nome: 'Bolo de chocolate' }];
  api.get.mockResolvedValue({ data: { sucesso: true, dados: products } });
  const signal = new AbortController().signal;

  await expect(fetchBackendProducts({ signal })).resolves.toEqual(products);
  expect(api.get).toHaveBeenCalledWith('/produtos', { signal });
});

test('expõe mensagens de erro devolvidas pelo backend', async () => {
  api.get.mockResolvedValue({ data: { sucesso: false, mensagem: 'Falha ao consultar produtos.' } });

  await expect(fetchBackendProducts()).rejects.toThrow('Falha ao consultar produtos.');
});

test('expõe a mensagem do backend em respostas HTTP com erro', async () => {
  api.get.mockRejectedValue({
    message: 'Request failed with status code 500',
    response: { data: { sucesso: false, mensagem: 'Erro na requisição.' } },
  });

  await expect(fetchBackendProducts()).rejects.toThrow('Erro na requisição.');
});
