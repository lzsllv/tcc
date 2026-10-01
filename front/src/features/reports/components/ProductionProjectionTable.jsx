import { Package } from '@phosphor-icons/react';
import { Link } from 'react-router-dom';

export function ProductionProjectionTable({ products, zeroCosts, totalCosts, totalUnits, fixedCostPerUnit, totalProfit, totalProductCost, suggestedPrice, formatMoney, monthName, year }) {
  return <div className="card relatorio-secao">
    <h2 className="secao-titulo">Produção e projeção - {monthName} {year}</h2>
    {products.length > 0 && !zeroCosts && <div className="alerta-info relatorio-rateio-info"><strong>Rateio do custo fixo:</strong> {formatMoney(totalCosts)} ÷ {totalUnits} un totais{' '}= <strong>{formatMoney(fixedCostPerUnit)}/un</strong> para qualquer produto.</div>}
    {products.length === 0 ? <div className="estado-vazio"><span><Package size={30} /></span><p>Nenhum produto cadastrado.</p><Link to="/produtos" className="btn-primary btn-estado-vazio">Cadastrar produto</Link></div> : <div className="tabela-wrapper">
      <table className="tabela"><thead><tr><th>Produto</th><th>Categoria</th><th>Qtd/mês</th><th>Custo direto</th><th>Fixo/un</th><th>Custo total</th><th>Preço sugerido</th><th>Lucro/un</th><th>Lucro mês</th></tr></thead><tbody>
        {products.map(product => {
          const cost = totalProductCost(product);
          const price = suggestedPrice(product);
          const quantity = Number(product.quantidadeMes || 0);
          const unitProfit = price - cost;
          const monthlyProfit = unitProfit * quantity;
          return <tr key={product.id}><td>{product.nome}</td><td><span className="badge">{product.categoria}</span></td><td>{quantity > 0 ? `${quantity} un.` : <span className="texto-aviso-sm">Não informado</span>}</td><td>{formatMoney(product.custo)}</td><td>{formatMoney(fixedCostPerUnit)}</td><td>{formatMoney(cost)}</td><td className="preco-sugerido">{formatMoney(price)}</td><td className="valor-verde">{formatMoney(unitProfit)}</td><td className="valor-verde">{formatMoney(monthlyProfit)}</td></tr>;
        })}
      </tbody><tfoot><tr><td colSpan={8}>Total</td><td className="valor-verde">{formatMoney(totalProfit)}</td></tr></tfoot></table>
      <p className="tabela-nota">* Fixo/un = {formatMoney(totalCosts)} ÷ {totalUnits} un = {formatMoney(fixedCostPerUnit)}/un</p>
    </div>}
  </div>;
}
