import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import '../styles/Auth.css';

export default function Login() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro]   = useState('');

  const { login } = useApp();
  const navegar   = useNavigate();

  function handleSubmit(e) {
    e.preventDefault();
    setErro('');
    if (!email || !senha) { setErro('Preencha todos os campos.'); return; }
    const sucesso = login(email, senha);
    if (sucesso) { navegar('/dashboard'); }
    else { setErro('E-mail ou senha incorretos.'); }
  }

  return (
    <div className="auth-page">
      <main className="auth-main">
        <div className="auth-card">
          <div className="auth-logo">
            <span className="auth-logo-icon">💰</span>
            <span className="auth-logo-nome">Precifique</span>
          </div>

          <h1 className="auth-titulo">Bem-vindo de volta</h1>
          <p className="auth-subtitulo">Entre na sua conta para continuar</p>

          <form onSubmit={handleSubmit} className="auth-form">
            {erro && <div className="alerta-erro">{erro}</div>}

            <div className="campo-grupo">
              <label className="input-label" htmlFor="email">E-mail</label>
              <input id="email" type="email" className="input-field"
                placeholder="seu@email.com" value={email}
                onChange={e => setEmail(e.target.value)} autoFocus />
            </div>

            <div className="campo-grupo">
              <label className="input-label" htmlFor="senha">Senha</label>
              <input id="senha" type="password" className="input-field"
                placeholder="Sua senha" value={senha}
                onChange={e => setSenha(e.target.value)} />
            </div>

            <button type="submit" className="btn-primary">Entrar</button>
          </form>

          <p className="auth-rodape">
            Não tem conta? <Link to="/cadastro">Criar conta grátis</Link>
          </p>
        </div>
      </main>
    </div>
  );
}
