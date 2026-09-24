import { Link } from 'react-router-dom';
import { formatCents } from '../../domain/pricing/money.js';

export function OfferCostSummary({ form, preview, saving, editing }) {
  return <aside className="card ficha-resumo">
    <span className="ficha-resumo-eyebrow">Resumo do lote</span>
    <h2>{form.name.trim() || 'Nova oferta'}</h2>
    <div className="resumo-linha"><span>Materiais</span><strong>{formatCents(preview?.materialCostCents ?? 0)}</strong></div>
    <div className="resumo-linha"><span>Mão de obra</span><strong>{formatCents(preview?.laborCostCents ?? 0)}</strong></div>
    <div className="resumo-linha"><span>Custo do lote</span><strong>{formatCents(preview?.batchCostCents ?? 0)}</strong></div>
    <div className="ficha-resumo-total"><span>Custo por unidade</span><strong>{formatCents(preview?.unitCostCents ?? 0)}</strong><small>{form.kind === 'service' ? 'por serviço' : `lote com ${form.batchYield || 0} unidades`}</small></div>
    <p>Os valores são recalculados sempre que um insumo ou o custo da hora mudar.</p>
    <div className="ficha-resumo-acoes"><button className="btn-primary" type="submit" disabled={saving}>{saving ? 'Salvando...' : editing ? 'Salvar alterações' : 'Criar ficha técnica'}</button><Link className="btn-secondary" to="/produtos">Cancelar</Link></div>
  </aside>;
}
