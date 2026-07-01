import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import '../styles/Navbar.css';

export default function Navbar() {
  const { usuarioLogado, logout } = useApp();
  const location = useLocation();
  const navegar  = useNavigate();
  const logado   = !!usuarioLogado;
  const [menuAberto, setMenuAberto] = useState(false);

  function handleLogout() {
    setMenuAberto(false);
    logout();
    navegar('/login');
  }

  function fecharMenu() { setMenuAberto(false); }

  const links = [
    { caminho: '/dashboard',     icone: '🏠', nome: 'Início' },
    { caminho: '/produtos',      icone: '📦', nome: 'Produtos' },
    { caminho: '/custos-fixos',  icone: '💸', nome: 'Custos Fixos' },
    { caminho: '/simulacao',     icone: '📈', nome: 'Simulação' },
    { caminho: '/relatorio',     icone: '📊', nome: 'Relatório' },
    { caminho: '/configuracoes', icone: '⚙️',  nome: 'Configurações' },
  ];

  const primeiroNome = usuarioLogado?.nome?.split(' ')[0] ?? '';

  return (
    <>
      <nav className="navbar">
        {/* Logo */}
        <Link to={logado ? '/dashboard' : '/'} className="navbar-logo" onClick={fecharMenu}>
          <span className="navbar-logo-icone">💰</span>
          <span className="navbar-logo-nome">Precifique</span>
        </Link>

        {/* Links — desktop */}
        {logado && (
          <ul className="navbar-links">
            {links.map(link => (
              <li key={link.caminho}>
                <Link
                  to={link.caminho}
                  className={`navbar-link ${location.pathname === link.caminho ? 'ativo' : ''}`}
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
              <span className="navbar-usuario-nome">Olá, {primeiroNome}</span>
              <button onClick={handleLogout} className="navbar-logout">Sair</button>

              {/* Hamburguer — mobile */}
              <button
                className={`navbar-hamburger ${menuAberto ? 'hamburger-aberto' : ''}`}
                onClick={() => setMenuAberto(a => !a)}
                aria-label={menuAberto ? 'Fechar menu' : 'Abrir menu'}
                aria-expanded={menuAberto}
              >
                <span /><span /><span />
              </button>
            </>
          ) : (
            <div className="navbar-acoes-publicas">
              <Link to="/login"    className="navbar-btn-ghost">Entrar</Link>
              <Link to="/cadastro" className="navbar-btn-verde">Criar conta</Link>
            </div>
          )}
        </div>
      </nav>

      {/* Menu mobile — dropdown */}
      {logado && (
        <>
          {menuAberto && (
            <div
              className="navbar-overlay"
              onClick={fecharMenu}
              aria-hidden="true"
            />
          )}
          <div className={`navbar-mobile ${menuAberto ? 'aberto' : ''}`}>
            <ul className="navbar-mobile-links">
              {links.map(link => (
                <li key={link.caminho}>
                  <Link
                    to={link.caminho}
                    className={`navbar-link ${location.pathname === link.caminho ? 'ativo' : ''}`}
                    onClick={fecharMenu}
                  >
                    <span className="navbar-link-icone">{link.icone}</span>
                    <span>{link.nome}</span>
                  </Link>
                </li>
              ))}
            </ul>
            <div className="navbar-mobile-rodape">
              <span className="navbar-mobile-usuario">{usuarioLogado?.nome}</span>
              <button onClick={handleLogout} className="navbar-logout">Sair</button>
            </div>
          </div>
        </>
      )}
    </>
  );
}
