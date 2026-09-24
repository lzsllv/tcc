import { useMemo, useState } from 'react';
import { ArrowLeft } from '@phosphor-icons/react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { useApp } from '../context/AppContext.js';
import { createOffer, updateOffer } from '../application/offers.js';
import { calculateOfferVariableCost } from '../domain/pricing/offers.js';
import { percentToBps } from '../domain/pricing/money.js';
import { OfferCompositionSection } from './ficha-tecnica/OfferCompositionSection.jsx';
import { OfferCostSummary } from './ficha-tecnica/OfferCostSummary.jsx';
import { OfferIdentificationSection } from './ficha-tecnica/OfferIdentificationSection.jsx';
import { OfferProductionSection } from './ficha-tecnica/OfferProductionSection.jsx';
import { EMPTY_OFFER_FORM, formToOfferInput, numberFromInput, offerToForm } from './ficha-tecnica/offerForm.js';
import '../styles/Pagina.css';
import '../styles/FichaTecnica.css';

export default function FichaTecnica() {
  const { id } = useParams();
  const app = useApp();
  const loading = app.workspaceStatus === 'loading' || app.workspaceStatus === 'idle';
  const existing = app.workspace?.offers?.find(offer => offer.id === id);

  if (loading) return <div><Navbar /><main className="pagina-container"><div className="card estado-vazio"><p>Carregando ficha técnica...</p></div></main></div>;
  if (id && !existing) return <div><Navbar /><main className="pagina-container"><div className="card estado-vazio"><p>Ficha técnica não encontrada.</p><Link className="btn-primary btn-estado-vazio" to="/produtos">Voltar aos produtos</Link></div></main></div>;
  const editorKey = id ? `${id}:${existing.updatedAt}` : 'new';
  return <FichaTecnicaEditor key={editorKey} editingId={id} existing={existing} app={app} />;
}

function FichaTecnicaEditor({ editingId: id, existing, app }) {
  const navigate = useNavigate();
  const { workspace, workspaceStatus, workspaceError, atualizarWorkspace } = app;
  const [form, setForm] = useState(() => existing ? offerToForm(existing) : EMPTY_OFFER_FORM);
  const [message, setMessage] = useState('');
  const ingredientsById = useMemo(() => Object.fromEntries((workspace?.ingredients ?? []).map(item => [item.id, item])), [workspace]);
  const selectableIngredients = useMemo(() => {
    const selected = new Set(form.components.map(component => component.ingredientId));
    return (workspace?.ingredients ?? []).filter(item => item.active || selected.has(item.id));
  }, [workspace, form.components]);
  const preview = useMemo(() => {
    if (!workspace) return null;
    try {
      return calculateOfferVariableCost({
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
      }, ingredientsById, workspace.settings.laborHourCents);
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
      components: [...current.components, { localId: crypto.randomUUID(), ingredientId: ingredient.id, quantity: '', unit: ingredient.purchaseUnit, waste: '0' }],
    }));
  }

  function updateComponent(index, field, value) {
    setForm(current => ({
      ...current,
      components: current.components.map((component, position) => {
        if (position !== index) return component;
        if (field === 'ingredientId') return { ...component, ingredientId: value, unit: ingredientsById[value].purchaseUnit };
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
      const payload = formToOfferInput(form);
      await atualizarWorkspace(current => id ? updateOffer(current, id, payload) : createOffer(current, payload));
      navigate('/produtos', { replace: true, state: { saved: true } });
    } catch (error) {
      setMessage(error.message);
    }
  }

  return <div>
    <Navbar />
    <main className="pagina-container ficha-container">
      <div className="pagina-cabecalho ficha-cabecalho"><div><Link to="/produtos" className="ficha-voltar"><ArrowLeft size={16} /> Produtos e serviços</Link><h1 className="pagina-titulo">{id ? 'Editar ficha técnica' : 'Nova ficha técnica'}</h1><p className="pagina-subtitulo">Monte a composição e acompanhe o custo por unidade em tempo real.</p></div></div>
      {workspaceError && <div className="alerta-erro">Não foi possível acessar seus dados: {workspaceError}</div>}
      {message && <div className="alerta-erro">{message}</div>}
      <form onSubmit={submit} className="ficha-layout">
        <div className="ficha-secoes">
          <OfferIdentificationSection form={form} onChange={change} onKindChange={changeKind} />
          <OfferCompositionSection form={form} ingredientsById={ingredientsById} selectableIngredients={selectableIngredients} onAdd={addComponent} onUpdate={updateComponent} onRemove={removeComponent} />
          <OfferProductionSection form={form} onChange={change} />
        </div>
        <OfferCostSummary form={form} preview={preview} saving={workspaceStatus === 'saving'} editing={Boolean(id)} />
      </form>
    </main>
  </div>;
}
