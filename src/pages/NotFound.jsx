import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import '../styles/NotFound.css';

export default function NotFound() {
  const { usuarioLogado } = useApp();
  const navegar = useNavigate();

  return (
    <div className="notfound-page">
      <div className="notfound-card">
        <div className="notfound-logo">
          <span className="notfound-logo-icon">💰</span>
          <span className="notfound-logo-nome">Precifique</span>
        </div>
        <div className="notfound-codigo">404</div>
        <h1 className="notfound-titulo">Página não encontrada</h1>
        <p className="notfound-desc">O endereço que você digitou não existe ou foi removido.</p>
        <div className="notfound-acoes">
          <button className="btn-secondary" onClick={() => navegar(-1)}>← Voltar</button>
          {usuarioLogado
            ? <Link to="/dashboard" className="btn-primary">Ir ao painel</Link>
            : <Link to="/"          className="btn-primary">Ir ao início</Link>
          }
        </div>
      </div>
    </div>
  );
}
