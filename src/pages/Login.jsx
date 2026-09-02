import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ChartLineUp, Coins, ShieldCheck } from '@phosphor-icons/react';
import { useApp } from '../context/AppContext';
import '../styles/Auth.css';

export default function Login() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(false);
  const { login } = useApp();
  const navegar = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setErro('');
    if (!email || !senha) { setErro('Preencha todos os campos.'); return; }
    setCarregando(true);
    try {
      await login(email, senha);
      navegar('/dashboard');
    } catch (error) {
      setErro(error.message || 'Não foi possível entrar.');
    } finally {
      setCarregando(false);
    }
  }

  return (
    <div className="auth-page">
      <aside className="auth-visual">
        <Link to="/" className="auth-brand"><span><Coins size={21} weight="fill" /></span>Precifique</Link>
        <div className="auth-visual-copy">
          <span className="auth-visual-icon"><ChartLineUp size={32} /></span>
          <h2>Preço claro. Negócio mais saudável.</h2>
          <p>Organize seus custos e tome decisões com confiança.</p>
        </div>
        <p className="auth-visual-note"><ShieldCheck size={18} /> Seus dados ficam protegidos na sua conta.</p>
      </aside>

      <main className="auth-main">
        <div className="auth-card">
          <Link to="/" className="auth-logo">
            <span className="auth-logo-icon"><Coins size={21} weight="fill" /></span>
            <span className="auth-logo-nome">Precifique</span>
          </Link>
          <p className="auth-contexto">Acesso à sua conta</p>
          <h1 className="auth-titulo">Bem-vindo de volta</h1>
          <p className="auth-subtitulo">Entre para continuar organizando seus preços.</p>

          <form onSubmit={handleSubmit} className="auth-form">
            {erro && <div className="alerta-erro">{erro}</div>}
            <div className="campo-grupo">
              <label className="input-label" htmlFor="email">E-mail</label>
              <input id="email" type="email" className="input-field" placeholder="seu@email.com" value={email} onChange={e => setEmail(e.target.value)} autoFocus />
            </div>
            <div className="campo-grupo">
              <label className="input-label" htmlFor="senha">Senha</label>
              <input id="senha" type="password" className="input-field" placeholder="Sua senha" value={senha} onChange={e => setSenha(e.target.value)} />
            </div>
            <button type="submit" className="btn-primary" disabled={carregando}>{carregando ? 'Entrando...' : 'Entrar'}</button>
          </form>
          <p className="auth-rodape">Não tem conta? <Link to="/cadastro">Criar conta grátis</Link></p>
        </div>
      </main>
    </div>
  );
}
