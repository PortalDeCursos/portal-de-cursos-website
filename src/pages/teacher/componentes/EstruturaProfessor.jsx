import { basePortal, enderecoPrivado } from '../../../app/rotas.js'
import logo from '../../../assets/marca/logo-portal.png'
import './estrutura-professor.css'
import Cabecalho from '../../../shared/components/header/Cabecalho.jsx'

export default function EstruturaProfessor({
  usuario,
  aoSair,
  tema,
  alternarTema,
  children,
  perfilAtivo = false,
}) {
  return (
    <div
      className={`area-professor ${usuario ? 'area-professor--conectada' : 'area-professor--entrada'}`}
    >
      {usuario ? (
        <Cabecalho
          areaProfessor
          autenticado
          pagina={perfilAtivo ? 'perfil' : 'professor'}
          usuario={usuario}
          tema={tema}
          alternarTema={alternarTema}
          aoSair={aoSair}
        />
      ) : (
        <header className="barra-professor">
          <a
            className="barra-professor__marca"
            href={usuario ? enderecoPrivado('professor/feed') : basePortal}
          >
            <img src={logo} alt="" width="32" height="32" />
            <span>
              Portal de Cursos<strong>Área do professor</strong>
            </span>
          </a>
          <nav className="barra-professor__acoes" aria-label="Navegação da área do professor">
            {usuario && (
              <a href={enderecoPrivado('professor/feed')} aria-current="page">
                Submissões
              </a>
            )}
            <a href={`${basePortal}#inicio`}>
              Ver portal <span aria-hidden="true">↗</span>
            </a>
            <button
              type="button"
              onClick={() => alternarTema(tema === 'escuro' ? 'claro' : 'escuro')}
              aria-label={tema === 'escuro' ? 'Ativar tema claro' : 'Ativar tema escuro'}
            >
              {tema === 'escuro' ? 'Tema claro' : 'Tema escuro'}
            </button>
            {usuario && (
              <button type="button" onClick={aoSair}>
                Sair da conta
              </button>
            )}
          </nav>
        </header>
      )}
      {usuario && (
        <div className="area-professor__identidade">
          {usuario.nome || 'Professor'}
          <span>Conta autenticada</span>
        </div>
      )}
      {children}
      {!usuario && (
        <footer className="acesso-rodape">Portal de Cursos · Acesso de professores</footer>
      )}
    </div>
  )
}
