import Navbar from '../components/Navbar';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import '../styles/Pagina.css';

const NOMES_CUSTOS = {
  aluguel:  'Aluguel',
  energia:  'Energia',
  internet: 'Internet',
  salarios: 'Salários',
  outros:   'Outros',
};

export default function Relatorio() {
  const {
    produtos,
    custosFixos,
    configuracoes,
    totalCustosFixos,
    totalUnidadesMes,
    custoFixoPorProduto,
    custoFixoPorUnidade,
    calcularCustoTotal,
    calcularPrecoSugerido,
  } = useApp();

  function formatarMoeda(valor) {
    return Number(valor).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  }

  const totalCustos     = totalCustosFixos();
  const custoFixoMedio  = custoFixoPorProduto();
  const totalUnidades   = totalUnidadesMes();
  const fixoPorUnidade  = custoFixoPorUnidade();
  const custosZerados   = totalCustos === 0;

  function handleImprimir() { window.print(); }

  return (
    <div>
      <Navbar />
      <main className="pagina-container">
        <div className="pagina-cabecalho">
          <div>
            <h1 className="pagina-titulo">📊 Relatório</h1>
            <p className="pagina-subtitulo">Visão completa dos seus custos, preços e margens</p>
          </div>
          <button className="btn-primary" style={{width:'auto'}} onClick={handleImprimir}>
            🖨️ Imprimir relatório
          </button>
        </div>

        {custosZerados && (
          <div className="alerta-aviso" style={{marginBottom:'1.5rem'}}>
            ⚠️ Seus custos fixos estão zerados. Os preços sugeridos podem estar abaixo do valor real.{' '}
            <Link to="/custos-fixos" style={{color:'inherit', fontWeight:700, textDecoration:'underline'}}>
              Preencher custos fixos
            </Link>
          </div>
        )}

        {produtos.some(p => !p.quantidadeMes || Number(p.quantidadeMes) === 0) && (
          <div className="alerta-aviso" style={{marginBottom:'1.5rem'}}>
            ⚠️ Alguns produtos não têm a quantidade mensal informada. O rateio dos custos fixos usa 1 unidade como base, o que pode elevar muito o custo.{' '}
            <Link to="/produtos" style={{color:'inherit', fontWeight:700, textDecoration:'underline'}}>
              Corrigir produtos
            </Link>
          </div>
        )}

        {/* Resumo geral */}
        <div className="card" style={{marginBottom:'1.5rem'}}>
          <h2 className="secao-titulo">Resumo geral</h2>
          <div className="relatorio-grid-info">
            <div className="info-item">
              <span className="info-label">Total de custos fixos mensais</span>
              <span className="info-valor">{formatarMoeda(totalCustos)}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Média de custo fixo por tipo de produto</span>
              <span className="info-valor">{formatarMoeda(custoFixoMedio)}</span>
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
          {custosZerados ? (
            <div className="estado-vazio">
              <span>💸</span>
              <p>Nenhum custo fixo registrado ainda.</p>
              <Link to="/custos-fixos" className="btn-primary" style={{display:'inline-block', width:'auto', padding:'0.6rem 1.5rem', marginTop:'1rem'}}>
                Cadastrar custos fixos
              </Link>
            </div>
          ) : (
            <div className="tabela-wrapper">
              <table className="tabela">
                <thead>
                  <tr><th>Despesa</th><th>Valor mensal</th></tr>
                </thead>
                <tbody>
                  {Object.entries(custosFixos)
                    .filter(([, val]) => Number(val) > 0)
                    .map(([key, val]) => (
                      <tr key={key}>
                        <td>{NOMES_CUSTOS[key] || key}</td>
                        <td>{formatarMoeda(val)}</td>
                      </tr>
                    ))
                  }
                  <tr style={{fontWeight:700, background:'var(--verde-fundo)'}}>
                    <td>Total</td>
                    <td className="valor-verde">{formatarMoeda(totalCustos)}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Tabela de produtos */}
        <div className="card">
          <h2 className="secao-titulo">Produtos e preços sugeridos</h2>

          {/* Explicação do rateio */}
          {produtos.length > 0 && !custosZerados && (
            <div className="alerta-info" style={{marginBottom:'1rem', fontSize:'0.85rem'}}>
              ℹ️ <strong>Como o custo fixo é rateado:</strong> O total de custos fixos
              ({formatarMoeda(totalCustos)}) é dividido pelo <strong>total de unidades
              de todos os produtos juntos ({totalUnidades} un/mês)</strong>, resultando
              em {formatarMoeda(fixoPorUnidade)} por unidade para qualquer produto.
              Isso garante que os custos fixos sejam cobertos proporcionalmente.
            </div>
          )}

          {produtos.length === 0 ? (
            <div className="estado-vazio">
              <span>📦</span>
              <p>Nenhum produto cadastrado.</p>
              <Link to="/produtos" className="btn-primary" style={{display:'inline-block', width:'auto', padding:'0.6rem 1.5rem', marginTop:'1rem'}}>
                Cadastrar produto
              </Link>
            </div>
          ) : (
            <div className="tabela-wrapper">
              <table className="tabela">
                <thead>
                  <tr>
                    <th>Produto</th>
                    <th>Categoria</th>
                    <th>Qtd/mês</th>
                    <th>Custo direto</th>
                    <th>Fixo/unidade*</th>
                    <th>Custo total</th>
                    <th>Preço sugerido</th>
                    <th>Margem</th>
                  </tr>
                </thead>
                <tbody>
                  {produtos.map(p => {
                    const fixoUnidade  = custoFixoPorUnidade();
                    const custoTotal   = calcularCustoTotal(p);
                    const precoSugerido = calcularPrecoSugerido(p);
                    return (
                      <tr key={p.id}>
                        <td>{p.nome}</td>
                        <td><span className="badge">{p.categoria}</span></td>
                        <td>
                          {p.quantidadeMes && Number(p.quantidadeMes) > 0
                            ? `${p.quantidadeMes} un.`
                            : <span style={{color:'var(--alerta)', fontSize:'0.8rem'}}>Não informado</span>
                          }
                        </td>
                        <td>{formatarMoeda(p.custo)}</td>
                        <td>{formatarMoeda(fixoUnidade)}</td>
                        <td>{formatarMoeda(custoTotal)}</td>
                        <td className="preco-sugerido">{formatarMoeda(precoSugerido)}</td>
                        <td>{configuracoes.margemLucro}%</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              <p style={{fontSize:'0.78rem', color:'var(--neutro-muted)', marginTop:'0.5rem'}}>
                * Fixo/unidade = {formatarMoeda(totalCustos)} ÷ {totalUnidades} un totais = {formatarMoeda(fixoPorUnidade)}/un
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
