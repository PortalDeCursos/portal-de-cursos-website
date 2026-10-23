import ApresentacaoInicial from './components/ApresentacaoInicial.jsx'
import CursosEmDestaque from './components/CursosEmDestaque.jsx'
import ProjetosEmDestaque from './components/ProjetosEmDestaque.jsx'
import ConviteSubmissao from './components/ConviteSubmissao.jsx'
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
