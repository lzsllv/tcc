import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import '../styles/Auth.css';

export default function Cadastro() {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [erro, setErro] = useState('');
  const [mensagemSucesso, setMensagemSucesso] = useState('');

  const { cadastrar } = useApp();
  const navegar = useNavigate();

  function handleSubmit(e) {
    e.preventDefault();
    setErro('');
    setMensagemSucesso('');

    if (!nome || !email || !senha || !confirmarSenha) {
      setErro('Preencha todos os campos.');
      return;
    }
    if (senha.length < 6) {
      setErro('A senha deve ter no mínimo 6 caracteres.');
      return;
    }
    if (senha !== confirmarSenha) {
      setErro('As senhas não coincidem.');
      return;
    }

    // Renomeado para 'ok' para evitar conflito com o estado 'mensagemSucesso'
    const ok = cadastrar(nome, email, senha);

    if (ok) {
      setMensagemSucesso('Conta criada com sucesso! Redirecionando...');
      setTimeout(() => navegar('/login'), 1500);
    } else {
      setErro('Este e-mail já está cadastrado.');
    }
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-logo">
          <span className="auth-logo-icone">💰</span>
          <h1 className="auth-titulo">Precifique</h1>
          <p className="auth-subtitulo">Crie sua conta gratuitamente</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          {erro && <div className="alerta-erro">{erro}</div>}
          {mensagemSucesso && <div className="alerta-sucesso">{mensagemSucesso}</div>}

          <div className="campo-grupo">
            <label className="input-label" htmlFor="nome">Nome completo</label>
            <input
              id="nome"
              type="text"
              className="input-field"
              placeholder="Seu nome"
              value={nome}
              onChange={e => setNome(e.target.value)}
            />
          </div>

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
              placeholder="Mínimo 6 caracteres"
              value={senha}
              onChange={e => setSenha(e.target.value)}
            />
          </div>

          <div className="campo-grupo">
            <label className="input-label" htmlFor="confirmarSenha">Confirmar senha</label>
            <input
              id="confirmarSenha"
              type="password"
              className="input-field"
              placeholder="Repita sua senha"
              value={confirmarSenha}
              onChange={e => setConfirmarSenha(e.target.value)}
            />
          </div>

          <button type="submit" className="btn-primary">Criar conta</button>
        </form>

        <p className="auth-link">
          Já tem conta? <Link to="/login">Entrar</Link>
        </p>
      </div>
    </div>
  );
}
