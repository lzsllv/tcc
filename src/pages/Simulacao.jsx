import { useState } from 'react';
import Navbar from '../components/Navbar';
import { useApp } from '../context/AppContext';
import '../styles/Pagina.css';
import '../styles/Simulacao.css';

export default function Simulacao() {
  const { produtos, calcularCustoTotal, calcularLucroMensal, calcularPrecoSugerido, configuracoes } = useApp();

  const [produtoSelecionado, setProdutoSelecionado] = useState('');
  const [precoVenda, setPrecoVenda] = useState('');
  const [quantidade, setQuantidade] = useState('');
  const [resultado, setResultado] = useState(null);

  // IDs sao strings (UUID) - comparar sem Number()
  const produtoAtual = produtos.find(p => p.id === produtoSelecionado) || null;
  const precoSugeridoRef = produtoAtual ? calcularPrecoSugerido(produtoAtual) : null;

  function fmt(v) {
    return Number(v).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  }

  function handleSimular(e) {
    e.preventDefault();
    if (!produtoAtual) return;
    const custoTotal = calcularCustoTotal(produtoAtual);
    const lucroMensal = calcularLucroMensal(precoVenda, custoTotal, quantidade);
    const lucroUnitario = Number(precoVenda) - custoTotal;
    const margemSobreVenda = Number(precoVenda) > 0
      ? (lucroUnitario / Number(precoVenda)) * 100
      : 0;
    const emPrejuizo = Number(precoVenda) < custoTotal;
    setResultado({ produto: produtoAtual, custoTotal, lucroMensal, lucroUnitario, margemSobreVenda, emPrejuizo });
  }

  return (
    <div>
      <Navbar />
      <main className="pagina-container">
        <div className="pagina-cabecalho">
          <div>
            <h1 className="pagina-titulo">Simulacao de Lucro</h1>
            <p className="pagina-subtitulo">Simule seus ganhos antes de definir o preco</p>
          </div>
        </div>

        <div className="pagina-grid">
          <div className="card">
            <h2 className="secao-titulo">Parametros da simulacao</h2>
            {produtos.length === 0 ? (
              <div className="estado-vazio">
                <p>Cadastre produtos para simular.</p>
              </div>
            ) : (
              <form onSubmit={handleSimular} className="auth-form">
                <div className="campo-grupo">
                  <label className="input-label">Selecione o produto</label>
                  <select
                    className="input-field"
                    value={produtoSelecionado}
                    onChange={e => { setProdutoSelecionado(e.target.value); setResultado(null); }}
                    required
                  >
                    <option value="">-- Selecione --</option>
                    {produtos.map(p => (
                      <option key={p.id} value={p.id}>{p.nome}</option>
                    ))}
                  </select>
                </div>

                {precoSugeridoRef !== null && (
                  <div className="alerta-info sim-sugestao">
                    Preco sugerido pelo sistema: <strong>{fmt(precoSugeridoRef)}</strong>
                    <small className="sim-nota-markup">
                      (baseado em markup de {configuracoes.margemLucro}% sobre o custo)
                    </small>
                  </div>
                )}

                <div className="campo-grupo">
                  <label className="input-label">Preco de venda (R$)</label>
                  <input
                    className="input-field"
                    type="number"
                    min="0"
                    step="0.01"
                    value={precoVenda}
                    onChange={e => setPrecoVenda(e.target.value)}
                    placeholder="0,00"
                    required
                  />
                </div>

                <div className="campo-grupo">
                  <label className="input-label">Quantidade vendida por mes</label>
                  <input
                    className="input-field"
                    type="number"
                    min="1"
                    value={quantidade}
                    onChange={e => setQuantidade(e.target.value)}
                    placeholder="Ex: 50"
                    required
                  />
                </div>

                <button type="submit" className="btn-primary">Simular</button>
              </form>
            )}
          </div>

          {resultado && (
            <div className="card">
              <h2 className="secao-titulo">Resultado</h2>

              {resultado.emPrejuizo && (
                <div className="alerta-erro">
                  Atencao! O preco definido esta abaixo do custo total. Voce tera prejuizo!
                </div>
              )}

              <div className="resumo-linha">
                <span>Produto:</span>
                <strong>{resultado.produto.nome}</strong>
              </div>
              <div className="resumo-linha">
                <span>Custo total unitario:</span>
                <strong>{fmt(resultado.custoTotal)}</strong>
              </div>
              <div className="resumo-linha">
                <span>Preco de venda:</span>
                <strong>{fmt(precoVenda)}</strong>
              </div>
              <div className="resumo-linha">
                <span>Lucro por unidade:</span>
                <strong className={resultado.emPrejuizo ? 'sim-valor-erro' : 'valor-verde'}>
                  {fmt(resultado.lucroUnitario)}
                </strong>
              </div>
              <div className="resumo-linha">
                <span>Margem sobre venda:</span>
                <strong className={resultado.margemSobreVenda < 10 ? 'sim-valor-alerta' : 'valor-verde'}>
                  {resultado.margemSobreVenda.toFixed(1)}%
                </strong>
              </div>
              <small className="sim-nota-margem">
                Margem calculada sobre o preco de venda (diferente do markup configurado).
              </small>
              <div className="resumo-linha destaque">
                <span>Lucro mensal estimado:</span>
                <strong className={`sim-lucro-mensal ${resultado.emPrejuizo ? 'sim-valor-erro' : 'valor-verde'}`}>
                  {fmt(resultado.lucroMensal)}
                </strong>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
