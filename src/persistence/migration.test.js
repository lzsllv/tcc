import test from 'node:test';
import assert from 'node:assert/strict';
import { LocalWorkspaceRepository } from './LocalWorkspaceRepository.js';

class MemoryStorage {
  constructor() { this.data = new Map(); }
  getItem(key) { return this.data.has(key) ? this.data.get(key) : null; }
  setItem(key, value) { this.data.set(key, String(value)); }
}

const legacy = {
  produtos: [{ id: 7, nome: 'Bolo', categoria: 'Alimento', custo: 20, tempoProducao: 1.5, quantidadeMes: 12 }],
  custosFixos: { aluguel: 100, energia: 50, extras: [{ id: 3, descricao: 'Gás', valor: 25 }] },
  configuracoes: { margemLucro: 20, custoHora: 30, nomeNegocio: 'Doces', regiaoAtuacao: 'SP', logoNegocio: '' },
};

test('migra dados legados preservando custo, tempo, quantidade e preço equivalente', async () => {
  const repository = new LocalWorkspaceRepository(new MemoryStorage(), () => '2026-08-24T15:00:00.000Z');
  const workspace = await repository.migrateWorkspace('user-1', legacy);

  assert.equal(workspace.schemaVersion, 2);
  assert.equal(workspace.ingredients[0].purchasePriceCents, 2000);
  assert.equal(workspace.offers[0].batchTimeMinutes, 90);
  assert.equal(workspace.offers[0].expectedMonthlySales, 12);
  assert.equal(workspace.settings.laborHourCents, 3000);
  assert.equal(workspace.settings.defaultMarginBps, 1667);
  assert.equal(workspace.fixedCosts.aluguel, 10000);
  assert.equal(workspace.fixedCosts.extras[0].valueCents, 2500);
  assert.equal(workspace.salesChannels[0].name, 'Venda direta');
});

test('migração é idempotente e cria apenas um backup', async () => {
  const storage = new MemoryStorage();
  const repository = new LocalWorkspaceRepository(storage, () => '2026-08-24T16:00:00.000Z');
  const first = await repository.migrateWorkspace('user-1', legacy);
  const second = await repository.migrateWorkspace('user-1', legacy);

  assert.deepEqual(second, first);
  assert.equal([...storage.data.keys()].filter(key => key.startsWith('precifique:backup:v1:')).length, 1);
});

test('rejeita migração sem usuário e mantém os dados legados intactos', async () => {
  const storage = new MemoryStorage();
  const repository = new LocalWorkspaceRepository(storage);
  await assert.rejects(repository.migrateWorkspace('', legacy), TypeError);
  assert.equal(storage.data.size, 0);
});
