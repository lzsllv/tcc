import { useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { useApp } from '../context/AppContext.js';
import { FixedCostsTable } from './relatorio/FixedCostsTable.jsx';
import { ProductionProjectionTable } from './relatorio/ProductionProjectionTable.jsx';
import { ReportHeader } from './relatorio/ReportHeader.jsx';
import { ReportSummary } from './relatorio/ReportSummary.jsx';
import { createReportProjection } from './relatorio/reportProjection.js';
import '../styles/Pagina.css';
import '../styles/Relatorio.css';

const COST_NAMES = { aluguel: 'Aluguel', energia: 'Energia', internet: 'Internet', salarios: 'Salários', outros: 'Outros' };
const MONTHS = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];

function formatMoney(value) {
  return Number(value).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

export default function Relatorio() {
  const {
    produtos, custosFixos, configuracoes,
    totalCustosFixos, totalUnidadesMes, custoFixoPorUnidade,
    calcularCustoTotal, calcularPrecoSugerido,
  } = useApp();
  const today = new Date();
  const [selectedMonth, setSelectedMonth] = useState(today.getMonth());
  const [selectedYear, setSelectedYear] = useState(today.getFullYear());
  const years = Array.from({ length: 5 }, (_, index) => today.getFullYear() - 2 + index);
  const monthName = MONTHS[selectedMonth];
  const projection = createReportProjection(produtos, totalCustosFixos, totalUnidadesMes, custoFixoPorUnidade, calcularCustoTotal, calcularPrecoSugerido);

  return <div>
    <Navbar />
    <main className="pagina-container">
      <div className="pagina-cabecalho">
        <div><h1 className="pagina-titulo">Relatório</h1><p className="pagina-subtitulo">Visão completa dos seus custos, preços e margens</p></div>
        <button className="btn-primary btn-imprimir" onClick={() => window.print()}>🖨️ Imprimir relatório</button>
      </div>

      <div className="card relatorio-filtro">
        <h2 className="secao-titulo">📅 Período de referência</h2>
        <p className="relatorio-filtro-aviso">Este relatório exibe uma <strong>projeção mensal</strong> com base nos dados atuais. O mês e ano selecionados aparecem apenas no cabeçalho impresso.</p>
        <div className="relatorio-filtro-campos">
          <div className="campo-grupo campo-sem-margem"><label className="input-label">Mês</label><select className="input-field" value={selectedMonth} onChange={event => setSelectedMonth(Number(event.target.value))}>{MONTHS.map((month, index) => <option key={index} value={index}>{month}</option>)}</select></div>
          <div className="campo-grupo campo-sem-margem"><label className="input-label">Ano</label><select className="input-field" value={selectedYear} onChange={event => setSelectedYear(Number(event.target.value))}>{years.map(year => <option key={year} value={year}>{year}</option>)}</select></div>
          <p className="relatorio-periodo-label">Cabeçalho do impresso: <strong>{monthName} {selectedYear}</strong></p>
        </div>
      </div>

      <ReportHeader businessName={configuracoes.nomeNegocio || ''} logo={configuracoes.logoNegocio || ''} region={configuracoes.regiaoAtuacao} monthName={monthName} year={selectedYear} />
      {projection.zeroCosts && <div className="alerta-aviso relatorio-alerta">Seus custos fixos estão zerados.{' '}<Link to="/custos-fixos">Preencher custos fixos</Link></div>}
      {produtos.some(product => !product.quantidadeMes || Number(product.quantidadeMes) === 0) && <div className="alerta-aviso relatorio-alerta">Alguns produtos não têm quantidade mensal informada.{' '}<Link to="/produtos">Corrigir produtos</Link></div>}
      <ReportSummary totalRevenue={projection.totalRevenue} totalProfit={projection.totalProfit} totalCosts={projection.totalCosts} settings={configuracoes} productCount={produtos.length} formatMoney={formatMoney} monthName={monthName} year={selectedYear} />
      <FixedCostsTable costs={custosFixos} zeroCosts={projection.zeroCosts} totalCosts={projection.totalCosts} costNames={COST_NAMES} formatMoney={formatMoney} />
      <ProductionProjectionTable products={produtos} zeroCosts={projection.zeroCosts} totalCosts={projection.totalCosts} totalUnits={projection.totalUnits} fixedCostPerUnit={projection.fixedCostPerUnit} totalProfit={projection.totalProfit} totalProductCost={calcularCustoTotal} suggestedPrice={calcularPrecoSugerido} formatMoney={formatMoney} monthName={monthName} year={selectedYear} />
    </main>
  </div>;
}
