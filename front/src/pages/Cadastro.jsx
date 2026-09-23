import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Coins, Package, ShieldCheck } from '@phosphor-icons/react';
import { useApp } from '../context/AppContext';
import '../styles/Auth.css';

export default function Cadastro() {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(false);
  const { cadastrar } = useApp();
  const navegar = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setErro('');
    if (!nome || !email || !senha || !confirmarSenha) { setErro('Preencha todos os campos.'); return; }
    if (senha.length < 6) { setErro('A senha deve ter no mínimo 6 caracteres.'); return; }
    if (senha !== confirmarSenha) { setErro('As senhas não coincidem.'); return; }
    setCarregando(true);
    try {
      await cadastrar(nome, email, senha);
      navegar('/dashboard');
    } catch (error) {
      setErro(error.message || 'Não foi possível criar a conta.');
    } finally {
      setCarregando(false);
    }
  }

  return (
    <div className="auth-page">
      <aside className="auth-visual">
        <Link to="/" className="auth-brand"><span><Coins size={21} weight="fill" /></span>Precifique</Link>
        <div className="auth-visual-copy">
          <span className="auth-visual-icon"><Package size={32} /></span>
          <h2>Conheça o custo real do que você vende.</h2>
          <p>Produtos, despesas, margem e projeções em um só lugar.</p>
        </div>
        <p className="auth-visual-note"><ShieldCheck size={18} /> Seus dados ficam salvos somente neste navegador.</p>
      </aside>

      <main className="auth-main">
        <div className="auth-card">
          <Link to="/" className="auth-logo">
            <span className="auth-logo-icon"><Coins size={21} weight="fill" /></span>
            <span className="auth-logo-nome">Precifique</span>
          </Link>
          <p className="auth-contexto">Comece localmente</p>
          <h1 className="auth-titulo">Crie sua conta</h1>
          <p className="auth-subtitulo">Sem servidor, sincronização ou confirmação por e-mail.</p>

          <form onSubmit={handleSubmit} className="auth-form">
            {erro && <div className="alerta-erro">{erro}</div>}
            <div className="campo-grupo">
              <label className="input-label" htmlFor="nome">Nome completo</label>
              <input id="nome" type="text" className="input-field" placeholder="Seu nome" value={nome} onChange={e => setNome(e.target.value)} autoFocus />
            </div>
            <div className="campo-grupo">
              <label className="input-label" htmlFor="email">E-mail</label>
              <input id="email" type="email" className="input-field" placeholder="seu@email.com" value={email} onChange={e => setEmail(e.target.value)} />
            </div>
            <div className="campo-grupo">
              <label className="input-label" htmlFor="senha">Senha</label>
              <input id="senha" type="password" className="input-field" placeholder="Mínimo 6 caracteres" value={senha} onChange={e => setSenha(e.target.value)} />
            </div>
            <div className="campo-grupo">
              <label className="input-label" htmlFor="confirmarSenha">Confirmar senha</label>
              <input id="confirmarSenha" type="password" className="input-field" placeholder="Repita sua senha" value={confirmarSenha} onChange={e => setConfirmarSenha(e.target.value)} />
            </div>
            <button type="submit" className="btn-primary" disabled={carregando}>{carregando ? 'Criando...' : 'Criar conta'}</button>
          </form>
          <p className="auth-rodape">Já tem conta? <Link to="/login">Entrar</Link></p>
        </div>
      </main>
    </div>
  );
}
