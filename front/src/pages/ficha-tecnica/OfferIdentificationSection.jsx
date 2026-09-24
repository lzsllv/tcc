export function OfferIdentificationSection({ form, onChange, onKindChange }) {
  return <section className="card ficha-secao">
    <div className="ficha-secao-cabecalho"><span>01</span><div><h2>Identificação</h2><p>Defina o que será vendido.</p></div></div>
    <div className="ficha-tipo" role="group" aria-label="Tipo da oferta">
      <button type="button" className={form.kind === 'product' ? 'ativo' : ''} onClick={() => onKindChange('product')}>Produto</button>
      <button type="button" className={form.kind === 'service' ? 'ativo' : ''} onClick={() => onKindChange('service')}>Serviço</button>
    </div>
    <div className="form-grid">
      <div className="campo-grupo"><label className="input-label" htmlFor="offer-name">Nome</label><input id="offer-name" className="input-field" value={form.name} onChange={event => onChange('name', event.target.value)} placeholder={form.kind === 'product' ? 'Ex: Bolo de chocolate' : 'Ex: Consultoria personalizada'} required /></div>
      <div className="campo-grupo"><label className="input-label" htmlFor="offer-category">Categoria</label><input id="offer-category" className="input-field" value={form.category} onChange={event => onChange('category', event.target.value)} placeholder="Ex: Bolos, Artesanato, Consultoria" required /></div>
    </div>
  </section>;
}
