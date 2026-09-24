export function ReportSummary({ totalRevenue, totalProfit, totalCosts, settings, productCount, formatMoney, monthName, year }) {
  return <div className="card relatorio-secao">
    <h2 className="secao-titulo">Resumo da projeção - {monthName} {year}</h2>
    <div className="relatorio-grid-info">
      <div className="info-item"><span className="info-label">Receita bruta projetada</span><span className="info-valor valor-verde">{formatMoney(totalRevenue)}</span></div>
      <div className="info-item"><span className="info-label">Lucro total projetado</span><span className="info-valor valor-verde">{formatMoney(totalProfit)}</span></div>
      <div className="info-item"><span className="info-label">Total de custos fixos</span><span className="info-valor">{formatMoney(totalCosts)}</span></div>
      <div className="info-item"><span className="info-label">Markup configurado</span><span className="info-valor">{settings.margemLucro}%</span></div>
      <div className="info-item"><span className="info-label">Custo/hora de trabalho</span><span className="info-valor">{formatMoney(settings.custoHora)}</span></div>
      <div className="info-item"><span className="info-label">Produtos cadastrados</span><span className="info-valor">{productCount}</span></div>
    </div>
  </div>;
}
