import { convertQuantity } from './units.js';

export function calculateIngredientCost(ingredient, quantity, unit, wasteBps = 0) {
  const { purchasePriceCents, purchaseQuantity, purchaseUnit } = ingredient ?? {};

  if (!Number.isInteger(purchasePriceCents) || purchasePriceCents < 0) {
    throw new TypeError('Preço de compra deve ser informado em centavos.');
  }
  if (!Number.isFinite(purchaseQuantity) || purchaseQuantity <= 0) {
    throw new RangeError('Quantidade de compra deve ser maior que zero.');
  }
  if (!Number.isInteger(wasteBps) || wasteBps < 0 || wasteBps > 10000) {
    throw new RangeError('Perda deve estar entre 0 e 10000 pontos-base.');
  }

  const usedInPurchaseUnit = convertQuantity(quantity, unit, purchaseUnit);
  const effectiveQuantity = usedInPurchaseUnit * (1 + wasteBps / 10000);
  return Math.round((purchasePriceCents * effectiveQuantity) / purchaseQuantity);
}
