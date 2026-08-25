import { useMemo, useState } from 'react';
import { Copy, CreditCard, PencilSimple, Plus, Star, Trash, Archive } from '@phosphor-icons/react';
import Navbar from '../components/Navbar';
import { useApp } from '../context/AppContext';
import {
  archiveSalesChannel,
  createSalesChannel,
  deleteSalesChannel,
  duplicateSalesChannel,
  setDefaultSalesChannel,
  updateSalesChannel,
} from '../application/salesChannels.js';
import { formatCents, parseMoneyToCents, percentToBps } from '../domain/pricing/money.js';
import '../styles/Pagina.css';
import '../styles/CanaisVenda.css';

const FEE_KINDS = { percentage: 'Percentual', fixed: 'Fixa por venda' };
const FEE_CATEGORIES = { tax: 'Imposto', payment: 'Pagamento', marketplace: 'Marketplace', other: 'Outro' };
const EMPTY_FORM = { name: '', fees: [] };

function feeToForm(fee) {
  return {
    id: fee.id,
    localId: fee.id,
    name: fee.name,
    kind: fee.kind,
    category: fee.category,
    value: fee.kind === 'percentage'
      ? String(fee.value / 100).replace('.', ',')
      : (fee.value / 100).toFixed(2).replace('.', ','),
  };
}

function summarize(channel) {
  return channel.fees.reduce((summary, fee) => {
    if (fee.kind === 'percentage') summary.percentage += fee.value;
    else summary.fixed += fee.value;
    return summary;
  }, { percentage: 0, fixed: 0 });
}

export default function CanaisVenda() {
  const { workspace, workspaceStatus, workspaceError, atualizarWorkspace } = useApp();
  const [form, setForm] = useState(EMPTY_FORM);
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState(null);

  const channels = useMemo(() => (workspace?.salesChannels ?? [])
    .toSorted((a, b) => Number(b.isDefault) - Number(a.isDefault) || Number(b.active) - Number(a.active) || a.name.localeCompare(b.name, 'pt-BR')), [workspace]);
  const activeChannelCount = workspace?.salesChannels?.filter(channel => channel.active).length ?? 0;
  const selectedChannelId = workspace?.settings?.selectedSalesChannelId;
  const saving = workspaceStatus === 'saving';
  const loading = workspaceStatus === 'loading' || workspaceStatus === 'idle';

  function resetForm() {
    setForm(EMPTY_FORM);
    setEditingId(null);
  }

  function addFee() {
    setForm(current => ({ ...current, fees: [...current.fees, {
      localId: crypto.randomUUID(), name: '', kind: 'percentage', category: 'payment', value: '',
    }] }));
  }

  function updateFee(index, field, value) {
    setForm(current => ({ ...current, fees: current.fees.map((fee, position) => position === index ? { ...fee, [field]: value } : fee) }));
  }

  function removeFee(index) {
    setForm(current => ({ ...current, fees: current.fees.filter((_, position) => position !== index) }));
  }

  function payload() {
    return {
      name: form.name,
      fees: form.fees.map(fee => ({
        id: fee.id,
        name: fee.name,
        kind: fee.kind,
        category: fee.category,
        value: fee.kind === 'percentage' ? percentToBps(fee.value) : parseMoneyToCents(fee.value),
      })),
    };
  }

  async function submit(event) {
    event.preventDefault();
    setMessage(null);
    try {
      await atualizarWorkspace(current => editingId
        ? updateSalesChannel(current, editingId, payload())
        : createSalesChannel(current, payload()));
      setMessage({ type: 'success', text: editingId ? 'Canal atualizado com sucesso.' : 'Canal criado com sucesso.' });
      resetForm();
    } catch (error) {
      setMessage({ type: 'error', text: error.message });
    }
  }

  function edit(channel) {
    setEditingId(channel.id);
    setForm({ name: channel.name, fees: channel.fees.map(feeToForm) });
    setMessage(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  async function run(action, successMessage) {
    setMessage(null);
    try {
      await atualizarWorkspace(action);
      setMessage({ type: 'success', text: successMessage });
    } catch (error) {
      setMessage({ type: 'error', text: error.message });
    }
  }

  function duplicate(channel) {
    run(current => duplicateSalesChannel(current, channel.id), `Cópia de ${channel.name} criada.`);
  }

  function makeDefault(channel) {
    run(current => setDefaultSalesChannel(current, channel.id), `${channel.name} agora é o canal padrão.`);
  }

  function archive(channel) {
    if (!window.confirm(`Arquivar “${channel.name}”?`)) return;
    run(current => archiveSalesChannel(current, channel.id), 'Canal arquivado.');
  }

  function remove(channel) {
    if (!window.confirm(`Excluir “${channel.name}” definitivamente?`)) return;
    run(current => deleteSalesChannel(current, channel.id), 'Canal excluído.');
  }

  return (
    <div>
      <Navbar />
      <main className="pagina-container">
        <div className="pagina-cabecalho">
          <div><h1 className="pagina-titulo">Canais de venda</h1><p className="pagina-subtitulo">Configure taxas de cartão, marketplace, impostos e outras cobranças por venda.</p></div>
          <span className="canais-contador">{activeChannelCount} {activeChannelCount === 1 ? 'ativo' : 'ativos'}</span>
        </div>

        {workspaceError && <div className="alerta-erro">Não foi possível acessar seus dados: {workspaceError}</div>}
        {message && <div role="status" className={message.type === 'error' ? 'alerta-erro' : 'alerta-sucesso'}>{message.text}</div>}

        <div className="pagina-grid canais-grid">
          <section className="card" aria-labelledby="channel-form-title">
            <h2 id="channel-form-title" className="secao-titulo">{editingId ? 'Editar canal' : 'Novo canal'}</h2>
            <form onSubmit={submit}>
              <div className="campo-grupo"><label className="input-label" htmlFor="channel-name">Nome do canal</label><input id="channel-name" className="input-field" value={form.name} onChange={event => setForm(current => ({ ...current, name: event.target.value }))} placeholder="Ex: Cartão de crédito" required /></div>
              <div className="canais-taxas-cabecalho"><div><h3>Taxas</h3><p>Informe cada cobrança aplicada à venda.</p></div><button className="canais-adicionar" type="button" onClick={addFee}><Plus size={15} /> Adicionar</button></div>
              {form.fees.length === 0 ? <div className="canais-taxas-vazio">Este canal não possui taxas.</div> : <div className="canais-taxas">{form.fees.map((fee, index) => {
                const fieldId = fee.id ?? fee.localId;
                return <div className="canal-taxa" key={fieldId}>
                  <div className="campo-grupo"><label className="input-label" htmlFor={`fee-name-${fieldId}`}>Nome</label><input id={`fee-name-${fieldId}`} className="input-field" value={fee.name} onChange={event => updateFee(index, 'name', event.target.value)} placeholder="Ex: Taxa do cartão" required /></div>
                  <div className="campo-grupo"><label className="input-label" htmlFor={`fee-kind-${fieldId}`}>Natureza</label><select id={`fee-kind-${fieldId}`} className="input-field" value={fee.kind} onChange={event => updateFee(index, 'kind', event.target.value)}>{Object.entries(FEE_KINDS).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></div>
                  <div className="campo-grupo"><label className="input-label" htmlFor={`fee-category-${fieldId}`}>Categoria</label><select id={`fee-category-${fieldId}`} className="input-field" value={fee.category} onChange={event => updateFee(index, 'category', event.target.value)}>{Object.entries(FEE_CATEGORIES).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></div>
                  <div className="campo-grupo"><label className="input-label" htmlFor={`fee-value-${fieldId}`}>{fee.kind === 'percentage' ? 'Percentual (%)' : 'Valor (R$)'}</label><input id={`fee-value-${fieldId}`} className="input-field" inputMode="decimal" value={fee.value} onChange={event => updateFee(index, 'value', event.target.value)} placeholder={fee.kind === 'percentage' ? 'Ex: 3,5' : 'Ex: 1,00'} required /></div>
                  <button type="button" className="btn-excluir canal-taxa-remover" onClick={() => removeFee(index)} aria-label={`Remover taxa ${fee.name || index + 1}`}><Trash size={15} /></button>
                </div>;
              })}</div>}
              <div className="form-acoes canais-form-acoes"><button className="btn-primary" type="submit" disabled={saving || loading}>{saving ? 'Salvando...' : editingId ? 'Salvar alterações' : 'Criar canal'}</button>{editingId && <button className="btn-secondary" type="button" onClick={resetForm}>Cancelar</button>}</div>
            </form>
          </section>

          <section aria-labelledby="channels-list-title">
            <div className="canais-lista-topo"><div><h2 id="channels-list-title" className="secao-titulo">Canais configurados</h2><p>O canal padrão será usado inicialmente nos preços.</p></div></div>
            {loading ? <div className="card estado-vazio"><span><CreditCard size={30} /></span><p>Carregando canais...</p></div> : channels.length === 0 ? <div className="card estado-vazio"><span><CreditCard size={30} /></span><p>Nenhum canal de venda cadastrado.</p></div> : <div className="canais-lista">{channels.map(channel => {
              const totals = summarize(channel);
              return <article key={channel.id} className={`card canal-card ${channel.active ? '' : 'canal-card-arquivado'}`}>
                <div className="canal-card-topo">
                  <div><div className="canal-identidade"><h3>{channel.name}</h3>{channel.isDefault && <span className="canal-padrao"><Star size={11} weight="fill" /> Padrão</span>}{!channel.active && <span className="canal-status">Arquivado</span>}</div><p>{channel.fees.length} {channel.fees.length === 1 ? 'taxa configurada' : 'taxas configuradas'}</p></div>
                  <div className="acoes">
                    {channel.active && <button className="btn-editar" onClick={() => edit(channel)} disabled={saving}><PencilSimple size={15} /> Editar</button>}
                    <button className="canal-acao" onClick={() => duplicate(channel)} disabled={saving} title="Duplicar" aria-label={`Duplicar ${channel.name}`}><Copy size={16} /></button>
                    {channel.active && !channel.isDefault && <button className="canal-acao" onClick={() => makeDefault(channel)} disabled={saving} title="Tornar padrão" aria-label={`Tornar ${channel.name} o canal padrão`}><Star size={16} /></button>}
                    {channel.active && !channel.isDefault && activeChannelCount > 1 && <button className="canal-arquivar" onClick={() => archive(channel)} disabled={saving} title="Arquivar" aria-label={`Arquivar ${channel.name}`}><Archive size={16} /></button>}
                    {!channel.isDefault && selectedChannelId !== channel.id && <button className="btn-excluir" onClick={() => remove(channel)} disabled={saving} title="Excluir" aria-label={`Excluir ${channel.name}`}><Trash size={15} /></button>}
                  </div>
                </div>
                <div className="canal-resumo"><div><span>Taxas percentuais</span><strong>{(totals.percentage / 100).toLocaleString('pt-BR')}%</strong></div><div><span>Taxas fixas</span><strong>{formatCents(totals.fixed)}</strong><small>por venda</small></div></div>
              </article>;
            })}</div>}
          </section>
        </div>
      </main>
    </div>
  );
}
