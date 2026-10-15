import ApresentacaoInicial from './components/initial-presentation/ApresentacaoInicial.jsx'
import CursosEmDestaque from './components/featured-courses/CursosEmDestaque.jsx'
import ProjetosEmDestaque from './components/featured-projects/ProjetosEmDestaque.jsx'
import ConviteSubmissao from './components/submission-invite/ConviteSubmissao.jsx'
import './inicio.css'

export default function PaginaInicial() {
  return (
    <main id="conteudo" className="limite pagina-inicial">
      <ApresentacaoInicial />
      <CursosEmDestaque />
      <ProjetosEmDestaque />
      <ConviteSubmissao />
    </main>
  )
}
