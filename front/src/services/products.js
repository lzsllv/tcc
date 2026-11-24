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

export async function updateBackendProduct(product, imageFile) {
  const formData = new FormData();
  for (const field of ['id_produto', 'id_empresa', 'nome', 'descricao', 'tipo', 'custo_direto', 'tempo_producao']) {
    formData.append(field, String(product[field] ?? ''));
  }
  formData.append('preco_minimo', product.preco_minimo == null ? '' : String(product.preco_minimo));
  if (imageFile) formData.append('imagem', imageFile);

  try {
    const response = await api.patch('/produtos', formData);
    if (response.data?.sucesso !== true) {
      throw new Error(response.data?.mensagem || 'Não foi possível atualizar o produto.');
    }
    return response.data.dados;
  } catch (error) {
    const message = error?.response?.data?.mensagem;
    if (typeof message === 'string' && message.trim()) {
      throw new Error(message, { cause: error });
    }
    throw error;
  }
}

async function sendProductAction(request, fallbackMessage) {
  try {
    const response = await request();
    if (response.data?.sucesso !== true) {
      throw new Error(response.data?.mensagem || fallbackMessage);
    }
    return response.data.dados;
  } catch (error) {
    const message = error?.response?.data?.mensagem;
    if (typeof message === 'string' && message.trim()) {
      throw new Error(message, { cause: error });
    }
    throw error;
  }
}

export function archiveBackendProduct(id) {
  return sendProductAction(
    () => api.patch('/produtos/arquivar', { id_produto: id, ativo: false }),
    'Não foi possível arquivar o produto.',
  );
}

export function deleteBackendProduct(id) {
  return sendProductAction(
    () => api.delete('/produtos', { data: { id_produto: id } }),
    'Não foi possível excluir o produto.',
  );
}
