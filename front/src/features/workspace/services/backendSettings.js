import api from '../../../services/api.js';

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

export async function fetchBackendSettings(userId, { signal } = {}) {
  if (userId === null || userId === undefined || userId === '') {
    throw new TypeError('Entre na sua conta para carregar as configurações.');
  }

  return request(async () => {
    const companyResponse = await api.get('/empresas', { signal });
    const companies = responseData(companyResponse, 'Não foi possível localizar a empresa da conta.');
    if (!Array.isArray(companies)) {
      throw new Error('A resposta do servidor não contém uma lista válida de empresas.');
    }

    const ownedCompanies = companies.filter(company => String(company.id_usuario) === String(userId));
    if (ownedCompanies.length === 0) {
      throw new Error('Não há uma empresa vinculada a esta conta. Cadastre ou vincule uma empresa no backend para gerenciar as configurações.');
    }
    if (ownedCompanies.length > 1) {
      throw new Error('Há mais de uma empresa vinculada a esta conta. É necessário selecionar uma empresa antes de carregar as configurações.');
    }

    const companyId = ownedCompanies[0].id_empresa;
    const settingsResponse = await api.get(`/configuracoes/${companyId}`, { signal });
    const settings = responseData(settingsResponse, 'Não foi possível carregar as configurações.');
    if (!settings || typeof settings !== 'object') {
      throw new Error('A resposta do servidor não contém configurações válidas.');
    }
    return { companyId, settings };
  }, 'Não foi possível carregar as configurações.');
}

export async function saveBackendSettings(companyId, settings) {
  if (companyId === null || companyId === undefined || companyId === '') {
    throw new TypeError('Empresa não identificada para salvar as configurações.');
  }

  return request(async () => {
    const response = await api.put(`/configuracoes/${companyId}`, {
      nomeNegocio: settings.nomeNegocio,
      logoNegocio: settings.logoNegocio || '',
      regiaoAtuacao: settings.regiaoAtuacao || '',
      custoHora: Number(settings.custoHora),
      margemLucro: Number(settings.margemLucro),
    });
    responseData(response, 'Não foi possível salvar as configurações.');
  }, 'Não foi possível salvar as configurações.');
}
