import { percentToBps } from '../../domain/pricing/money.js';

export const EMPTY_OFFER_FORM = {
  kind: 'product', name: '', category: '', batchYield: '1', batchTimeMinutes: '',
  expectedMonthlySales: '', desiredMargin: '', components: [],
};

export function numberFromInput(value) {
  return Number(String(value).replace(',', '.'));
}

export function offerToForm(offer) {
  return {
    kind: offer.kind,
    name: offer.name,
    category: offer.category,
    batchYield: String(offer.batchYield),
    batchTimeMinutes: String(offer.batchTimeMinutes),
    expectedMonthlySales: String(offer.expectedMonthlySales),
    desiredMargin: offer.desiredMarginBps === null ? '' : String(offer.desiredMarginBps / 100).replace('.', ','),
    components: offer.components.map(component => ({
      ...component,
      quantity: String(component.quantity),
      waste: String(component.wasteBps / 100).replace('.', ','),
    })),
  };
}

export function formToOfferInput(form) {
  return {
    kind: form.kind,
    name: form.name,
    category: form.category,
    batchYield: form.kind === 'service' ? 1 : numberFromInput(form.batchYield),
    batchTimeMinutes: numberFromInput(form.batchTimeMinutes || 0),
    expectedMonthlySales: numberFromInput(form.expectedMonthlySales || 0),
    desiredMarginBps: form.desiredMargin === '' ? null : percentToBps(form.desiredMargin),
    components: form.components.map(component => ({
      id: component.id,
      ingredientId: component.ingredientId,
      quantity: numberFromInput(component.quantity),
      unit: component.unit,
      wasteBps: percentToBps(component.waste || 0),
    })),
  };
}
