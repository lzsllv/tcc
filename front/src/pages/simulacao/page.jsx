import { useEffect, useState } from 'react';
import { Package } from '@phosphor-icons/react';
import Navbar from '../../components/layout/Navbar';
import { useApp } from '../../context/AppContext.js';
import { fetchBackendProducts } from '../../services/products.js';
import { calculateServerProductSimulation } from '../../features/reports/domain/serverProductSimulation.js';
import '../../styles/Pagina.css';
import '../../features/reports/styles/Simulacao.css';

export default function Simulacao() {
  const {
    produtos,
    custosFixos,
    configuracoes,
    workspace,
    workspaceError,
    workspaceStatus,
    calcularCustoTotal,
    calcularLucroMensal,
    calcularPrecoSugerido,
  } = useApp();

  const [produtosServidor, setProdutosServidor] = useState([]);
  const [statusProdutosServidor, setStatusProdutosServidor] = useState('loading');
  const [erroProdutosServidor, setErroProdutosServidor] = useState('');
  const [produtoSelecionado, setProdutoSelecionado] = useState('');
  const [precoVenda,         setPrecoVenda]         = useState('');
  const [quantidade,         setQuantidade]         = useState('');
  const [resultado,          setResultado]          = useState(null);

  useEffect(() => {
    const controller = new AbortController();
    fetchBackendProducts({ signal: controller.signal })
      .then(items => {
        setProdutosServidor(items
          .filter(product => Number(product.ativo ?? 1) !== 0)
          .map(product => ({ ...product, id: `server:${product.id_produto}`, source: 'server' })));
        setStatusProdutosServidor('ready');
      })
      .catch(error => {
        if (controller.signal.aborted) return;
        setErroProdutosServidor(error.message || 'Não foi possível carregar os produtos do servidor.');
        setStatusProdutosServidor('error');
      });

    return () => controller.abort();
  }, []);

  const produtosDisponiveis = [...produtos, ...produtosServidor];
  const produtoAtual = produtosDisponiveis.find(product => String(product.id) === produtoSelecionado) || null;
  const isProdutoServidor = produtoAtual?.source === 'server';
  const simulacaoProdutoServidor = isProdutoServidor
    ? calculateServerProductSimulation({
      product: produtoAtual,
      settings: configuracoes,
      fixedCosts: custosFixos,
      workspace,
      monthlyQuantity: quantidade,
      salePrice: precoVenda,
    })
    : null;
  const precoSugeridoRef = isProdutoServidor
    ? simulacaoProdutoServidor.suggestedPrice
    : produtoAtual ? calcularPrecoSugerido(produtoAtual) : null;

  function fmt(v) {
    if (v === null || !Number.isFinite(Number(v))) return 'Indisponível';
    return Number(v).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  }

  function handleSimular(e) {
    e.preventDefault();
    if (!produtoAtual) return;
    const custoTotal = isProdutoServidor
      ? simulacaoProdutoServidor.totalCost
      : calcularCustoTotal(produtoAtual, Number(precoVenda));
    if (custoTotal === null) { setResultado(null); return; }
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
            <h1 className="pagina-titulo">Simulação de Lucro</h1>
            <p className="pagina-subtitulo">Simule seus ganhos antes de definir o preço</p>
          </div>
        </div>

        {workspaceError && <div className="alerta-erro" role="alert">Não foi possível carregar os dados do backend: {workspaceError}</div>}
        {erroProdutosServidor && <div className="alerta-erro" role="alert">Não foi possível carregar produtos cadastrados no servidor: {erroProdutosServidor}</div>}
        {workspaceStatus === 'loading' && <div className="alerta-aviso" role="status">Carregando dados do backend...</div>}
        {statusProdutosServidor === 'loading' && <div className="alerta-aviso" role="status">Carregando produtos cadastrados no servidor...</div>}

        <div className="pagina-grid">
          <div className="card">
            <h2 className="secao-titulo">Parâmetros da simulação</h2>
            {produtosDisponiveis.length === 0 && statusProdutosServidor === 'loading' ? (
              <div className="estado-vazio" role="status"><p>Carregando produtos...</p></div>
            ) : produtosDisponiveis.length === 0 ? (
              <div className="estado-vazio">
                <span><Package size={30} /></span>
                <p>Cadastre produtos para simular.</p>
              </div>
            ) : (
              <form onSubmit={handleSimular} className="auth-form">
                <div className="campo-grupo">
                  <label className="input-label" htmlFor="simulation-product">Selecione o produto</label>
                  <select id="simulation-product" className="input-field" value={produtoSelecionado}
                    onChange={e => { setProdutoSelecionado(e.target.value); setResultado(null); }}
                    required
                  >
                    <option value="">-- Selecione --</option>
                    {produtos.map(p => (
                      <option key={p.id} value={p.id}>{p.nome}</option>
                    ))}
                    {produtosServidor.map(p => (
                      <option key={p.id} value={p.id}>{p.nome}</option>
                    ))}
                  </select>
                </div>

                {isProdutoServidor && (
                  <p className="sim-nota-margem" role="status">
                    Para este produto, o custo considera o custo direto, a mão de obra e o rateio dos custos fixos pela quantidade mensal informada.
                  </p>
                )}

                {precoSugeridoRef !== null && (
                  <div className="alerta-info sim-sugestao">
                    💡 Preço sugerido pelo sistema: <strong>{fmt(precoSugeridoRef)}</strong>
                    <small className="sim-nota-markup">
                      (considera as taxas do canal selecionado e a margem sobre a venda)
                    </small>
                  </div>
                )}

                <div className="campo-grupo">
                  <label className="input-label" htmlFor="simulation-sale-price">Preço de venda (R$)</label>
                  <input id="simulation-sale-price" className="input-field" type="number" min="0" step="0.01"
                    value={precoVenda} onChange={e => { setPrecoVenda(e.target.value); setResultado(null); }}
                    placeholder="0,00" required />
                </div>

                <div className="campo-grupo">
                  <label className="input-label" htmlFor="simulation-monthly-quantity">Quantidade vendida por mês</label>
                  <input id="simulation-monthly-quantity" className="input-field" type="number" min="1"
                    value={quantidade} onChange={e => { setQuantidade(e.target.value); setResultado(null); }}
                    placeholder="Ex: 50" required />
                </div>

                {precoSugeridoRef === null && <p role="status">{isProdutoServidor && !Number(quantidade) ? 'Informe a quantidade mensal para calcular o rateio e o preço sugerido.' : 'Preço indisponível. Confira o planejamento mensal, o canal e a margem do produto.'}</p>}
                <button type="submit" className="btn-primary" disabled={precoSugeridoRef === null}>Simular</button>
              </form>
            )}
          </div>

          {resultado && (
            <div className="card">
              <h2 className="secao-titulo">Resultado</h2>

              {resultado.emPrejuizo && (
                <div className="alerta-erro">
                  Atenção! O preço definido está abaixo do custo total. Você terá prejuízo!
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
                Margem calculada sobre o preço de venda, após custos e taxas do canal.
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
