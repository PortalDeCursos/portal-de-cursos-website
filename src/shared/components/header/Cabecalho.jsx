import { useEffect, useRef, useState } from 'react'
import Icone from '../icon/Icone.jsx'
import logoPortal from '../../../assets/marca/logo-portal.png'
import '../../styles/estrutura.css'
import './cabecalho.css'

export default function Cabecalho({ tema, alternarTema, pagina = 'inicio' }) {
  const [menuAberto, definirMenuAberto] = useState(false)
  const [seletorTemaAberto, definirSeletorTemaAberto] = useState(false)
  const seletorTema = useRef(null)

  useEffect(() => {
    function fecharAoClicarFora(evento) {
      if (!seletorTema.current?.contains(evento.target)) {
        definirSeletorTemaAberto(false)
      }
    }

    function fecharAoPressionarEscape(evento) {
      if (evento.key === 'Escape') {
        definirSeletorTemaAberto(false)
      }
    }

    document.addEventListener('click', fecharAoClicarFora)
    document.addEventListener('keydown', fecharAoPressionarEscape)
    return () => {
      document.removeEventListener('click', fecharAoClicarFora)
      document.removeEventListener('keydown', fecharAoPressionarEscape)
    }
  }, [])

  return (
    <header className={`cabecalho ${pagina === 'cursos' ? 'cabecalho--catalogo' : ''}`}>
      <div className="limite cabecalho__conteudo">
        <a className="marca marca--cabecalho" href="#inicio" aria-label="Portal de Cursos — Início">
          <img className="marca__simbolo" src={logoPortal} alt="" width="44" height="44" />
          <span>
            Portal de <span className="marca__cursos">Cursos</span>
          </span>
        </a>
        <button
          className="botao-menu"
          aria-label="Abrir navegação"
          aria-expanded={menuAberto}
          aria-controls="navegacao-principal"
          onClick={() => definirMenuAberto(!menuAberto)}
        >
          ☰
        </button>
        <nav
          id="navegacao-principal"
          className={`navegacao ${menuAberto ? 'navegacao--aberta' : ''}`}
          aria-label="Navegação principal"
          onClick={() => definirMenuAberto(false)}
        >
          <a href="#inicio" aria-current={pagina === 'inicio' ? 'page' : undefined}>
            Início
          </a>
          <a href="#cursos" aria-current={pagina === 'cursos' ? 'page' : undefined}>
            Cursos
          </a>
          <a href="#projetos" aria-current={pagina === 'projetos' ? 'page' : undefined}>
            Projetos
          </a>
          <a
            className="navegacao__submeter"
            href="#submeter"
            aria-current={pagina === 'submeter' ? 'page' : undefined}
          >
            Submeter projeto
          </a>
          <a
            className="navegacao__acesso"
            href="#acesso"
            aria-current={pagina === 'acesso' ? 'page' : undefined}
          >
            Área restrita
          </a>
        </nav>
        <div className="cabecalho__acoes">
          <a
            className="cabecalho__submissao"
            href="#submeter"
            aria-current={pagina === 'submeter' ? 'page' : undefined}
          >
            Submeter projeto
          </a>
          <a
            className="acesso-restrito"
            href="#acesso"
            aria-current={pagina === 'acesso' ? 'page' : undefined}
          >
            Área restrita{' '}
            <span className="avatar">
              <Icone nome="usuario" />
            </span>
          </a>
          <div className="seletor-tema" ref={seletorTema}>
            <button
              className="alternador-tema"
              onClick={() => definirSeletorTemaAberto(!seletorTemaAberto)}
              aria-label="Escolher tema"
              aria-expanded={seletorTemaAberto}
              aria-haspopup="listbox"
              title="Escolher tema"
            >
              <Icone nome={tema === 'escuro' ? 'sol' : 'lua'} />
            </button>
            {seletorTemaAberto && (
              <div className="opcoes-tema" role="listbox" aria-label="Tema da interface">
                <button
                  className={tema === 'claro' ? 'opcao-tema opcao-tema--selecionada' : 'opcao-tema'}
                  onClick={() => {
                    alternarTema('claro')
                    definirSeletorTemaAberto(false)
                  }}
                  role="option"
                  aria-selected={tema === 'claro'}
                >
                  Claro
                </button>
                <button
                  className={
                    tema === 'escuro' ? 'opcao-tema opcao-tema--selecionada' : 'opcao-tema'
                  }
                  onClick={() => {
                    alternarTema('escuro')
                    definirSeletorTemaAberto(false)
                  }}
                  role="option"
                  aria-selected={tema === 'escuro'}
                >
                  Escuro
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
