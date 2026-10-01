import test from 'node:test';
import assert from 'node:assert/strict';
import { EMPTY_OFFER_FORM, formToOfferInput, offerToForm } from './offerForm.js';

test('converte oferta persistida para o formulário sem mutar a entrada', () => {
  const offer = {
    kind: 'product', name: 'Bolo', category: 'Doces', batchYield: 10,
    batchTimeMinutes: 90, expectedMonthlySales: 20, desiredMarginBps: 1250,
    components: [{ id: 'c1', ingredientId: 'i1', quantity: 500, unit: 'g', wasteBps: 250 }],
  };
  const form = offerToForm(offer);
  assert.equal(form.desiredMargin, '12,5');
  assert.equal(form.components[0].waste, '2,5');
  assert.equal(offer.components[0].quantity, 500);
});

test('monta o payload atual para produto', () => {
  const payload = formToOfferInput({
    ...EMPTY_OFFER_FORM,
    name: 'Bolo', category: 'Doces', batchYield: '10', batchTimeMinutes: '90',
    expectedMonthlySales: '20', desiredMargin: '12,5',
    components: [{ id: 'c1', ingredientId: 'i1', quantity: '500,5', unit: 'g', waste: '2,5' }],
  });
  assert.deepEqual(payload, {
    kind: 'product', name: 'Bolo', category: 'Doces', batchYield: 10,
    batchTimeMinutes: 90, expectedMonthlySales: 20, desiredMarginBps: 1250,
    components: [{ id: 'c1', ingredientId: 'i1', quantity: 500.5, unit: 'g', wasteBps: 250 }],
  });
});

test('força rendimento unitário e mantém margem vazia para serviço', () => {
  const payload = formToOfferInput({ ...EMPTY_OFFER_FORM, kind: 'service' });
  assert.equal(payload.batchYield, 1);
  assert.equal(payload.desiredMarginBps, null);
});
