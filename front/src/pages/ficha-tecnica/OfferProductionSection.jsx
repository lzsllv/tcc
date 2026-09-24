export function OfferProductionSection({ form, onChange }) {
  return <section className="card ficha-secao">
    <div className="ficha-secao-cabecalho"><span>03</span><div><h2>Produção e margem</h2><p>Informe o rendimento e o tempo dedicado ao lote.</p></div></div>
    <div className="form-grid">
      {form.kind === 'product' && <div className="campo-grupo"><label className="input-label" htmlFor="batch-yield">Rendimento do lote</label><input id="batch-yield" className="input-field" type="number" min="0.001" step="any" value={form.batchYield} onChange={event => onChange('batchYield', event.target.value)} required /><small className="input-hint">Quantidade de unidades produzidas por lote.</small></div>}
      <div className="campo-grupo"><label className="input-label" htmlFor="batch-time">Tempo do lote (minutos)</label><input id="batch-time" className="input-field" type="number" min="0" step="1" value={form.batchTimeMinutes} onChange={event => onChange('batchTimeMinutes', event.target.value)} placeholder="Ex: 90" /></div>
      <div className="campo-grupo"><label className="input-label" htmlFor="monthly-sales">Vendas planejadas por mês</label><input id="monthly-sales" className="input-field" type="number" min="0" step="any" value={form.expectedMonthlySales} onChange={event => onChange('expectedMonthlySales', event.target.value)} placeholder="Ex: 30" /></div>
      <div className="campo-grupo"><label className="input-label" htmlFor="desired-margin">Margem específica (%)</label><input id="desired-margin" className="input-field" type="number" min="0" max="100" step="0.01" value={form.desiredMargin} onChange={event => onChange('desiredMargin', event.target.value)} placeholder="Usar margem padrão" /><small className="input-hint">Deixe vazio para usar a margem das configurações.</small></div>
    </div>
  </section>;
}
