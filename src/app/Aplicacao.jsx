import { useEffect, useState } from 'react'
import { basePortal, enderecoPrivado, lerRota, navegar, retornoProfessor } from './rotas.js'
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
import PaginaDetalhesSubmissao from '../pages/teacher/PaginaDetalhesSubmissao.jsx'

function identificarPagina(rota) {
  if (['projetos', 'biblioteca'].includes(rota)) return 'projetos'
  if (rota === 'acesso') return 'acesso'
  if (rota === 'submeter') return 'submissao'
  if (
    rota === 'professor' ||
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
        url.pathname.startsWith(enderecoPrivado('professor'))
      const sairDoPainel =
        ['acesso', 'professor'].includes(identificarPagina(lerRota())) &&
        url.pathname === basePortal
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
              : pagina === 'professor'
                ? sessao
                  ? 'Avaliações — Portal de Cursos'
                  : 'Entrar — Portal de Cursos'
                : pagina === 'acesso'
                  ? 'Entrar — Portal de Cursos'
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
    definirSessao(novaSessao)
    definirSessaoExpirada(false)
    navegar(enderecoPrivado(retornoProfessor()), true)
  }
  function sair() {
    definirSessao(null)
    definirSessaoExpirada(false)
    navegar(enderecoPrivado('login'), true)
  }
  useEffect(() => {
    const noSitePublico = window.location.pathname === basePortal
    if (pagina === 'professor' && !sessao) {
      const retorno =
        rota.startsWith('professor/submissao/') || rota === 'professor/perfil'
          ? rota
          : 'professor/feed'
      navegar(`${enderecoPrivado('login')}?retorno=${encodeURIComponent(retorno)}`, true)
    } else if (pagina === 'acesso' && sessao) {
      navegar(enderecoPrivado(retornoProfessor()), true)
    } else if (pagina === 'acesso' && noSitePublico) {
      navegar(enderecoPrivado('login'), true)
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
        : rota === 'acesso'
          ? 'acesso'
          : pagina === 'detalhes-curso'
            ? 'cursos'
            : pagina
  if (pagina === 'acesso' || pagina === 'professor') {
    return (
      <EstruturaProfessor
        perfilAtivo={rota === 'professor/perfil'}
        usuario={sessao?.usuario}
        aoSair={sair}
        tema={tema}
        alternarTema={definirTema}
      >
        <a className="pular-conteudo" href="#conteudo">
          Pular para o conteúdo
        </a>
        {!sessao ? (
          <PaginaAcesso aoEntrar={entrar} sessaoExpirada={sessaoExpirada} />
        ) : rota === 'professor/perfil' ? (
          <PaginaPerfil
            usuario={sessao.usuario}
            aoSalvar={(perfil) =>
              definirSessao((atual) => ({ ...atual, usuario: { ...atual.usuario, ...perfil } }))
            }
          />
        ) : identificadorSubmissao ? (
          <PaginaDetalhesSubmissao
            key={identificadorSubmissao}
            identificador={identificadorSubmissao}
          />
        ) : (
          <PaginaProfessor />
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
