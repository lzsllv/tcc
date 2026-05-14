import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import '../styles/NotFound.css';

export default function NotFound() {
  const { usuarioLogado } = useApp();
  const navegar = useNavigate();

  return (
    <div className="nf-page">
      <div className="nf-card">
        <div className="nf-codigo">404</div>
        <div className="nf-icone">🔍</div>
        <h1 className="nf-titulo">Página não encontrada</h1>
        <p className="nf-desc">
          O endereço que você acessou não existe ou foi movido.
        </p>
        <div className="nf-acoes">
          <button onClick={() => navegar(-1)} className="btn-secondary">
            ← Voltar
          </button>
          {usuarioLogado ? (
            <Link to="/dashboard" className="btn-primary">Ir para o Dashboard</Link>
          ) : (
            <Link to="/" className="btn-primary">Ir para o início</Link>
          )}
        </div>
      </div>
    </div>
  );
}
