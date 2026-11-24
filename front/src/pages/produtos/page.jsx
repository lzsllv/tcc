import { useEffect, useMemo, useState } from 'react';
import { Archive, MagnifyingGlass, Package, PencilSimple, Plus, Trash, X } from '@phosphor-icons/react';
import { Link, useLocation } from 'react-router-dom';
import Navbar from '../../components/layout/Navbar';
import { useApp } from '../../context/AppContext.js';
import {
  archiveBackendProduct,
  deleteBackendProduct,
  fetchBackendProducts,
  updateBackendProduct,
} from '../../services/products.js';
import { archiveOffer, deleteOffer } from '../../features/offers/services/offers.js';
import { priceOfferForChannel } from '../../features/offers/services/offerPricing.js';
import { selectSalesChannel } from '../../features/sales-channels/services/salesChannels.js';
import { calculateOfferVariableCost } from '../../features/offers/domain/offers.js';
import { formatCents } from '../../features/pricing/domain/money.js';
import '../../styles/Pagina.css';
import '../../features/offers/styles/Produtos.css';

export default function Produtos() {
  const { workspace, workspaceStatus, workspaceError, atualizarWorkspace } = useApp();
  const location = useLocation();
  const [search, setSearch] = useState('');
  const [kind, setKind] = useState('all');
  const [category, setCategory] = useState('all');
  const [message, setMessage] = useState(location.state?.saved ? { type: 'success', text: 'Ficha técnica salva com sucesso.' } : null);
  const [backendProducts, setBackendProducts] = useState([]);
  const [backendProductsStatus, setBackendProductsStatus] = useState('loading');
  const [backendProductsError, setBackendProductsError] = useState('');
  const [backendRefresh, setBackendRefresh] = useState(0);
  const [editingBackendProduct, setEditingBackendProduct] = useState(null);
  const [backendProductForm, setBackendProductForm] = useState(null);
  const [backendProductImage, setBackendProductImage] = useState(null);
  const [savingBackendProduct, setSavingBackendProduct] = useState(false);
  const [backendProductActionId, setBackendProductActionId] = useState(null);

  useEffect(() => {
    const controller = new AbortController();

    fetchBackendProducts({ signal: controller.signal })
      .then(products => {
        setBackendProducts(products);
        setBackendProductsStatus('ready');
      })
      .catch(error => {
        if (controller.signal.aborted) return;
        setBackendProductsError(error.message || 'Não foi possível carregar os produtos do servidor.');
        setBackendProductsStatus('error');
      });

    return () => controller.abort();
  }, [backendRefresh]);

  function retryBackendProducts() {
    setBackendProductsStatus('loading');
    setBackendProductsError('');
    setBackendRefresh(current => current + 1);
  }

  function editBackendProduct(product) {
    setEditingBackendProduct(product);
    setBackendProductForm({
      nome: product.nome ?? '',
      descricao: product.descricao ?? '',
      tipo: product.tipo ?? '',
      custo_direto: product.custo_direto ?? '',
      tempo_producao: product.tempo_producao ?? '',
      preco_minimo: product.preco_minimo ?? '',
    });
    setBackendProductImage(null);
    setMessage(null);
  }

  function closeBackendProductEditor() {
    if (savingBackendProduct) return;
    setEditingBackendProduct(null);
    setBackendProductForm(null);
    setBackendProductImage(null);
  }

  async function saveBackendProduct(event) {
    event.preventDefault();
    if (!editingBackendProduct || !backendProductForm) return;
    setSavingBackendProduct(true);
    setMessage(null);
    try {
      await updateBackendProduct({
        ...editingBackendProduct,
        ...backendProductForm,
        custo_direto: Number(backendProductForm.custo_direto),
        tempo_producao: Number(backendProductForm.tempo_producao),
        preco_minimo: backendProductForm.preco_minimo === '' ? null : Number(backendProductForm.preco_minimo),
      }, backendProductImage);
      setEditingBackendProduct(null);
      setBackendProductForm(null);
      setBackendProductImage(null);
      setMessage({ type: 'success', text: 'Produto do servidor atualizado com sucesso.' });
      retryBackendProducts();
    } catch (error) {
      setMessage({ type: 'error', text: error.message || 'Não foi possível atualizar o produto.' });
    } finally {
      setSavingBackendProduct(false);
    }
  }

  function chooseBackendProductImage(file) {
    if (!file) return;
    if (!['image/png', 'image/jpeg', 'image/webp'].includes(file.type)) {
      setMessage({ type: 'error', text: 'Escolha uma imagem PNG, JPEG ou WebP.' });
      return;
    }
    if (file.size > 400 * 1024) {
      setMessage({ type: 'error', text: 'A imagem deve ter no máximo 400 KB.' });
      return;
    }
    setBackendProductImage(file);
  }

  async function archiveServerProduct(product) {
    if (!window.confirm(`Arquivar “${product.nome}”?`)) return;
    setBackendProductActionId(product.id_produto);
    setMessage(null);
    try {
      await archiveBackendProduct(product.id_produto);
      setMessage({ type: 'success', text: 'Produto arquivado. O histórico foi preservado.' });
      retryBackendProducts();
    } catch (error) {
      setMessage({ type: 'error', text: error.message || 'Não foi possível arquivar o produto.' });
    } finally {
      setBackendProductActionId(null);
    }
  }

  async function removeServerProduct(product) {
    if (!window.confirm(`Excluir “${product.nome}” definitivamente?`)) return;
    setBackendProductActionId(product.id_produto);
    setMessage(null);
    try {
      await deleteBackendProduct(product.id_produto);
      if (editingBackendProduct?.id_produto === product.id_produto) closeBackendProductEditor();
      setMessage({ type: 'success', text: 'Produto excluído do servidor.' });
      retryBackendProducts();
    } catch (error) {
      setMessage({ type: 'error', text: error.message || 'Não foi possível excluir o produto.' });
    } finally {
      setBackendProductActionId(null);
    }
  }

  const ingredientsById = useMemo(() => Object.fromEntries((workspace?.ingredients ?? []).map(item => [item.id, item])), [workspace]);
  const activeChannels = useMemo(() => (workspace?.salesChannels ?? []).filter(channel => channel.active), [workspace]);
  const selectedChannelId = activeChannels.some(channel => channel.id === workspace?.settings?.selectedSalesChannelId)
    ? workspace.settings.selectedSalesChannelId
    : activeChannels.find(channel => channel.isDefault)?.id ?? activeChannels[0]?.id;
  const categories = useMemo(() => [...new Set([
    ...(workspace?.offers ?? []).map(offer => offer.category),
    ...backendProducts.map(product => product.tipo).filter(Boolean),
  ])].sort((a, b) => a.localeCompare(b, 'pt-BR')), [workspace, backendProducts]);
  const offers = useMemo(() => {
    const term = search.trim().toLocaleLowerCase('pt-BR');
    return (workspace?.offers ?? [])
      .filter(offer => kind === 'all' || offer.kind === kind)
      .filter(offer => category === 'all' || offer.category === category)
      .filter(offer => !term || offer.name.toLocaleLowerCase('pt-BR').includes(term) || offer.category.toLocaleLowerCase('pt-BR').includes(term))
      .sort((a, b) => Number(b.active) - Number(a.active) || a.name.localeCompare(b.name, 'pt-BR'));
  }, [workspace, kind, category, search]);
  const filteredBackendProducts = useMemo(() => {
    const term = search.trim().toLocaleLowerCase('pt-BR');
    if (kind === 'service') return [];
    return backendProducts.filter(product => {
      const matchesCategory = category === 'all' || product.tipo === category;
      const searchableText = [product.nome, product.tipo, product.descricao]
        .filter(Boolean)
        .join(' ')
        .toLocaleLowerCase('pt-BR');
      return matchesCategory && (!term || searchableText.includes(term));
    });
  }, [backendProducts, category, kind, search]);
  const visibleItems = useMemo(() => [
    ...offers.map(offer => ({ source: 'workspace', item: offer, name: offer.name, active: offer.active })),
    ...filteredBackendProducts.map(product => ({
      source: 'backend',
      item: product,
      name: product.nome,
      active: Number(product.ativo ?? 1) !== 0,
    })),
  ].sort((a, b) => Number(b.active) - Number(a.active) || a.name.localeCompare(b.name, 'pt-BR')), [offers, filteredBackendProducts]);

  function costs(offer) {
    try { return calculateOfferVariableCost(offer, ingredientsById, workspace.settings.laborHourCents); }
    catch { return null; }
  }

  function pricing(offer) {
    if (!offer.active || !selectedChannelId) return null;
    try { return { value: priceOfferForChannel(workspace, offer.id, selectedChannelId), error: null }; }
    catch (error) { return { value: null, error: error.message }; }
  }

  async function changeChannel(event) {
    setMessage(null);
    try { await atualizarWorkspace(current => selectSalesChannel(current, event.target.value)); }
    catch (error) { setMessage({ type: 'error', text: error.message }); }
  }

  async function archive(item) {
    if (!window.confirm(`Arquivar “${item.name}”?`)) return;
    try {
      await atualizarWorkspace(current => archiveOffer(current, item.id));
      setMessage({ type: 'success', text: 'Oferta arquivada. A ficha técnica foi preservada.' });
    } catch (error) { setMessage({ type: 'error', text: error.message }); }
  }

  async function remove(item) {
    if (!window.confirm(`Excluir “${item.name}” definitivamente?`)) return;
    try {
      await atualizarWorkspace(current => deleteOffer(current, item.id));
      setMessage({ type: 'success', text: 'Oferta excluída.' });
    } catch (error) { setMessage({ type: 'error', text: error.message }); }
  }

  const loading = workspaceStatus === 'loading' || workspaceStatus === 'idle';
  const saving = workspaceStatus === 'saving';
  const formatCurrency = value => {
    const amount = Number(value);
    return Number.isFinite(amount)
      ? amount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
      : 'Não informado';
  };
  return (
    <div>
      <Navbar />
      <main className="pagina-container">
        <div className="pagina-cabecalho">
          <div><h1 className="pagina-titulo">Produtos e serviços</h1><p className="pagina-subtitulo">Monte fichas técnicas e acompanhe o custo real de cada oferta.</p></div>
          <Link className="btn-primary produtos-novo" to="/produtos/novo"><Plus size={17} /> Nova ficha técnica</Link>
        </div>

        {workspaceError && <div className="alerta-erro">Não foi possível acessar seus dados: {workspaceError}</div>}
        {message && <div role="status" className={message.type === 'error' ? 'alerta-erro' : 'alerta-sucesso'}>{message.text}</div>}
        {editingBackendProduct && backendProductForm && (
          <section className="card produto-editor-servidor" aria-labelledby="produto-editor-titulo">
            <div className="produto-editor-cabecalho">
              <div><h2 id="produto-editor-titulo" className="secao-titulo">Editar produto do servidor</h2><p>As alterações serão salvas no cadastro do servidor.</p></div>
              <button type="button" className="produto-editor-fechar" aria-label="Fechar edição" onClick={closeBackendProductEditor} disabled={savingBackendProduct}><X size={20} /></button>
            </div>
            <form className="produto-editor-form" onSubmit={saveBackendProduct}>
              <label className="campo-grupo"><span className="input-label">Nome</span><input className="input-field" value={backendProductForm.nome} onChange={event => setBackendProductForm(current => ({ ...current, nome: event.target.value }))} maxLength={120} required /></label>
              <label className="campo-grupo"><span className="input-label">Categoria</span><input className="input-field" value={backendProductForm.tipo} onChange={event => setBackendProductForm(current => ({ ...current, tipo: event.target.value }))} maxLength={50} required /></label>
              <label className="campo-grupo produto-editor-descricao"><span className="input-label">Descrição</span><textarea className="input-field" value={backendProductForm.descricao} onChange={event => setBackendProductForm(current => ({ ...current, descricao: event.target.value }))} maxLength={255} /></label>
              <label className="campo-grupo"><span className="input-label">Custo direto (R$)</span><input className="input-field" type="number" min="0" step="0.01" value={backendProductForm.custo_direto} onChange={event => setBackendProductForm(current => ({ ...current, custo_direto: event.target.value }))} required /></label>
              <label className="campo-grupo"><span className="input-label">Tempo de produção</span><input className="input-field" type="number" min="0" step="0.01" value={backendProductForm.tempo_producao} onChange={event => setBackendProductForm(current => ({ ...current, tempo_producao: event.target.value }))} required /></label>
              <label className="campo-grupo"><span className="input-label">Preço mínimo (R$)</span><input className="input-field" type="number" min="0" step="0.01" value={backendProductForm.preco_minimo} onChange={event => setBackendProductForm(current => ({ ...current, preco_minimo: event.target.value }))} /></label>
              <label className="campo-grupo produto-editor-imagem"><span className="input-label">Foto do produto</span><input className="input-field" type="file" accept="image/png,image/jpeg,image/webp" onChange={event => chooseBackendProductImage(event.target.files?.[0])} />{backendProductImage && <span>{backendProductImage.name}</span>}{!backendProductImage && <small>Deixe vazio para manter a foto atual. PNG, JPEG ou WebP até 400 KB.</small>}</label>
              <div className="produto-editor-acoes">
                <button type="button" className="btn-secondary" onClick={closeBackendProductEditor} disabled={savingBackendProduct}>Cancelar</button>
                <button type="submit" className="btn-primary" disabled={savingBackendProduct}>{savingBackendProduct ? 'Salvando...' : 'Salvar alterações'}</button>
              </div>
            </form>
          </section>
        )}

        <div className="card produtos-toolbar">
          <label className="produtos-busca"><MagnifyingGlass size={18} /><span className="sr-only">Buscar produto ou serviço</span><input value={search} onChange={event => setSearch(event.target.value)} placeholder="Buscar por nome ou categoria" /></label>
          <div className="produtos-tipos" role="group" aria-label="Filtrar por tipo">
            {[['all', 'Todos'], ['product', 'Produtos'], ['service', 'Serviços']].map(([value, label]) => <button key={value} type="button" className={kind === value ? 'ativo' : ''} onClick={() => setKind(value)}>{label}</button>)}
          </div>
          <select className="input-field produtos-categoria" aria-label="Filtrar por categoria" value={category} onChange={event => setCategory(event.target.value)}><option value="all">Todas as categorias</option>{categories.map(item => <option key={item} value={item}>{item}</option>)}</select>
          <span className="produtos-total">{visibleItems.length} {visibleItems.length === 1 ? 'item' : 'itens'}</span>
        </div>

        <div className="card produtos-canal">
          <div><label htmlFor="sales-channel">Canal usado na precificação</label><p>A troca recalcula os preços sem alterar as fichas técnicas.</p></div>
          <select id="sales-channel" className="input-field" value={selectedChannelId ?? ''} onChange={changeChannel} disabled={saving || activeChannels.length === 0}>
            {activeChannels.length === 0 ? <option value="">Nenhum canal ativo</option> : activeChannels.map(channel => <option key={channel.id} value={channel.id}>{channel.name}{channel.isDefault ? ' — padrão' : ''}</option>)}
          </select>
          <Link to="/canais-venda" className="btn-secondary">Configurar canais</Link>
        </div>

        {loading ? (
          <div className="card estado-vazio"><span><Package size={30} /></span><p>Carregando produtos e serviços...</p></div>
        ) : (
          <section aria-label="Produtos e serviços cadastrados">
            {backendProductsStatus === 'loading' && <div className="card estado-vazio"><p>Carregando produtos do servidor...</p></div>}
            {backendProductsStatus === 'error' && <div className="alerta-erro" role="alert">Não foi possível carregar os produtos do backend: {backendProductsError} <button className="btn-secondary" type="button" onClick={retryBackendProducts}>Tentar novamente</button></div>}
            {visibleItems.length === 0 && backendProductsStatus !== 'loading' ? (
              <div className="card estado-vazio"><span><Package size={30} /></span><p>{workspace?.offers?.length || backendProducts.length ? 'Nenhum produto corresponde aos filtros.' : 'Nenhum produto ou ficha técnica cadastrado ainda.'}</p>{!workspace?.offers?.length && !backendProducts.length && <Link className="btn-primary btn-estado-vazio" to="/produtos/novo">Criar primeira ficha</Link>}</div>
            ) : (
              <div className="produtos-lista">{visibleItems.map(({ source, item, active }) => {
                if (source === 'backend') {
                  return <article key={`backend-${item.id_produto}`} className={`card produto-card ${active ? '' : 'produto-card-arquivado'}`}>
                    <div className="produto-card-header">
                      <div>
                        <div className="produto-identidade produto-backend-identidade">
                          {item.imagem && <img src={item.imagem} alt="" loading="lazy" />}
                          <h2>{item.nome}</h2>
                          {!active && <span className="produto-status">Arquivado</span>}
                        </div>
                        <div className="produto-badges"><span className="badge">Produto</span><span>{item.tipo || 'Sem categoria'}</span><span>Cadastrado no servidor</span></div>
                      </div>
                      {active && <div className="acoes">
                        <button className="btn-editar" type="button" aria-label={`Editar ${item.nome}`} onClick={() => editBackendProduct(item)} disabled={savingBackendProduct || backendProductActionId !== null}><PencilSimple size={15} /> Editar</button>
                        <button className="produto-arquivar" type="button" aria-label={`Arquivar ${item.nome}`} title="Arquivar" onClick={() => archiveServerProduct(item)} disabled={backendProductActionId !== null || savingBackendProduct}><Archive size={16} /></button>
                        <button className="btn-excluir" type="button" aria-label={`Excluir ${item.nome}`} title="Excluir" onClick={() => removeServerProduct(item)} disabled={backendProductActionId !== null || savingBackendProduct}><Trash size={15} /></button>
                      </div>}
                    </div>
                    <div className="produto-metricas">
                      <div><span>Custo direto</span><strong>{formatCurrency(item.custo_direto)}</strong></div>
                      <div><span>Tempo de produção</span><strong>{item.tempo_producao ?? '—'}</strong></div>
                      <div className="produto-custo-chave"><span>Preço mínimo</span><strong>{item.preco_minimo == null ? 'Não definido' : formatCurrency(item.preco_minimo)}</strong></div>
                      <div><span>Origem</span><strong>Servidor</strong></div>
                    </div>
                    {item.descricao && <div className="produto-card-rodape">{item.descricao}</div>}
                  </article>;
                }

                const offer = item;
                const value = costs(offer);
                const channelPricing = pricing(offer);
                return <article key={`workspace-${offer.id}`} className={`card produto-card ${offer.active ? '' : 'produto-card-arquivado'}`}>
                  <div className="produto-card-header">
                    <div><div className="produto-identidade">{offer.image && <img src={offer.image} alt={`Foto de ${offer.name}`} loading="lazy" />}<h2>{offer.name}</h2>{!offer.active && <span className="produto-status">Arquivado</span>}</div><div className="produto-badges"><span className="badge">{offer.kind === 'product' ? 'Produto' : 'Serviço'}</span><span>{offer.category}</span><span>Ficha técnica</span></div></div>
                    {offer.active && <div className="acoes"><Link className="btn-editar" to={`/produtos/${offer.id}/editar`} aria-disabled={saving} onClick={event => saving && event.preventDefault()}><PencilSimple size={15} /> Editar</Link><button className="produto-arquivar" onClick={() => archive(offer)} title="Arquivar" disabled={saving}><Archive size={16} /></button><button className="btn-excluir" onClick={() => remove(offer)} title="Excluir" disabled={saving}><Trash size={15} /></button></div>}
                  </div>
                  <div className="produto-metricas"><div><span>Materiais do lote</span><strong>{value ? formatCents(value.materialCostCents) : 'Indisponível'}</strong></div><div><span>Mão de obra do lote</span><strong>{value ? formatCents(value.laborCostCents) : 'Indisponível'}</strong></div><div className="produto-custo-chave"><span>Custo por unidade</span><strong>{value ? formatCents(value.unitCostCents) : 'Indisponível'}</strong></div><div><span>Planejamento mensal</span><strong>{offer.expectedMonthlySales || 0} vendas</strong></div></div>
                  {offer.active && channelPricing?.error && <div className="produto-precos-erro">Não foi possível calcular os preços: {channelPricing.error}</div>}
                  {offer.active && channelPricing?.value?.pricingError && <div className="produto-precos-erro">Preço recomendado indisponível: {channelPricing.value.pricingError}</div>}
                  {offer.active && channelPricing?.value && <div className="produto-precos">
                    <div><span>Preço mínimo</span><strong>{formatCents(channelPricing.value.prices.minimumPriceCents)}</strong><small>Cobre o custo variável e as taxas da venda.</small></div>
                    <div><span>Preço sustentável</span><strong>{channelPricing.value.prices.sustainablePriceCents === null ? 'Planejamento mensal necessário' : formatCents(channelPricing.value.prices.sustainablePriceCents)}</strong><small>{channelPricing.value.fixedAllocationCents === null ? 'Também cobre o rateio dos custos fixos.' : `Inclui ${formatCents(channelPricing.value.fixedAllocationCents)} de custos fixos por unidade, antes das taxas.`}</small></div>
                    <div className="produto-preco-recomendado"><span>Preço recomendado</span><strong>{channelPricing.value.prices.recommendedPriceCents === null ? 'Planejamento mensal necessário' : formatCents(channelPricing.value.prices.recommendedPriceCents)}</strong><small>Adiciona a margem líquida desejada.</small></div>
                  </div>}
                  <div className="produto-card-rodape"><span>{offer.components.length} {offer.components.length === 1 ? 'insumo' : 'insumos'}</span><span>{offer.batchTimeMinutes || 0} min por lote</span><span>Rendimento: {offer.batchYield}</span></div>
                </article>;
              })}</div>
            )}
          </section>
        )}
      </main>
    </div>
  );
}
