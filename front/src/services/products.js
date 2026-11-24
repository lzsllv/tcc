import api from './api.js';

export async function fetchBackendProducts({ signal } = {}) {
  try {
    const response = await api.get('/produtos', { signal });
    const payload = response.data;

    if (payload?.sucesso !== true || !Array.isArray(payload.dados)) {
      throw new Error(payload?.mensagem || 'A resposta do servidor não contém uma lista válida de produtos.');
    }

    return payload.dados;
  } catch (error) {
    const message = error?.response?.data?.mensagem;
    if (typeof message === 'string' && message.trim()) {
      throw new Error(message, { cause: error });
    }
    throw error;
  }
}
