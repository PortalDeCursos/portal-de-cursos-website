import Botao from '@/shared/componentes/Botao.jsx'
import './capa.css'

export default function Capa() {
  return (
    <section id="inicio" className="hero-inicial" aria-label="Apresentação do Portal de Cursos">
      <div className="hero-inicial__sombra" aria-hidden="true" />

      <div className="hero-inicial__conteudo">
        <h1 className="hero-inicial__titulo-principal">Cursos e projetos acadêmicos</h1>

        <p className="hero-inicial__descricao">
          Consulte matrizes curriculares, conheça os docentes e veja os trabalhos publicados.
        </p>

        <div className="hero-inicial__acoes">
          <Botao as="a" href="#cursos" className="hero-inicial__cta-primario">
            Explorar cursos
          </Botao>
          <a href="#projetos" className="hero-inicial__cta-secundario">
            Ver projetos e TCCs
          </a>
        </div>
      </div>
    </section>
  )
}
