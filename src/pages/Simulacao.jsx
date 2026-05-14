import { useState } from 'react';
import Navbar from '../components/Navbar';
import { useApp } from '../context/AppContext';
import '../styles/Pagina.css';
import '../styles/Simulacao.css';

export default function Simulacao() {
  const { produtos, calcularCustoTotal, calcularLucroMensal, calcularPrecoSugerido, configuracoes } = useApp();

  const [produtoSelecionado, setProdutoSelecionado] = useState('');
  const [precoVenda,         setPrecoVenda]         = useState('');
  const [quantidade,         setQuantidade]         = useState('');
  const [resultado,          setResultado]          = useState(null);
  const [erro,               setErro]               = useState('');

  const produtoAtual     = produtos.find(p => p.id === Number(produtoSelecionado)) || null;
  const precoSugeridoRef = produtoAtual ? calcularPrecoSugerido(produtoAtual) : null;

  function fmt(v) {
    return Number(v).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  }

  function handleSelecionarProduto(id) {
    setProdutoSelecionado(id);
    setPrecoVenda('');
    setQuantidade('');
    setResultado(null);
    setErro('');
  }

  function usarPrecoSugerido() {
    if (precoSugeridoRef !== null) {
      setPrecoVenda(precoSugeridoRef.toFixed(2));
    }
  }

  function handleSimular(e) {
    e.preventDefault();
    setErro('');
    if (!produtoAtual) return;
    if (!precoVenda || Number(precoVenda) <= 0) { setErro('Informe um preço de venda maior que zero.'); return; }
    if (!quantidade  || Number(quantidade) < 1) { setErro('Informe uma quantidade válida (mínimo 1).'); return; }
    const custoTotal       = calcularCustoTotal(produtoAtual);
    const lucroMensal      = calcularLucroMensal(precoVenda, custoTotal, quantidade);
    const lucroUnitario    = Number(precoVenda) - custoTotal;
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
                {erro && <div className="alerta-erro">{erro}</div>}

                <div className="campo-grupo">
                  <label className="input-label">Selecione o produto</label>
                  <select className="input-field" value={produtoSelecionado}
                    onChange={e => handleSelecionarProduto(e.target.value)}
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
                    <div>
                      💡 Preço sugerido pelo sistema: <strong>{fmt(precoSugeridoRef)}</strong>
                      <small className="sim-nota-markup">
                        (baseado em markup de {configuracoes.margemLucro}% sobre o custo)
                      </small>
                    </div>
                    <button type="button" className="btn-usar-sugerido" onClick={usarPrecoSugerido}>
                      Usar esse preço
                    </button>
                  </div>
                )}

                <div className="campo-grupo">
                  <label className="input-label">Preço de venda (R$)</label>
                  <input className="input-field" type="number" min="0.01" step="0.01"
                    value={precoVenda} onChange={e => { setPrecoVenda(e.target.value); setResultado(null); }}
                    placeholder="0,00" />
                </div>

                <div className="campo-grupo">
                  <label className="input-label">Quantidade vendida por mês</label>
                  <input className="input-field" type="number" min="1"
                    value={quantidade} onChange={e => { setQuantidade(e.target.value); setResultado(null); }}
                    placeholder="Ex: 50" />
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
                <div className="alerta-erro">
                  ⚠️ Atenção! O preço definido está abaixo do custo total. Você terá prejuízo!
                </div>
              )}

              <div className="resumo-linha">
                <span>Produto:</span>
                <strong>{resultado.produto.nome}</strong>
              </div>
              <div className="resumo-linha">
                <span>Custo total unitário:</span>
                <strong>{fmt(resultado.custoTotal)}</strong>
              </div>
              <div className="resumo-linha">
                <span>Preço de venda:</span>
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
                ℹ️ Margem calculada sobre o preço de venda (diferente do markup configurado).
              </small>
              <div className="resumo-linha destaque">
                <span>💰 Lucro mensal estimado:</span>
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
