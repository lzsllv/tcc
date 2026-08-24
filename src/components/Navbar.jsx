import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Archive, ChartBar, ChartLineUp, Coins, GearSix, House, List, Package, SignOut, X,
} from '@phosphor-icons/react';
import { useApp } from '../context/AppContext';
import '../styles/Navbar.css';

export default function Navbar() {
  const { usuarioLogado, logout } = useApp();
  const location = useLocation();
  const navegar = useNavigate();
  const logado = !!usuarioLogado;
  const [menuAberto, setMenuAberto] = useState(false);

  function handleLogout() {
    setMenuAberto(false);
    logout();
    navegar('/login');
  }

  function fecharMenu() { setMenuAberto(false); }

  const links = [
    { caminho: '/dashboard', Icon: House, nome: 'Início' },
    { caminho: '/produtos', Icon: Package, nome: 'Produtos' },
    { caminho: '/insumos', Icon: Archive, nome: 'Insumos' },
    { caminho: '/custos-fixos', Icon: Coins, nome: 'Custos Fixos' },
    { caminho: '/simulacao', Icon: ChartLineUp, nome: 'Simulação' },
    { caminho: '/relatorio', Icon: ChartBar, nome: 'Relatório' },
    { caminho: '/configuracoes', Icon: GearSix, nome: 'Configurações' },
  ];

  return (
    <>
      <nav className={`navbar ${logado ? 'navbar-logado' : 'navbar-deslogado'}`} aria-label="Navegação do aplicativo">
        <Link to={logado ? '/dashboard' : '/'} className="navbar-logo" onClick={fecharMenu}>
          <span className="navbar-logo-icon"><Coins size={20} weight="fill" /></span>
          <span className="navbar-logo-nome">Precifique</span>
        </Link>

        {logado && (
          <ul className="navbar-links">
            {links.map(({ caminho, Icon, nome }) => (
              <li key={caminho}>
                <Link
                  to={caminho}
                  className={`navbar-link ${location.pathname === caminho ? 'navbar-link-ativo' : ''}`}
                  aria-current={location.pathname === caminho ? 'page' : undefined}
                >
                  <Icon className="navbar-link-icone" size={17} weight={location.pathname === caminho ? 'fill' : 'regular'} />
                  <span className="navbar-link-nome">{nome}</span>
                </Link>
              </li>
            ))}
          </ul>
        )}

        <div className="navbar-usuario">
          {logado ? (
            <>
              <span className="navbar-usuario-nome">Olá, {usuarioLogado?.nome?.split(' ')[0]}</span>
              <button onClick={handleLogout} className="navbar-sair"><SignOut size={16} /> Sair</button>
              <button
                className="navbar-hamburger"
                onClick={() => setMenuAberto(a => !a)}
                aria-label={menuAberto ? 'Fechar menu' : 'Abrir menu'}
                aria-expanded={menuAberto}
              >
                {menuAberto ? <X size={22} /> : <List size={22} />}
              </button>
            </>
          ) : (
            <div className="navbar-acoes-publicas">
              <Link to="/login" className="navbar-btn-ghost">Entrar</Link>
              <Link to="/cadastro" className="navbar-btn-verde">Criar conta</Link>
            </div>
          )}
        </div>
      </nav>

      {logado && (
        <>
          {menuAberto && <div className="navbar-overlay" onClick={fecharMenu} aria-hidden="true" />}
          <aside className={`navbar-drawer ${menuAberto ? 'drawer-aberto' : ''}`} aria-hidden={!menuAberto}>
            <ul className="drawer-links">
              {links.map(({ caminho, Icon, nome }) => (
                <li key={caminho}>
                  <Link
                    to={caminho}
                    className={`drawer-link ${location.pathname === caminho ? 'drawer-link-ativo' : ''}`}
                    onClick={fecharMenu}
                  >
                    <Icon size={20} weight={location.pathname === caminho ? 'fill' : 'regular'} />
                    <span>{nome}</span>
                  </Link>
                </li>
              ))}
            </ul>
            <div className="drawer-rodape">
              <span className="drawer-usuario">{usuarioLogado?.nome}</span>
              <button onClick={() => { fecharMenu(); handleLogout(); }} className="drawer-sair"><SignOut size={16} /> Sair</button>
            </div>
          </aside>
        </>
      )}
    </>
  );
}
