import { useState, useRef } from 'react';
import Navbar from '../components/Navbar';
import { useApp } from '../context/AppContext';
import '../styles/Pagina.css';
import '../styles/Configuracoes.css';

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
    if (file.size > 500 * 1024) { setErro('A imagem deve ter no máximo 500 KB.'); return; }
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
    if (margem < 1)    { setErro('A margem de lucro deve ser maior que 0%.'); return; }
    if (custoHora < 0) { setErro('O custo/hora não pode ser negativo.'); return; }
    if (margem < 10)   setAviso('⚠️ Margem abaixo de 10% pode ser insuficiente para cobrir imprevistos.');
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

        <div className="card config-card">
          <form onSubmit={handleSalvar} className="auth-form">
            {erro    && <div className="alerta-erro">{erro}</div>}
            {aviso   && <div className="alerta-aviso">{aviso}</div>}
            {sucesso && <div className="alerta-sucesso">{sucesso}</div>}

            <h3 className="config-secao-titulo">🏢 Identidade do negócio</h3>

            <div className="campo-grupo">
              <label className="input-label">Nome do negócio</label>
              <input className="input-field" type="text"
                value={configuracoes.nomeNegocio || ''}
                onChange={e => handleChange('nomeNegocio', e.target.value)}
                placeholder="Ex: Doces da Maria, Atelê Ana Paula..."
              />
              <small className="input-hint">Aparece no cabeçalho dos relatórios gerados.</small>
            </div>

            <div className="campo-grupo">
              <label className="input-label">🖼️ Logo do negócio</label>
              {configuracoes.logoNegocio ? (
                <div className="config-logo-preview">
                  <img src={configuracoes.logoNegocio} alt="Logo do negócio" className="config-logo-img" />
                  <div className="config-logo-info">
                    <p className="config-logo-ok">Logo carregado ✅</p>
                    <button type="button" onClick={removerLogo} className="btn-remover-logo">
                      Remover logo
                    </button>
                  </div>
                </div>
              ) : (
                <div className="config-logo-drop" onClick={() => inputLogoRef.current?.click()}>
                  <p className="config-logo-drop-icone">🖼️</p>
                  <p className="config-logo-drop-texto">Clique para enviar seu logo</p>
                  <p className="config-logo-drop-hint">PNG, JPG ou SVG · máx. 500 KB</p>
                </div>
              )}
              <input ref={inputLogoRef} type="file" accept="image/png,image/jpeg,image/svg+xml"
                className="input-hidden" onChange={handleLogoUpload} />
            </div>

            <h3 className="config-secao-titulo">💰 Precificação</h3>

            <div className="campo-grupo">
              <label className="input-label">📈 Margem de lucro desejada (%)</label>
              <input className="input-field" type="number" min="1" max="500" step="0.5"
                value={configuracoes.margemLucro}
                onChange={e => handleChange('margemLucro', e.target.value)}
              />
              <small className="input-hint">
                Recomendado: mínimo 10%. Valor atual: {configuracoes.margemLucro}%
              </small>
            </div>

            <div className="campo-grupo">
              <label className="input-label">💰 Custo da sua hora de trabalho (R$)</label>
              <input className="input-field" type="number" min="0" step="0.01"
                value={configuracoes.custoHora}
                onChange={e => handleChange('custoHora', e.target.value)}
                placeholder="0,00"
              />
              <small className="input-hint">Usado para calcular o custo de mão de obra de cada produto.</small>
            </div>

            <div className="campo-grupo">
              <label className="input-label">📍 Região de atuação</label>
              <input className="input-field" type="text"
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
