import { useEffect, useMemo, useRef, useState } from 'react';
import { ArrowLeft, ImageSquare } from '@phosphor-icons/react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Navbar from '../../components/layout/Navbar';
import { useApp } from '../../context/AppContext.js';
import { fetchBackendProducts, updateBackendProduct } from '../../services/products.js';
import { createOffer, updateOffer } from '../../features/offers/services/offers.js';
import { calculateOfferVariableCost } from '../../features/offers/domain/offers.js';
import { percentToBps } from '../../features/pricing/domain/money.js';
import { OfferCompositionSection } from '../../features/offers/components/OfferCompositionSection.jsx';
import { OfferCostSummary } from '../../features/offers/components/OfferCostSummary.jsx';
import { OfferIdentificationSection } from '../../features/offers/components/OfferIdentificationSection.jsx';
import { OfferProductionSection } from '../../features/offers/components/OfferProductionSection.jsx';
import { EMPTY_OFFER_FORM, formToOfferInput, numberFromInput, offerToForm } from '../../features/offers/forms/offerForm.js';
import '../../styles/Pagina.css';
import '../../features/offers/styles/FichaTecnica.css';

export default function FichaTecnica() {
  const { id } = useParams();
  const app = useApp();
  const loading = app.workspaceStatus === 'loading' || app.workspaceStatus === 'idle';
  const existing = app.workspace?.offers?.find(offer => offer.id === id);
  const [backendLookup, setBackendLookup] = useState(null);

  useEffect(() => {
    if (!id || existing || loading) return undefined;

    let active = true;
    fetchBackendProducts()
      .then(products => {
        if (!active) return;
        const product = products.find(item => String(item.id_produto) === id);
        setBackendLookup({ id, product, error: '' });
      })
      .catch(error => {
        if (active) setBackendLookup({ id, product: null, error: error.message || 'Não foi possível carregar o produto.' });
      });

    return () => { active = false; };
  }, [id, existing, loading]);

  if (loading) return <div><Navbar /><main className="pagina-container"><div className="card estado-vazio"><p>Carregando ficha técnica...</p></div></main></div>;
  const editorKey = id ? `${id}:${existing?.updatedAt ?? 'server'}` : 'new';
  if (existing) return <FichaTecnicaEditor key={editorKey} editingId={id} existing={existing} app={app} />;
  if (!id) return <FichaTecnicaEditor key={editorKey} editingId={id} existing={existing} app={app} />;
  if (backendLookup?.id !== id) return <div><Navbar /><main className="pagina-container"><div className="card estado-vazio"><p>Carregando produto...</p></div></main></div>;
  if (backendLookup.error) return <div><Navbar /><main className="pagina-container"><div className="alerta-erro" role="alert">{backendLookup.error}</div><Link className="btn-primary btn-estado-vazio" to="/produtos">Voltar aos produtos</Link></main></div>;
  if (!backendLookup.product) return <div><Navbar /><main className="pagina-container"><div className="card estado-vazio"><p>Produto não encontrado.</p><Link className="btn-primary btn-estado-vazio" to="/produtos">Voltar aos produtos</Link></div></main></div>;
  return <BackendProductEditor key={id} product={backendLookup.product} />;
}

function BackendProductEditor({ product }) {
  const navigate = useNavigate();
  const [form, setForm] = useState(() => ({
    nome: product.nome ?? '',
    descricao: product.descricao ?? '',
    tipo: product.tipo ?? '',
    custo_direto: product.custo_direto ?? '',
    tempo_producao: product.tempo_producao ?? '',
    preco_minimo: product.preco_minimo ?? '',
  }));
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const imagePreviewUrl = useRef('');
  const [message, setMessage] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => () => {
    if (imagePreviewUrl.current) URL.revokeObjectURL(imagePreviewUrl.current);
  }, []);

  function change(field, value) {
    setForm(current => ({ ...current, [field]: value }));
  }

  function chooseImage(file) {
    if (!file) return;
    if (!['image/png', 'image/jpeg', 'image/webp'].includes(file.type)) {
      setMessage('Escolha uma imagem PNG, JPEG ou WebP.');
      return;
    }
    if (file.size > 400 * 1024) {
      setMessage('A imagem deve ter no máximo 400 KB.');
      return;
    }

    if (imagePreviewUrl.current) URL.revokeObjectURL(imagePreviewUrl.current);
    imagePreviewUrl.current = URL.createObjectURL(file);
    setImagePreview(imagePreviewUrl.current);
    setImageFile(file);
    setMessage('');
  }

  async function submit(event) {
    event.preventDefault();
    setSaving(true);
    setMessage('');
    try {
      await updateBackendProduct({
        ...product,
        ...form,
        custo_direto: Number(form.custo_direto),
        tempo_producao: Number(form.tempo_producao),
        preco_minimo: form.preco_minimo === '' ? null : Number(form.preco_minimo),
      }, imageFile);
      navigate('/produtos', { replace: true, state: { saved: true, savedMessage: 'Produto atualizado com sucesso.' } });
    } catch (error) {
      setMessage(error.message || 'Não foi possível atualizar o produto.');
    } finally {
      setSaving(false);
    }
  }

  return <div>
    <Navbar />
    <main className="pagina-container ficha-container">
      <div className="pagina-cabecalho ficha-cabecalho"><div><Link to="/produtos" className="ficha-voltar"><ArrowLeft size={16} /> Produtos e serviços</Link><h1 className="pagina-titulo">Editar produto</h1><p className="pagina-subtitulo">Atualize os dados deste produto cadastrado no servidor.</p></div></div>
      {message && <div className="alerta-erro" role="alert">{message}</div>}
      <form className="ficha-layout" onSubmit={submit}>
        <div className="ficha-secoes">
          <section className="card ficha-secao">
            <div className="ficha-secao-cabecalho"><span>01</span><div><h2>Identificação</h2><p>Defina o nome, a categoria e a foto do produto.</p></div></div>
            <div className="form-grid">
              <div className="campo-grupo"><label className="input-label" htmlFor="backend-product-name">Nome</label><input id="backend-product-name" className="input-field" value={form.nome} onChange={event => change('nome', event.target.value)} maxLength={120} required /></div>
              <div className="campo-grupo"><label className="input-label" htmlFor="backend-product-category">Categoria</label><input id="backend-product-category" className="input-field" value={form.tipo} onChange={event => change('tipo', event.target.value)} maxLength={50} required /></div>
            </div>
            <div className="campo-grupo ficha-foto"><label className="input-label" htmlFor="backend-product-image">Foto do produto</label>
              {(imagePreview || product.imagem) ? <div className="ficha-foto-preview"><img src={imagePreview || product.imagem} alt={imagePreview ? 'Prévia da nova foto' : `Foto atual de ${product.nome}`} /><span>{imageFile?.name || 'Foto atual'}</span></div> : <label className="ficha-foto-upload" htmlFor="backend-product-image"><ImageSquare size={24} /><span>Escolher uma foto</span><small>PNG, JPEG ou WebP, até 400 KB</small></label>}
              <input id="backend-product-image" className="ficha-foto-input" type="file" accept="image/png,image/jpeg,image/webp" onChange={event => { chooseImage(event.target.files?.[0]); event.target.value = ''; }} />
              {(imagePreview || product.imagem) && <label className="ficha-foto-upload" htmlFor="backend-product-image"><ImageSquare size={20} /><span>Trocar foto</span><small>PNG, JPEG ou WebP, até 400 KB</small></label>}
            </div>
            <div className="campo-grupo"><label className="input-label" htmlFor="backend-product-description">Descrição</label><textarea id="backend-product-description" className="input-field" value={form.descricao} onChange={event => change('descricao', event.target.value)} maxLength={255} /></div>
          </section>
          <section className="card ficha-secao">
            <div className="ficha-secao-cabecalho"><span>02</span><div><h2>Custos e produção</h2><p>Revise os valores usados no cadastro do produto.</p></div></div>
            <div className="form-grid">
              <div className="campo-grupo"><label className="input-label" htmlFor="backend-product-cost">Custo direto (R$)</label><input id="backend-product-cost" className="input-field" type="number" min="0" step="0.01" value={form.custo_direto} onChange={event => change('custo_direto', event.target.value)} required /></div>
              <div className="campo-grupo"><label className="input-label" htmlFor="backend-product-time">Tempo de produção</label><input id="backend-product-time" className="input-field" type="number" min="0" step="0.01" value={form.tempo_producao} onChange={event => change('tempo_producao', event.target.value)} required /></div>
              <div className="campo-grupo"><label className="input-label" htmlFor="backend-product-price">Preço mínimo (R$)</label><input id="backend-product-price" className="input-field" type="number" min="0" step="0.01" value={form.preco_minimo} onChange={event => change('preco_minimo', event.target.value)} /></div>
            </div>
          </section>
        </div>
        <aside className="card ficha-resumo">
          <span className="ficha-resumo-eyebrow">Cadastro do servidor</span>
          <h2>{form.nome.trim() || 'Produto'}</h2>
          <p>As alterações serão salvas no cadastro existente. A foto atual será mantida se nenhuma nova imagem for selecionada.</p>
          <div className="ficha-resumo-acoes"><button className="btn-primary" type="submit" disabled={saving}>{saving ? 'Salvando...' : 'Salvar alterações'}</button><Link className="btn-secondary" to="/produtos">Cancelar</Link></div>
        </aside>
      </form>
    </main>
  </div>;
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

  function changeImage(file) {
    if (!file) return;
    if (!['image/png', 'image/jpeg', 'image/webp'].includes(file.type)) {
      setMessage('Escolha uma imagem PNG, JPEG ou WebP.');
      return;
    }
    if (file.size > 400 * 1024) {
      setMessage('A foto deve ter no máximo 400 KB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result !== 'string') {
        setMessage('Não foi possível carregar a foto selecionada.');
        return;
      }
      setMessage('');
      change('image', reader.result);
    };
    reader.onerror = () => setMessage('Não foi possível ler a foto selecionada.');
    reader.readAsDataURL(file);
  }

  function changeIdentification(field, value) {
    if (field === 'imageFile') {
      changeImage(value);
      return;
    }
    change(field, value);
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
          <OfferIdentificationSection form={form} onChange={changeIdentification} onKindChange={changeKind} />
          <OfferCompositionSection form={form} ingredientsById={ingredientsById} selectableIngredients={selectableIngredients} onAdd={addComponent} onUpdate={updateComponent} onRemove={removeComponent} />
          <OfferProductionSection form={form} onChange={change} />
        </div>
        <OfferCostSummary form={form} preview={preview} saving={workspaceStatus === 'saving'} editing={Boolean(id)} />
      </form>
    </main>
  </div>;
}
