import { useMemo, useState } from 'react';
import { Archive, MagnifyingGlass, Package, PencilSimple, Plus, Trash } from '@phosphor-icons/react';
import { Link, useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { useApp } from '../context/AppContext';
import { archiveOffer, deleteOffer } from '../application/offers.js';
import { calculateOfferVariableCost } from '../domain/pricing/offers.js';
import { formatCents } from '../domain/pricing/money.js';
import '../styles/Pagina.css';
import '../styles/Produtos.css';

export default function Produtos() {
  const { workspace, workspaceStatus, workspaceError, atualizarWorkspace } = useApp();
  const location = useLocation();
  const [search, setSearch] = useState('');
  const [kind, setKind] = useState('all');
  const [message, setMessage] = useState(location.state?.saved ? 'Ficha técnica salva com sucesso.' : '');

  const ingredientsById = useMemo(() => Object.fromEntries((workspace?.ingredients ?? []).map(item => [item.id, item])), [workspace]);
  const offers = useMemo(() => {
    const term = search.trim().toLocaleLowerCase('pt-BR');
    return (workspace?.offers ?? [])
      .filter(offer => kind === 'all' || offer.kind === kind)
      .filter(offer => !term || offer.name.toLocaleLowerCase('pt-BR').includes(term) || offer.category.toLocaleLowerCase('pt-BR').includes(term))
      .sort((a, b) => Number(b.active) - Number(a.active) || a.name.localeCompare(b.name, 'pt-BR'));
  }, [workspace, kind, search]);

  function costs(offer) {
    try { return calculateOfferVariableCost(offer, ingredientsById, workspace.settings.laborHourCents); }
    catch { return null; }
  }

  async function archive(item) {
    if (!window.confirm(`Arquivar “${item.name}”?`)) return;
    try {
      await atualizarWorkspace(current => archiveOffer(current, item.id));
      setMessage('Oferta arquivada. A ficha técnica foi preservada.');
    } catch (error) { setMessage(error.message); }
  }

  async function remove(item) {
    if (!window.confirm(`Excluir “${item.name}” definitivamente?`)) return;
    try {
      await atualizarWorkspace(current => deleteOffer(current, item.id));
      setMessage('Oferta excluída.');
    } catch (error) { setMessage(error.message); }
  }

  const loading = workspaceStatus === 'loading' || workspaceStatus === 'idle';
  return (
    <div>
      <Navbar />
      <main className="pagina-container">
        <div className="pagina-cabecalho">
          <div><h1 className="pagina-titulo">Produtos e serviços</h1><p className="pagina-subtitulo">Monte fichas técnicas e acompanhe o custo real de cada oferta.</p></div>
          <Link className="btn-primary produtos-novo" to="/produtos/novo"><Plus size={17} /> Nova ficha técnica</Link>
        </div>

        {workspaceError && <div className="alerta-erro">Não foi possível acessar seus dados: {workspaceError}</div>}
        {message && <div className="alerta-sucesso">{message}</div>}

        <div className="card produtos-toolbar">
          <label className="produtos-busca"><MagnifyingGlass size={18} /><span className="sr-only">Buscar produto ou serviço</span><input value={search} onChange={event => setSearch(event.target.value)} placeholder="Buscar por nome ou categoria" /></label>
          <div className="produtos-tipos" role="group" aria-label="Filtrar por tipo">
            {[['all', 'Todos'], ['product', 'Produtos'], ['service', 'Serviços']].map(([value, label]) => <button key={value} type="button" className={kind === value ? 'ativo' : ''} onClick={() => setKind(value)}>{label}</button>)}
          </div>
          <span className="produtos-total">{offers.length} {offers.length === 1 ? 'oferta' : 'ofertas'}</span>
        </div>

        {loading ? (
          <div className="card estado-vazio"><span><Package size={30} /></span><p>Carregando produtos e serviços...</p></div>
        ) : offers.length === 0 ? (
          <div className="card estado-vazio"><span><Package size={30} /></span><p>{workspace?.offers?.length ? 'Nenhuma oferta corresponde aos filtros.' : 'Nenhuma ficha técnica cadastrada ainda.'}</p>{!workspace?.offers?.length && <Link className="btn-primary btn-estado-vazio" to="/produtos/novo">Criar primeira ficha</Link>}</div>
        ) : (
          <div className="produtos-lista">{offers.map(offer => {
            const value = costs(offer);
            return <article key={offer.id} className={`card produto-card ${offer.active ? '' : 'produto-card-arquivado'}`}>
              <div className="produto-card-header">
                <div><div className="produto-identidade"><h2>{offer.name}</h2>{!offer.active && <span className="produto-status">Arquivado</span>}</div><div className="produto-badges"><span className="badge">{offer.kind === 'product' ? 'Produto' : 'Serviço'}</span><span>{offer.category}</span></div></div>
                {offer.active && <div className="acoes"><Link className="btn-editar" to={`/produtos/${offer.id}/editar`}><PencilSimple size={15} /> Editar</Link><button className="produto-arquivar" onClick={() => archive(offer)} title="Arquivar"><Archive size={16} /></button><button className="btn-excluir" onClick={() => remove(offer)} title="Excluir"><Trash size={15} /></button></div>}
              </div>
              <div className="produto-metricas"><div><span>Materiais do lote</span><strong>{value ? formatCents(value.materialCostCents) : 'Indisponível'}</strong></div><div><span>Mão de obra do lote</span><strong>{value ? formatCents(value.laborCostCents) : 'Indisponível'}</strong></div><div className="produto-custo-chave"><span>Custo por unidade</span><strong>{value ? formatCents(value.unitCostCents) : 'Indisponível'}</strong></div><div><span>Planejamento mensal</span><strong>{offer.expectedMonthlySales || 0} vendas</strong></div></div>
              <div className="produto-card-rodape"><span>{offer.components.length} {offer.components.length === 1 ? 'insumo' : 'insumos'}</span><span>{offer.batchTimeMinutes || 0} min por lote</span><span>Rendimento: {offer.batchYield}</span></div>
            </article>;
          })}</div>
        )}
      </main>
    </div>
  );
}