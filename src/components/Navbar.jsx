import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import '../styles/Navbar.css';

export default function Navbar() {
  const { usuarioLogado, logout } = useApp();
  const location = useLocation();
  const navegar = useNavigate();
  const logado = !!usuarioLogado;

  function handleLogout() {
    logout();
    navegar('/login');
  }

  const links = [
    { caminho: '/dashboard',     icone: '🏠', nome: 'Início' },
    { caminho: '/produtos',      icone: '📦', nome: 'Produtos' },
    { caminho: '/custos-fixos',  icone: '💸', nome: 'Custos Fixos' },
    { caminho: '/configuracoes', icone: '⚙️',  nome: 'Configurações' },
    { caminho: '/simulacao',     icone: '📈', nome: 'Simulação' },
    { caminho: '/relatorio',     icone: '📊', nome: 'Relatório' },
  ];

  return (
    <nav className={`navbar ${logado ? 'navbar-logado' : 'navbar-deslogado'}`}>
      {/* Logo */}
      <Link to={logado ? '/dashboard' : '/'} className="navbar-logo">
        <span>💰</span>
        <span className="navbar-logo-nome">Precifique</span>
      </Link>

      {/* Links — só aparece quando logado */}
      {logado && (
        <ul className="navbar-links">
          {links.map(link => (
            <li key={link.caminho}>
              <Link
                to={link.caminho}
                className={`navbar-link ${
                  location.pathname === link.caminho ? 'navbar-link-ativo' : ''
                }`}
              >
                <span className="navbar-link-icone">{link.icone}</span>
                <span className="navbar-link-nome">{link.nome}</span>
              </Link>
            </li>
          ))}
        </ul>
      )}

      {/* Lado direito */}
      <div className="navbar-usuario">
        {logado ? (
          <>
            <span className="navbar-usuario-nome">
              Olá, {usuarioLogado?.nome?.split(' ')[0]}
            </span>
            <button onClick={handleLogout} className="navbar-sair">Sair</button>
          </>
        ) : (
          <div className="navbar-acoes-publicas">
            <Link to="/login"    className="navbar-btn-ghost">Entrar</Link>
            <Link to="/cadastro" className="navbar-btn-verde">Criar conta</Link>
          </div>
        )}
      </div>
    </nav>
  );
}
