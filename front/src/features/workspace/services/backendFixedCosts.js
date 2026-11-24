import api from '../../../services/api.js';

const FIXED_COST_KEYS = ['aluguel', 'energia', 'internet', 'salarios', 'outros'];

function responseData(response, fallbackMessage) {
  const payload = response.data;
  if (payload?.sucesso !== true) {
    throw new Error(payload?.mensagem || fallbackMessage);
  }
  return payload.dados;
}

function backendError(error, fallbackMessage) {
  const message = error?.response?.data?.mensagem || error?.message || fallbackMessage;
  return new Error(message, { cause: error });
}

async function request(action, fallbackMessage) {
  try {
    return await action();
  } catch (error) {
    throw backendError(error, fallbackMessage);
  }
}

async function findCompanyId(userId, signal) {
  if (userId === null || userId === undefined || userId === '') {
    throw new TypeError('Entre na sua conta para carregar os custos fixos.');
  }

  const response = await api.get('/empresas', { signal });
  const companies = responseData(response, 'Não foi possível localizar a empresa da conta.');
  if (!Array.isArray(companies)) {
    throw new Error('A resposta do servidor não contém uma lista válida de empresas.');
  }

  const ownedCompanies = companies.filter(company => String(company.id_usuario) === String(userId));
  if (ownedCompanies.length === 0) {
    throw new Error('Não há uma empresa vinculada a esta conta. Cadastre ou vincule uma empresa no backend para gerenciar custos fixos.');
  }
  if (ownedCompanies.length > 1) {
    throw new Error('Há mais de uma empresa vinculada a esta conta. É necessário selecionar uma empresa antes de carregar os custos fixos.');
  }
  return ownedCompanies[0].id_empresa;
}

function normalizeFixedCosts(costs) {
  if (!costs || typeof costs !== 'object' || !Array.isArray(costs.extras)) {
    throw new Error('A resposta do servidor não contém custos fixos válidos.');
  }

  return {
    ...Object.fromEntries(FIXED_COST_KEYS.map(key => [key, Number(costs[key] ?? 0)])),
    extras: costs.extras.map(extra => ({
      id: String(extra.id),
      descricao: String(extra.descricao ?? ''),
      valor: Number(extra.valor ?? 0),
    })),
  };
}

export async function fetchBackendFixedCosts(userId, { signal } = {}) {
  return request(async () => {
    const companyId = await findCompanyId(userId, signal);
    const response = await api.get(`/workspace/${companyId}/custos-fixos`, { signal });
    const costs = responseData(response, 'Não foi possível carregar os custos fixos.');
    return { companyId, costs: normalizeFixedCosts(costs) };
  }, 'Não foi possível carregar os custos fixos.');
}

export async function saveBackendFixedCosts(companyId, costs) {
  if (companyId === null || companyId === undefined || companyId === '') {
    throw new TypeError('Empresa não identificada para salvar os custos fixos.');
  }

  return request(async () => {
    const payload = {
      ...Object.fromEntries(FIXED_COST_KEYS.map(key => [key, Number(costs[key] ?? 0)])),
      extras: (costs.extras ?? [])
        .filter(extra => String(extra.descricao ?? '').trim() || Number(extra.valor || 0) > 0)
        .map(extra => ({
          id: String(extra.id),
          descricao: String(extra.descricao ?? '').trim(),
          valor: Number(extra.valor ?? 0),
        })),
    };
    const response = await api.put(`/workspace/${companyId}/custos-fixos`, payload);
    responseData(response, 'Não foi possível salvar os custos fixos.');
  }, 'Não foi possível salvar os custos fixos.');
}
