import { montarEdicaoProjeto, pegarIdsDisciplinas } from '@/shared/utils/contratoProjetos.js'
import { listarDisciplinasPorCurso } from '@/api/disciplinas.js'
import { Suspense, lazy, useEffect, useState } from 'react'
import { definirSessao, limparSessao, pegarSessao } from '@/api/sessaoMemoria.js'
import { basePortal, enderecoPrivado, lerRota, navegar, retornoAutenticado } from './rotas.js'
import EstruturaProfessor from '@/pages/professor/componentes/EstruturaProfessor.jsx'
import { FotosDaSessao } from '@/shared/componentes/FotoDaConta.jsx'
import Cabecalho from '@/shared/componentes/Cabecalho.jsx'
import Rodape from '@/componentes/Rodape.jsx'
const PaginaPoliticaPrivacidade = lazy(
  () => import('@/pages/privacidade/PaginaPoliticaPrivacidade.jsx'),
)
const PaginaInicial = lazy(() => import('@/pages/inicio/PaginaInicial.jsx'))
const PaginaCursos = lazy(() => import('@/pages/cursos/PaginaCursos.jsx'))
const PaginaCurso = lazy(() => import('@/pages/curso/PaginaCurso.jsx'))
const PaginaProjeto = lazy(() => import('@/pages/projetos/PaginaProjeto.jsx'))
const PaginaPerfilProfessor = lazy(() => import('@/pages/perfil/PaginaPerfilProfessor.jsx'))
const PaginaPerfilAluno = lazy(() => import('@/pages/perfil/PaginaPerfilAluno.jsx'))
const PaginaProjetos = lazy(() => import('@/pages/projetos/PaginaProjetos.jsx'))
const PaginaSubmissao = lazy(() => import('@/pages/submissao/PaginaSubmissao.jsx'))
const PaginaAcesso = lazy(() => import('../pages/acesso/PaginaAcesso.jsx'))
const PaginaLoginAluno = lazy(() => import('@/pages/acesso/PaginaLoginAluno.jsx'))
const PaginaLoginProfessor = lazy(() => import('@/pages/acesso/PaginaLoginProfessor.jsx'))
const PaginaLoginAdministracao = lazy(() => import('@/pages/acesso/PaginaLoginAdministracao.jsx'))
import PaginaPerfil from '@/pages/perfil/PaginaPerfil.jsx'
const PaginaProfessor = lazy(() => import('@/pages/professor/PaginaProfessor.jsx'))
const PaginaAdministracao = lazy(() => import('../pages/administracao/PaginaAdministracao.jsx'))
const PaginaCoordenacao = lazy(() => import('../pages/coordenacao/PaginaCoordenacao.jsx'))
const PaginaCadastroAluno = lazy(() => import('@/pages/cadastro-aluno/PaginaCadastroAluno.jsx'))
const PaginaPainelAluno = lazy(() => import('@/pages/painel-aluno/PaginaPainelAluno.jsx'))
const PaginaVerSubmissao = lazy(() => import('@/pages/professor/PaginaVerSubmissao.jsx'))

function CarregamentoPagina() {
  return (
    <div className="limite carregamento-pagina" aria-busy="true">
      <span className="carregamento-pagina__spinner" aria-hidden="true" />
      <p role="status" aria-live="polite">
        Carregando página…
      </p>
    </div>
  )
}
import { listarCursos } from '@/api/cursos.js'
import { listarProfessores } from '@/api/professores.js'
import {
  atualizarProjeto,
  atualizarStatusProjeto,
  buscarProjetoPorId,
  encaminharProjetoParaCoordenacao,
  excluirProjeto,
  listarProjetos,
} from '@/api/projetos.js'
import { listarCoordenadores } from '@/api/coordenadores.js'
import { enviarNotificacaoProjeto } from '@/api/notificacoes.js'
import { limparLocal } from './limparLocal.js'

function descobrirPagina(rota) {
  if (rota.startsWith('projeto/')) return 'detalhes-projeto'
  if (rota.startsWith('professor/perfil-publico/') || rota.startsWith('professor/')) {
    if (
      !['professor', 'professor/painel', 'professor/perfil'].includes(rota) &&
      !rota.startsWith('professor/submissao/')
    ) {
      return 'perfil-professor'
    }
  }
  if (rota.startsWith('aluno/')) {
    if (!['aluno/cadastro', 'aluno/painel', 'aluno/perfil'].includes(rota)) return 'perfil-aluno'
  }
  if (['projetos', 'biblioteca'].includes(rota)) return 'projetos'
  if (['acesso', 'acesso-professor', 'acesso-administracao'].includes(rota)) return 'acesso'
  if (rota === 'aluno/cadastro') return 'aluno-cadastro'
  if (['aluno/painel', 'aluno/perfil'].includes(rota)) return 'aluno-painel'
  if (rota === 'administracao' || rota.startsWith('administracao/')) return 'administracao'
  if (rota === 'coordenacao' || rota.startsWith('coordenacao/')) return 'coordenacao'
  if (rota === 'submeter') return 'submissao'
  if (
    rota === 'professor' ||
    rota === 'professor/painel' ||
    rota === 'professor/perfil' ||
    rota.startsWith('professor/submissao/')
  )
    return 'professor'
  if (rota === 'politica-de-privacidade') return 'privacidade'
  if (rota.startsWith('curso/')) return 'detalhes-curso'
  if (['cursos', 'catalogo'].includes(rota)) return 'cursos'
  if (!rota || rota === 'inicio') return 'inicio'
  return null
}

function lerTema() {
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'escuro' : 'claro'
}

export default function App() {
  const [sessao, mudarSessao] = useState(() => {
    const salva = pegarSessao()
    return salva && Date.now() < salva.expiraEm ? salva : null
  })
  const [decisoes, mudarDecisoes] = useState({})
  const [listaSubmissoes, mudarListaSubmissoes] = useState([])
  const [erroSubmissoes, mudarErroSubmissoes] = useState('')
  const [tentativaSubmissoes, mudarTentativaSubmissoes] = useState(0)
  const [sessaoExpirada, mudarSessaoExpirada] = useState(false)
  const [tema, mudarTema] = useState(lerTema)
  const [rota, mudarRota] = useState(lerRota)
  const [pagina, mudarPagina] = useState(() => descobrirPagina(lerRota()) || 'inicio')
  const [rotaCurso, mudarRotaCurso] = useState(() =>
    window.location.hash.startsWith('#curso/') ? window.location.hash.slice(1) : '',
  )
  useEffect(() => {
    if (
      window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
      !('IntersectionObserver' in window)
    )
      return

    const observer = new IntersectionObserver(
      (entradas) => {
        entradas.forEach((entrada) => {
          if (!entrada.isIntersecting) return
          entrada.target.classList.add('revelacao-rolagem--visivel')
          observer.unobserve(entrada.target)
        })
      },
      { threshold: 0.08, rootMargin: '0px 0px -10% 0px' },
    )

    const seletor =
      'main section:not([data-sem-revelacao]), main article.cartao, main .item-projeto, main [data-revelacao]'
    function observar(elemento) {
      if (!(elemento instanceof Element)) return
      const alvos = []
      if (elemento.matches(seletor)) alvos.push(elemento)
      alvos.push(...elemento.querySelectorAll(seletor))
      alvos.forEach((alvo) => {
        if (alvo.classList.contains('revelacao-rolagem--visivel')) return
        alvo.dataset.revelacaoRolagem = 'preparada'
        alvo.classList.add('revelacao-rolagem')
        observer.observe(alvo)
      })
    }

    observar(document.getElementById('root'))
    const mutacoes = new MutationObserver((registros) =>
      registros.forEach((registro) => registro.addedNodes.forEach(observar)),
    )
    mutacoes.observe(document.getElementById('root'), { childList: true, subtree: true })

    return () => {
      mutacoes.disconnect()
      observer.disconnect()
    }
  }, [])

  useEffect(() => {
    if (sessao) definirSessao(sessao)
    else limparSessao()
  }, [sessao])
  useEffect(() => {
    document.documentElement.dataset.tema = tema
  }, [tema])
  useEffect(() => {
    const aoMudarRota = () => {
      const destino = lerRota()
      mudarRota(destino)
      const proximaPagina = descobrirPagina(destino)
      if (proximaPagina) {
        mudarPagina(proximaPagina)
        if (destino.startsWith('curso/')) mudarRotaCurso(destino)
        if (!destino.startsWith('curso/') || destino.split('/').length === 2)
          window.scrollTo({ top: 0, behavior: 'instant' })
      }
    }
    function aoClicarLink(evento) {
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
        url.pathname.startsWith(enderecoPrivado('administracao')) ||
        url.pathname.startsWith(enderecoPrivado('coordenacao')) ||
        url.pathname.startsWith(enderecoPrivado('aluno'))
      const sairDoPainel =
        [
          'acesso-professor',
          'acesso-administracao',
          'professor',
          'administracao',
          'coordenacao',
          'aluno-cadastro',
          'aluno-painel',
        ].includes(descobrirPagina(lerRota())) && url.pathname === basePortal
      if (privado || sairDoPainel) {
        evento.preventDefault()
        navegar(url.pathname + url.search + url.hash)
      }
    }
    window.addEventListener('hashchange', aoMudarRota)
    window.addEventListener('popstate', aoMudarRota)
    document.addEventListener('click', aoClicarLink)
    return () => {
      window.removeEventListener('hashchange', aoMudarRota)
      window.removeEventListener('popstate', aoMudarRota)
      document.removeEventListener('click', aoClicarLink)
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
                : pagina === 'acesso'
                  ? 'Entrar — Portal de Cursos'
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
        mudarSessao(null)
        mudarSessaoExpirada(true)
        limparLocal()
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

  useEffect(() => {
    if (!sessao?.token) return
    const controller = new AbortController()

    async function sincronizarSubmissoes() {
      mudarErroSubmissoes('')
      try {
        const [dados, cursosCadastrados, professoresCadastrados] = await Promise.all([
          listarProjetos(sessao.token, controller.signal),
          listarCursos(controller.signal).catch(() => {
            if (!controller.signal.aborted)
              mudarErroSubmissoes(
                'Não foi possível completar os nomes dos cursos e da equipe. Tente atualizar os dados novamente.',
              )
            return []
          }),
          listarProfessores(sessao.token, {}, controller.signal).catch(() => {
            if (!controller.signal.aborted)
              mudarErroSubmissoes(
                'Não foi possível completar os nomes dos cursos e da equipe. Tente atualizar os dados novamente.',
              )
            return []
          }),
        ])

        if (Array.isArray(dados) && dados.length > 0) {
          const mapaCursos = new Map(
            (Array.isArray(cursosCadastrados) ? cursosCadastrados : []).map((c) => [
              String(c.id),
              c,
            ]),
          )
          const mapaProfessores = new Map(
            (Array.isArray(professoresCadastrados) ? professoresCadastrados : []).map((prof) => [
              String(prof.id),
              prof.nome || prof.usuario?.nome || '',
            ]),
          )

          const cursosDosProjetos = [...new Set(dados.map((p) => p.cursoId).filter(Boolean))]
          const resultadosDisciplinas = await Promise.allSettled(
            cursosDosProjetos.map((id) =>
              listarDisciplinasPorCurso(id, sessao.token, controller.signal),
            ),
          )
          if (controller.signal.aborted) return
          if (resultadosDisciplinas.some((resultado) => resultado.status === 'rejected'))
            mudarErroSubmissoes(
              'Não foi possível completar os nomes das disciplinas. Confira os identificadores exibidos e tente atualizar os dados novamente.',
            )
          const mapaDisciplinas = new Map(
            resultadosDisciplinas.flatMap((resultado) =>
              resultado.status === 'fulfilled'
                ? resultado.value.map((d) => [String(d.id), d.nome])
                : [],
            ),
          )
          const mapeadas = dados.map((p) => {
            const orientadorObj = p.professores?.find((prof) => prof.papel === 'ORIENTADOR')
            const participantesObjs =
              p.professores?.filter((prof) => prof.papel !== 'ORIENTADOR') || []
            const primeiroAutor =
              Array.isArray(p.autores) && p.autores.length > 0 ? p.autores[0] : null
            const nomeAutor =
              primeiroAutor?.nome ||
              (typeof primeiroAutor === 'string' ? primeiroAutor : '') ||
              'Aluno'
            const dataFormatada = p.dataInicio
              ? new Date(p.dataInicio + 'T12:00:00').toLocaleDateString('pt-BR')
              : ''
            const infoCurso = mapaCursos.get(String(p.cursoId))
            const nomeProfessorReal = orientadorObj?.professorId
              ? mapaProfessores.get(String(orientadorObj.professorId)) ||
                orientadorObj?.nome ||
                `Professor ${orientadorObj.professorId}`
              : ''
            const nomesParticipantes = participantesObjs
              .map((part) =>
                part.professorId
                  ? mapaProfessores.get(String(part.professorId)) ||
                    part?.nome ||
                    `Professor ${part.professorId}`
                  : part?.nome || '',
              )
              .filter(Boolean)

            return {
              identificador: String(p.id),
              id: p.id,
              cursoId: p.cursoId,
              campusId: p.campusId,
              curso:
                infoCurso?.sigla || infoCurso?.acronimo || (p.cursoId ? `Curso #${p.cursoId}` : ''),
              cursoCompleto: infoCurso?.nome || (p.cursoId ? `Curso #${p.cursoId}` : ''),
              titulo: p.nome,
              tipo:
                p.tipoProjeto === 'TCC'
                  ? 'TCC'
                  : p.tipoProjeto === 'PROJETO_INTEGRADOR'
                    ? 'Projeto Integrador'
                    : p.tipoProjeto === 'PROJETO_PESQUISA'
                      ? 'Pesquisa'
                      : p.tipoProjeto === 'PROJETO_EXTENSAO'
                        ? 'Extensão'
                        : p.tipoProjeto || '',
              orientador: nomeProfessorReal,
              orientadorId: orientadorObj?.professorId || null,
              professoresParticipantes: nomesParticipantes,
              professores: Array.isArray(p.professores) ? p.professores : [],
              autor: nomeAutor,
              autores: Array.isArray(p.autores) ? p.autores : [],
              enviadoEm: dataFormatada,
              dataInicio: p.dataInicio,
              dataFim: p.dataFim,
              documentos: Array.isArray(p.documentos) ? p.documentos : [],
              originalApi: p,
              disciplinaIds: pegarIdsDisciplinas(p),
              disciplinas: pegarIdsDisciplinas(p).map(
                (id) => mapaDisciplinas.get(String(id)) || `Disciplina #${id}`,
              ),
              statusBackend: p.statusProjeto,
              status:
                p.statusProjeto === 'EM_ANALISE'
                  ? 'Aguardando Orientador'
                  : p.statusProjeto === 'APROVADO'
                    ? 'Aprovado pelo orientador'
                    : p.statusProjeto === 'ANALISE_PUBLICACAO'
                      ? 'Aguardando Coordenação'
                      : p.statusProjeto === 'PUBLICADO'
                        ? 'Aprovado'
                        : p.statusProjeto === 'RECUSADO'
                          ? 'Recusado pelo orientador'
                          : p.statusProjeto === 'RECUSADO_PUBLICACAO'
                            ? 'Publicação recusada'
                            : p.statusProjeto === 'REVISAO'
                              ? 'Precisa de revisão'
                              : p.statusProjeto,
              resumo: p.resumo,
              objetivo: p.descricao,
              tipoAutor: p.tipoAutor || p.submissor?.tipoUsuario || null,
            }
          })
          mudarListaSubmissoes(mapeadas)
        } else if (Array.isArray(dados)) {
          mudarListaSubmissoes([])
        }
      } catch (falha) {
        if (controller.signal.aborted) return
        mudarErroSubmissoes(
          'Não foi possível atualizar os projetos. Tente novamente antes de conferir a lista.',
        )
        if (falha?.status === 401) {
          mudarSessao(null)
          mudarSessaoExpirada(true)
          limparLocal()
        }
      }
    }

    sincronizarSubmissoes()
    return () => controller.abort()
  }, [sessao?.token, tentativaSubmissoes])

  function entrar(novaSessao) {
    mudarSessao(novaSessao)
    mudarSessaoExpirada(false)
    if (novaSessao.tipoUsuario === 'ALUNO') {
      navegar(enderecoPrivado('aluno/painel'), true)
    } else {
      navegar(enderecoPrivado(retornoAutenticado(novaSessao.tipoUsuario)), true)
    }
  }
  function sair() {
    mudarSessao(null)
    mudarSessaoExpirada(false)
    mudarDecisoes({})
    mudarListaSubmissoes([])
    limparLocal()
    navegar(enderecoPrivado('login'), true)
  }
  useEffect(() => {
    const noSitePublico = window.location.pathname === basePortal
    const ePaginaLogin = pagina === 'acesso'
    const areaDaSessao =
      sessao?.tipoUsuario === 'ADMIN'
        ? 'administracao'
        : sessao?.tipoUsuario === 'COORDENADOR'
          ? 'coordenacao'
          : sessao?.tipoUsuario === 'ALUNO'
            ? 'aluno-painel'
            : 'professor'
    if (['administracao', 'coordenacao', 'professor', 'aluno-painel'].includes(pagina) && !sessao) {
      const destino =
        pagina === 'administracao'
          ? rota === 'administracao'
            ? 'administracao/painel'
            : rota
          : pagina === 'coordenacao'
            ? rota === 'coordenacao'
              ? 'coordenacao/painel'
              : rota
            : pagina === 'aluno-painel'
              ? 'aluno/painel'
              : rota.startsWith('professor/submissao/') ||
                  ['professor/perfil', 'professor/painel'].includes(rota)
                ? rota
                : 'professor/feed'
      const login = 'login'
      navegar(`${enderecoPrivado(login)}?retorno=${encodeURIComponent(destino)}`, true)
    } else if (ePaginaLogin && sessao) {
      const destino = new URLSearchParams(window.location.search).get('retorno')
      navegar(enderecoPrivado(destino || retornoAutenticado(sessao.tipoUsuario)), true)
    } else if (
      sessao &&
      ['professor', 'administracao', 'coordenacao', 'aluno-painel'].includes(pagina) &&
      pagina !== areaDaSessao
    ) {
      navegar(
        enderecoPrivado(
          areaDaSessao === 'professor'
            ? 'professor/feed'
            : areaDaSessao === 'aluno-painel'
              ? 'aluno/painel'
              : `${areaDaSessao}/painel`,
        ),
        true,
      )
    } else if (
      sessao &&
      pagina === 'professor' &&
      window.location.pathname.endsWith('/professor/painel')
    ) {
      navegar(enderecoPrivado('professor/feed'), true)
    } else if (ePaginaLogin && noSitePublico) {
      navegar(enderecoPrivado('login'), true)
    } else if (pagina === 'professor' && noSitePublico) {
      navegar(enderecoPrivado(rota === 'professor' ? 'professor/feed' : rota), true)
    }
  }, [pagina, rota, sessao])
  const [, identificador, aba] = rotaCurso.split('/')
  const identificadorSubmissao =
    rota.startsWith('professor/submissao/') || rota.startsWith('coordenacao/submissao/')
      ? rota.split('/')[2]
      : ''
  const secaoAtiva =
    rota === 'biblioteca' || rota.startsWith('projeto/')
      ? 'projetos'
      : rota === 'submeter'
        ? 'submeter'
        : pagina === 'acesso'
          ? pagina
          : pagina === 'detalhes-curso'
            ? 'cursos'
            : pagina
  const ePaginaLogin = pagina === 'acesso'
  const caminhoLogin = window.location.pathname.slice(basePortal.length).replace(/^\//, '')
  const PaginaDeLogin =
    caminhoLogin === 'aluno/login'
      ? PaginaLoginAluno
      : ['professor/login', 'login/professor'].includes(caminhoLogin)
        ? PaginaLoginProfessor
        : ['administracao/login', 'admin/login', 'login/admin'].includes(caminhoLogin)
          ? PaginaLoginAdministracao
          : PaginaAcesso
  if (pagina === 'aluno-cadastro') {
    return (
      <>
        <a className="pular-conteudo" href="#conteudo">
          Pular para o conteúdo
        </a>
        <Cabecalho modoAcesso tema={tema} alternarTema={mudarTema} pagina="acesso" />
        <Suspense fallback={<CarregamentoPagina />}>
          <PaginaCadastroAluno />
        </Suspense>
        <Rodape pagina="acesso" />
      </>
    )
  }
  if (
    ePaginaLogin ||
    ['professor', 'administracao', 'coordenacao', 'aluno-painel'].includes(pagina)
  ) {
    const administrador = sessao?.tipoUsuario === 'ADMIN'
    const coordenador = sessao?.tipoUsuario === 'COORDENADOR'
    const aluno = sessao?.tipoUsuario === 'ALUNO'
    const areaDaSessao = administrador
      ? 'administracao'
      : coordenador
        ? 'coordenacao'
        : aluno
          ? 'aluno-painel'
          : 'professor'
    if (sessao && (ePaginaLogin || pagina !== areaDaSessao)) return <CarregamentoPagina />
    return (
      <FotosDaSessao key={sessao?.usuario?.id} sessao={sessao}>
        <EstruturaProfessor
          administrador={administrador}
          coordenador={coordenador}
          aluno={aluno}
          rota={rota}
          perfilAtivo={[
            'professor/perfil',
            'administracao/perfil',
            'coordenacao/perfil',
            'aluno/perfil',
          ].includes(rota)}
          usuario={sessao?.usuario}
          aoSair={sair}
          tema={tema}
          alternarTema={mudarTema}
        >
          <a className="pular-conteudo" href="#conteudo">
            Pular para o conteúdo
          </a>
          {sessao && erroSubmissoes && (
            <section className="limite" role="alert">
              <p>{erroSubmissoes}</p>
              <button
                type="button"
                className="botao-secundario"
                onClick={() => mudarTentativaSubmissoes((atual) => atual + 1)}
              >
                Tentar novamente
              </button>
            </section>
          )}
          <Suspense fallback={<CarregamentoPagina />}>
            {!sessao ? (
              <PaginaDeLogin aoEntrar={entrar} sessaoExpirada={sessaoExpirada} />
            ) : [
                'professor/perfil',
                'administracao/perfil',
                'coordenacao/perfil',
                'aluno/perfil',
              ].includes(rota) ? (
              <PaginaPerfil
                tipoUsuario={sessao.tipoUsuario}
                token={sessao.token}
                destinoVoltar={
                  areaDaSessao === 'professor'
                    ? 'professor/feed'
                    : areaDaSessao === 'aluno-painel'
                      ? 'aluno/painel'
                      : `${areaDaSessao}/painel`
                }
                usuario={sessao.usuario}
                aoSalvar={(perfil) =>
                  mudarSessao((atual) => ({ ...atual, usuario: { ...atual.usuario, ...perfil } }))
                }
              />
            ) : administrador ? (
              <PaginaAdministracao
                secao={rota.split('/')[1] || 'painel'}
                identificador={rota.split('/')[2]}
                sessao={sessao}
                submissoes={listaSubmissoes.map((item) => ({
                  ...item,
                  status:
                    decisoes[item.identificador]?.status ||
                    decisoes[item.identificador] ||
                    item.status,
                }))}
              />
            ) : aluno && pagina === 'aluno-painel' ? (
              <PaginaPainelAluno
                sessao={sessao}
                submissoes={listaSubmissoes.map((item) => ({
                  ...item,
                  status: decisoes[item.identificador]?.status || item.status,
                }))}
                aoSubmeter={(novaSubmissao) =>
                  mudarListaSubmissoes((atuais) => [novaSubmissao, ...atuais])
                }
              />
            ) : coordenador && !identificadorSubmissao ? (
              <PaginaCoordenacao
                secao={rota.split('/')[1] || 'painel'}
                sessao={sessao}
                submissoes={listaSubmissoes.map((item) => ({
                  ...item,
                  status:
                    decisoes[item.identificador]?.status ||
                    decisoes[item.identificador] ||
                    item.status,
                }))}
              />
            ) : identificadorSubmissao ? (
              <PaginaVerSubmissao
                key={identificadorSubmissao}
                item={listaSubmissoes.find((item) => item.identificador === identificadorSubmissao)}
                tipoUsuario={sessao.tipoUsuario}
                usuario={sessao.usuario}
                token={sessao.token}
                cursoId={sessao.usuario.cursoId}
                decisao={decisoes[identificadorSubmissao]}
                aoDecidir={async (status, justificativa) => {
                  const submissao = listaSubmissoes.find(
                    (item) => item.identificador === identificadorSubmissao,
                  )

                  // Sincroniza com o backend via PATCH /api/projetos/{id}/status
                  let proximoStatusBackend = submissao?.statusBackend
                  let statusAtualizado = status
                  const falhasAviso = []
                  const avisosPendentes = []
                  const enviarAviso = (statusProjeto, destinatarios) => {
                    if (!destinatarios.length) {
                      falhasAviso.push(
                        'Não foi possível localizar os destinatários do aviso por e-mail.',
                      )
                      return
                    }
                    avisosPendentes.push(
                      // TODO: confirmar com Notificações se o evento do RabbitMQ já envia o e-mail
                      enviarNotificacaoProjeto(
                        {
                          statusProjeto,
                          nomeProjeto: submissao?.titulo || submissao?.nome || 'Projeto',
                          tipoProjeto:
                            {
                              TCC: 'TCC',
                              'Projeto Integrador': 'PROJETO_INTEGRADOR',
                              Pesquisa: 'PROJETO_PESQUISA',
                              Extensão: 'PROJETO_EXTENSAO',
                            }[submissao?.tipo] ||
                            submissao?.tipo ||
                            'TCC',
                          destinatarios,
                          nomeResponsavel: sessao.usuario?.nome,
                          justificativa,
                        },
                        sessao.token,
                      ).catch(() => {
                        falhasAviso.push(
                          'Não foi possível confirmar o aviso por e-mail. Avise o responsável.',
                        )
                      }),
                    )
                  }
                  const emailsAutores = (submissao?.autores || [])
                    .map((autor) => (typeof autor === 'string' ? '' : autor?.email))
                    .filter(Boolean)
                  if (submissao?.email) emailsAutores.push(submissao.email)
                  if (submissao?.id && sessao?.token) {
                    try {
                      if (sessao.tipoUsuario === 'PROFESSOR') {
                        if (status === 'Em análise' || status === 'Aceito') {
                          await encaminharProjetoParaCoordenacao(submissao.id, sessao.token)
                          proximoStatusBackend = 'ANALISE_PUBLICACAO'
                          statusAtualizado = 'Aguardando Coordenação'
                          enviarAviso('APROVADO', emailsAutores)
                          const coordenadores = await listarCoordenadores(sessao.token, {
                            cursoId: submissao?.cursoId,
                          }).catch((falha) => {
                            console.warn('Não foi possível localizar a coordenação:', falha.message)
                            falhasAviso.push(
                              'Não foi possível localizar a coordenação para enviar o aviso. Avise o responsável.',
                            )
                            return []
                          })
                          const emailsCoordenadores = (
                            Array.isArray(coordenadores) ? coordenadores : []
                          )
                            .map((c) => c.professor?.usuario?.email || c.usuario?.email || c.email)
                            .filter(Boolean)
                          if (emailsCoordenadores.length > 0) {
                            enviarAviso('ANALISE_PUBLICACAO', emailsCoordenadores)
                          } else {
                            falhasAviso.push(
                              'Não foi encontrado um e-mail da coordenação. Avise o responsável pelo curso.',
                            )
                          }
                        } else if (status === 'Recusado') {
                          await atualizarStatusProjeto(submissao.id, 'RECUSADO', sessao.token)
                          proximoStatusBackend = 'RECUSADO'
                          statusAtualizado = 'Recusado pelo orientador'
                          enviarAviso('RECUSADO', emailsAutores)
                        }
                      } else if (sessao.tipoUsuario === 'COORDENADOR') {
                        if (status === 'Aprovado') {
                          await atualizarStatusProjeto(submissao.id, 'PUBLICADO', sessao.token)
                          proximoStatusBackend = 'PUBLICADO'
                          statusAtualizado = 'Aprovado'
                          enviarAviso('PUBLICADO', emailsAutores)
                        } else if (status === 'Recusado') {
                          await atualizarStatusProjeto(
                            submissao.id,
                            'RECUSADO_PUBLICACAO',
                            sessao.token,
                          )
                          proximoStatusBackend = 'RECUSADO_PUBLICACAO'
                          statusAtualizado = 'Publicação recusada'
                          enviarAviso('RECUSADO_PUBLICACAO', emailsAutores)
                        }
                      }
                    } catch (err) {
                      console.error('Erro ao atualizar status do projeto no backend:', err)
                      throw err
                    }
                  }

                  mudarDecisoes((atuais) => ({
                    ...atuais,
                    [identificadorSubmissao]: {
                      status: statusAtualizado,
                      justificativa,
                      papel: sessao.tipoUsuario,
                      usuarioId: sessao.usuario.id,
                      cursoId:
                        submissao?.identificadorCurso || submissao?.cursoId || submissao?.curso,
                      registradoEm: new Date().toISOString(),
                    },
                  }))

                  mudarListaSubmissoes((atuais) => {
                    const atualizadas = atuais.map((item) =>
                      item.identificador === identificadorSubmissao
                        ? { ...item, status: statusAtualizado, statusBackend: proximoStatusBackend }
                        : item,
                    )
                    return atualizadas
                  })
                  await Promise.all(avisosPendentes)
                  return {
                    aviso: falhasAviso.length
                      ? `A decisão foi salva. ${[...new Set(falhasAviso)].join(' ')}`
                      : '',
                  }
                }}
                aoEditar={async (alteracoes) => {
                  const submissao = listaSubmissoes.find(
                    (item) => item.identificador === identificadorSubmissao,
                  )
                  const atual = await buscarProjetoPorId(submissao.id, sessao.token)
                  const resposta = await atualizarProjeto(
                    submissao.id,
                    montarEdicaoProjeto(atual, alteracoes),
                    sessao.token,
                  )
                  mudarListaSubmissoes((itens) =>
                    itens.map((item) =>
                      item.id === resposta.id
                        ? {
                            ...item,
                            titulo: resposta.nome,
                            resumo: resposta.resumo,
                            objetivo: resposta.descricao,
                            originalApi: resposta,
                          }
                        : item,
                    ),
                  )
                }}
                aoRemover={async () => {
                  const submissao = listaSubmissoes.find(
                    (item) => item.identificador === identificadorSubmissao,
                  )
                  await excluirProjeto(submissao.id, sessao.token)
                  mudarListaSubmissoes((itens) => itens.filter((item) => item.id !== submissao.id))
                  mudarDecisoes((atuais) => {
                    const proxima = { ...atuais }
                    delete proxima[identificadorSubmissao]
                    return proxima
                  })
                }}
              />
            ) : (
              <PaginaProfessor
                usuario={sessao.usuario}
                submissoes={listaSubmissoes.map((item) => ({
                  ...item,
                  status:
                    decisoes[item.identificador]?.status ||
                    decisoes[item.identificador] ||
                    item.status,
                }))}
              />
            )}
          </Suspense>
        </EstruturaProfessor>
      </FotosDaSessao>
    )
  }
  return (
    <FotosDaSessao key={sessao?.usuario?.id} sessao={sessao}>
      <a className="pular-conteudo" href="#conteudo">
        Pular para o conteúdo
      </a>
      <Cabecalho
        destinoArea={
          sessao?.tipoUsuario === 'ADMIN'
            ? 'administracao/painel'
            : sessao?.tipoUsuario === 'COORDENADOR'
              ? 'coordenacao/painel'
              : sessao?.tipoUsuario === 'ALUNO'
                ? 'aluno/painel'
                : 'professor/feed'
        }
        destinoPerfil={
          sessao?.tipoUsuario === 'ADMIN'
            ? 'administracao/perfil'
            : sessao?.tipoUsuario === 'COORDENADOR'
              ? 'coordenacao/perfil'
              : sessao?.tipoUsuario === 'ALUNO'
                ? 'aluno/perfil'
                : 'professor/perfil'
        }
        tipoUsuario={sessao?.tipoUsuario}
        usuario={sessao?.usuario}
        aoSair={sair}
        pagina={secaoAtiva}
        autenticado={Boolean(sessao)}
        tema={tema}
        alternarTema={(proximoTema) => mudarTema(proximoTema)}
      />
      <Suspense fallback={<CarregamentoPagina />}>
        {pagina === 'cursos' && <PaginaCursos />}
        {pagina === 'projetos' && <PaginaProjetos />}
        {pagina === 'detalhes-projeto' && (
          <PaginaProjeto
            key={rota.split('/')[1]}
            identificador={rota.split('/')[1]}
            token={sessao?.token}
          />
        )}
        {pagina === 'perfil-professor' && (
          <PaginaPerfilProfessor key={rota.split('/')[1]} idProfessor={rota.split('/')[1]} />
        )}
        {pagina === 'perfil-aluno' && (
          <PaginaPerfilAluno
            conta={sessao?.usuario}
            key={rota.split('/')[1]}
            idAluno={rota.split('/')[1]}
          />
        )}
        {pagina === 'detalhes-curso' && (
          <PaginaCurso key={identificador} identificador={identificador} aba={aba} />
        )}
        {pagina === 'submissao' && (
          <PaginaSubmissao
            sessao={sessao}
            aoSubmeter={(novaSubmissao) =>
              mudarListaSubmissoes((atuais) => [novaSubmissao, ...atuais])
            }
          />
        )}
        {pagina === 'aluno-cadastro' && <PaginaCadastroAluno />}
        {pagina === 'privacidade' && <PaginaPoliticaPrivacidade />}
        {pagina === 'inicio' && <PaginaInicial />}
      </Suspense>
      <Rodape pagina={pagina} />
    </FotosDaSessao>
  )
}
