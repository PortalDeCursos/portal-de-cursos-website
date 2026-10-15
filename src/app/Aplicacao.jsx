import { useEffect, useState } from 'react'
import Cabecalho from '../shared/components/header/Cabecalho.jsx'
import Rodape from '../shared/components/footer/Rodape.jsx'
import JanelaContexto from '../shared/components/context-dialog/JanelaContexto.jsx'
import PaginaInicial from '../pages/home/PaginaInicial.jsx'
import PaginaCursos from '../pages/courses/PaginaCursos.jsx'
import RodapeCatalogo from '../pages/courses/components/catalog-footer/RodapeCatalogo.jsx'
import PaginaDetalhesCurso from '../pages/course-details/PaginaDetalhesCurso.jsx'
import PaginaProjetos from '../pages/projects/PaginaProjetos.jsx'
import PaginaSubmissao from '../pages/submission/PaginaSubmissao.jsx'
import PaginaProfessor from '../pages/teacher/PaginaProfessor.jsx'
import PaginaDetalhesSubmissao from '../pages/teacher/PaginaDetalhesSubmissao.jsx'

function identificarPagina(rota) {
  if (['projetos', 'biblioteca'].includes(rota)) return 'projetos'
  if (rota === 'submeter') return 'submissao'
  if (rota === 'professor' || rota.startsWith('professor/submissao/')) return 'professor'
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
  const [tema, definirTema] = useState(lerTema)
  const [rota, definirRota] = useState(() => window.location.hash.slice(1))
  const [pagina, definirPagina] = useState(
    () => identificarPagina(window.location.hash.slice(1)) || 'inicio',
  )
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
      const destino = window.location.hash.slice(1)
      definirRota(destino)
      const proximaPagina = identificarPagina(destino)
      if (proximaPagina) {
        definirPagina(proximaPagina)
        if (destino.startsWith('curso/')) definirRotaCurso(destino)
        if (!destino.startsWith('curso/') || destino.split('/').length === 2)
          window.scrollTo({ top: 0, behavior: 'instant' })
      }
    }
    window.addEventListener('hashchange', acompanharRota)
    return () => window.removeEventListener('hashchange', acompanharRota)
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
                ? 'Avaliações — Portal de Cursos'
                : 'Portal de Cursos — Formação e produção acadêmica'
  }, [pagina])
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
  return (
    <>
      <a className="pular-conteudo" href="#conteudo">
        Pular para o conteúdo
      </a>
      <Cabecalho
        pagina={secaoAtiva}
        tema={tema}
        alternarTema={(proximoTema) => definirTema(proximoTema)}
      />
      {pagina === 'cursos' && <PaginaCursos />}
      {pagina === 'projetos' && <PaginaProjetos />}
      {pagina === 'detalhes-curso' && (
        <PaginaDetalhesCurso key={identificador} identificador={identificador} aba={aba} />
      )}
      {pagina === 'submissao' && <PaginaSubmissao />}
      {pagina === 'professor' &&
        (identificadorSubmissao ? (
          <PaginaDetalhesSubmissao identificador={identificadorSubmissao} />
        ) : (
          <PaginaProfessor />
        ))}
      {pagina === 'inicio' && <PaginaInicial />}
      {pagina === 'inicio' ? <Rodape /> : <RodapeCatalogo pagina={pagina} />}
      <JanelaContexto
        rota={rota}
        destinoAoFechar={pagina === 'detalhes-curso' ? rotaCurso : pagina}
      />
    </>
  )
}
