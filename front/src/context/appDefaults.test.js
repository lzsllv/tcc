import test from 'node:test';
import assert from 'node:assert/strict';
import { createEmptyFixedCostsView, createEmptySettingsView } from './appDefaults.js';

test('cria estados vazios independentes', () => {
  const firstCosts = createEmptyFixedCostsView();
  const secondCosts = createEmptyFixedCostsView();
  firstCosts.extras.push({ id: 'extra' });

  assert.deepEqual(secondCosts, {
    aluguel: 0,
    energia: 0,
    internet: 0,
    salarios: 0,
    outros: 0,
    extras: [],
  });
  assert.notEqual(firstCosts, secondCosts);
  assert.notEqual(firstCosts.extras, secondCosts.extras);
  assert.deepEqual(createEmptySettingsView(), {
    margemLucro: 20,
    custoHora: 0,
    regiaoAtuacao: '',
    nomeNegocio: '',
    logoNegocio: '',
  });
});
