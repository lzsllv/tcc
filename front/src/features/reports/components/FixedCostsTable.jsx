import { Coins } from '@phosphor-icons/react';
import { Link } from 'react-router-dom';

export function FixedCostsTable({ costs, zeroCosts, totalCosts, costNames, formatMoney }) {
  return <div className="card relatorio-secao">
    <h2 className="secao-titulo">Custos fixos detalhados</h2>
    {zeroCosts ? <div className="estado-vazio"><span><Coins size={30} /></span><p>Nenhum custo fixo registrado.</p><Link to="/custos-fixos" className="btn-primary btn-estado-vazio">Cadastrar custos fixos</Link></div> : <div className="tabela-wrapper">
      <table className="tabela"><thead><tr><th>Despesa</th><th>Valor mensal</th></tr></thead><tbody>
        {Object.entries(costs).filter(([key, value]) => key !== 'extras' && Number(value) > 0).map(([key, value]) => <tr key={key}><td>{costNames[key] || key}</td><td>{formatMoney(value)}</td></tr>)}
        {(costs.extras || []).filter(extra => Number(extra.valor) > 0).map(extra => <tr key={extra.id}><td>{extra.nome || extra.descricao || 'Extra'}</td><td>{formatMoney(extra.valor)}</td></tr>)}
        <tr className="tabela-total"><td>Total</td><td className="valor-verde">{formatMoney(totalCosts)}</td></tr>
      </tbody></table>
    </div>}
  </div>;
}
