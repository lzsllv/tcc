export const workspaceFixture = {
  schemaVersion: 2,
  ownerId: 'client-owner',
  ingredients: [{
    id: 'ingredient-1', ownerId: 'client-owner', name: 'Farinha', category: 'raw-material',
    purchasePriceCents: 1200, purchaseQuantity: 1, purchaseUnit: 'kg', active: true,
    createdAt: '2026-08-31T12:00:00.000Z', updatedAt: '2026-08-31T12:00:00.000Z',
  }],
  offers: [{
    id: 'offer-1', ownerId: 'client-owner', kind: 'product', name: 'Bolo', category: 'Alimento',
    active: true, batchYield: 10, batchTimeMinutes: 60, expectedMonthlySales: 30,
    desiredMarginBps: null,
    components: [{ id: 'component-1', ingredientId: 'ingredient-1', quantity: 0.5, unit: 'kg', wasteBps: 100 }],
    createdAt: '2026-08-31T12:00:00.000Z', updatedAt: '2026-08-31T12:00:00.000Z',
  }],
  salesChannels: [{
    id: 'channel-direct', ownerId: 'client-owner', name: 'Venda direta', active: true, isDefault: true,
    fees: [{ id: 'fee-1', name: 'Cartão', kind: 'percentage', category: 'payment', value: 350 }],
    createdAt: '2026-08-31T12:00:00.000Z', updatedAt: '2026-08-31T12:00:00.000Z',
  }],
  fixedCosts: {
    aluguel: 10000, energia: 2000, internet: 1000, salarios: 0, outros: 500,
    extras: [{ id: 'extra-1', name: 'Seguro', valueCents: 900 }],
  },
  settings: {
    businessName: 'Doces da Ana', logo: '', region: 'Tupã - SP', laborHourCents: 2500,
    defaultMarginBps: 2000, selectedSalesChannelId: 'channel-direct',
  },
  updatedAt: '2026-08-31T12:00:00.000Z',
};
