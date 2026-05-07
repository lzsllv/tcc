import Navbar from '../components/Navbar';
import { useApp } from '../context/AppContext';
import '../styles/Pagina.css';

export default function Relatorio() {
  const {
    produtos,
    custosFixos,
    configuracoes,
    totalCustosFixos,
    custoFixoPorProduto,
    calcularCustoTotal,
    calcularPrecoSugerido,
  } = useApp();

  function formatarMoeda(valor) {
    return Number(valor).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  }

  const totalCustos = totalCustosFixos();
  const custoFixoProd = custoFixoPorProduto();

  return (
    <div>
      <Navbar />
      <main className="pagina-container">
        <div className="pagina-cabecalho">
          <div>
            <h1 className="pagina-titulo">📊 Relatório</h1>
            <p className="pagina-subtitulo">Visão completa dos seus custos, preços e margens</p>
          </div>
        </div>

        {/* Resumo geral */}
        <div className="card" style={{marginBottom:'1.5rem'}}>
          <h2 className="secao-titulo">Resumo geral</h2>
          <div className="relatorio-grid-info">
            <div className="info-item">
              <span className="info-label">Total de custos fixos mensais</span>
              <span className="info-valor">{formatarMoeda(totalCustos)}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Custo fixo por produto</span>
              <span className="info-valor">{formatarMoeda(custoFixoProd)}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Margem de lucro definida</span>
              <span className="info-valor">{configuracoes.margemLucro}%</span>
            </div>
            <div className="info-item">
              <span className="info-label">Custo/hora de trabalho</span>
              <span className="info-valor">{formatarMoeda(configuracoes.custoHora)}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Região de atuação</span>
              <span className="info-valor">{configuracoes.regiaoAtuacao || '—'}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Produtos cadastrados</span>
              <span className="info-valor">{produtos.length}</span>
            </div>
          </div>
        </div>

        {/* Custos fixos detalhados */}
        <div className="card" style={{marginBottom:'1.5rem'}}>
          <h2 className="secao-titulo">Custos fixos detalhados</h2>
          <div className="tabela-wrapper">
            <table className="tabela">
              <thead>
                <tr><th>Despesa</th><th>Valor mensal</th></tr>
              </thead>
              <tbody>
                {Object.entries(custosFixos).map(([key, val]) => (
                  <tr key={key}>
                    <td style={{textTransform:'capitalize'}}>{key}</td>
                    <td>{formatarMoeda(val)}</td>
                  </tr>
                ))}
                <tr style={{fontWeight:700, background:'var(--verde-fundo)'}}>
                  <td>Total</td>
                  <td className="valor-verde">{formatarMoeda(totalCustos)}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Tabela de produtos */}
        <div className="card">
          <h2 className="secao-titulo">Produtos e preços sugeridos</h2>
          {produtos.length === 0 ? (
            <div className="estado-vazio"><span>📦</span><p>Nenhum produto cadastrado.</p></div>
          ) : (
            <div className="tabela-wrapper">
              <table className="tabela">
                <thead>
                  <tr>
                    <th>Produto</th>
                    <th>Categoria</th>
                    <th>Custo direto</th>
                    <th>Custo total</th>
                    <th>Preço sugerido</th>
                    <th>Margem</th>
                  </tr>
                </thead>
                <tbody>
                  {produtos.map(p => {
                    const custoTotal = calcularCustoTotal(p);
                    const precoSugerido = calcularPrecoSugerido(p);
                    return (
                      <tr key={p.id}>
                        <td>{p.nome}</td>
                        <td><span className="badge">{p.categoria}</span></td>
                        <td>{formatarMoeda(p.custo)}</td>
                        <td>{formatarMoeda(custoTotal)}</td>
                        <td className="preco-sugerido">{formatarMoeda(precoSugerido)}</td>
                        <td>{configuracoes.margemLucro}%</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
