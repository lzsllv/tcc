import { useState } from 'react';
import Navbar from '../components/Navbar';
import { useApp } from '../context/AppContext';
import '../styles/Pagina.css';

export default function Simulacao() {
  const { produtos, calcularCustoTotal, calcularLucroMensal, calcularPrecoSugerido } = useApp();

  const [produtoSelecionado, setProdutoSelecionado] = useState('');
  const [precoVenda, setPrecoVenda] = useState('');
  const [quantidade, setQuantidade] = useState('');
  const [resultado, setResultado] = useState(null);

  // Produto atualmente selecionado no select
  const produtoAtual = produtos.find(p => p.id === Number(produtoSelecionado)) || null;
  const precoSugeridoRef = produtoAtual ? calcularPrecoSugerido(produtoAtual) : null;

  function formatarMoeda(valor) {
    return Number(valor).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  }

  function handleSimular(e) {
    e.preventDefault();
    if (!produtoAtual) return;

    const custoTotal = calcularCustoTotal(produtoAtual);
    const lucroMensal = calcularLucroMensal(precoVenda, custoTotal, quantidade);
    const lucroUnitario = Number(precoVenda) - custoTotal;
    const margemReal = custoTotal > 0 ? (lucroUnitario / custoTotal) * 100 : 0;
    const emPrejuizo = Number(precoVenda) < custoTotal;

    setResultado({ produto: produtoAtual, custoTotal, lucroMensal, lucroUnitario, margemReal, emPrejuizo });
  }

  return (
    <div>
      <Navbar />
      <main className="pagina-container">
        <div className="pagina-cabecalho">
          <div>
            <h1 className="pagina-titulo">📈 Simulação de Lucro</h1>
            <p className="pagina-subtitulo">Simule seus ganhos antes de definir o preço</p>
          </div>
        </div>

        <div className="pagina-grid">
          {/* Formulário */}
          <div className="card">
            <h2 className="secao-titulo">Parâmetros da simulação</h2>
            {produtos.length === 0 ? (
              <div className="estado-vazio">
                <span>📦</span>
                <p>Cadastre produtos para simular.</p>
              </div>
            ) : (
              <form onSubmit={handleSimular} className="auth-form">
                <div className="campo-grupo">
                  <label className="input-label">Selecione o produto</label>
                  <select
                    className="input-field"
                    value={produtoSelecionado}
                    onChange={e => {
                      setProdutoSelecionado(e.target.value);
                      setResultado(null);
                    }}
                    required
                  >
                    <option value="">-- Selecione --</option>
                    {produtos.map(p => (
                      <option key={p.id} value={p.id}>{p.nome}</option>
                    ))}
                  </select>
                </div>

                {/* Mostra o preço sugerido assim que o produto é selecionado */}
                {precoSugeridoRef !== null && (
                  <div className="alerta-info" style={{marginBottom:'0.5rem'}}>
                    💡 Preço sugerido pelo sistema: <strong>{formatarMoeda(precoSugeridoRef)}</strong>
                  </div>
                )}

                <div className="campo-grupo">
                  <label className="input-label">Preço de venda (R$)</label>
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
                  <label className="input-label">Quantidade vendida por mês</label>
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

          {/* Resultado */}
          {resultado && (
            <div className="card">
              <h2 className="secao-titulo">📊 Resultado</h2>

              {resultado.emPrejuizo && (
                <div className="alerta-erro">⚠️ Atenção! O preço definido está abaixo do custo total. Você terá prejuízo!</div>
              )}

              <div className="resumo-linha">
                <span>Produto:</span>
                <strong>{resultado.produto.nome}</strong>
              </div>
              <div className="resumo-linha">
                <span>Custo total unitário:</span>
                <strong>{formatarMoeda(resultado.custoTotal)}</strong>
              </div>
              <div className="resumo-linha">
                <span>Preço de venda:</span>
                <strong>{formatarMoeda(precoVenda)}</strong>
              </div>
              <div className="resumo-linha">
                <span>Lucro por unidade:</span>
                <strong style={{color: resultado.emPrejuizo ? 'var(--erro)' : 'var(--verde-principal)'}}>
                  {formatarMoeda(resultado.lucroUnitario)}
                </strong>
              </div>
              <div className="resumo-linha">
                <span>Margem real:</span>
                <strong style={{color: resultado.margemReal < 10 ? 'var(--alerta)' : 'var(--verde-principal)'}}>
                  {resultado.margemReal.toFixed(1)}%
                </strong>
              </div>
              <div className="resumo-linha destaque">
                <span>💰 Lucro mensal estimado:</span>
                <strong style={{color: resultado.emPrejuizo ? 'var(--erro)' : 'var(--verde-principal)', fontSize:'1.2rem'}}>
                  {formatarMoeda(resultado.lucroMensal)}
                </strong>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
