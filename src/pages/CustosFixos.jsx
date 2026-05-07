import { useState } from 'react';
import Navbar from '../components/Navbar';
import { useApp } from '../context/AppContext';
import '../styles/Pagina.css';

export default function CustosFixos() {
  const { custosFixos, setCustosFixos, totalCustosFixos, custoFixoPorProduto, produtos } = useApp();
  const [sucesso, setSucesso] = useState('');

  function formatarMoeda(valor) {
    return Number(valor).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  }

  function handleChange(campo, valor) {
    setCustosFixos(prev => ({ ...prev, [campo]: valor }));
  }

  function handleSalvar(e) {
    e.preventDefault();
    setSucesso('Custos fixos salvos com sucesso!');
    setTimeout(() => setSucesso(''), 3000);
  }

  const campos = [
    { key: 'aluguel',  label: 'Aluguel',  icone: '🏠' },
    { key: 'energia',  label: 'Energia',  icone: '⚡' },
    { key: 'internet', label: 'Internet', icone: '🌐' },
    { key: 'salarios', label: 'Salários', icone: '👷' },
    { key: 'outros',   label: 'Outros',   icone: '📋' },
  ];

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
          {/* Formulário de custos */}
          <div className="card">
            <h2 className="secao-titulo">Despesas mensais</h2>
            <form onSubmit={handleSalvar} className="auth-form">
              {sucesso && <div className="alerta-sucesso">{sucesso}</div>}

              {campos.map(c => (
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

              <button type="submit" className="btn-primary">Salvar custos</button>
            </form>
          </div>

          {/* Resumo */}
          <div>
            <div className="card" style={{marginBottom:'1rem'}}>
              <h2 className="secao-titulo">📊 Resumo</h2>
              <div className="resumo-linha">
                <span>Total mensal:</span>
                <strong className="valor-verde">{formatarMoeda(totalCustosFixos())}</strong>
              </div>
              <div className="resumo-linha">
                <span>Produtos cadastrados:</span>
                <strong>{produtos.length}</strong>
              </div>
              <div className="resumo-linha">
                <span>Custo fixo por produto:</span>
                <strong className="valor-verde">{formatarMoeda(custoFixoPorProduto())}</strong>
              </div>
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
