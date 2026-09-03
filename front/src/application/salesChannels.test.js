import test from 'node:test';
import assert from 'node:assert/strict';
import { createEmptyWorkspace } from '../persistence/workspace.js';
import {
  archiveSalesChannel,
  createSalesChannel,
  deleteSalesChannel,
  duplicateSalesChannel,
  selectSalesChannel,
  setDefaultSalesChannel,
  updateSalesChannel,
} from './salesChannels.js';

const NOW = '2026-08-25T12:00:00.000Z';

function cardInput(overrides = {}) {
  return {
    name: ' Cartão ',
    fees: [
      { name: ' Crédito ', kind: 'percentage', category: 'payment', value: 350 },
      { name: ' Tarifa ', kind: 'fixed', category: 'payment', value: 100 },
    ],
    ...overrides,
  };
}

function workspaceWithCard() {
  return createSalesChannel(createEmptyWorkspace('user-1', NOW), cardInput(), {
    id: 'channel-card', feeIds: ['fee-credit', 'fee-fixed'], now: NOW,
  });
}

test('cria canal com taxas normalizadas sem alterar o workspace original', () => {
  const workspace = createEmptyWorkspace('user-1', NOW);
  const updated = createSalesChannel(workspace, cardInput(), {
    id: 'channel-card', feeIds: ['fee-credit', 'fee-fixed'], now: NOW,
  });
  assert.equal(workspace.salesChannels.length, 1);
  assert.deepEqual(updated.salesChannels[1], {
    id: 'channel-card', ownerId: 'user-1', name: 'Cartão', active: true, isDefault: false,
    fees: [
      { id: 'fee-credit', name: 'Crédito', kind: 'percentage', category: 'payment', value: 350 },
      { id: 'fee-fixed', name: 'Tarifa', kind: 'fixed', category: 'payment', value: 100 },
    ],
    createdAt: NOW, updatedAt: NOW,
  });
});

test('rejeita canal e taxas inválidos', () => {
  const workspace = createEmptyWorkspace('user-1', NOW);
  assert.throws(() => createSalesChannel(workspace, cardInput({ name: ' ' })), /nome/i);
  assert.throws(() => createSalesChannel(workspace, cardInput({ fees: [{ name: 'X', kind: 'unknown', category: 'payment', value: 1 }] })), /natureza/i);
  assert.throws(() => createSalesChannel(workspace, cardInput({ fees: [{ name: 'X', kind: 'fixed', category: 'unknown', value: 1 }] })), /categoria/i);
  assert.throws(() => createSalesChannel(workspace, cardInput({ fees: [{ name: 'X', kind: 'fixed', category: 'payment', value: -1 }] })), /valor/i);
  assert.throws(() => createSalesChannel(workspace, cardInput({ fees: [{ name: 'X', kind: 'percentage', category: 'payment', value: 10000 }] })), /100%/i);
});

test('edita canal preservando identidade, estado e criação', () => {
  const workspace = workspaceWithCard();
  const later = '2026-08-25T13:00:00.000Z';
  const updated = updateSalesChannel(workspace, 'channel-card', cardInput({
    name: 'Cartão premium', fees: [{ id: 'fee-credit', name: 'Crédito', kind: 'percentage', category: 'payment', value: 450 }],
  }), later);
  const channel = updated.salesChannels[1];
  assert.equal(channel.name, 'Cartão premium');
  assert.equal(channel.createdAt, NOW);
  assert.equal(channel.updatedAt, later);
  assert.equal(workspace.salesChannels[1].name, 'Cartão');
});

test('duplica canal como ativo e não padrão', () => {
  const workspace = workspaceWithCard();
  const updated = duplicateSalesChannel(workspace, 'channel-card', {
    id: 'channel-copy', feeIds: ['copy-credit', 'copy-fixed'], now: NOW,
  });
  const copy = updated.salesChannels[2];
  assert.equal(copy.name, 'Cópia de Cartão');
  assert.equal(copy.isDefault, false);
  assert.equal(copy.active, true);
  assert.equal(copy.fees[0].id, 'copy-credit');
});

test('troca o canal padrão mantendo exatamente um padrão ativo', () => {
  const workspace = workspaceWithCard();
  const updated = setDefaultSalesChannel(workspace, 'channel-card', NOW);
  assert.equal(updated.salesChannels.filter(channel => channel.isDefault).length, 1);
  assert.equal(updated.salesChannels.find(channel => channel.id === 'channel-card').isDefault, true);
  assert.equal(updated.salesChannels.find(channel => channel.id === 'channel-direct').isDefault, false);
});

test('seleciona somente canal ativo', () => {
  const workspace = workspaceWithCard();
  const selected = selectSalesChannel(workspace, 'channel-card', NOW);
  assert.equal(selected.settings.selectedSalesChannelId, 'channel-card');
  const archived = { ...workspace, salesChannels: workspace.salesChannels.map(channel => channel.id === 'channel-card' ? { ...channel, active: false } : channel) };
  assert.throws(() => selectSalesChannel(archived, 'channel-card', NOW), /ativo/i);
});

test('bloqueia arquivamento do padrão e do último canal ativo', () => {
  const workspace = workspaceWithCard();
  assert.throws(() => archiveSalesChannel(workspace, 'channel-direct', NOW), /padrão/i);
  const onlyCard = {
    ...workspace,
    salesChannels: workspace.salesChannels.map(channel => channel.id === 'channel-direct' ? { ...channel, active: false, isDefault: false } : { ...channel, isDefault: true }),
  };
  assert.throws(() => archiveSalesChannel(onlyCard, 'channel-card', NOW), /último canal ativo/i);
});

test('arquiva canal secundário e bloqueia exclusão do padrão ou selecionado', () => {
  const workspace = workspaceWithCard();
  const archived = archiveSalesChannel(workspace, 'channel-card', NOW);
  assert.equal(archived.salesChannels[1].active, false);
  assert.throws(() => deleteSalesChannel(workspace, 'channel-direct', NOW), /padrão/i);
  const selected = { ...workspace, settings: { ...workspace.settings, selectedSalesChannelId: 'channel-card' } };
  assert.throws(() => deleteSalesChannel(selected, 'channel-card', NOW), /selecionado/i);
  assert.equal(deleteSalesChannel(workspace, 'channel-card', NOW).salesChannels.length, 1);
});

test('informa quando o canal solicitado não existe', () => {
  const workspace = createEmptyWorkspace('user-1', NOW);
  assert.throws(() => updateSalesChannel(workspace, 'missing', cardInput(), NOW), /não encontrado/i);
  assert.throws(() => duplicateSalesChannel(workspace, 'missing'), /não encontrado/i);
  assert.throws(() => setDefaultSalesChannel(workspace, 'missing', NOW), /não encontrado/i);
});
