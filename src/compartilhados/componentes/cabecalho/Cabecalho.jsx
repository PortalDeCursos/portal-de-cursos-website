import { useState } from 'react'
import Icone from '../icone/Icone.jsx'
import logoPortal from '../../../recursos/marca/logo-portal.png'
import '../../estilos/estrutura.css'
import './cabecalho.css'

export default function Cabecalho({ tema, alternarTema, pagina = 'inicio' }) {
  const [menuAberto, definirMenuAberto] = useState(false)
  return <header className={`cabecalho ${pagina === 'cursos' ? 'cabecalho--catalogo' : ''}`}>
    <div className="limite cabecalho__conteudo">
      <a className="marca marca--cabecalho" href="#inicio" aria-label="Portal de Cursos — Início"><img className="marca__simbolo" src={logoPortal} alt="" width="44" height="44" /><span>Portal de <span className="marca__cursos">Cursos</span></span></a>
      <button className="botao-menu" aria-label="Abrir navegação" aria-expanded={menuAberto} aria-controls="navegacao-principal" onClick={() => definirMenuAberto(!menuAberto)}>☰</button>
      <nav id="navegacao-principal" className={`navegacao ${menuAberto ? 'navegacao--aberta' : ''}`} aria-label="Navegação principal" onClick={() => definirMenuAberto(false)}>
        <a href="#inicio" aria-current={pagina === 'inicio' ? 'page' : undefined}>Início</a><a href="#cursos" aria-current={pagina === 'cursos' ? 'page' : undefined}>Cursos</a><a href="#projetos" aria-current={pagina === 'projetos' ? 'page' : undefined}>Projetos</a><a className="navegacao__submeter" href="#submeter" aria-current={pagina === 'submeter' ? 'page' : undefined}>Submeter projeto</a><a className="navegacao__acesso" href="#acesso" aria-current={pagina === 'acesso' ? 'page' : undefined}>Área restrita</a>
      </nav>
      <div className="cabecalho__acoes">
        <a className="cabecalho__submissao" href="#submeter" aria-current={pagina === 'submeter' ? 'page' : undefined}>Submeter projeto</a>
        <a className="acesso-restrito" href="#acesso" aria-current={pagina === 'acesso' ? 'page' : undefined}>Área restrita <span className="avatar"><Icone nome="usuario" /></span></a>
        <button className="alternador-tema" onClick={alternarTema} aria-label={`Ativar modo ${tema === 'escuro' ? 'claro' : 'escuro'}`} aria-pressed={tema === 'escuro'} title={`Ativar modo ${tema === 'escuro' ? 'claro' : 'escuro'}`}><Icone nome={tema === 'escuro' ? 'sol' : 'lua'} /></button>
      </div>
    </div>
  </header>
}
