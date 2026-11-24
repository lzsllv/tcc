import { afterEach, expect, test, vi } from 'vitest';
import api from '../../../services/api.js';
import { fetchBackendSettings, saveBackendSettings } from './backendSettings.js';

vi.mock('../../../services/api.js', () => ({
  default: {
    get: vi.fn(),
    put: vi.fn(),
  },
}));

afterEach(() => vi.clearAllMocks());

test('localiza a empresa do usuário e carrega suas configurações', async () => {
  const settings = {
    nomeNegocio: 'Doce Sabor',
    logoNegocio: 'data:image/png;base64,abc',
    regiaoAtuacao: 'São Paulo',
    custoHora: 35,
    margemLucro: 25,
  };
  const signal = new AbortController().signal;
  api.get
    .mockResolvedValueOnce({ data: { sucesso: true, dados: [
      { id_empresa: 8, id_usuario: 3 },
      { id_empresa: 9, id_usuario: 4 },
    ] } })
    .mockResolvedValueOnce({ data: { sucesso: true, dados: settings } });

  await expect(fetchBackendSettings(3, { signal })).resolves.toEqual({ companyId: 8, settings });
  expect(api.get).toHaveBeenNthCalledWith(1, '/empresas', { signal });
  expect(api.get).toHaveBeenNthCalledWith(2, '/configuracoes/8', { signal });
});

test('rejeita contas sem empresa vinculada', async () => {
  api.get.mockResolvedValue({ data: { sucesso: true, dados: [] } });

  await expect(fetchBackendSettings(3)).rejects.toThrow('Não há uma empresa vinculada');
  expect(api.get).toHaveBeenCalledTimes(1);
});

test('salva as configurações na empresa usando o contrato do backend', async () => {
  api.put.mockResolvedValue({ data: { sucesso: true, mensagem: 'Configurações salvas.' } });
  const settings = {
    nomeNegocio: ' Doce Sabor ',
    logoNegocio: '',
    regiaoAtuacao: 'São Paulo',
    custoHora: '35.50',
    margemLucro: '25',
  };

  await expect(saveBackendSettings(8, settings)).resolves.toBeUndefined();
  expect(api.put).toHaveBeenCalledWith('/configuracoes/8', {
    nomeNegocio: ' Doce Sabor ',
    logoNegocio: '',
    regiaoAtuacao: 'São Paulo',
    custoHora: 35.5,
    margemLucro: 25,
  });
});

test('apresenta a mensagem do backend em falhas HTTP', async () => {
  api.put.mockRejectedValue({
    message: 'Request failed',
    response: { data: { sucesso: false, mensagem: 'Erro ao salvar configurações.' } },
  });

  await expect(saveBackendSettings(8, {
    nomeNegocio: 'Doce',
    custoHora: 10,
    margemLucro: 20,
  })).rejects.toThrow('Erro ao salvar configurações.');
});
