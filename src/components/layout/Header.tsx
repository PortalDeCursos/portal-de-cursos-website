import { useEffect, useRef, useState } from 'react';
import { Link, NavLink } from 'react-router';
import { BookOpen, FolderKanban, Home, Menu, Moon, Send, ShieldCheck, Sun, X } from 'lucide-react';
import logo from '../../assets/logo-transparent.png';
import PrototypeAction from '../ui/PrototypeAction';
export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [amoled, setAmoled] = useState(
    () => typeof window !== 'undefined' && window.localStorage.getItem('portal-theme') === 'amoled',
  );
  const menuButton = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    document.documentElement.dataset.theme = amoled ? 'amoled' : 'light';
    window.localStorage.setItem('portal-theme', amoled ? 'amoled' : 'light');
  }, [amoled]);
  function closeMenu() {
    setMenuOpen(false);
  }
  return (
    <header
      className="site-header"
      onKeyDown={(event) => {
        if (event.key === 'Escape' && menuOpen) {
          closeMenu();
          menuButton.current?.focus();
        }
      }}
    >
      <div className="container header-inner">
        <Link to="/" className="portal-brand" onClick={closeMenu}>
          <img src={logo} className="portal-logo" width="40" height="40" alt="" />
          <span>
            Portal de <span className="brand-highlight">Cursos</span>
          </span>
        </Link>
        <button
          ref={menuButton}
          className="menu-toggle"
          type="button"
          aria-expanded={menuOpen}
          aria-controls="portal-navigation"
          aria-label={menuOpen ? 'Fechar menu' : 'Abrir menu'}
          onClick={() => setMenuOpen((value) => !value)}
        >
          {menuOpen ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
        </button>
        <div id="portal-navigation" className={`header-navigation${menuOpen ? ' is-open' : ''}`}>
          <nav aria-label="Navegação principal">
            <NavLink to="/" end onClick={closeMenu}>
              <Home aria-hidden="true" />
              Início
            </NavLink>
            <NavLink to="/cursos" onClick={closeMenu}>
              <BookOpen aria-hidden="true" />
              Cursos
            </NavLink>
            <NavLink to="/projetos" onClick={closeMenu}>
              <FolderKanban aria-hidden="true" />
              Projetos
            </NavLink>
          </nav>
          <div className="header-actions">
            <PrototypeAction className="submission-link">
              <Send aria-hidden="true" />
              Submeter projeto
            </PrototypeAction>
            <PrototypeAction title="Área restrita" className="restricted-link">
              <ShieldCheck aria-hidden="true" />
              <span>Área restrita</span>
            </PrototypeAction>
            <button
              type="button"
              className="theme-toggle"
              aria-pressed={amoled}
              aria-label={amoled ? 'Ativar tema claro' : 'Ativar tema AMOLED'}
              title={amoled ? 'Ativar tema claro' : 'Ativar tema AMOLED'}
              onClick={() => setAmoled((value) => !value)}
            >
              {amoled ? <Sun aria-hidden="true" /> : <Moon aria-hidden="true" />}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
