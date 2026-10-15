import ApresentacaoInicial from './componentes/apresentacao-inicial/ApresentacaoInicial.jsx'
import CursosEmDestaque from './componentes/cursos-em-destaque/CursosEmDestaque.jsx'
import ProjetosEmDestaque from './componentes/projetos-em-destaque/ProjetosEmDestaque.jsx'
import ConviteSubmissao from './componentes/convite-submissao/ConviteSubmissao.jsx'
import './inicio.css'

export default function PaginaInicial() {
  return <main id="conteudo" className="limite pagina-inicial">
    <ApresentacaoInicial />
    <CursosEmDestaque />
    <ProjetosEmDestaque />
    <ConviteSubmissao />
  </main>
}
