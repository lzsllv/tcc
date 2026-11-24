import { afterEach, expect, test, vi } from 'vitest';
import api from '../../../services/api.js';
import { fetchBackendFixedCosts, saveBackendFixedCosts } from './backendFixedCosts.js';

vi.mock('../../../services/api.js', () => ({
  default: {
    get: vi.fn(),
    put: vi.fn(),
  },
}));

afterEach(() => vi.clearAllMocks());

test('localiza a empresa do usuário e carrega custos fixos e extras', async () => {
  const costs = {
    aluguel: 1200,
    energia: 250,
    internet: 100,
    salarios: 3000,
    outros: 0,
    extras: [{ id: 'extra-1', descricao: 'Embalagens', valor: 70 }],
  };
  const signal = new AbortController().signal;
  api.get
    .mockResolvedValueOnce({ data: { sucesso: true, dados: [
      { id_empresa: 8, id_usuario: 3 },
      { id_empresa: 9, id_usuario: 4 },
    ] } })
    .mockResolvedValueOnce({ data: { sucesso: true, dados: costs } });

  await expect(fetchBackendFixedCosts(3, { signal })).resolves.toEqual({ companyId: 8, costs });
  expect(api.get).toHaveBeenNthCalledWith(1, '/empresas', { signal });
  expect(api.get).toHaveBeenNthCalledWith(2, '/workspace/8/custos-fixos', { signal });
});

test('informa quando o usuário não tem empresa vinculada', async () => {
  api.get.mockResolvedValue({ data: { sucesso: true, dados: [] } });

  await expect(fetchBackendFixedCosts(3)).rejects.toThrow('Não há uma empresa vinculada');
  expect(api.get).toHaveBeenCalledTimes(1);
});

test('salva custos e extras usando o contrato do endpoint workspace', async () => {
  api.put.mockResolvedValue({ data: { sucesso: true, mensagem: 'Custos fixos salvos.' } });
  const costs = {
    aluguel: '1200',
    energia: 250,
    internet: 100,
    salarios: 3000,
    outros: 0,
    extras: [
      { id: 'extra-1', descricao: ' Embalagens ', valor: '70' },
      { id: 'empty', descricao: ' ', valor: 0 },
    ],
  };

  await expect(saveBackendFixedCosts(8, costs)).resolves.toBeUndefined();
  expect(api.put).toHaveBeenCalledWith('/workspace/8/custos-fixos', {
    aluguel: 1200,
    energia: 250,
    internet: 100,
    salarios: 3000,
    outros: 0,
    extras: [{ id: 'extra-1', descricao: 'Embalagens', valor: 70 }],
  });
});

test('exibe mensagem do backend quando a gravação falha', async () => {
  api.put.mockRejectedValue({
    message: 'Request failed',
    response: { data: { sucesso: false, mensagem: 'Erro ao salvar custos fixos.' } },
  });

  await expect(saveBackendFixedCosts(8, {
    aluguel: 0, energia: 0, internet: 0, salarios: 0, outros: 0, extras: [],
  })).rejects.toThrow('Erro ao salvar custos fixos.');
});
