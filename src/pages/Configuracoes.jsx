import { useState, useRef } from 'react';
import Navbar from '../components/Navbar';
import { useApp } from '../context/AppContext';
import '../styles/Pagina.css';

export default function Configuracoes() {
  const { configuracoes, setConfiguracoes } = useApp();
  const [sucesso, setSucesso] = useState('');
  const [erro,    setErro]    = useState('');
  const [aviso,   setAviso]   = useState('');
  const inputLogoRef = useRef(null);

  function handleChange(campo, valor) {
    setConfiguracoes(prev => ({ ...prev, [campo]: valor }));
  }

  function handleLogoUpload(e) {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 500 * 1024) {
      setErro('A imagem deve ter no máximo 500 KB.');
      return;
    }
    const reader = new FileReader();
    reader.onload = ev => handleChange('logoNegocio', ev.target.result);
    reader.readAsDataURL(file);
  }

  function removerLogo() {
    handleChange('logoNegocio', '');
    if (inputLogoRef.current) inputLogoRef.current.value = '';
  }

  function handleSalvar(e) {
    e.preventDefault();
    setErro(''); setSucesso(''); setAviso('');
    const margem    = Number(configuracoes.margemLucro);
    const custoHora = Number(configuracoes.custoHora);
    if (margem < 1)     { setErro('A margem de lucro deve ser maior que 0%.'); return; }
    if (custoHora < 0)  { setErro('O custo/hora não pode ser negativo.'); return; }
    if (margem < 10)    setAviso('⚠️ Margem abaixo de 10% pode ser insuficiente para cobrir imprevistos.');
    setSucesso('Configurações salvas com sucesso!');
    setTimeout(() => setSucesso(''), 3000);
  }

  return (
    <div>
      <Navbar />
      <main className="pagina-container">
        <div className="pagina-cabecalho">
          <div>
            <h1 className="pagina-titulo">⚙️ Configurações</h1>
            <p className="pagina-subtitulo">Defina sua margem de lucro e informações do negócio</p>
          </div>
        </div>

        <div className="card" style={{maxWidth:'580px'}}>
          <form onSubmit={handleSalvar} className="auth-form">
            {erro    && <div className="alerta-erro">{erro}</div>}
            {aviso   && <div className="alerta-aviso">{aviso}</div>}
            {sucesso && <div className="alerta-sucesso">{sucesso}</div>}

            {/* ── Identidade do negócio ── */}
            <h3 style={{fontSize:'0.95rem', fontWeight:700, color:'var(--texto-principal)', marginBottom:'0.75rem', borderBottom:'1px solid var(--borda)', paddingBottom:'0.4rem'}}>
              🏢 Identidade do negócio
            </h3>

            <div className="campo-grupo">
              <label className="input-label">Nome do negócio</label>
              <input
                className="input-field"
                type="text"
                value={configuracoes.nomeNegocio || ''}
                onChange={e => handleChange('nomeNegocio', e.target.value)}
                placeholder="Ex: Doces da Maria, Ateliê Ana Paula..."
              />
              <small style={{color:'var(--neutro-muted)', marginTop:'0.3rem'}}>
                Aparece no cabeçalho dos relatórios gerados.
              </small>
            </div>

            <div className="campo-grupo">
              <label className="input-label">🖼️ Logo do negócio</label>

              {configuracoes.logoNegocio ? (
                <div style={{display:'flex', alignItems:'center', gap:'1rem', padding:'0.75rem', border:'1px solid var(--borda)', borderRadius:'var(--radius)', background:'var(--fundo-card)'}}>
                  <img
                    src={configuracoes.logoNegocio}
                    alt="Logo do negócio"
                    style={{height:'56px', maxWidth:'120px', objectFit:'contain', borderRadius:'4px'}}
                  />
                  <div style={{flex:1}}>
                    <p style={{fontSize:'0.85rem', color:'var(--texto-secundario)', marginBottom:'0.4rem'}}>Logo carregado ✅</p>
                    <button
                      type="button"
                      onClick={removerLogo}
                      style={{fontSize:'0.8rem', color:'var(--erro)', background:'none', border:'1px solid var(--erro)', borderRadius:'4px', padding:'0.2rem 0.6rem', cursor:'pointer'}}
                    >
                      Remover logo
                    </button>
                  </div>
                </div>
              ) : (
                <div
                  style={{border:'2px dashed var(--borda)', borderRadius:'var(--radius)', padding:'1.25rem', textAlign:'center', cursor:'pointer', background:'var(--fundo-card)'}}
                  onClick={() => inputLogoRef.current?.click()}
                >
                  <p style={{fontSize:'2rem', marginBottom:'0.4rem'}}>🖼️</p>
                  <p style={{fontSize:'0.875rem', color:'var(--texto-secundario)', marginBottom:'0.25rem'}}>Clique para enviar seu logo</p>
                  <p style={{fontSize:'0.78rem', color:'var(--neutro-muted)'}}>PNG, JPG ou SVG · máx. 500 KB</p>
                </div>
              )}
              <input
                ref={inputLogoRef}
                type="file"
                accept="image/png,image/jpeg,image/svg+xml"
                style={{display:'none'}}
                onChange={handleLogoUpload}
              />
            </div>

            {/* ── Precificação ── */}
            <h3 style={{fontSize:'0.95rem', fontWeight:700, color:'var(--texto-principal)', margin:'1.25rem 0 0.75rem', borderBottom:'1px solid var(--borda)', paddingBottom:'0.4rem'}}>
              💰 Precificação
            </h3>

            <div className="campo-grupo">
              <label className="input-label">📈 Margem de lucro desejada (%)</label>
              <input
                className="input-field"
                type="number" min="1" max="500" step="0.5"
                value={configuracoes.margemLucro}
                onChange={e => handleChange('margemLucro', e.target.value)}
              />
              <small style={{color:'var(--neutro-muted)', marginTop:'0.3rem'}}>
                Recomendado: mínimo 10%. Valor atual: {configuracoes.margemLucro}%
              </small>
            </div>

            <div className="campo-grupo">
              <label className="input-label">💰 Custo da sua hora de trabalho (R$)</label>
              <input
                className="input-field"
                type="number" min="0" step="0.01"
                value={configuracoes.custoHora}
                onChange={e => handleChange('custoHora', e.target.value)}
                placeholder="0,00"
              />
              <small style={{color:'var(--neutro-muted)', marginTop:'0.3rem'}}>
                Usado para calcular o custo de mão de obra de cada produto.
              </small>
            </div>

            <div className="campo-grupo">
              <label className="input-label">📍 Região de atuação</label>
              <input
                className="input-field"
                type="text"
                value={configuracoes.regiaoAtuacao}
                onChange={e => handleChange('regiaoAtuacao', e.target.value)}
                placeholder="Ex: São Paulo - SP"
              />
            </div>

            <button type="submit" className="btn-primary">Salvar configurações</button>
          </form>
        </div>
      </main>
    </div>
  );
}
