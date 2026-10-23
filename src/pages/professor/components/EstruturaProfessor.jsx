import { basePortal, enderecoPrivado } from '@/app/rotas.js'
import logo from '@/assets/marca/logo-portal.png'
import './estrutura-professor.css'
import Cabecalho from '@/shared/components/Cabecalho.jsx'
import NavegacaoAdministracao from '@/pages/administracao/components/NavegacaoAdministracao.jsx'
import NavegacaoCoordenacao from '@/pages/coordenacao/components/NavegacaoCoordenacao.jsx'

export default function EstruturaProfessor({
  usuario,
  aoSair,
  tema,
  alternarTema,
  children,
  perfilAtivo = false,
  rota = 'professor',
  administrador = false,
  coordenador = false,
  aluno = false,
}) {
  const rotuloAcesso =
    usuario?.tipoUsuario === 'ADMIN'
      ? 'Acesso Administrativo'
      : usuario?.tipoUsuario === 'COORDENADOR'
        ? 'Acesso da Coordenação'
        : aluno
          ? 'Área do Aluno'
          : 'Acesso unificado'
  const destinoArea = administrador
    ? 'administracao/painel'
    : coordenador
      ? 'coordenacao/painel'
      : aluno
        ? 'aluno/painel'
        : 'professor/feed'
  const destinoPerfil = administrador
    ? 'administracao/perfil'
    : coordenador
      ? 'coordenacao/perfil'
      : aluno
        ? 'aluno/painel'
        : 'professor/perfil'
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
          destinoArea={destinoArea}
          destinoPerfil={destinoPerfil}
        />
      ) : (
        <header className="barra-professor">
          <a
            className="barra-professor__marca"
            href={usuario ? enderecoPrivado('professor/feed') : basePortal}
          >
            <img src={logo} alt="" width="32" height="32" />
            <span>
              Portal de Cursos<strong>{rotuloAcesso}</strong>
            </span>
          </a>
          <nav className="barra-professor__acoes" aria-label="Navegação do portal">
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
      {usuario && (administrador || coordenador) ? (
        <div className="painel-estrutura">
          {administrador ? (
            <NavegacaoAdministracao rota={rota} usuario={usuario} />
          ) : (
            <NavegacaoCoordenacao rota={rota} />
          )}
          <div className="painel-estrutura__conteudo">{children}</div>
        </div>
      ) : (
        children
      )}
      {!usuario && <footer className="acesso-rodape">Portal de Cursos · {rotuloAcesso}</footer>}
    </div>
  )
}
