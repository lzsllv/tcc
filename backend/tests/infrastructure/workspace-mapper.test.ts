import { describe, expect, it } from 'vitest';
import { parseWorkspace } from '../../src/domain/workspace.js';
import { fromWorkspaceGraph, toWorkspaceRows } from '../../src/infrastructure/prisma/workspace-mapper.js';
import { workspaceFixture } from '../fixtures/workspace.js';

describe('workspace mapper', () => {
  it('converte o agregado para linhas normalizadas preservando ordem e precisão', () => {
    const workspace = parseWorkspace(workspaceFixture, '11111111-1111-4111-8111-111111111111');

    const rows = toWorkspaceRows(workspace);

    expect(rows.ingredients[0]).toMatchObject({ category: 'raw_material', purchasePriceCents: 1200n });
    expect(rows.components[0]).toMatchObject({ offerId: 'offer-1', ingredientId: 'ingredient-1', position: 0 });
    expect(rows.fees[0]).toMatchObject({ salesChannelId: 'channel-direct', value: 350n, position: 0 });
  });

  it('reconstrói o workspace v2 a partir do grafo relacional', () => {
    const ownerId = '11111111-1111-4111-8111-111111111111';
    const graph = {
      ownerId, schemaVersion: 2, revision: 4n, updatedAt: new Date('2026-08-31T12:00:00.000Z'),
      settings: {
        businessName: 'Doces da Ana', logoPath: `${ownerId}/logo.webp`, region: 'Tupã - SP',
        laborHourCents: 2500n, defaultMarginBps: 2000, selectedSalesChannelId: 'channel-direct',
      },
      fixedCosts: { aluguel: 10000n, energia: 2000n, internet: 1000n, salarios: 0n, outros: 500n },
      fixedCostExtras: [{ id: 'extra-1', name: 'Seguro', valueCents: 900n, position: 0 }],
      ingredients: [{
        id: 'ingredient-1', name: 'Farinha', category: 'raw_material', purchasePriceCents: 1200n,
        purchaseQuantity: '1', purchaseUnit: 'kg', active: true,
        createdAt: new Date('2026-08-31T12:00:00.000Z'), updatedAt: new Date('2026-08-31T12:00:00.000Z'),
      }],
      offers: [{
        id: 'offer-1', kind: 'product', name: 'Bolo', category: 'Alimento', active: true,
        batchYield: '10', batchTimeMinutes: '60', expectedMonthlySales: '30', desiredMarginBps: null,
        createdAt: new Date('2026-08-31T12:00:00.000Z'), updatedAt: new Date('2026-08-31T12:00:00.000Z'),
        components: [{ id: 'component-1', ingredientId: 'ingredient-1', quantity: '0.5', unit: 'kg', wasteBps: 100, position: 0 }],
      }],
      salesChannels: [{
        id: 'channel-direct', name: 'Venda direta', active: true, isDefault: true,
        createdAt: new Date('2026-08-31T12:00:00.000Z'), updatedAt: new Date('2026-08-31T12:00:00.000Z'),
        fees: [{ id: 'fee-1', name: 'Cartão', kind: 'percentage', category: 'payment', value: 350n, position: 0 }],
      }],
    };

    const record = fromWorkspaceGraph(graph, 'https://signed.example/logo');

    expect(record.revision).toBe(4);
    expect(record.workspace).toEqual({ ...workspaceFixture, ownerId, settings: { ...workspaceFixture.settings, logo: 'https://signed.example/logo' },
      ingredients: workspaceFixture.ingredients.map((item) => ({ ...item, ownerId })),
      offers: workspaceFixture.offers.map((item) => ({ ...item, ownerId })),
      salesChannels: workspaceFixture.salesChannels.map((item) => ({ ...item, ownerId })),
    });
  });
});
