import { useState } from 'react';
import Navbar from '../components/Navbar';
import { useApp } from '../context/AppContext';
import '../styles/Pagina.css';

export default function Configuracoes() {
  const { configuracoes, setConfiguracoes } = useApp();
  const [sucesso, setSucesso] = useState('');
  const [erro, setErro] = useState('');
  const [aviso, setAviso] = useState('');

  function handleChange(campo, valor) {
    setConfiguracoes(prev => ({ ...prev, [campo]: valor }));
  }

  function handleSalvar(e) {
    e.preventDefault();
    setErro('');
    setSucesso('');
    setAviso('');

    // Erro bloqueante: margem zerada
    if (configuracoes.margemLucro < 1) {
      setErro('A margem de lucro deve ser maior que 0%.');
      return;
    }

    // Aviso não bloqueante: margem baixa mas válida
    if (configuracoes.margemLucro < 10) {
      setAviso('⚠️ Margem abaixo de 10% pode ser insuficiente para cobrir imprevistos.');
    }

    // Salva em qualquer caso (desde que margem >= 1)
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

        <div className="card" style={{maxWidth:'560px'}}>
          <form onSubmit={handleSalvar} className="auth-form">
            {erro    && <div className="alerta-erro">{erro}</div>}
            {aviso   && <div className="alerta-aviso">{aviso}</div>}
            {sucesso && <div className="alerta-sucesso">{sucesso}</div>}

            <div className="campo-grupo">
              <label className="input-label">📈 Margem de lucro desejada (%)</label>
              <input
                className="input-field"
                type="number"
                min="1"
                max="500"
                step="0.5"
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
                type="number"
                min="0"
                step="0.01"
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
