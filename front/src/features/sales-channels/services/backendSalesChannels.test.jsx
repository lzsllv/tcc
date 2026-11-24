import { afterEach, expect, test, vi } from 'vitest';
import api from '../../../services/api.js';
import {
  createBackendSalesChannel,
  deleteBackendSalesChannel,
  fetchBackendSalesChannels,
  updateBackendSalesChannel,
} from './backendSalesChannels.js';

vi.mock('../../../services/api.js', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    patch: vi.fn(),
    delete: vi.fn(),
  },
}));

afterEach(() => vi.clearAllMocks());

test('localiza a empresa do usuário e carrega seus canais do backend', async () => {
  const channels = [{ id: 'canal-1', name: 'Venda direta', active: true, isDefault: true, fees: [] }];
  const signal = new AbortController().signal;
  api.get
    .mockResolvedValueOnce({ data: { sucesso: true, dados: [
      { id_empresa: 8, id_usuario: 3 },
      { id_empresa: 9, id_usuario: 4 },
    ] } })
    .mockResolvedValueOnce({ data: { sucesso: true, dados: channels } });

  await expect(fetchBackendSalesChannels(3, { signal })).resolves.toEqual({ companyId: 8, channels });
  expect(api.get).toHaveBeenNthCalledWith(1, '/empresas', { signal });
  expect(api.get).toHaveBeenNthCalledWith(2, '/canais-venda', { params: { id_empresa: 8 }, signal });
});

test('explica quando a conta não possui empresa vinculada', async () => {
  api.get.mockResolvedValue({ data: { sucesso: true, dados: [] } });

  await expect(fetchBackendSalesChannels(3)).rejects.toThrow('Não há uma empresa vinculada');
  expect(api.get).toHaveBeenCalledTimes(1);
});

test('cria canal padrão usando a rota de criação e em seguida a rota de edição', async () => {
  const channel = {
    id: 'canal-1',
    name: 'Venda direta',
    active: true,
    isDefault: true,
    fees: [],
  };
  api.post.mockResolvedValue({ data: { sucesso: true, dados: { id: channel.id } } });
  api.patch.mockResolvedValue({ data: { sucesso: true } });

  await expect(createBackendSalesChannel(8, channel)).resolves.toEqual(channel);
  expect(api.post).toHaveBeenCalledWith('/canais-venda', {
    id_empresa: 8, id: channel.id, name: channel.name, fees: [], active: true, isDefault: true,
  });
  expect(api.patch).toHaveBeenCalledWith('/canais-venda', {
    id_empresa: 8, id: channel.id, name: channel.name, fees: [], active: true, isDefault: true,
  });
});

test('atualiza e exclui canais enviando a empresa e o identificador', async () => {
  const channel = {
    id: 'canal-1',
    name: 'Cartão',
    active: false,
    isDefault: false,
    fees: [{ id: 'taxa-1', name: 'Crédito', kind: 'percentage', category: 'payment', value: 350 }],
  };
  api.patch.mockResolvedValue({ data: { sucesso: true } });
  api.delete.mockResolvedValue({ data: { sucesso: true } });

  await expect(updateBackendSalesChannel(8, channel)).resolves.toEqual(channel);
  await expect(deleteBackendSalesChannel(8, channel.id)).resolves.toBeUndefined();
  expect(api.patch).toHaveBeenCalledWith('/canais-venda', {
    id_empresa: 8, id: channel.id, name: channel.name, fees: channel.fees, active: false, isDefault: false,
  });
  expect(api.delete).toHaveBeenCalledWith('/canais-venda', { data: { id_empresa: 8, id: channel.id } });
});

test('apresenta a mensagem retornada pelo backend quando uma requisição falha', async () => {
  api.get.mockRejectedValue({
    message: 'Request failed',
    response: { data: { sucesso: false, mensagem: 'Erro ao listar canais.' } },
  });

  await expect(fetchBackendSalesChannels(3)).rejects.toThrow('Erro ao listar canais.');
});
