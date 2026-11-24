import { afterEach, beforeEach, expect, test, vi } from 'vitest';
import api from '../../../services/api.js';
import { fetchBackendFixedCosts } from '../services/backendFixedCosts.js';
import { fetchBackendSettings } from '../services/backendSettings.js';
import { fetchBackendSalesChannels } from '../../sales-channels/services/backendSalesChannels.js';
import { BackendWorkspaceRepository } from './BackendWorkspaceRepository.js';
import { createEmptyWorkspace } from './workspace.js';

vi.mock('../../../services/api.js', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    patch: vi.fn(),
    delete: vi.fn(),
  },
}));

vi.mock('../services/backendFixedCosts.js', () => ({
  fetchBackendFixedCosts: vi.fn(),
  saveBackendFixedCosts: vi.fn(),
}));

vi.mock('../services/backendSettings.js', () => ({
  fetchBackendSettings: vi.fn(),
  saveBackendSettings: vi.fn(),
}));

vi.mock('../../sales-channels/services/backendSalesChannels.js', () => ({
  createBackendSalesChannel: vi.fn(),
  deleteBackendSalesChannel: vi.fn(),
  fetchBackendSalesChannels: vi.fn(),
  updateBackendSalesChannel: vi.fn(),
}));

class MemoryStorage {
  constructor() { this.data = new Map(); }
  getItem(key) { return this.data.get(key) ?? null; }
  setItem(key, value) { this.data.set(key, String(value)); }
}

const successfulResponse = { data: { sucesso: true, dados: {} } };
const requests = [];

beforeEach(() => {
  requests.length = 0;
  api.get.mockResolvedValue({ data: { sucesso: true, dados: [{ id_empresa: 8, id_usuario: 3 }] } });
  api.post.mockImplementation(async (path, body) => {
    requests.push(['post', path, body]);
    return { data: { sucesso: true, dados: { id: body.id } } };
  });
  api.patch.mockImplementation(async (path, body) => {
    requests.push(['patch', path, body]);
    return successfulResponse;
  });
  api.delete.mockImplementation(async (path, config) => {
    requests.push(['delete', path, config.data]);
    return successfulResponse;
  });
});

afterEach(() => vi.clearAllMocks());

test('salva insumos antes das fichas técnicas para respeitar suas referências', async () => {
  const repository = new BackendWorkspaceRepository(new MemoryStorage());
  const workspace = createEmptyWorkspace('3');
  workspace.ingredients.push({
    id: 'ingredient-1',
    name: 'Farinha',
    category: 'raw-material',
    purchasePriceCents: 500,
    purchaseQuantity: 1,
    purchaseUnit: 'kg',
    active: true,
  });
  workspace.offers.push({
    id: 'offer-1',
    kind: 'product',
    name: 'Bolo',
    category: 'Doces',
    batchYield: 1,
    batchTimeMinutes: 0,
    expectedMonthlySales: 0,
    desiredMarginBps: null,
    active: true,
    components: [{ id: 'component-1', ingredientId: 'ingredient-1', quantity: 1, unit: 'kg', wasteBps: 0 }],
  });

  await repository.saveWorkspace('3', workspace);

  expect(requests.filter(([method]) => method === 'post').map(([, path]) => path)).toEqual(['/insumos', '/ofertas']);
  expect(requests.find(([, path]) => path === '/ofertas')[2].id_empresa).toBe(8);
});

test('carrega o workspace persistido no backend para as telas de negócio', async () => {
  const channel = {
    id: 'channel-1',
    name: 'Venda direta',
    active: true,
    isDefault: true,
    fees: [],
  };
  const ingredient = {
    id: 'ingredient-1',
    name: 'Farinha',
    category: 'raw-material',
    purchasePriceCents: 500,
    purchaseQuantity: 1,
    purchaseUnit: 'kg',
    active: true,
  };
  const offer = {
    id: 'offer-1',
    kind: 'product',
    name: 'Bolo',
    category: 'Doces',
    batchYield: 1,
    batchTimeMinutes: 30,
    expectedMonthlySales: 10,
    desiredMarginBps: null,
    active: true,
    components: [],
  };
  api.get.mockImplementation(async path => {
    if (path === '/empresas') return { data: { sucesso: true, dados: [{ id_empresa: 8, id_usuario: 3 }] } };
    if (path === '/insumos') return { data: { sucesso: true, dados: [ingredient] } };
    if (path === '/ofertas') return { data: { sucesso: true, dados: [offer] } };
    throw new Error(`Rota inesperada: ${path}`);
  });
  fetchBackendSalesChannels.mockResolvedValue({ companyId: 8, channels: [channel] });
  fetchBackendFixedCosts.mockResolvedValue({
    companyId: 8,
    costs: { aluguel: 120, energia: 0, internet: 0, salarios: 0, outros: 0, extras: [] },
  });
  fetchBackendSettings.mockResolvedValue({
    companyId: 8,
    settings: { nomeNegocio: 'Ateliê', logoNegocio: '', regiaoAtuacao: 'SP', custoHora: 30, margemLucro: 25 },
  });
  const repository = new BackendWorkspaceRepository(new MemoryStorage());

  const workspace = await repository.loadWorkspace('3');

  expect(workspace.ingredients[0]).toMatchObject({ ...ingredient, ownerId: '3' });
  expect(workspace.offers[0]).toMatchObject({ ...offer, ownerId: '3' });
  expect(workspace.salesChannels[0]).toMatchObject({ ...channel, ownerId: '3' });
  expect(workspace.fixedCosts.aluguel).toBe(12000);
  expect(workspace.settings).toMatchObject({
    businessName: 'Ateliê',
    region: 'SP',
    laborHourCents: 3000,
    defaultMarginBps: 2500,
    selectedSalesChannelId: 'channel-1',
  });
});

test('deixa workspace novo seguir o fluxo de migração do armazenamento antigo', async () => {
  api.get.mockImplementation(async path => {
    if (path === '/empresas') return { data: { sucesso: true, dados: [{ id_empresa: 8, id_usuario: 3 }] } };
    return { data: { sucesso: true, dados: [] } };
  });
  fetchBackendSalesChannels.mockResolvedValue({ companyId: 8, channels: [] });
  fetchBackendFixedCosts.mockResolvedValue({
    companyId: 8,
    costs: { aluguel: 0, energia: 0, internet: 0, salarios: 0, outros: 0, extras: [] },
  });
  fetchBackendSettings.mockResolvedValue({
    companyId: 8,
    settings: { nomeNegocio: '', logoNegocio: '', regiaoAtuacao: '', custoHora: 0, margemLucro: 20 },
  });

  const repository = new BackendWorkspaceRepository(new MemoryStorage());

  await expect(repository.loadWorkspace('3')).resolves.toBeNull();
});

test('exclui fichas técnicas antes dos insumos referenciados', async () => {
  const storage = new MemoryStorage();
  const repository = new BackendWorkspaceRepository(storage);
  const previous = createEmptyWorkspace('3');
  previous.ingredients.push({ id: 'ingredient-1' });
  previous.offers.push({ id: 'offer-1' });
  await repository.localRepository.saveWorkspace('3', previous);

  await repository.saveWorkspace('3', createEmptyWorkspace('3'));

  expect(requests.filter(([method]) => method === 'delete').map(([, path]) => path)).toEqual(['/ofertas', '/insumos']);
});

test('não persiste cache local quando a gravação no backend falha', async () => {
  const storage = new MemoryStorage();
  api.post.mockRejectedValue(new Error('Backend indisponível.'));
  const repository = new BackendWorkspaceRepository(storage);
  const workspace = createEmptyWorkspace('3');
  workspace.ingredients.push({ id: 'ingredient-1' });

  await expect(repository.saveWorkspace('3', workspace)).rejects.toThrow('Backend indisponível');
  expect(await repository.localRepository.loadWorkspace('3')).toBeNull();
});
