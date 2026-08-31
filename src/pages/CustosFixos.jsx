import { useState } from 'react';
import { X } from '@phosphor-icons/react';
import Navbar from '../components/Navbar';
import { useApp } from '../context/AppContext';
import '../styles/Pagina.css';
import '../styles/CustosFixos.css';

export default function CustosFixos() {
  const { custosFixos, setCustosFixos, totalCustosFixos, produtos } = useApp();
  const [sucesso, setSucesso] = useState('');
  const [erro,    setErro]    = useState('');
  const [extrasAberto, setExtrasAberto] = useState(false);

  function fmt(v) {
    return Number(v).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  }

  function handleChange(campo, valor) {
    setCustosFixos(prev => ({ ...prev, [campo]: valor }));
  }

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
    setCustosFixos(prev => ({ ...prev, extras: prev.extras.filter(e => e.id !== id) }));
  }

  function handleSalvar(e) {
    e.preventDefault();
    setErro(''); setSucesso('');

    const temNegativo = Object.entries(custosFixos)
      .filter(([k]) => k !== 'extras')
      .some(([, v]) => Number(v) < 0);
    const extraNegativo     = (custosFixos.extras || []).some(e => Number(e.valor) < 0);
    const extraSemDescricao = (custosFixos.extras || []).some(e => e.descricao.trim() === '' && Number(e.valor) > 0);

    if (temNegativo || extraNegativo)  { setErro('Nenhum custo pode ser negativo.'); return; }
    if (extraSemDescricao)             { setErro('Preencha a descrição de todos os gastos extras.'); return; }

    setSucesso('Custos fixos salvos com sucesso!');
    setTimeout(() => setSucesso(''), 3000);
  }

  const camposFixos = [
    { key: 'aluguel', label: 'Aluguel' },
    { key: 'energia', label: 'Energia' },
    { key: 'internet', label: 'Internet' },
    { key: 'salarios', label: 'Salários' },
    { key: 'outros', label: 'Outros' },
  ];

  const extras       = custosFixos.extras || [];
  const totalExtras  = extras.reduce((acc, e) => acc + Number(e.valor || 0), 0);
  const totalMensal  = totalCustosFixos();
  const mediaFixa    = produtos.length > 0 ? totalMensal / produtos.length : 0;

  return (
    <div>
      <Navbar />
      <main className="pagina-container">
        <div className="pagina-cabecalho">
          <div>
            <h1 className="pagina-titulo">Custos Fixos</h1>
            <p className="pagina-subtitulo">Registre os gastos mensais fixos do seu negócio</p>
          </div>
        </div>

        <div className="pagina-grid">
          <div className="card">
            <h2 className="secao-titulo">Despesas mensais</h2>
            <form onSubmit={handleSalvar} className="auth-form">
              {erro    && <div className="alerta-erro">{erro}</div>}
              {sucesso && <div className="alerta-sucesso">{sucesso}</div>}

              {camposFixos.map(c => (
                <div className="campo-grupo" key={c.key}>
                  <label className="input-label">{c.label} (R$)</label>
                  <input
                    className="input-field"
                    type="number" min="0" step="0.01"
                    value={custosFixos[c.key]}
                    onChange={e => handleChange(c.key, e.target.value)}
                    placeholder="0,00"
                  />
                </div>
              ))}

              {/* Extras */}
              <div className="extras-container">
                <button
                  type="button"
                  className="extras-toggle"
                  onClick={() => setExtrasAberto(a => !a)}
                >
                  <span>Outros gastos personalizados</span>
                  <span className="extras-toggle-info">
                    {extras.length > 0 ? `${extras.length} item(s) - ${fmt(totalExtras)}` : ''}
                    {extrasAberto ? 'Ocultar' : 'Ver itens'}
                  </span>
                </button>

                {extrasAberto && (
                  <div className="extras-painel">
                    {extras.length === 0 && (
                      <p className="extras-vazio">Nenhum gasto extra ainda. Clique em "+ Adicionar gasto" para começar.</p>
                    )}

                    {extras.map((extra, idx) => (
                      <div key={extra.id} className="extra-linha">
                        <div className="campo-grupo extra-campo-desc">
                          {idx === 0 && <label className="input-label">Descrição</label>}
                          <input
                            className="input-field"
                            type="text"
                            placeholder="Ex: Embalagens, frete, taxa..."
                            value={extra.descricao}
                            onChange={e => atualizarExtra(extra.id, 'descricao', e.target.value)}
                          />
                        </div>
                        <div className="campo-grupo extra-campo-valor">
                          {idx === 0 && <label className="input-label">Valor (R$)</label>}
                          <input
                            className="input-field"
                            type="number" min="0" step="0.01" placeholder="0,00"
                            value={extra.valor}
                            onChange={e => atualizarExtra(extra.id, 'valor', e.target.value)}
                          />
                        </div>
                        <button
                          type="button"
                          className="extra-remover"
                          onClick={() => removerExtra(extra.id)}
                          title="Remover"
                          aria-label="Remover gasto extra"
                        ><X size={16} /></button>
                      </div>
                    ))}

                    <button type="button" className="btn-adicionar-extra" onClick={adicionarExtra}>
                      + Adicionar gasto
                    </button>

                    {extras.length > 0 && (
                      <div className="extras-subtotal">
                        Subtotal extras: <strong>{fmt(totalExtras)}</strong>
                      </div>
                    )}
                  </div>
                )}
              </div>

              <button type="submit" className="btn-primary" style={{marginTop:'1.25rem'}}>Salvar custos</button>
            </form>
          </div>

          {/* Resumo */}
          <div>
            <div className="card">
              <h2 className="secao-titulo">Resumo</h2>
              <div className="resumo-linha">
                <span>Total mensal:</span>
                <strong className="valor-verde">{fmt(totalMensal)}</strong>
              </div>
              {extras.length > 0 && (
                <div className="resumo-linha">
                  <span>Gastos extras:</span>
                  <strong>{fmt(totalExtras)}</strong>
                </div>
              )}
              <div className="resumo-linha">
                <span>Produtos cadastrados:</span>
                <strong>{produtos.length}</strong>
              </div>
              <div className="resumo-linha">
                <span>Média de custo fixo por tipo:</span>
                <strong className="valor-verde">{fmt(mediaFixa)}</strong>
              </div>
              <small className="input-hint" style={{marginTop:'0.5rem', display:'block'}}>
                O rateio real por unidade depende da quantidade mensal de cada produto.
              </small>
              {produtos.length === 0 && (
                <p className="texto-aviso">Cadastre produtos para ver a distribuição de custos.</p>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
