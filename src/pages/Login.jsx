import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import '../styles/Auth.css';

export default function Login() {
  // Estados locais da tela — guardam o que o usuário digita
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');

  // Pega a função de login do contexto
  const { login } = useApp();

  // useNavigate permite mudar de tela pelo código
  const navegar = useNavigate();

  function handleSubmit(e) {
    // Evita que a página recarregue ao enviar o formulário
    e.preventDefault();
    setErro('');

    if (!email || !senha) {
      setErro('Preencha todos os campos.');
      return;
    }

    const sucesso = login(email, senha);
    if (sucesso) {
      navegar('/dashboard');
    } else {
      setErro('E-mail ou senha incorretos.');
    }
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        {/* Logo / título */}
        <div className="auth-logo">
          <span className="auth-logo-icone">💰</span>
          <h1 className="auth-titulo">Precifique</h1>
          <p className="auth-subtitulo">Precifique seus produtos com inteligência</p>
        </div>

        {/* Formulário de login */}
        <form onSubmit={handleSubmit} className="auth-form">
          {erro && <div className="alerta-erro">{erro}</div>}

          <div className="campo-grupo">
            <label className="input-label" htmlFor="email">E-mail</label>
            <input
              id="email"
              type="email"
              className="input-field"
              placeholder="seu@email.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
          </div>

          <div className="campo-grupo">
            <label className="input-label" htmlFor="senha">Senha</label>
            <input
              id="senha"
              type="password"
              className="input-field"
              placeholder="Sua senha"
              value={senha}
              onChange={e => setSenha(e.target.value)}
            />
          </div>

          <button type="submit" className="btn-primary">Entrar</button>
        </form>

        <p className="auth-link">
          Não tem conta? <Link to="/cadastro">Criar conta grátis</Link>
        </p>
      </div>
    </div>
  );
}
