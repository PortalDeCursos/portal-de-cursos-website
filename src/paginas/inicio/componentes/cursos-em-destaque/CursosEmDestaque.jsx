import CartaoCurso from '../../../../compartilhados/componentes/cartao-curso/CartaoCurso.jsx'
import Ligacao from '../../../../compartilhados/componentes/ligacao/Ligacao.jsx'
import { cursos } from '../../../../dados/cursos.js'

export default function CursosEmDestaque() {
  return (<section id="cursos" className="secao" aria-labelledby="titulo-cursos"><div className="secao__cabecalho"><div><h2 id="titulo-cursos">Encontre seu caminho</h2><p>Conheça a estrutura e as possibilidades de cada formação.</p></div><Ligacao destino="#catalogo">Ver todos os cursos</Ligacao></div><div className="grade-cursos">{cursos.map(curso => <CartaoCurso key={curso.identificador} curso={curso} />)}</div></section>)
}
