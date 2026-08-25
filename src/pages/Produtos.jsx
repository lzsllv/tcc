import { useMemo, useState } from 'react';
import { Archive, MagnifyingGlass, Package, PencilSimple, Plus, Trash } from '@phosphor-icons/react';
import { Link, useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { useApp } from '../context/AppContext';
import { archiveOffer, deleteOffer } from '../application/offers.js';
import { priceOfferForChannel } from '../application/offerPricing.js';
import { selectSalesChannel } from '../application/salesChannels.js';
import { calculateOfferVariableCost } from '../domain/pricing/offers.js';
import { formatCents } from '../domain/pricing/money.js';
import '../styles/Pagina.css';
import '../styles/Produtos.css';

export default function Produtos() {
  const { workspace, workspaceStatus, workspaceError, atualizarWorkspace } = useApp();
  const location = useLocation();
  const [search, setSearch] = useState('');
  const [kind, setKind] = useState('all');
  const [category, setCategory] = useState('all');
  const [message, setMessage] = useState(location.state?.saved ? { type: 'success', text: 'Ficha técnica salva com sucesso.' } : null);

  const ingredientsById = useMemo(() => Object.fromEntries((workspace?.ingredients ?? []).map(item => [item.id, item])), [workspace]);
  const activeChannels = useMemo(() => (workspace?.salesChannels ?? []).filter(channel => channel.active), [workspace]);
  const selectedChannelId = activeChannels.some(channel => channel.id === workspace?.settings?.selectedSalesChannelId)
    ? workspace.settings.selectedSalesChannelId
    : activeChannels.find(channel => channel.isDefault)?.id ?? activeChannels[0]?.id;
  const categories = useMemo(() => [...new Set((workspace?.offers ?? []).map(offer => offer.category))].sort((a, b) => a.localeCompare(b, 'pt-BR')), [workspace]);
  const offers = useMemo(() => {
    const term = search.trim().toLocaleLowerCase('pt-BR');
    return (workspace?.offers ?? [])
      .filter(offer => kind === 'all' || offer.kind === kind)
      .filter(offer => category === 'all' || offer.category === category)
      .filter(offer => !term || offer.name.toLocaleLowerCase('pt-BR').includes(term) || offer.category.toLocaleLowerCase('pt-BR').includes(term))
      .sort((a, b) => Number(b.active) - Number(a.active) || a.name.localeCompare(b.name, 'pt-BR'));
  }, [workspace, kind, category, search]);

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

        <div className="card produtos-toolbar">
          <label className="produtos-busca"><MagnifyingGlass size={18} /><span className="sr-only">Buscar produto ou serviço</span><input value={search} onChange={event => setSearch(event.target.value)} placeholder="Buscar por nome ou categoria" /></label>
          <div className="produtos-tipos" role="group" aria-label="Filtrar por tipo">
            {[['all', 'Todos'], ['product', 'Produtos'], ['service', 'Serviços']].map(([value, label]) => <button key={value} type="button" className={kind === value ? 'ativo' : ''} onClick={() => setKind(value)}>{label}</button>)}
          </div>
          <select className="input-field produtos-categoria" aria-label="Filtrar por categoria" value={category} onChange={event => setCategory(event.target.value)}><option value="all">Todas as categorias</option>{categories.map(item => <option key={item} value={item}>{item}</option>)}</select>
          <span className="produtos-total">{offers.length} {offers.length === 1 ? 'oferta' : 'ofertas'}</span>
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
        ) : offers.length === 0 ? (
          <div className="card estado-vazio"><span><Package size={30} /></span><p>{workspace?.offers?.length ? 'Nenhuma oferta corresponde aos filtros.' : 'Nenhuma ficha técnica cadastrada ainda.'}</p>{!workspace?.offers?.length && <Link className="btn-primary btn-estado-vazio" to="/produtos/novo">Criar primeira ficha</Link>}</div>
        ) : (
          <div className="produtos-lista">{offers.map(offer => {
            const value = costs(offer);
            const channelPricing = pricing(offer);
            return <article key={offer.id} className={`card produto-card ${offer.active ? '' : 'produto-card-arquivado'}`}>
              <div className="produto-card-header">
                <div><div className="produto-identidade"><h2>{offer.name}</h2>{!offer.active && <span className="produto-status">Arquivado</span>}</div><div className="produto-badges"><span className="badge">{offer.kind === 'product' ? 'Produto' : 'Serviço'}</span><span>{offer.category}</span></div></div>
                {offer.active && <div className="acoes"><Link className="btn-editar" to={`/produtos/${offer.id}/editar`} aria-disabled={saving} onClick={event => saving && event.preventDefault()}><PencilSimple size={15} /> Editar</Link><button className="produto-arquivar" onClick={() => archive(offer)} title="Arquivar" disabled={saving}><Archive size={16} /></button><button className="btn-excluir" onClick={() => remove(offer)} title="Excluir" disabled={saving}><Trash size={15} /></button></div>}
              </div>
              <div className="produto-metricas"><div><span>Materiais do lote</span><strong>{value ? formatCents(value.materialCostCents) : 'Indisponível'}</strong></div><div><span>Mão de obra do lote</span><strong>{value ? formatCents(value.laborCostCents) : 'Indisponível'}</strong></div><div className="produto-custo-chave"><span>Custo por unidade</span><strong>{value ? formatCents(value.unitCostCents) : 'Indisponível'}</strong></div><div><span>Planejamento mensal</span><strong>{offer.expectedMonthlySales || 0} vendas</strong></div></div>
              {offer.active && channelPricing?.error && <div className="produto-precos-erro">Não foi possível calcular os preços: {channelPricing.error}</div>}
              {offer.active && channelPricing?.value && <div className="produto-precos">
                <div><span>Preço mínimo</span><strong>{formatCents(channelPricing.value.prices.minimumPriceCents)}</strong><small>Cobre o custo variável e as taxas da venda.</small></div>
                <div><span>Preço sustentável</span><strong>{channelPricing.value.prices.sustainablePriceCents === null ? 'Planejamento mensal necessário' : formatCents(channelPricing.value.prices.sustainablePriceCents)}</strong><small>Também cobre o rateio dos custos fixos.</small></div>
                <div className="produto-preco-recomendado"><span>Preço recomendado</span><strong>{channelPricing.value.prices.recommendedPriceCents === null ? 'Planejamento mensal necessário' : formatCents(channelPricing.value.prices.recommendedPriceCents)}</strong><small>Adiciona a margem líquida desejada.</small></div>
              </div>}
              <div className="produto-card-rodape"><span>{offer.components.length} {offer.components.length === 1 ? 'insumo' : 'insumos'}</span><span>{offer.batchTimeMinutes || 0} min por lote</span><span>Rendimento: {offer.batchYield}</span></div>
            </article>;
          })}</div>
        )}
      </main>
    </div>
  );
}