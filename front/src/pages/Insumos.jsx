import { useMemo, useState } from 'react';
import { Archive, MagnifyingGlass, PencilSimple, Trash } from '@phosphor-icons/react';
import Navbar from '../components/Navbar';
import { useApp } from '../context/AppContext';
import { archiveIngredient, createIngredient, deleteIngredient, updateIngredient } from '../application/ingredients.js';
import { convertQuantity } from '../domain/pricing/units.js';
import { formatCents, parseMoneyToCents } from '../domain/pricing/money.js';
import '../styles/Pagina.css';
import '../styles/Insumos.css';

const CATEGORIES = { 'raw-material': 'Matéria-prima', packaging: 'Embalagem', other: 'Outro' };
const UNITS = { mg: 'mg', g: 'g', kg: 'kg', ml: 'ml', l: 'L', un: 'unidade', min: 'minuto', h: 'hora' };
const BASE_UNIT = { mg: 'g', g: 'g', kg: 'g', ml: 'ml', l: 'ml', un: 'un', min: 'min', h: 'min' };
const EMPTY_FORM = { name: '', category: 'raw-material', purchasePrice: '', purchaseQuantity: '', purchaseUnit: 'kg' };

function unitCost(ingredient) {
  const base = BASE_UNIT[ingredient.purchaseUnit];
  const normalized = convertQuantity(ingredient.purchaseQuantity, ingredient.purchaseUnit, base);
  return `${formatCents(Math.round(ingredient.purchasePriceCents / normalized))}/${base}`;
}

export default function Insumos() {
  const { workspace, workspaceStatus, workspaceError, atualizarWorkspace } = useApp();
  const [form, setForm] = useState(EMPTY_FORM);
  const [editingId, setEditingId] = useState(null);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const [message, setMessage] = useState({ type: '', text: '' });

  const ingredients = useMemo(() => {
    const term = search.trim().toLocaleLowerCase('pt-BR');
    return (workspace?.ingredients ?? [])
      .filter(item => category === 'all' || item.category === category)
      .filter(item => !term || item.name.toLocaleLowerCase('pt-BR').includes(term))
      .sort((a, b) => Number(b.active) - Number(a.active) || a.name.localeCompare(b.name, 'pt-BR'));
  }, [workspace, search, category]);

  function change(field, value) {
    setForm(current => ({ ...current, [field]: value }));
  }

  function resetForm() {
    setForm(EMPTY_FORM);
    setEditingId(null);
  }

  async function submit(event) {
    event.preventDefault();
    setMessage({ type: '', text: '' });
    try {
      const input = {
        name: form.name,
        category: form.category,
        purchasePriceCents: parseMoneyToCents(form.purchasePrice),
        purchaseQuantity: Number(String(form.purchaseQuantity).replace(',', '.')),
        purchaseUnit: form.purchaseUnit,
      };
      await atualizarWorkspace(current => editingId
        ? updateIngredient(current, editingId, input)
        : createIngredient(current, input));
      setMessage({ type: 'success', text: editingId ? 'Insumo atualizado com sucesso.' : 'Insumo cadastrado com sucesso.' });
      resetForm();
    } catch (error) {
      setMessage({ type: 'error', text: error.message });
    }
  }

  function edit(item) {
    setEditingId(item.id);
    setForm({
      name: item.name,
      category: item.category,
      purchasePrice: (item.purchasePriceCents / 100).toFixed(2).replace('.', ','),
      purchaseQuantity: String(item.purchaseQuantity),
      purchaseUnit: item.purchaseUnit,
    });
    setMessage({ type: '', text: '' });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  async function archive(item) {
    if (!window.confirm(`Arquivar “${item.name}”?`)) return;
    try {
      await atualizarWorkspace(current => archiveIngredient(current, item.id));
      if (editingId === item.id) resetForm();
      setMessage({ type: 'success', text: 'Insumo arquivado. O histórico foi preservado.' });
    } catch (error) {
      setMessage({ type: 'error', text: error.message });
    }
  }

  async function remove(item) {
    if (!window.confirm(`Excluir “${item.name}” definitivamente?`)) return;
    try {
      await atualizarWorkspace(current => deleteIngredient(current, item.id));
      if (editingId === item.id) resetForm();
      setMessage({ type: 'success', text: 'Insumo excluído.' });
    } catch (error) {
      setMessage({ type: 'error', text: error.message });
    }
  }

  const loading = workspaceStatus === 'loading' || workspaceStatus === 'idle';
  const saving = workspaceStatus === 'saving';

  return (
    <div>
      <Navbar />
      <main className="pagina-container">
        <div className="pagina-cabecalho">
          <div>
            <h1 className="pagina-titulo">Insumos</h1>
            <p className="pagina-subtitulo">Cadastre materiais e embalagens para calcular custos com precisão.</p>
          </div>
          <span className="insumos-contador">{workspace?.ingredients?.filter(item => item.active).length ?? 0} ativos</span>
        </div>

        {workspaceError && <div className="alerta-erro">Não foi possível acessar seus dados: {workspaceError}</div>}
        {message.text && <div className={message.type === 'error' ? 'alerta-erro' : 'alerta-sucesso'}>{message.text}</div>}

        <div className="pagina-grid">
          <section className="card" aria-labelledby="insumo-form-title">
            <h2 id="insumo-form-title" className="secao-titulo">{editingId ? 'Editar insumo' : 'Novo insumo'}</h2>
            <form onSubmit={submit} className="auth-form">
              <div className="campo-grupo">
                <label className="input-label" htmlFor="ingredient-name">Nome do insumo</label>
                <input id="ingredient-name" className="input-field" value={form.name} onChange={event => change('name', event.target.value)} placeholder="Ex: Farinha de trigo" required />
              </div>
              <div className="campo-grupo">
                <label className="input-label" htmlFor="ingredient-category">Categoria</label>
                <select id="ingredient-category" className="input-field" value={form.category} onChange={event => change('category', event.target.value)}>
                  {Object.entries(CATEGORIES).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
                </select>
              </div>
              <div className="campo-grupo">
                <label className="input-label" htmlFor="ingredient-price">Preço da compra (R$)</label>
                <input id="ingredient-price" className="input-field" inputMode="decimal" value={form.purchasePrice} onChange={event => change('purchasePrice', event.target.value)} placeholder="Ex: 7,50" required />
              </div>
              <div className="insumos-form-row">
                <div className="campo-grupo">
                  <label className="input-label" htmlFor="ingredient-quantity">Quantidade</label>
                  <input id="ingredient-quantity" className="input-field" type="number" min="0.001" step="any" value={form.purchaseQuantity} onChange={event => change('purchaseQuantity', event.target.value)} placeholder="Ex: 1" required />
                </div>
                <div className="campo-grupo">
                  <label className="input-label" htmlFor="ingredient-unit">Unidade</label>
                  <select id="ingredient-unit" className="input-field" value={form.purchaseUnit} onChange={event => change('purchaseUnit', event.target.value)}>
                    {Object.entries(UNITS).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
                  </select>
                </div>
              </div>
              <p className="input-hint insumos-form-hint">Informe como o insumo é comprado. O custo por unidade-base será calculado automaticamente.</p>
              <div className="form-acoes">
                <button className="btn-primary" type="submit" disabled={loading || saving}>{saving ? 'Salvando...' : editingId ? 'Salvar alterações' : 'Cadastrar insumo'}</button>
                {editingId && <button className="btn-secondary" type="button" onClick={resetForm}>Cancelar</button>}
              </div>
            </form>
          </section>

          <section aria-labelledby="ingredients-list-title">
            <div className="insumos-lista-topo">
              <div>
                <h2 id="ingredients-list-title" className="secao-titulo">Seus insumos</h2>
                <p>Consulte o custo real de cada unidade usada na produção.</p>
              </div>
              <div className="insumos-filtros">
                <label className="insumos-busca">
                  <MagnifyingGlass size={18} aria-hidden="true" />
                  <span className="sr-only">Buscar insumo</span>
                  <input value={search} onChange={event => setSearch(event.target.value)} placeholder="Buscar insumo" />
                </label>
                <select className="input-field" aria-label="Filtrar por categoria" value={category} onChange={event => setCategory(event.target.value)}>
                  <option value="all">Todas as categorias</option>
                  {Object.entries(CATEGORIES).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
                </select>
              </div>
            </div>

            {loading ? (
              <div className="card estado-vazio"><span><Archive size={30} /></span><p>Carregando seus insumos...</p></div>
            ) : ingredients.length === 0 ? (
              <div className="card estado-vazio"><span><Archive size={30} /></span><p>{workspace?.ingredients?.length ? 'Nenhum insumo corresponde aos filtros.' : 'Nenhum insumo cadastrado. Use o formulário para começar.'}</p></div>
            ) : ingredients.map(item => (
              <article key={item.id} className={`card insumo-card ${item.active ? '' : 'insumo-card-arquivado'}`}>
                <div className="insumo-card-topo">
                  <div>
                    <div className="insumo-card-identidade">
                      <h3>{item.name}</h3>
                      {!item.active && <span className="insumo-status">Arquivado</span>}
                    </div>
                    <span className="badge">{CATEGORIES[item.category]}</span>
                  </div>
                  {item.active && <div className="acoes">
                    <button className="btn-editar" onClick={() => edit(item)}><PencilSimple size={15} /> Editar</button>
                    <button className="insumo-btn-arquivar" onClick={() => archive(item)} title="Arquivar"><Archive size={16} /></button>
                    <button className="btn-excluir" onClick={() => remove(item)} title="Excluir"><Trash size={15} /></button>
                  </div>}
                </div>
                <div className="insumo-metricas">
                  <div><span>Compra</span><strong>{formatCents(item.purchasePriceCents)}</strong><small>{item.purchaseQuantity} {UNITS[item.purchaseUnit]}</small></div>
                  <div className="insumo-custo"><span>Custo unitário</span><strong>{unitCost(item)}</strong><small>Base para receitas e fichas técnicas</small></div>
                </div>
              </article>
            ))}
          </section>
        </div>
      </main>
    </div>
  );
}
