import { afterEach, expect, test, vi } from 'vitest';
import api from './api.js';
import {
  archiveBackendProduct,
  deleteBackendProduct,
  fetchBackendProducts,
  updateBackendProduct,
} from './products.js';

vi.mock('./api.js', () => ({ default: { get: vi.fn(), patch: vi.fn(), delete: vi.fn() } }));

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

test('atualiza produto no endpoint multipart e preserva a foto se não foi substituída', async () => {
  api.patch.mockResolvedValue({ data: { sucesso: true, dados: { affectedRows: 1 } } });

  await updateBackendProduct({
    id_produto: 24,
    id_empresa: 8,
    nome: 'Bolo atualizado',
    descricao: '',
    tipo: 'Confeitaria',
    custo_direto: 35,
    tempo_producao: 2.5,
    preco_minimo: null,
  });

  const [path, formData] = api.patch.mock.calls[0];
  expect(path).toBe('/produtos');
  expect(formData).toBeInstanceOf(FormData);
  expect(formData.get('id_produto')).toBe('24');
  expect(formData.get('id_empresa')).toBe('8');
  expect(formData.get('nome')).toBe('Bolo atualizado');
  expect(formData.get('preco_minimo')).toBe('');
  expect(formData.get('imagem')).toBeNull();
});

test('expõe a mensagem quando o backend rejeita a edição', async () => {
  api.patch.mockResolvedValue({ data: { sucesso: false, mensagem: 'Produto não atualizado.' } });

  await expect(updateBackendProduct({ id_produto: 24 })).rejects.toThrow('Produto não atualizado.');
});

test('arquiva produto com chamada explícita de estado ativo', async () => {
  api.patch.mockResolvedValue({ data: { sucesso: true, dados: { affectedRows: 1 } } });

  await archiveBackendProduct(24);

  expect(api.patch).toHaveBeenCalledWith('/produtos/arquivar', { id_produto: 24, ativo: false });
});

test('exclui produto pelo endpoint legado', async () => {
  api.delete.mockResolvedValue({ data: { sucesso: true, dados: { affectedRows: 1 } } });

  await deleteBackendProduct(24);

  expect(api.delete).toHaveBeenCalledWith('/produtos', { data: { id_produto: 24 } });
});
