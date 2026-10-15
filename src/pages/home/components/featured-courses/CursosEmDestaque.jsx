import CartaoCurso from '../../../../shared/components/course-card/CartaoCurso.jsx'
import Ligacao from '../../../../shared/components/link/Ligacao.jsx'
import { cursos } from '../../../../data/cursos.js'

export default function CursosEmDestaque() {
  return (
    <section id="cursos" className="secao" aria-labelledby="titulo-cursos">
      <div className="secao__cabecalho">
        <div>
          <h2 id="titulo-cursos">Encontre seu caminho</h2>
          <p>Conheça a estrutura e as possibilidades de cada formação.</p>
        </div>
        <Ligacao destino="#catalogo">Ver todos os cursos</Ligacao>
      </div>
      <div className="grade-cursos">
        {cursos.map((curso) => (
          <CartaoCurso key={curso.identificador} curso={curso} />
        ))}
      </div>
    </section>
  )
}
