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

export async function fetchBackendSalesChannels(userId, { signal } = {}) {
  if (userId === null || userId === undefined || userId === '') {
    throw new TypeError('Entre na sua conta para carregar os canais de venda.');
  }

  return request(async () => {
    const companyResponse = await api.get('/empresas', { signal });
    const companies = responseData(companyResponse, 'Não foi possível localizar a empresa da conta.');
    if (!Array.isArray(companies)) {
      throw new Error('A resposta do servidor não contém uma lista válida de empresas.');
    }

    const ownedCompanies = companies.filter(company => String(company.id_usuario) === String(userId));
    if (ownedCompanies.length === 0) {
      throw new Error('Não há uma empresa vinculada a esta conta. Cadastre ou vincule uma empresa no backend para gerenciar canais.');
    }
    if (ownedCompanies.length > 1) {
      throw new Error('Há mais de uma empresa vinculada a esta conta. É necessário selecionar uma empresa antes de carregar os canais.');
    }

    const companyId = ownedCompanies[0].id_empresa;
    const channelsResponse = await api.get('/canais-venda', { params: { id_empresa: companyId }, signal });
    const channels = responseData(channelsResponse, 'Não foi possível carregar os canais de venda.');
    if (!Array.isArray(channels)) {
      throw new Error('A resposta do servidor não contém uma lista válida de canais.');
    }
    return { companyId, channels };
  }, 'Não foi possível carregar os canais de venda.');
}

function channelBody(companyId, channel) {
  return {
    id_empresa: companyId,
    id: channel.id,
    name: channel.name,
    fees: channel.fees,
    active: channel.active,
    isDefault: channel.isDefault,
  };
}

export async function createBackendSalesChannel(companyId, channel) {
  return request(async () => {
    const response = await api.post('/canais-venda', channelBody(companyId, channel));
    const data = responseData(response, 'Não foi possível criar o canal de venda.');
    const id = data?.id ?? channel.id;
    if (channel.isDefault) {
      const defaultResponse = await api.patch('/canais-venda', { ...channelBody(companyId, channel), id });
      responseData(defaultResponse, 'O canal foi criado, mas não foi possível defini-lo como padrão.');
    }
    return { ...channel, id };
  }, 'Não foi possível criar o canal de venda.');
}

export async function updateBackendSalesChannel(companyId, channel) {
  return request(async () => {
    const response = await api.patch('/canais-venda', channelBody(companyId, channel));
    responseData(response, 'Não foi possível atualizar o canal de venda.');
    return channel;
  }, 'Não foi possível atualizar o canal de venda.');
}

export async function deleteBackendSalesChannel(companyId, channelId) {
  return request(async () => {
    const response = await api.delete('/canais-venda', { data: { id_empresa: companyId, id: channelId } });
    responseData(response, 'Não foi possível excluir o canal de venda.');
  }, 'Não foi possível excluir o canal de venda.');
}
