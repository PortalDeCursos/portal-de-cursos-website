import { useRef, useState } from 'react';
import { Link, NavLink } from 'react-router';
import logo from '../../../assets/logo.png';
import { LogIn, Menu, X } from 'lucide-react';
import PrototypeAction from '../ui/PrototypeAction';
import ThemeToggle from '../ui/ThemeToggle';
export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuButton = useRef<HTMLButtonElement>(null);
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
          {menuOpen ? (
            <X size={24} strokeWidth={1.8} aria-hidden="true" />
          ) : (
            <Menu size={24} strokeWidth={1.8} aria-hidden="true" />
          )}
        </button>
        <div id="portal-navigation" className={`header-navigation${menuOpen ? ' is-open' : ''}`}>
          <nav aria-label="Navegação principal">
            <NavLink to="/" end onClick={closeMenu}>
              Início
            </NavLink>
            <NavLink to="/cursos" onClick={closeMenu}>
              Cursos
            </NavLink>
            <NavLink to="/projetos" onClick={closeMenu}>
              Projetos
            </NavLink>
          </nav>
          <div className="header-actions">
            <PrototypeAction className="submission-link">Submeter projeto</PrototypeAction>
            <PrototypeAction title="Área restrita" className="restricted-link">
              <LogIn size={20} strokeWidth={1.8} aria-hidden="true" />
              <span>Área restrita</span>
            </PrototypeAction>
          </div>
        </div>
        <ThemeToggle />
      </div>
    </header>
  );
}
