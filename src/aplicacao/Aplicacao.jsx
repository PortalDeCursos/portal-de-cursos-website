import { useEffect, useState } from 'react'
import Cabecalho from '../compartilhados/componentes/cabecalho/Cabecalho.jsx'
import Rodape from '../compartilhados/componentes/rodape/Rodape.jsx'
import JanelaContexto from '../compartilhados/componentes/janela-contexto/JanelaContexto.jsx'
import PaginaInicial from '../paginas/inicio/PaginaInicial.jsx'
import PaginaCursos from '../paginas/cursos/PaginaCursos.jsx'
import RodapeCatalogo from '../paginas/cursos/componentes/rodape-catalogo/RodapeCatalogo.jsx'
import PaginaDetalhesCurso from '../paginas/detalhes-curso/PaginaDetalhesCurso.jsx'
import PaginaProjetos from '../paginas/projetos/PaginaProjetos.jsx'

function identificarPagina(rota) {
  if (['projetos', 'biblioteca'].includes(rota)) return 'projetos'
  if (rota.startsWith('curso/')) return 'detalhes-curso'
  if (['cursos', 'catalogo'].includes(rota)) return 'cursos'
  if (!rota || rota === 'inicio') return 'inicio'
  return null
}

function lerTema() {
  try { const salvo = localStorage.getItem('portal-cursos-tema'); if (salvo === 'claro' || salvo === 'escuro') return salvo } catch { /* A navegação continua sem armazenamento local. */ }
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'escuro' : 'claro'
}

export default function Aplicacao() {
  const [tema, definirTema] = useState(lerTema)
  const [rota, definirRota] = useState(() => window.location.hash.slice(1))
  const [pagina, definirPagina] = useState(() => identificarPagina(window.location.hash.slice(1)) || 'inicio')
  const [rotaCurso, definirRotaCurso] = useState(() => window.location.hash.startsWith('#curso/') ? window.location.hash.slice(1) : '')
  useEffect(() => {
    document.documentElement.dataset.tema = tema
    try { localStorage.setItem('portal-cursos-tema', tema) } catch { /* Preferência mantida nesta sessão. */ }
  }, [tema])
  useEffect(() => {
    const acompanharRota = () => {
      const destino = window.location.hash.slice(1)
      definirRota(destino)
      const proximaPagina = identificarPagina(destino)
      if (proximaPagina) {
        definirPagina(proximaPagina)
        if (destino.startsWith('curso/')) definirRotaCurso(destino)
        if (!destino.startsWith('curso/') || destino.split('/').length === 2) window.scrollTo({ top: 0, behavior: 'instant' })
      }
    }
    window.addEventListener('hashchange', acompanharRota)
    return () => window.removeEventListener('hashchange', acompanharRota)
  }, [])
  useEffect(() => {
    if (pagina !== 'detalhes-curso') document.title = pagina === 'projetos' ? 'Projetos — Portal de Cursos' : pagina === 'cursos' ? 'Cursos — Portal de Cursos' : 'Portal de Cursos — Formação e produção acadêmica'
  }, [pagina])
  const [, identificador, aba] = rotaCurso.split('/')
  const secaoAtiva = rota === 'biblioteca' || rota.startsWith('projeto/') ? 'projetos' : rota === 'submeter' ? 'submeter' : rota === 'acesso' ? 'acesso' : pagina === 'detalhes-curso' ? 'cursos' : pagina
  return <><a className="pular-conteudo" href="#conteudo">Pular para o conteúdo</a><Cabecalho pagina={secaoAtiva} tema={tema} alternarTema={() => definirTema(tema === 'claro' ? 'escuro' : 'claro')} />{pagina === 'cursos' && <PaginaCursos />}{pagina === 'projetos' && <PaginaProjetos />}{pagina === 'detalhes-curso' && <PaginaDetalhesCurso key={identificador} identificador={identificador} aba={aba} />}{pagina === 'inicio' && <PaginaInicial />}{pagina === 'inicio' ? <Rodape /> : <RodapeCatalogo pagina={pagina} />}<JanelaContexto rota={rota} destinoAoFechar={pagina === 'detalhes-curso' ? rotaCurso : pagina} /></>
}
