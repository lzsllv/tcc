import api from '../../../services/api.js';
import { fetchBackendFixedCosts, saveBackendFixedCosts } from '../services/backendFixedCosts.js';
import { fetchBackendSettings, saveBackendSettings } from '../services/backendSettings.js';
import {
  createBackendSalesChannel,
  deleteBackendSalesChannel,
  fetchBackendSalesChannels,
  updateBackendSalesChannel,
} from '../../sales-channels/services/backendSalesChannels.js';
import { LocalWorkspaceRepository } from './LocalWorkspaceRepository.js';
import { migrateLegacyData } from './migration.js';
import { assertOwnerId, assertWorkspace, createEmptyWorkspace } from './workspace.js';

function responseData(response, fallbackMessage) {
  const payload = response.data;
  if (payload?.sucesso !== true) throw new Error(payload?.mensagem || fallbackMessage);
  return payload.dados;
}

function backendError(error, fallbackMessage) {
  return new Error(error?.response?.data?.mensagem || error?.message || fallbackMessage, { cause: error });
}

function toFixedCostsView(costs) {
  return {
    ...Object.fromEntries(['aluguel', 'energia', 'internet', 'salarios', 'outros']
      .map(key => [key, Math.round(Number(costs[key] ?? 0) * 100)])),
    extras: (costs.extras ?? []).map(extra => ({
      id: String(extra.id),
      name: String(extra.descricao ?? ''),
      valueCents: Math.round(Number(extra.valor ?? 0) * 100),
    })),
  };
}

function fromFixedCostsView(costs) {
  return {
    ...Object.fromEntries(['aluguel', 'energia', 'internet', 'salarios', 'outros']
      .map(key => [key, Number(costs[key] ?? 0) / 100])),
    extras: (costs.extras ?? []).map(extra => ({
      id: String(extra.id),
      descricao: extra.name,
      valor: Number(extra.valueCents ?? 0) / 100,
    })),
  };
}

function makeWorkspace(ownerId, data, cachedWorkspace) {
  const workspace = createEmptyWorkspace(ownerId);
  const cachedIngredients = new Map((cachedWorkspace?.ingredients ?? []).map(item => [item.id, item]));
  const cachedOffers = new Map((cachedWorkspace?.offers ?? []).map(item => [item.id, item]));
  const cachedChannels = new Map((cachedWorkspace?.salesChannels ?? []).map(item => [item.id, item]));
  const now = new Date().toISOString();

  workspace.ingredients = data.ingredients.map(item => ({
    ...cachedIngredients.get(item.id),
    ...item,
    ownerId,
    createdAt: cachedIngredients.get(item.id)?.createdAt ?? now,
    updatedAt: now,
  }));
  workspace.offers = data.offers.map(item => ({
    ...cachedOffers.get(item.id),
    ...item,
    ownerId,
    createdAt: cachedOffers.get(item.id)?.createdAt ?? now,
    updatedAt: now,
  }));
  workspace.salesChannels = data.channels.map(item => ({
    ...cachedChannels.get(item.id),
    ...item,
    ownerId,
    createdAt: cachedChannels.get(item.id)?.createdAt ?? now,
    updatedAt: now,
  }));
  workspace.fixedCosts = data.fixedCosts;
  workspace.settings = {
    ...workspace.settings,
    ...data.settings,
    selectedSalesChannelId: workspace.salesChannels.find(channel => channel.active && channel.isDefault)?.id
      ?? workspace.salesChannels.find(channel => channel.active)?.id
      ?? null,
  };
  const cachedSelection = cachedWorkspace?.settings?.selectedSalesChannelId;
  if (workspace.salesChannels.some(channel => channel.id === cachedSelection && channel.active)) {
    workspace.settings.selectedSalesChannelId = cachedSelection;
  }
  workspace.updatedAt = cachedWorkspace?.updatedAt ?? now;
  return workspace;
}

function sameValue(left, right) {
  return JSON.stringify(left) === JSON.stringify(right);
}

function ingredientPayload(companyId, ingredient) {
  return {
    id_empresa: companyId,
    id: ingredient.id,
    name: ingredient.name,
    category: ingredient.category,
    purchasePriceCents: ingredient.purchasePriceCents,
    purchaseQuantity: ingredient.purchaseQuantity,
    purchaseUnit: ingredient.purchaseUnit,
    active: ingredient.active,
  };
}

function offerPayload(companyId, offer) {
  return {
    id_empresa: companyId,
    id: offer.id,
    kind: offer.kind,
    name: offer.name,
    category: offer.category,
    batchYield: offer.batchYield,
    batchTimeMinutes: offer.batchTimeMinutes,
    expectedMonthlySales: offer.expectedMonthlySales,
    desiredMarginBps: offer.desiredMarginBps,
    active: offer.active,
    components: offer.components,
  };
}

export class BackendWorkspaceRepository {
  constructor(storage = globalThis.localStorage, apiClient = api) {
    this.localRepository = new LocalWorkspaceRepository(storage);
    this.api = apiClient;
    this.companyIds = new Map();
  }

  async findCompanyId(ownerId) {
    const response = await this.api.get('/empresas');
    const companies = responseData(response, 'Não foi possível localizar a empresa da conta.');
    if (!Array.isArray(companies)) throw new Error('A resposta do servidor não contém uma lista válida de empresas.');
    const ownedCompanies = companies.filter(company => String(company.id_usuario) === String(ownerId));
    if (ownedCompanies.length !== 1) {
      throw new Error(ownedCompanies.length === 0
        ? 'Não há uma empresa vinculada a esta conta. Cadastre ou vincule uma empresa no backend para acessar seus dados.'
        : 'Há mais de uma empresa vinculada a esta conta. É necessário selecionar uma empresa.');
    }
    this.companyIds.set(ownerId, ownedCompanies[0].id_empresa);
    return ownedCompanies[0].id_empresa;
  }

  async fetchWorkspace(ownerId) {
    const companyId = await this.findCompanyId(ownerId);
    const [ingredientsResponse, offersResponse, channelsResult, costsResult, settingsResult] = await Promise.all([
      this.api.get('/insumos', { params: { id_empresa: companyId } }),
      this.api.get('/ofertas', { params: { id_empresa: companyId } }),
      fetchBackendSalesChannels(ownerId),
      fetchBackendFixedCosts(ownerId),
      fetchBackendSettings(ownerId),
    ]);
    const ingredients = responseData(ingredientsResponse, 'Não foi possível carregar os insumos.');
    const offers = responseData(offersResponse, 'Não foi possível carregar as fichas técnicas.');
    if (!Array.isArray(ingredients) || !Array.isArray(offers)) {
      throw new Error('A resposta do servidor contém dados inválidos para o workspace.');
    }
    return {
      companyId,
      ingredients,
      offers,
      channels: channelsResult.channels,
      fixedCosts: toFixedCostsView(costsResult.costs),
      settings: {
        businessName: settingsResult.settings.nomeNegocio ?? '',
        logo: settingsResult.settings.logoNegocio ?? '',
        region: settingsResult.settings.regiaoAtuacao ?? '',
        laborHourCents: Math.round(Number(settingsResult.settings.custoHora ?? 0) * 100),
        defaultMarginBps: Math.round(Number(settingsResult.settings.margemLucro ?? 20) * 100),
      },
    };
  }

  async loadWorkspace(ownerId) {
    assertOwnerId(ownerId);
    try {
      let [data, cachedWorkspace] = await Promise.all([
        this.fetchWorkspace(ownerId),
        this.localRepository.loadWorkspace(ownerId),
      ]);

      if (!cachedWorkspace && data.ingredients.length === 0 && data.offers.length === 0
        && data.channels.length === 0
        && ['aluguel', 'energia', 'internet', 'salarios', 'outros']
          .every(key => Number(data.fixedCosts[key] ?? 0) === 0)
        && data.fixedCosts.extras.length === 0
        && !data.settings.businessName && !data.settings.logo && !data.settings.region
        && data.settings.laborHourCents === 0 && data.settings.defaultMarginBps === 2000) {
        return null;
      }

      const cachedFixedCosts = cachedWorkspace?.fixedCosts;
      const hasCachedCosts = cachedFixedCosts
        && (['aluguel', 'energia', 'internet', 'salarios', 'outros']
          .some(key => Number(cachedFixedCosts[key]) > 0) || cachedFixedCosts.extras.length > 0);
      const hasCachedSettings = cachedWorkspace
        && (cachedWorkspace.settings.businessName || cachedWorkspace.settings.logo
          || cachedWorkspace.settings.region || cachedWorkspace.settings.laborHourCents
          || cachedWorkspace.settings.defaultMarginBps !== 0);

      if (data.ingredients.length === 0 && data.offers.length === 0 && cachedWorkspace
        && (cachedWorkspace.ingredients.length || cachedWorkspace.offers.length || hasCachedCosts || hasCachedSettings)) {
        await this.syncCore(data.companyId, createEmptyWorkspace(ownerId), cachedWorkspace);
        if (data.channels.length === 0) {
          for (const channel of cachedWorkspace.salesChannels) {
            await createBackendSalesChannel(data.companyId, channel);
          }
        }
        const hasRemoteCosts = ['aluguel', 'energia', 'internet', 'salarios', 'outros']
          .some(key => Number(data.fixedCosts[key]) > 0) || data.fixedCosts.extras.length > 0;
        if (!hasRemoteCosts && hasCachedCosts) {
          await saveBackendFixedCosts(data.companyId, fromFixedCostsView(cachedWorkspace.fixedCosts));
        }
        const hasRemoteSettings = Boolean(data.settings.businessName || data.settings.logo || data.settings.region
          || data.settings.laborHourCents || data.settings.defaultMarginBps !== 2000);
        if (!hasRemoteSettings && hasCachedSettings) {
          await saveBackendSettings(data.companyId, {
            nomeNegocio: cachedWorkspace.settings.businessName,
            logoNegocio: cachedWorkspace.settings.logo,
            regiaoAtuacao: cachedWorkspace.settings.region,
            custoHora: cachedWorkspace.settings.laborHourCents / 100,
            margemLucro: cachedWorkspace.settings.defaultMarginBps / 100,
          });
        }
        data = await this.fetchWorkspace(ownerId);
      }

      if (data.channels.length === 0) {
        const defaultChannel = cachedWorkspace?.salesChannels.find(channel => channel.isDefault)
          ?? createEmptyWorkspace(ownerId).salesChannels[0];
        await createBackendSalesChannel(data.companyId, defaultChannel);
        data = await this.fetchWorkspace(ownerId);
      }

      const workspace = makeWorkspace(ownerId, data, cachedWorkspace);
      await this.localRepository.saveWorkspace(ownerId, workspace);
      return workspace;
    } catch (error) {
      throw backendError(error, 'Não foi possível carregar os dados do backend.');
    }
  }

  async migrateWorkspace(ownerId, legacyData) {
    const workspace = migrateLegacyData(ownerId, legacyData, new Date().toISOString());
    try {
      await this.localRepository.createBackup(ownerId, legacyData);
      const companyId = await this.findCompanyId(ownerId);
      await this.syncAll(companyId, createEmptyWorkspace(ownerId), workspace);
      return this.localRepository.saveWorkspace(ownerId, workspace);
    } catch (error) {
      throw backendError(error, 'Não foi possível migrar os dados para o backend.');
    }
  }

  async saveWorkspace(ownerId, workspace) {
    assertWorkspace(ownerId, workspace);
    try {
      const companyId = this.companyIds.get(ownerId) ?? await this.findCompanyId(ownerId);
      const previous = await this.localRepository.loadWorkspace(ownerId) ?? createEmptyWorkspace(ownerId);
      await this.syncCore(companyId, previous, workspace);
      return this.localRepository.saveWorkspace(ownerId, workspace);
    } catch (error) {
      throw backendError(error, 'Não foi possível salvar os dados no backend.');
    }
  }

  async syncCore(companyId, previous, next) {
    const previousIngredients = new Map(previous.ingredients.map(item => [item.id, item]));
    const nextIngredients = new Map(next.ingredients.map(item => [item.id, item]));
    const previousOffers = new Map(previous.offers.map(item => [item.id, item]));
    const nextOffers = new Map(next.offers.map(item => [item.id, item]));

    for (const ingredient of next.ingredients) {
      if (!previousIngredients.has(ingredient.id)) {
        const response = await this.api.post('/insumos', ingredientPayload(companyId, ingredient));
        responseData(response, 'Não foi possível cadastrar o insumo.');
      }
    }
    for (const offer of next.offers) {
      const existing = previousOffers.get(offer.id);
      if (!existing) {
        const response = await this.api.post('/ofertas', offerPayload(companyId, offer));
        responseData(response, 'Não foi possível cadastrar a ficha técnica.');
      } else if (!sameValue(existing, offer)) {
        const response = await this.api.patch('/ofertas', offerPayload(companyId, offer));
        responseData(response, 'Não foi possível atualizar a ficha técnica.');
      }
    }
    for (const [id] of previousOffers) {
      if (!nextOffers.has(id)) {
        const response = await this.api.delete('/ofertas', { data: { id_empresa: companyId, id } });
        responseData(response, 'Não foi possível excluir a ficha técnica.');
      }
    }
    for (const [id, ingredient] of previousIngredients) {
      if (!nextIngredients.has(id)) {
        const response = await this.api.delete('/insumos', { data: { id_empresa: companyId, id } });
        responseData(response, 'Não foi possível excluir o insumo.');
      } else if (!sameValue(ingredient, nextIngredients.get(id))) {
        const response = await this.api.patch('/insumos', ingredientPayload(companyId, nextIngredients.get(id)));
        responseData(response, 'Não foi possível atualizar o insumo.');
      }
    }
  }

  async syncAll(companyId, previous, next) {
    await this.syncCore(companyId, previous, next);
    const previousChannels = new Map(previous.salesChannels.map(channel => [channel.id, channel]));
    const nextChannels = new Map(next.salesChannels.map(channel => [channel.id, channel]));
    for (const channel of next.salesChannels) {
      const existing = previousChannels.get(channel.id);
      if (!existing) await createBackendSalesChannel(companyId, channel);
      else if (!sameValue(existing, channel)) await updateBackendSalesChannel(companyId, channel);
    }
    for (const [id] of previousChannels) {
      if (!nextChannels.has(id)) await deleteBackendSalesChannel(companyId, id);
    }
    await saveBackendFixedCosts(companyId, fromFixedCostsView(next.fixedCosts));
    const marginPercent = next.settings.defaultMarginBps / 100;
    if (marginPercent > 0 && marginPercent < 100) {
      await saveBackendSettings(companyId, {
        nomeNegocio: next.settings.businessName,
        logoNegocio: next.settings.logo,
        regiaoAtuacao: next.settings.region,
        custoHora: next.settings.laborHourCents / 100,
        margemLucro: marginPercent,
      });
    }
  }

  async exportWorkspace(ownerId) {
    return this.localRepository.exportWorkspace(ownerId);
  }

  async saveLogo(ownerId, dataUrl) {
    const workspace = await this.localRepository.loadWorkspace(ownerId);
    if (!workspace) throw new ReferenceError('Workspace não encontrado para atualização do logo.');
    const companyId = this.companyIds.get(ownerId) ?? await this.findCompanyId(ownerId);
    await saveBackendSettings(companyId, {
      nomeNegocio: workspace.settings.businessName,
      logoNegocio: dataUrl,
      regiaoAtuacao: workspace.settings.region,
      custoHora: workspace.settings.laborHourCents / 100,
      margemLucro: workspace.settings.defaultMarginBps / 100,
    });
    return this.localRepository.saveLogo(ownerId, dataUrl);
  }

  async deleteLogo(ownerId) {
    return this.saveLogo(ownerId, '');
  }
}
