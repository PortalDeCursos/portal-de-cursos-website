import { useEffect, useState } from 'react'
import { basePortal, enderecoPrivado, lerRota, navegar, retornoAutenticado } from './rotas.js'
import EstruturaProfessor from '../pages/teacher/componentes/EstruturaProfessor.jsx'
import Cabecalho from '../shared/components/header/Cabecalho.jsx'
import Rodape from '../shared/components/footer/Rodape.jsx'
import JanelaContexto from '../shared/components/context-dialog/JanelaContexto.jsx'
import PaginaInicial from '../pages/home/PaginaInicial.jsx'
import PaginaCursos from '../pages/courses/PaginaCursos.jsx'
import RodapeCatalogo from '../pages/courses/components/catalog-footer/RodapeCatalogo.jsx'
import PaginaDetalhesCurso from '../pages/course-details/PaginaDetalhesCurso.jsx'
import PaginaProjetos from '../pages/projects/PaginaProjetos.jsx'
import PaginaSubmissao from '../pages/submission/PaginaSubmissao.jsx'
import PaginaAcesso from '../pages/acesso/PaginaAcesso.jsx'
import PaginaPerfil from '../pages/perfil/PaginaPerfil.jsx'
import PaginaProfessor from '../pages/teacher/PaginaProfessor.jsx'
import PaginaAdministracao from '../pages/administracao/PaginaAdministracao.jsx'
import { cursos } from '../data/cursos.js'
import { projetos } from '../data/projetos.js'
import { submissoes } from '../data/submissoes.js'
import PaginaDetalhesSubmissao from '../pages/teacher/PaginaDetalhesSubmissao.jsx'

function identificarPagina(rota) {
  if (['projetos', 'biblioteca'].includes(rota)) return 'projetos'
  if (['acesso', 'acesso-professor'].includes(rota)) return 'acesso-professor'
  if (rota === 'acesso-administracao') return 'acesso-administracao'
  if (rota === 'administracao' || rota.startsWith('administracao/')) return 'administracao'
  if (rota === 'submeter') return 'submissao'
  if (
    rota === 'professor' ||
    rota === 'professor/painel' ||
    rota === 'professor/perfil' ||
    rota.startsWith('professor/submissao/')
  )
    return 'professor'
  if (rota.startsWith('curso/')) return 'detalhes-curso'
  if (['cursos', 'catalogo'].includes(rota)) return 'cursos'
  if (!rota || rota === 'inicio') return 'inicio'
  return null
}

function lerTema() {
  try {
    const salvo = localStorage.getItem('portal-cursos-tema')
    if (salvo === 'claro' || salvo === 'escuro') return salvo
  } catch {
    /* A navegação continua sem armazenamento local. */
  }
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'escuro' : 'claro'
}

export default function Aplicacao() {
  const [sessao, definirSessao] = useState(null)
  const [decisoes, definirDecisoes] = useState({})
  const [rascunhos, definirRascunhos] = useState({ cursos, projetos })
  const [sessaoExpirada, definirSessaoExpirada] = useState(false)
  const [tema, definirTema] = useState(lerTema)
  const [rota, definirRota] = useState(lerRota)
  const [pagina, definirPagina] = useState(() => identificarPagina(lerRota()) || 'inicio')
  const [rotaCurso, definirRotaCurso] = useState(() =>
    window.location.hash.startsWith('#curso/') ? window.location.hash.slice(1) : '',
  )
  useEffect(() => {
    document.documentElement.dataset.tema = tema
    try {
      localStorage.setItem('portal-cursos-tema', tema)
    } catch {
      /* Preferência mantida nesta sessão. */
    }
  }, [tema])
  useEffect(() => {
    const acompanharRota = () => {
      const destino = lerRota()
      definirRota(destino)
      const proximaPagina = identificarPagina(destino)
      if (proximaPagina) {
        definirPagina(proximaPagina)
        if (destino.startsWith('curso/')) definirRotaCurso(destino)
        if (!destino.startsWith('curso/') || destino.split('/').length === 2)
          window.scrollTo({ top: 0, behavior: 'instant' })
      }
    }
    function acompanharLink(evento) {
      const link = evento.target.closest('a')
      if (
        !link ||
        evento.defaultPrevented ||
        evento.button !== 0 ||
        evento.metaKey ||
        evento.ctrlKey ||
        evento.shiftKey ||
        evento.altKey ||
        link.target ||
        link.hasAttribute('download')
      )
        return
      const url = new URL(link.href)
      if (url.origin !== window.location.origin) return
      if (url.pathname === window.location.pathname && url.hash === '#conteudo') return
      const privado =
        url.pathname === enderecoPrivado('login') ||
        url.pathname === enderecoPrivado('professor/login') ||
        url.pathname === enderecoPrivado('administracao/login') ||
        url.pathname.startsWith(enderecoPrivado('professor')) ||
        url.pathname.startsWith(enderecoPrivado('administracao'))
      const sairDoPainel =
        ['acesso-professor', 'acesso-administracao', 'professor', 'administracao'].includes(
          identificarPagina(lerRota()),
        ) && url.pathname === basePortal
      if (privado || sairDoPainel) {
        evento.preventDefault()
        navegar(url.pathname + url.search + url.hash)
      }
    }
    window.addEventListener('hashchange', acompanharRota)
    window.addEventListener('popstate', acompanharRota)
    document.addEventListener('click', acompanharLink)
    return () => {
      window.removeEventListener('hashchange', acompanharRota)
      window.removeEventListener('popstate', acompanharRota)
      document.removeEventListener('click', acompanharLink)
    }
  }, [])
  useEffect(() => {
    if (pagina !== 'detalhes-curso')
      document.title =
        pagina === 'projetos'
          ? 'Projetos — Portal de Cursos'
          : pagina === 'cursos'
            ? 'Cursos — Portal de Cursos'
            : pagina === 'submissao'
              ? 'Submeter projeto — Portal de Cursos'
              : pagina === 'administracao'
                ? 'Administração — Portal de Cursos'
                : pagina === 'acesso-administracao'
                  ? 'Acesso Administrativo — Portal de Cursos'
                  : pagina === 'acesso-professor'
                    ? 'Acesso do Professor — Portal de Cursos'
                    : pagina === 'professor'
                      ? sessao
                        ? 'Avaliações — Portal de Cursos'
                        : 'Entrar — Portal de Cursos'
                      : 'Portal de Cursos — Formação e produção acadêmica'
  }, [pagina, sessao])
  useEffect(() => {
    if (!sessao) return
    function verificarValidade() {
      if (Date.now() >= sessao.expiraEm) {
        definirSessao(null)
        definirSessaoExpirada(true)
      }
    }
    const temporizador = window.setTimeout(
      verificarValidade,
      Math.max(0, sessao.expiraEm - Date.now()),
    )
    window.addEventListener('focus', verificarValidade)
    document.addEventListener('visibilitychange', verificarValidade)
    return () => {
      window.clearTimeout(temporizador)
      window.removeEventListener('focus', verificarValidade)
      document.removeEventListener('visibilitychange', verificarValidade)
    }
  }, [sessao])

  function entrar(novaSessao) {
    definirDecisoes({})
    definirRascunhos({ cursos, projetos })
    definirSessao(novaSessao)
    definirSessaoExpirada(false)
    navegar(enderecoPrivado(retornoAutenticado(novaSessao.tipoUsuario)), true)
  }
  function sair() {
    const eraAdmin = sessao?.tipoUsuario === 'ADMIN'
    definirSessao(null)
    definirDecisoes({})
    definirRascunhos({ cursos, projetos })
    definirSessaoExpirada(false)
    navegar(enderecoPrivado(eraAdmin ? 'administracao/login' : 'professor/login'), true)
  }
  useEffect(() => {
    const noSitePublico = window.location.pathname === basePortal
    const ePaginaLogin = ['acesso-professor', 'acesso-administracao'].includes(pagina)
    if (pagina === 'administracao' && !sessao) {
      const retorno = rota === 'administracao' ? 'administracao/painel' : rota
      navegar(
        `${enderecoPrivado('administracao/login')}?retorno=${encodeURIComponent(retorno)}`,
        true,
      )
    } else if (pagina === 'professor' && !sessao) {
      const retorno =
        rota.startsWith('professor/submissao/') ||
        ['professor/perfil', 'professor/painel'].includes(rota)
          ? rota
          : 'professor/feed'
      navegar(`${enderecoPrivado('professor/login')}?retorno=${encodeURIComponent(retorno)}`, true)
    } else if (ePaginaLogin && sessao) {
      navegar(enderecoPrivado(retornoAutenticado(sessao.tipoUsuario)), true)
    } else if (
      sessao &&
      ['professor', 'administracao'].includes(pagina) &&
      pagina !== (sessao.tipoUsuario === 'ADMIN' ? 'administracao' : 'professor')
    ) {
      navegar(
        enderecoPrivado(sessao.tipoUsuario === 'ADMIN' ? 'administracao/painel' : 'professor/feed'),
        true,
      )
    } else if (
      sessao &&
      pagina === 'professor' &&
      window.location.pathname.endsWith('/professor/painel')
    ) {
      navegar(enderecoPrivado('professor/feed'), true)
    } else if (ePaginaLogin && noSitePublico) {
      navegar(
        enderecoPrivado(
          pagina === 'acesso-administracao' ? 'administracao/login' : 'professor/login',
        ),
        true,
      )
    } else if (pagina === 'professor' && noSitePublico) {
      navegar(enderecoPrivado(rota === 'professor' ? 'professor/feed' : rota), true)
    }
  }, [pagina, rota, sessao])
  const [, identificador, aba] = rotaCurso.split('/')
  const identificadorSubmissao = rota.startsWith('professor/submissao/') ? rota.split('/')[2] : ''
  const secaoAtiva =
    rota === 'biblioteca' || rota.startsWith('projeto/')
      ? 'projetos'
      : rota === 'submeter'
        ? 'submeter'
        : ['acesso-professor', 'acesso-administracao'].includes(pagina)
          ? pagina
          : pagina === 'detalhes-curso'
            ? 'cursos'
            : pagina
  const ePaginaLogin = ['acesso-professor', 'acesso-administracao'].includes(pagina)
  if (ePaginaLogin || pagina === 'professor' || pagina === 'administracao') {
    const tipoAcesso = pagina === 'acesso-administracao' ? 'ADMIN' : 'PROFESSOR'
    const administrador = sessao?.tipoUsuario === 'ADMIN'
    if (sessao && (ePaginaLogin || pagina !== (administrador ? 'administracao' : 'professor')))
      return (
        <main id="conteudo" className="limite pagina-painel" role="status">
          Abrindo sua área…
        </main>
      )
    return (
      <EstruturaProfessor
        administrador={administrador}
        rota={rota}
        perfilAtivo={['professor/perfil', 'administracao/perfil'].includes(rota)}
        usuario={sessao?.usuario}
        aoSair={sair}
        tema={tema}
        alternarTema={definirTema}
        tipoAcesso={tipoAcesso}
      >
        <a className="pular-conteudo" href="#conteudo">
          Pular para o conteúdo
        </a>
        {!sessao ? (
          <PaginaAcesso tipoAcesso={tipoAcesso} aoEntrar={entrar} sessaoExpirada={sessaoExpirada} />
        ) : ['professor/perfil', 'administracao/perfil'].includes(rota) ? (
          <PaginaPerfil
            destinoVoltar={administrador ? 'administracao/painel' : 'professor/feed'}
            usuario={sessao.usuario}
            aoSalvar={(perfil) =>
              definirSessao((atual) => ({ ...atual, usuario: { ...atual.usuario, ...perfil } }))
            }
          />
        ) : administrador ? (
          <PaginaAdministracao
            secao={rota.split('/')[1] || 'painel'}
            sessao={sessao}
            rascunhos={rascunhos}
            aoAlterar={(dominio, itens) =>
              definirRascunhos((atual) => ({ ...atual, [dominio]: itens }))
            }
            submissoes={submissoes.map((item) => ({
              ...item,
              status: decisoes[item.identificador] || item.status,
            }))}
          />
        ) : identificadorSubmissao ? (
          <PaginaDetalhesSubmissao
            key={identificadorSubmissao}
            identificador={identificadorSubmissao}
            decisao={decisoes[identificadorSubmissao]}
            aoDecidir={(status) =>
              definirDecisoes((atuais) => ({ ...atuais, [identificadorSubmissao]: status }))
            }
          />
        ) : (
          <PaginaProfessor
            submissoes={submissoes.map((item) => ({
              ...item,
              status: decisoes[item.identificador] || item.status,
            }))}
          />
        )}
      </EstruturaProfessor>
    )
  }
  return (
    <>
      <a className="pular-conteudo" href="#conteudo">
        Pular para o conteúdo
      </a>
      <Cabecalho
        destinoArea={sessao?.tipoUsuario === 'ADMIN' ? 'administracao/painel' : 'professor/feed'}
        pagina={secaoAtiva}
        autenticado={Boolean(sessao)}
        tema={tema}
        alternarTema={(proximoTema) => definirTema(proximoTema)}
      />
      {pagina === 'cursos' && <PaginaCursos />}
      {pagina === 'projetos' && <PaginaProjetos />}
      {pagina === 'detalhes-curso' && (
        <PaginaDetalhesCurso key={identificador} identificador={identificador} aba={aba} />
      )}
      {pagina === 'submissao' && <PaginaSubmissao />}
      {pagina === 'inicio' && <PaginaInicial />}
      {pagina === 'inicio' ? <Rodape /> : <RodapeCatalogo pagina={pagina} />}
      <JanelaContexto
        rota={rota}
        destinoAoFechar={pagina === 'detalhes-curso' ? rotaCurso : pagina}
      />
    </>
  )
}
