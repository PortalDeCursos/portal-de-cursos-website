import { useEffect, useRef, useState } from 'react'
import { basePortal, enderecoPrivado } from '../../../app/rotas.js'
import Icone from '../icon/Icone.jsx'
import logoPortal from '../../../assets/marca/logo-portal.png'
import '../../styles/estrutura.css'
import './cabecalho.css'

export default function Cabecalho({
  tema,
  alternarTema,
  pagina = 'inicio',
  autenticado = false,
  areaProfessor = false,
  aoSair,
  usuario,
  destinoArea = 'professor/feed',
  destinoPerfil = 'professor/perfil',
}) {
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
        definirMenuAberto(false)
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
    <header
      className={`cabecalho ${pagina === 'cursos' ? 'cabecalho--catalogo' : ''} ${areaProfessor ? 'cabecalho--professor' : ''}`}
    >
      <div className="limite cabecalho__conteudo">
        <a
          className="marca marca--cabecalho"
          href={areaProfessor ? enderecoPrivado(destinoArea) : '#inicio'}
          aria-label={areaProfessor ? 'Portal de Cursos — Minha área' : 'Portal de Cursos — Início'}
        >
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
          aria-label={areaProfessor ? 'Navegação da área do professor' : 'Navegação principal'}
          onClick={() => definirMenuAberto(false)}
        >
          {areaProfessor ? (
            <>
              <a href={`${basePortal}#inicio`}>
                Ver portal <span aria-hidden="true">↗</span>
              </a>
              <a
                href={enderecoPrivado(destinoPerfil)}
                aria-current={pagina === 'perfil' ? 'page' : undefined}
              >
                Meu perfil
              </a>
              <button className="navegacao__sair" type="button" onClick={aoSair}>
                Sair da conta
              </button>
            </>
          ) : (
            <>
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
                href={enderecoPrivado(autenticado ? destinoArea : 'professor/login')}
                aria-current={
                  ['acesso-professor', 'professor'].includes(pagina) ? 'page' : undefined
                }
              >
                Área do Professor
              </a>
              <a
                className="navegacao__admin"
                href={enderecoPrivado(autenticado ? destinoArea : 'administracao/login')}
                aria-current={
                  ['acesso-administracao', 'administracao'].includes(pagina) ? 'page' : undefined
                }
              >
                Administração
              </a>
            </>
          )}
        </nav>
        <div className="cabecalho__acoes">
          {areaProfessor ? (
            <>
              <a className="cabecalho__portal" href={`${basePortal}#inicio`}>
                Ver portal <span aria-hidden="true">↗</span>
              </a>
              <button className="cabecalho__sair" type="button" onClick={aoSair}>
                Sair da conta
              </button>
              <a
                className="cabecalho__perfil"
                href={enderecoPrivado(destinoPerfil)}
                aria-label="Meu perfil"
                title="Editar meu perfil"
                aria-current={pagina === 'perfil' ? 'page' : undefined}
              >
                {usuario?.foto ? (
                  <img src={usuario.foto} alt="" />
                ) : (
                  <span className="avatar">
                    <Icone nome="usuario" />
                  </span>
                )}
              </a>
            </>
          ) : (
            <>
              <a
                className="cabecalho__submissao"
                href="#submeter"
                aria-current={pagina === 'submeter' ? 'page' : undefined}
              >
                Submeter projeto
              </a>
              <a
                className="cabecalho__admin-link"
                href={enderecoPrivado(autenticado ? destinoArea : 'administracao/login')}
                aria-current={pagina === 'acesso-administracao' ? 'page' : undefined}
                title="Acesso Administrativo"
              >
                Administração
              </a>
              <a
                className="acesso-restrito"
                href={enderecoPrivado(autenticado ? destinoArea : 'professor/login')}
                aria-current={
                  ['acesso-professor', 'professor'].includes(pagina) ? 'page' : undefined
                }
                title="Área do Professor"
              >
                Área do Professor{' '}
                <span className="avatar">
                  <Icone nome="usuario" />
                </span>
              </a>
            </>
          )}
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
