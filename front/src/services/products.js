import api from './api.js';

export async function fetchBackendProducts({ signal } = {}) {
  const response = await api.get('/produtos', { signal });
  const payload = response.data;

  if (payload?.sucesso !== true || !Array.isArray(payload.dados)) {
    throw new Error(payload?.mensagem || 'A resposta do servidor não contém uma lista válida de produtos.');
  }

  return payload.dados;
}
