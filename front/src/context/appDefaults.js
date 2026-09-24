export function createEmptyFixedCostsView() {
  return { aluguel: 0, energia: 0, internet: 0, salarios: 0, outros: 0, extras: [] };
}

export function createEmptySettingsView() {
  return { margemLucro: 20, custoHora: 0, regiaoAtuacao: '', nomeNegocio: '', logoNegocio: '' };
}
