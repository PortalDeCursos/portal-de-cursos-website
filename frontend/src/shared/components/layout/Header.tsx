import { useRef, useState } from 'react'
import { Link, NavLink } from 'react-router'
import logo from '../../../assets/logo.png'
import DesignIcon from '../ui/DesignIcon'
import PrototypeAction from '../ui/PrototypeAction'
export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false)
  const menuButton = useRef<HTMLButtonElement>(null)
  function closeMenu() { setMenuOpen(false) }
  return <header className="site-header" onKeyDown={event => {
    if (event.key === 'Escape' && menuOpen) { closeMenu(); menuButton.current?.focus() }
  }}>
    <div className="container header-inner">
      <Link to="/" className="portal-brand" onClick={closeMenu}><img src={logo} className="portal-logo" width="40" height="40" alt="" /><span>Portal de <span className="brand-highlight">Cursos</span></span></Link>
      <button ref={menuButton} className="menu-toggle" type="button" aria-expanded={menuOpen} aria-controls="portal-navigation" aria-label={menuOpen ? 'Fechar menu' : 'Abrir menu'} onClick={() => setMenuOpen(value => !value)}>
        <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">{menuOpen ? <path d="m6 6 12 12M6 18 18 6" /> : <path d="M4 6h16M4 12h16M4 18h16" />}</svg>
      </button>
      <div id="portal-navigation" className={`header-navigation${menuOpen ? ' is-open' : ''}`}>
        <nav aria-label="Navegação principal">
          <NavLink to="/" end onClick={closeMenu}>Início</NavLink>
          <NavLink to="/cursos" onClick={closeMenu}>Cursos</NavLink>
          <NavLink to="/projetos" onClick={closeMenu}>Projetos</NavLink>
        </nav>
        <div className="header-actions"><PrototypeAction className="submission-link">Submeter projeto</PrototypeAction><PrototypeAction title="Área restrita" className="restricted-link"><DesignIcon name="imgContainer8" /><span>Área restrita</span></PrototypeAction></div>
      </div>
    </div>
  </header>
}
