import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import '../styles/Auth.css';

export default function Cadastro() {
  const [nome,           setNome]           = useState('');
  const [email,          setEmail]          = useState('');
  const [senha,          setSenha]          = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [mostrarSenha,   setMostrarSenha]   = useState(false);
  const [erro,           setErro]           = useState('');
  const [sucesso,        setSucesso]        = useState('');
  const [carregando,     setCarregando]     = useState(false);

  const { cadastrar } = useApp();
  const navegar = useNavigate();

  function handleSubmit(e) {
    e.preventDefault();
    setErro(''); setSucesso('');
    if (!nome.trim() || !email || !senha || !confirmarSenha) { setErro('Preencha todos os campos.'); return; }
    if (senha.length < 6)         { setErro('A senha deve ter no mínimo 6 caracteres.'); return; }
    if (senha !== confirmarSenha) { setErro('As senhas não coincidem.'); return; }
    setCarregando(true);
    setTimeout(() => {
      const ok = cadastrar(nome.trim(), email, senha);
      setCarregando(false);
      if (ok) {
        setSucesso('Conta criada com sucesso! Redirecionando...');
        setTimeout(() => navegar('/login'), 1500);
      } else {
        setErro('Este e-mail já está cadastrado.');
      }
    }, 400);
  }

  return (
    <div className="auth-page">
      <main className="auth-main">
        <div className="auth-card">
          <div className="auth-logo">
            <span className="auth-logo-icon">💰</span>
            <span className="auth-logo-nome">Precifique</span>
          </div>

          <h1 className="auth-titulo">Criar conta grátis</h1>
          <p className="auth-subtitulo">Precifique seus produtos com inteligência</p>

          <form onSubmit={handleSubmit} className="auth-form">
            {erro    && <div className="alerta-erro">{erro}</div>}
            {sucesso && <div className="alerta-sucesso">{sucesso}</div>}

            <div className="campo-grupo">
              <label className="input-label" htmlFor="nome">Nome completo</label>
              <input id="nome" type="text" className="input-field"
                placeholder="Seu nome" value={nome}
                onChange={e => setNome(e.target.value)} autoFocus />
            </div>

            <div className="campo-grupo">
              <label className="input-label" htmlFor="email">E-mail</label>
              <input id="email" type="email" className="input-field"
                placeholder="seu@email.com" value={email}
                onChange={e => setEmail(e.target.value)} />
            </div>

            <div className="campo-grupo">
              <label className="input-label" htmlFor="senha">Senha</label>
              <div className="input-senha-wrapper">
                <input id="senha" type={mostrarSenha ? 'text' : 'password'} className="input-field input-senha"
                  placeholder="Mínimo 6 caracteres" value={senha}
                  onChange={e => setSenha(e.target.value)} />
                <button type="button" className="btn-olho"
                  onClick={() => setMostrarSenha(v => !v)}
                  aria-label={mostrarSenha ? 'Ocultar senha' : 'Mostrar senha'}>
                  {mostrarSenha ? '🙈' : '👁️'}
                </button>
              </div>
            </div>

            <div className="campo-grupo">
              <label className="input-label" htmlFor="confirmarSenha">Confirmar senha</label>
              <div className="input-senha-wrapper">
                <input id="confirmarSenha" type={mostrarSenha ? 'text' : 'password'} className="input-field input-senha"
                  placeholder="Repita sua senha" value={confirmarSenha}
                  onChange={e => setConfirmarSenha(e.target.value)} />
              </div>
            </div>

            <button type="submit" className="btn-primary" disabled={carregando}>
              {carregando ? 'Criando conta...' : 'Criar conta'}
            </button>
          </form>

          <p className="auth-rodape">
            Já tem conta? <Link to="/login">Entrar</Link>
          </p>
        </div>
      </main>
    </div>
  );
}
