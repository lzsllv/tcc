import { useEffect, useMemo, useRef, useState } from 'react';
import { Copy, CreditCard, PencilSimple, Plus, Star, Trash, Archive } from '@phosphor-icons/react';
import Navbar from '../../components/layout/Navbar';
import { useApp } from '../../context/AppContext.js';
import {
  createBackendSalesChannel,
  deleteBackendSalesChannel,
  fetchBackendSalesChannels,
  updateBackendSalesChannel,
} from '../../features/sales-channels/services/backendSalesChannels.js';
import {
  archiveSalesChannel,
  createSalesChannel,
  deleteSalesChannel,
  duplicateSalesChannel,
  setDefaultSalesChannel,
  updateSalesChannel,
} from '../../features/sales-channels/services/salesChannels.js';
import { formatCents, parseMoneyToCents, percentToBps } from '../../features/pricing/domain/money.js';
import '../../styles/Pagina.css';
import '../../features/sales-channels/styles/CanaisVenda.css';

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
  const { usuarioLogado, workspace, workspaceStatus, workspaceError, atualizarWorkspace } = useApp();
  const [form, setForm] = useState(EMPTY_FORM);
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState(null);
  const [companyId, setCompanyId] = useState(null);
  const [backendStatus, setBackendStatus] = useState('loading');
  const [backendError, setBackendError] = useState('');
  const [backendChannels, setBackendChannels] = useState([]);
  const [retryCount, setRetryCount] = useState(0);
  const [backendSaving, setBackendSaving] = useState(false);
  const syncedUserId = useRef(null);

  useEffect(() => {
    const userId = usuarioLogado?.id;
    const controller = new AbortController();
    syncedUserId.current = null;

    Promise.resolve()
      .then(() => {
        if (controller.signal.aborted) return null;
        setCompanyId(null);
        setBackendChannels([]);
        setBackendError('');
        setBackendStatus('loading');
        if (!userId) throw new Error('Entre na sua conta para carregar os canais de venda.');
        return fetchBackendSalesChannels(userId, { signal: controller.signal });
      })
      .then(result => {
        if (controller.signal.aborted || !result) return;
        setCompanyId(result.companyId);
        setBackendChannels(result.channels);
        setBackendStatus('loaded');
      })
      .catch(error => {
        if (controller.signal.aborted) return;
        setBackendError(error.message || 'Não foi possível carregar os canais de venda.');
        setBackendStatus('error');
      });

    return () => controller.abort();
  }, [usuarioLogado?.id, retryCount]);

  useEffect(() => {
    const userId = usuarioLogado?.id;
    if (!userId || backendStatus !== 'loaded' || workspaceStatus !== 'ready' || syncedUserId.current === userId) return;
    syncedUserId.current = userId;
    const updateWorkspace = atualizarWorkspace(current => {
      const currentSelection = current.settings.selectedSalesChannelId;
      const selectedSalesChannelId = backendChannels.some(channel => channel.id === currentSelection && channel.active)
        ? currentSelection
        : backendChannels.find(channel => channel.active && channel.isDefault)?.id
          ?? backendChannels.find(channel => channel.active)?.id;
      return {
        ...current,
        salesChannels: backendChannels,
        settings: { ...current.settings, selectedSalesChannelId },
      };
    });
    updateWorkspace
      .then(() => setBackendStatus('ready'))
      .catch(error => {
        syncedUserId.current = null;
        setBackendError(error.message || 'Não foi possível sincronizar os canais no workspace.');
        setBackendStatus('error');
      });
  }, [atualizarWorkspace, backendChannels, backendStatus, usuarioLogado?.id, workspaceStatus]);

  const channels = useMemo(() => (backendStatus === 'ready' ? workspace?.salesChannels ?? [] : [])
    .toSorted((a, b) => Number(b.isDefault) - Number(a.isDefault) || Number(b.active) - Number(a.active) || a.name.localeCompare(b.name, 'pt-BR')), [backendStatus, workspace]);
  const activeChannelCount = channels.filter(channel => channel.active).length;
  const selectedChannelId = workspace?.settings?.selectedSalesChannelId;
  const saving = workspaceStatus === 'saving' || backendSaving;
  const loading = workspaceStatus === 'loading' || workspaceStatus === 'idle' || backendStatus === 'loading' || backendStatus === 'loaded';

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
    const operation = editingId ? 'update' : 'create';
    const saved = await run(current => editingId
      ? updateSalesChannel(current, editingId, payload())
      : createSalesChannel(current, payload()), editingId ? 'Canal atualizado com sucesso.' : 'Canal criado com sucesso.', operation, editingId);
    if (saved) resetForm();
  }

  function edit(channel) {
    setEditingId(channel.id);
    setForm({ name: channel.name, fees: channel.fees.map(feeToForm) });
    setMessage(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  async function run(action, successMessage, operation = 'update', channelId) {
    setMessage(null);
    setBackendSaving(true);
    try {
      const next = action(workspace);
      const changedChannel = operation === 'create'
        ? next.salesChannels.find(channel => !workspace.salesChannels.some(current => current.id === channel.id))
        : next.salesChannels.find(channel => channel.id === channelId);

      if (operation === 'delete') {
        await deleteBackendSalesChannel(companyId, channelId);
      } else if (operation === 'create') {
        if (!changedChannel) throw new Error('Não foi possível identificar o canal criado.');
        await createBackendSalesChannel(companyId, changedChannel);
      } else {
        if (!changedChannel) throw new Error('Não foi possível identificar o canal atualizado.');
        await updateBackendSalesChannel(companyId, changedChannel);
      }

      await atualizarWorkspace(current => ({
        ...current,
        salesChannels: next.salesChannels,
        settings: { ...current.settings, selectedSalesChannelId: next.settings.selectedSalesChannelId },
      }));
      setMessage({ type: 'success', text: successMessage });
      return true;
    } catch (error) {
      setMessage({ type: 'error', text: error.message });
      return false;
    } finally {
      setBackendSaving(false);
    }
  }

  function duplicate(channel) {
    run(current => duplicateSalesChannel(current, channel.id), `Cópia de ${channel.name} criada.`, 'create');
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
    run(current => deleteSalesChannel(current, channel.id), 'Canal excluído.', 'delete', channel.id);
  }

  function retryBackendChannels() {
    syncedUserId.current = null;
    setRetryCount(current => current + 1);
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
              <div className="form-acoes canais-form-acoes"><button className="btn-primary" type="submit" disabled={saving || loading || !companyId}>{saving ? 'Salvando...' : editingId ? 'Salvar alterações' : 'Criar canal'}</button>{editingId && <button className="btn-secondary" type="button" onClick={resetForm}>Cancelar</button>}</div>
            </form>
          </section>

          <section aria-labelledby="channels-list-title">
            <div className="canais-lista-topo"><div><h2 id="channels-list-title" className="secao-titulo">Canais configurados</h2><p>O canal padrão será usado inicialmente nos preços.</p></div></div>
            {loading ? <div className="card estado-vazio"><span><CreditCard size={30} /></span><p>Carregando canais...</p></div> : backendStatus === 'error' ? <div className="card estado-vazio"><span><CreditCard size={30} /></span><p role="alert">{backendError}</p><button className="btn-secondary" type="button" onClick={retryBackendChannels}>Tentar novamente</button></div> : channels.length === 0 ? <div className="card estado-vazio"><span><CreditCard size={30} /></span><p>Nenhum canal de venda cadastrado.</p></div> : <div className="canais-lista">{channels.map(channel => {
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
