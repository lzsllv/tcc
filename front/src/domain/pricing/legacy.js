export function markupBpsToMarginBps(markupBps) {
  if (!Number.isInteger(markupBps) || markupBps < 0) {
    throw new RangeError('Markup deve ser um inteiro não negativo em pontos-base.');
  }
  return Math.round((markupBps / (10000 + markupBps)) * 10000);
}
