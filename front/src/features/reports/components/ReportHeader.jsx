import { Link } from 'react-router-dom';

export function ReportHeader({ businessName, logo, region, monthName, year }) {
  return <div className="relatorio-cabecalho-impresso card">
    <div className="relatorio-cabecalho-inner">
      {logo && <img src={logo} alt="Logo do negócio" className="relatorio-logo" />}
      <div>
        {businessName && <h2 className="relatorio-nome-negocio">{businessName}</h2>}
        <p className="relatorio-periodo-desc">Projeção mensal - <strong>{monthName} {year}</strong></p>
        {region && <p className="relatorio-regiao">{region}</p>}
      </div>
    </div>
    {!businessName && !logo && <p className="relatorio-sem-identidade">💡 Adicione o nome e logo do seu negócio em{' '}<Link to="/configuracoes">Configurações</Link>{' '}para personalizar este cabeçalho.</p>}
  </div>;
}
