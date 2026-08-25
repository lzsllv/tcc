import { useMemo, useState } from 'react';
import { ArrowLeft, Plus, Trash } from '@phosphor-icons/react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { useApp } from '../context/AppContext';
import { createOffer, updateOffer } from '../application/offers.js';
import { calculateOfferVariableCost } from '../domain/pricing/offers.js';
import { calculateIngredientCost } from '../domain/pricing/ingredients.js';
import { formatCents, percentToBps } from '../domain/pricing/money.js';
import { getUnitFamily } from '../domain/pricing/units.js';
import '../styles/Pagina.css';
import '../styles/FichaTecnica.css';

const UNITS_BY_FAMILY = {
  mass: [['mg', 'mg'], ['g', 'g'], ['kg', 'kg']],
  volume: [['ml', 'ml'], ['l', 'L']],
  count: [['un', 'unidade']],
  time: [['min', 'minuto'], ['h', 'hora']],
};

const EMPTY_FORM = {
  kind: 'product', name: '', category: '', batchYield: '1', batchTimeMinutes: '',
  expectedMonthlySales: '', desiredMargin: '', components: [],
};

function offerToForm(offer) {
  return {
    kind: offer.kind,
    name: offer.name,
    category: offer.category,
    batchYield: String(offer.batchYield),
    batchTimeMinutes: String(offer.batchTimeMinutes),
    expectedMonthlySales: String(offer.expectedMonthlySales),
    desiredMargin: offer.desiredMarginBps === null ? '' : String(offer.desiredMarginBps / 100).replace('.', ','),
    components: offer.components.map(component => ({ ...component, quantity: String(component.quantity), waste: String(component.wasteBps / 100).replace('.', ',') })),
  };
}

function numberFromInput(value) {
  return Number(String(value).replace(',', '.'));
}

export default function FichaTecnica() {
  const { id } = useParams();
  const app = useApp();
  const loading = app.workspaceStatus === 'loading' || app.workspaceStatus === 'idle';
  const existing = app.workspace?.offers?.find(offer => offer.id === id);

  if (loading) {
    return <div><Navbar /><main className="pagina-container"><div className="card estado-vazio"><p>Carregando ficha técnica...</p></div></main></div>;
  }
  if (id && !existing) {
    return <div><Navbar /><main className="pagina-container"><div className="card estado-vazio"><p>Ficha técnica não encontrada.</p><Link className="btn-primary btn-estado-vazio" to="/produtos">Voltar aos produtos</Link></div></main></div>;
  }
  const editorKey = id ? `${id}:${existing.updatedAt}` : 'new';
  return <FichaTecnicaEditor key={editorKey} editingId={id} existing={existing} app={app} />;
}

function FichaTecnicaEditor({ editingId: id, existing, app }) {
  const navigate = useNavigate();
  const { workspace, workspaceStatus, workspaceError, atualizarWorkspace } = app;
  const [form, setForm] = useState(() => existing ? offerToForm(existing) : EMPTY_FORM);
  const [message, setMessage] = useState('');

  const ingredientsById = useMemo(() => Object.fromEntries((workspace?.ingredients ?? []).map(item => [item.id, item])), [workspace]);
  const selectableIngredients = useMemo(() => {
    const selected = new Set(form.components.map(component => component.ingredientId));
    return (workspace?.ingredients ?? []).filter(item => item.active || selected.has(item.id));
  }, [workspace, form.components]);

  const preview = useMemo(() => {
    if (!workspace) return null;
    try {
      const offer = {
        batchYield: form.kind === 'service' ? 1 : numberFromInput(form.batchYield),
        batchTimeMinutes: numberFromInput(form.batchTimeMinutes || 0),
        components: form.components
          .filter(component => component.ingredientId && numberFromInput(component.quantity) > 0)
          .map(component => ({
            ingredientId: component.ingredientId,
            quantity: numberFromInput(component.quantity),
            unit: component.unit,
            wasteBps: percentToBps(component.waste || 0),
          })),
      };
      return calculateOfferVariableCost(offer, ingredientsById, workspace.settings.laborHourCents);
    } catch {
      return null;
    }
  }, [form, ingredientsById, workspace]);

  function change(field, value) {
    setForm(current => ({ ...current, [field]: value }));
  }

  function changeKind(kind) {
    setForm(current => ({ ...current, kind, batchYield: kind === 'service' ? '1' : current.batchYield }));
  }

  function addComponent() {
    const ingredient = selectableIngredients.find(item => item.active && !form.components.some(component => component.ingredientId === item.id));
    if (!ingredient) {
      setMessage('Cadastre ou disponibilize outro insumo antes de adicionar um item.');
      return;
    }
    setMessage('');
    setForm(current => ({
      ...current,
      components: [...current.components, {
        localId: crypto.randomUUID(), ingredientId: ingredient.id,
        quantity: '', unit: ingredient.purchaseUnit, waste: '0',
      }],
    }));
  }

  function updateComponent(index, field, value) {
    setForm(current => ({
      ...current,
      components: current.components.map((component, position) => {
        if (position !== index) return component;
        if (field === 'ingredientId') {
          const ingredient = ingredientsById[value];
          return { ...component, ingredientId: value, unit: ingredient.purchaseUnit };
        }
        return { ...component, [field]: value };
      }),
    }));
  }

  function removeComponent(index) {
    setForm(current => ({ ...current, components: current.components.filter((_, position) => position !== index) }));
  }

  async function submit(event) {
    event.preventDefault();
    setMessage('');
    try {
      const payload = {
        kind: form.kind,
        name: form.name,
        category: form.category,
        batchYield: form.kind === 'service' ? 1 : numberFromInput(form.batchYield),
        batchTimeMinutes: numberFromInput(form.batchTimeMinutes || 0),
        expectedMonthlySales: numberFromInput(form.expectedMonthlySales || 0),
        desiredMarginBps: form.desiredMargin === '' ? null : percentToBps(form.desiredMargin),
        components: form.components.map(component => ({
          id: component.id,
          ingredientId: component.ingredientId,
          quantity: numberFromInput(component.quantity),
          unit: component.unit,
          wasteBps: percentToBps(component.waste || 0),
        })),
      };
      await atualizarWorkspace(current => id ? updateOffer(current, id, payload) : createOffer(current, payload));
      navigate('/produtos', { replace: true, state: { saved: true } });
    } catch (error) {
      setMessage(error.message);
    }
  }

  const saving = workspaceStatus === 'saving';


  return (
    <div>
      <Navbar />
      <main className="pagina-container ficha-container">
        <div className="pagina-cabecalho ficha-cabecalho">
          <div>
            <Link to="/produtos" className="ficha-voltar"><ArrowLeft size={16} /> Produtos e serviços</Link>
            <h1 className="pagina-titulo">{id ? 'Editar ficha técnica' : 'Nova ficha técnica'}</h1>
            <p className="pagina-subtitulo">Monte a composição e acompanhe o custo por unidade em tempo real.</p>
          </div>
        </div>

        {workspaceError && <div className="alerta-erro">Não foi possível acessar seus dados: {workspaceError}</div>}
        {message && <div className="alerta-erro">{message}</div>}

        <form onSubmit={submit} className="ficha-layout">
            <div className="ficha-secoes">
              <section className="card ficha-secao">
                <div className="ficha-secao-cabecalho"><span>01</span><div><h2>Identificação</h2><p>Defina o que será vendido.</p></div></div>
                <div className="ficha-tipo" role="group" aria-label="Tipo da oferta">
                  <button type="button" className={form.kind === 'product' ? 'ativo' : ''} onClick={() => changeKind('product')}>Produto</button>
                  <button type="button" className={form.kind === 'service' ? 'ativo' : ''} onClick={() => changeKind('service')}>Serviço</button>
                </div>
                <div className="form-grid">
                  <div className="campo-grupo"><label className="input-label" htmlFor="offer-name">Nome</label><input id="offer-name" className="input-field" value={form.name} onChange={event => change('name', event.target.value)} placeholder={form.kind === 'product' ? 'Ex: Bolo de chocolate' : 'Ex: Consultoria personalizada'} required /></div>
                  <div className="campo-grupo"><label className="input-label" htmlFor="offer-category">Categoria</label><input id="offer-category" className="input-field" value={form.category} onChange={event => change('category', event.target.value)} placeholder="Ex: Bolos, Artesanato, Consultoria" required /></div>
                </div>
              </section>

              <section className="card ficha-secao">
                <div className="ficha-secao-cabecalho"><span>02</span><div><h2>Composição</h2><p>{form.kind === 'product' ? 'Adicione os insumos usados no lote.' : 'Insumos são opcionais para serviços.'}</p></div></div>
                {form.components.length === 0 ? <div className="ficha-componentes-vazio">Nenhum insumo adicionado.</div> : (
                  <div className="ficha-componentes">
                    {form.components.map((component, index) => {
                      const ingredient = ingredientsById[component.ingredientId];
                      const family = ingredient ? getUnitFamily(ingredient.purchaseUnit) : 'count';
                      let cost = null;
                      try { cost = calculateIngredientCost(ingredient, numberFromInput(component.quantity), component.unit, percentToBps(component.waste || 0)); } catch { /* aguarda dados válidos */ }
                      const fieldId = component.id ?? component.localId ?? index;
                      return <div className="ficha-componente" key={fieldId}>
                        <div className="campo-grupo"><label className="input-label" htmlFor={`component-ingredient-${fieldId}`}>Insumo</label><select id={`component-ingredient-${fieldId}`} className="input-field" value={component.ingredientId} onChange={event => updateComponent(index, 'ingredientId', event.target.value)}>{selectableIngredients.filter(item => item.id === component.ingredientId || !form.components.some(current => current.ingredientId === item.id)).map(item => <option key={item.id} value={item.id}>{item.name}{item.active ? '' : ' (arquivado)'}</option>)}</select></div>
                        <div className="campo-grupo"><label className="input-label" htmlFor={`component-quantity-${fieldId}`}>Quantidade</label><input id={`component-quantity-${fieldId}`} className="input-field" type="number" min="0.001" step="any" value={component.quantity} onChange={event => updateComponent(index, 'quantity', event.target.value)} required /></div>
                        <div className="campo-grupo"><label className="input-label" htmlFor={`component-unit-${fieldId}`}>Unidade</label><select id={`component-unit-${fieldId}`} className="input-field" value={component.unit} onChange={event => updateComponent(index, 'unit', event.target.value)}>{UNITS_BY_FAMILY[family].map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></div>
                        <div className="campo-grupo"><label className="input-label" htmlFor={`component-waste-${fieldId}`}>Perda (%)</label><input id={`component-waste-${fieldId}`} className="input-field" type="number" min="0" max="100" step="0.01" value={component.waste} onChange={event => updateComponent(index, 'waste', event.target.value)} /></div>
                        <div className="ficha-componente-custo"><span>Custo</span><strong>{cost === null ? '—' : formatCents(cost)}</strong></div>
                        <button type="button" className="btn-excluir ficha-remover" onClick={() => removeComponent(index)} aria-label={`Remover ${ingredient?.name ?? 'insumo'}`}><Trash size={16} /></button>
                      </div>;
                    })}
                  </div>
                )}
                <button type="button" className="ficha-adicionar" onClick={addComponent} disabled={!selectableIngredients.some(item => item.active && !form.components.some(component => component.ingredientId === item.id))}><Plus size={17} /> Adicionar insumo</button>
                {!workspace?.ingredients?.some(item => item.active) && <p className="input-hint">Cadastre um insumo ativo na área de Insumos para montar a composição.</p>}
              </section>

              <section className="card ficha-secao">
                <div className="ficha-secao-cabecalho"><span>03</span><div><h2>Produção e margem</h2><p>Informe o rendimento e o tempo dedicado ao lote.</p></div></div>
                <div className="form-grid">
                  {form.kind === 'product' && <div className="campo-grupo"><label className="input-label" htmlFor="batch-yield">Rendimento do lote</label><input id="batch-yield" className="input-field" type="number" min="0.001" step="any" value={form.batchYield} onChange={event => change('batchYield', event.target.value)} required /><small className="input-hint">Quantidade de unidades produzidas por lote.</small></div>}
                  <div className="campo-grupo"><label className="input-label" htmlFor="batch-time">Tempo do lote (minutos)</label><input id="batch-time" className="input-field" type="number" min="0" step="1" value={form.batchTimeMinutes} onChange={event => change('batchTimeMinutes', event.target.value)} placeholder="Ex: 90" /></div>
                  <div className="campo-grupo"><label className="input-label" htmlFor="monthly-sales">Vendas planejadas por mês</label><input id="monthly-sales" className="input-field" type="number" min="0" step="any" value={form.expectedMonthlySales} onChange={event => change('expectedMonthlySales', event.target.value)} placeholder="Ex: 30" /></div>
                  <div className="campo-grupo"><label className="input-label" htmlFor="desired-margin">Margem específica (%)</label><input id="desired-margin" className="input-field" type="number" min="0" max="100" step="0.01" value={form.desiredMargin} onChange={event => change('desiredMargin', event.target.value)} placeholder="Usar margem padrão" /><small className="input-hint">Deixe vazio para usar a margem das configurações.</small></div>
                </div>
              </section>
            </div>

            <aside className="card ficha-resumo">
              <span className="ficha-resumo-eyebrow">Resumo do lote</span>
              <h2>{form.name.trim() || 'Nova oferta'}</h2>
              <div className="resumo-linha"><span>Materiais</span><strong>{formatCents(preview?.materialCostCents ?? 0)}</strong></div>
              <div className="resumo-linha"><span>Mão de obra</span><strong>{formatCents(preview?.laborCostCents ?? 0)}</strong></div>
              <div className="resumo-linha"><span>Custo do lote</span><strong>{formatCents(preview?.batchCostCents ?? 0)}</strong></div>
              <div className="ficha-resumo-total"><span>Custo por unidade</span><strong>{formatCents(preview?.unitCostCents ?? 0)}</strong><small>{form.kind === 'service' ? 'por serviço' : `lote com ${form.batchYield || 0} unidades`}</small></div>
              <p>Os valores são recalculados sempre que um insumo ou o custo da hora mudar.</p>
              <div className="ficha-resumo-acoes"><button className="btn-primary" type="submit" disabled={saving}>{saving ? 'Salvando...' : id ? 'Salvar alterações' : 'Criar ficha técnica'}</button><Link className="btn-secondary" to="/produtos">Cancelar</Link></div>
            </aside>
        </form>
      </main>
    </div>
  );
}
