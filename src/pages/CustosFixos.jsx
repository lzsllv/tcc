import { useState } from 'react';
import Navbar from '../components/Navbar';
import { useApp } from '../context/AppContext';
import '../styles/Pagina.css';

export default function CustosFixos() {
  const { custosFixos, setCustosFixos, totalCustosFixos, produtos } = useApp();
  const [sucesso, setSucesso] = useState('');
  const [erro, setErro] = useState('');
  const [extrasAberto, setExtrasAberto] = useState(false);

  function formatarMoeda(valor) {
    return Number(valor).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  }

  function handleChange(campo, valor) {
    setCustosFixos(prev => ({ ...prev, [campo]: valor }));
  }

  // ── Extras ──────────────────────────────────────────────
  function adicionarExtra() {
    setCustosFixos(prev => ({
      ...prev,
      extras: [...(prev.extras || []), { id: Date.now(), descricao: '', valor: '' }],
    }));
    setExtrasAberto(true);
  }

  function atualizarExtra(id, campo, valor) {
    setCustosFixos(prev => ({
      ...prev,
      extras: prev.extras.map(e => e.id === id ? { ...e, [campo]: valor } : e),
    }));
  }

  function removerExtra(id) {
    setCustosFixos(prev => ({
      ...prev,
      extras: prev.extras.filter(e => e.id !== id),
    }));
  }

  // ── Salvar ──────────────────────────────────────────────
  function handleSalvar(e) {
    e.preventDefault();
    setErro('');
    setSucesso('');

    const temNegativo = Object.entries(custosFixos)
      .filter(([k]) => k !== 'extras')
      .some(([, v]) => Number(v) < 0);

    const extraNegativo = (custosFixos.extras || []).some(e => Number(e.valor) < 0);
    const extraSemDescricao = (custosFixos.extras || []).some(e => e.descricao.trim() === '' && Number(e.valor) > 0);

    if (temNegativo || extraNegativo) {
      setErro('Nenhum custo pode ser negativo.');
      return;
    }
    if (extraSemDescricao) {
      setErro('Preencha a descrição de todos os gastos extras.');
      return;
    }

    setSucesso('Custos fixos salvos com sucesso!');
    setTimeout(() => setSucesso(''), 3000);
  }

  const camposFixos = [
    { key: 'aluguel',  label: 'Aluguel',  icone: '🏠' },
    { key: 'energia',  label: 'Energia',  icone: '⚡' },
    { key: 'internet', label: 'Internet', icone: '🌐' },
    { key: 'salarios', label: 'Salários', icone: '👷' },
    { key: 'outros',   label: 'Outros',   icone: '📋' },
  ];

  const extras = custosFixos.extras || [];
  const totalExtras = extras.reduce((acc, e) => acc + Number(e.valor || 0), 0);
  const totalMensal = totalCustosFixos();
  const mediaFixaPorTipo = produtos.length > 0 ? totalMensal / produtos.length : 0;

  return (
    <div>
      <Navbar />
      <main className="pagina-container">
        <div className="pagina-cabecalho">
          <div>
            <h1 className="pagina-titulo">💸 Custos Fixos</h1>
            <p className="pagina-subtitulo">Registre os gastos mensais fixos do seu negócio</p>
          </div>
        </div>

        <div className="pagina-grid">
          <div className="card">
            <h2 className="secao-titulo">Despesas mensais</h2>
            <form onSubmit={handleSalvar} className="auth-form">
              {erro    && <div className="alerta-erro">{erro}</div>}
              {sucesso && <div className="alerta-sucesso">{sucesso}</div>}

              {/* Campos fixos padrão */}
              {camposFixos.map(c => (
                <div className="campo-grupo" key={c.key}>
                  <label className="input-label">{c.icone} {c.label} (R$)</label>
                  <input
                    className="input-field"
                    type="number"
                    min="0"
                    step="0.01"
                    value={custosFixos[c.key]}
                    onChange={e => handleChange(c.key, e.target.value)}
                    placeholder="0,00"
                  />
                </div>
              ))}

              {/* ── Seção de gastos extras ── */}
              <div style={{ marginTop: '1.25rem' }}>
                <button
                  type="button"
                  onClick={() => setExtrasAberto(a => !a)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    background: 'none',
                    border: '1.5px dashed var(--borda)',
                    borderRadius: '8px',
                    padding: '0.6rem 1rem',
                    cursor: 'pointer',
                    color: 'var(--texto-secundario)',
                    fontWeight: 600,
                    width: '100%',
                    justifyContent: 'space-between',
                    transition: 'border-color 0.2s',
                  }}
                >
                  <span>➕ Outros gastos personalizados</span>
                  <span style={{ fontSize: '0.85rem', opacity: 0.7 }}>
                    {extras.length > 0 ? `${extras.length} item(s) · ${formatarMoeda(totalExtras)}` : ''}
                    {extrasAberto ? '  ▲' : '  ▼'}
                  </span>
                </button>

                {extrasAberto && (
                  <div style={{
                    border: '1.5px solid var(--borda)',
                    borderTop: 'none',
                    borderRadius: '0 0 8px 8px',
                    padding: '1rem',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.75rem',
                    background: 'var(--fundo-card)',
                  }}>
                    {extras.length === 0 && (
                      <p style={{ color: 'var(--texto-secundario)', fontSize: '0.9rem', textAlign: 'center' }}>
                        Nenhum gasto extra ainda. Clique em "+ Adicionar gasto" para começar.
                      </p>
                    )}

                    {extras.map((extra, idx) => (
                      <div key={extra.id} style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-end' }}>
                        {/* Descrição */}
                        <div className="campo-grupo" style={{ flex: 2, marginBottom: 0 }}>
                          {idx === 0 && <label className="input-label">Descrição</label>}
                          <input
                            className="input-field"
                            type="text"
                            placeholder="Ex: Embalagens, frete, taxa..."
                            value={extra.descricao}
                            onChange={e => atualizarExtra(extra.id, 'descricao', e.target.value)}
                          />
                        </div>
                        {/* Valor */}
                        <div className="campo-grupo" style={{ flex: 1, marginBottom: 0 }}>
                          {idx === 0 && <label className="input-label">Valor (R$)</label>}
                          <input
                            className="input-field"
                            type="number"
                            min="0"
                            step="0.01"
                            placeholder="0,00"
                            value={extra.valor}
                            onChange={e => atualizarExtra(extra.id, 'valor', e.target.value)}
                          />
                        </div>
                        {/* Remover */}
                        <button
                          type="button"
                          onClick={() => removerExtra(extra.id)}
                          title="Remover"
                          style={{
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            color: 'var(--erro)',
                            fontSize: '1.2rem',
                            paddingBottom: '0.5rem',
                            lineHeight: 1,
                          }}
                        >✕</button>
                      </div>
                    ))}

                    <button
                      type="button"
                      onClick={adicionarExtra}
                      style={{
                        marginTop: '0.25rem',
                        alignSelf: 'flex-start',
                        background: 'none',
                        border: '1px solid var(--verde-principal)',
                        color: 'var(--verde-principal)',
                        borderRadius: '6px',
                        padding: '0.4rem 0.9rem',
                        cursor: 'pointer',
                        fontWeight: 600,
                        fontSize: '0.875rem',
                      }}
                    >+ Adicionar gasto</button>

                    {extras.length > 0 && (
                      <div style={{
                        display: 'flex',
                        justifyContent: 'flex-end',
                        borderTop: '1px solid var(--borda)',
                        paddingTop: '0.5rem',
                        fontSize: '0.9rem',
                        color: 'var(--texto-secundario)',
                      }}>
                        Subtotal extras: <strong style={{ marginLeft: '0.4rem' }}>{formatarMoeda(totalExtras)}</strong>
                      </div>
                    )}
                  </div>
                )}
              </div>

              <button type="submit" className="btn-primary" style={{ marginTop: '1.25rem' }}>Salvar custos</button>
            </form>
          </div>

          {/* Resumo */}
          <div>
            <div className="card" style={{ marginBottom: '1rem' }}>
              <h2 className="secao-titulo">📊 Resumo</h2>
              <div className="resumo-linha">
                <span>Total mensal:</span>
                <strong className="valor-verde">{formatarMoeda(totalMensal)}</strong>
              </div>
              {extras.length > 0 && (
                <div className="resumo-linha">
                  <span>↳ do qual gastos extras:</span>
                  <strong>{formatarMoeda(totalExtras)}</strong>
                </div>
              )}
              <div className="resumo-linha">
                <span>Produtos cadastrados:</span>
                <strong>{produtos.length}</strong>
              </div>
              <div className="resumo-linha">
                <span>Média de custo fixo por tipo:</span>
                <strong className="valor-verde">{formatarMoeda(mediaFixaPorTipo)}</strong>
              </div>
              <small style={{ color: 'var(--neutro-muted)', marginTop: '0.5rem', display: 'block' }}>
                O rateio real por unidade depende da quantidade mensal de cada produto.
              </small>
              {produtos.length === 0 && (
                <p className="texto-aviso">⚠️ Cadastre produtos para ver a distribuição de custos.</p>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
