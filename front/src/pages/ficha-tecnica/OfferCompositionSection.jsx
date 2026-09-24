import { Plus, Trash } from '@phosphor-icons/react';
import { calculateIngredientCost } from '../../domain/pricing/ingredients.js';
import { formatCents, percentToBps } from '../../domain/pricing/money.js';
import { getUnitFamily } from '../../domain/pricing/units.js';
import { numberFromInput } from './offerForm.js';

const UNITS_BY_FAMILY = {
  mass: [['mg', 'mg'], ['g', 'g'], ['kg', 'kg']],
  volume: [['ml', 'ml'], ['l', 'L']],
  count: [['un', 'unidade']],
  time: [['min', 'minuto'], ['h', 'hora']],
};

export function OfferCompositionSection({ form, ingredientsById, selectableIngredients, onAdd, onUpdate, onRemove }) {
  const canAdd = selectableIngredients.some(item => item.active && !form.components.some(component => component.ingredientId === item.id));
  return <section className="card ficha-secao">
    <div className="ficha-secao-cabecalho"><span>02</span><div><h2>Composição</h2><p>{form.kind === 'product' ? 'Adicione os insumos usados no lote.' : 'Insumos são opcionais para serviços.'}</p></div></div>
    {form.components.length === 0 ? <div className="ficha-componentes-vazio">Nenhum insumo adicionado.</div> : <div className="ficha-componentes">
      {form.components.map((component, index) => {
        const ingredient = ingredientsById[component.ingredientId];
        const family = ingredient ? getUnitFamily(ingredient.purchaseUnit) : 'count';
        let cost = null;
        try { cost = calculateIngredientCost(ingredient, numberFromInput(component.quantity), component.unit, percentToBps(component.waste || 0)); } catch (error) { void error; }
        const fieldId = component.id ?? component.localId ?? index;
        const options = selectableIngredients.filter(item => item.id === component.ingredientId || !form.components.some(current => current.ingredientId === item.id));
        return <div className="ficha-componente" key={fieldId}>
          <div className="campo-grupo"><label className="input-label" htmlFor={`component-ingredient-${fieldId}`}>Insumo</label><select id={`component-ingredient-${fieldId}`} className="input-field" value={component.ingredientId} onChange={event => onUpdate(index, 'ingredientId', event.target.value)}>{options.map(item => <option key={item.id} value={item.id}>{item.name}{item.active ? '' : ' (arquivado)'}</option>)}</select></div>
          <div className="campo-grupo"><label className="input-label" htmlFor={`component-quantity-${fieldId}`}>Quantidade</label><input id={`component-quantity-${fieldId}`} className="input-field" type="number" min="0.001" step="any" value={component.quantity} onChange={event => onUpdate(index, 'quantity', event.target.value)} required /></div>
          <div className="campo-grupo"><label className="input-label" htmlFor={`component-unit-${fieldId}`}>Unidade</label><select id={`component-unit-${fieldId}`} className="input-field" value={component.unit} onChange={event => onUpdate(index, 'unit', event.target.value)}>{UNITS_BY_FAMILY[family].map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></div>
          <div className="campo-grupo"><label className="input-label" htmlFor={`component-waste-${fieldId}`}>Perda (%)</label><input id={`component-waste-${fieldId}`} className="input-field" type="number" min="0" max="100" step="0.01" value={component.waste} onChange={event => onUpdate(index, 'waste', event.target.value)} /></div>
          <div className="ficha-componente-custo"><span>Custo</span><strong>{cost === null ? '—' : formatCents(cost)}</strong></div>
          <button type="button" className="btn-excluir ficha-remover" onClick={() => onRemove(index)} aria-label={`Remover ${ingredient?.name ?? 'insumo'}`}><Trash size={16} /></button>
        </div>;
      })}
    </div>}
    <button type="button" className="ficha-adicionar" onClick={onAdd} disabled={!canAdd}><Plus size={17} /> Adicionar insumo</button>
    {!selectableIngredients.some(item => item.active) && <p className="input-hint">Cadastre um insumo ativo na área de Insumos para montar a composição.</p>}
  </section>;
}
