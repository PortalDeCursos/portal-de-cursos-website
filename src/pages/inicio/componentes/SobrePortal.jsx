import './sobre-portal.css'

export default function SobrePortal() {
  return (
    <section className="sobre-portal" id="sobre" aria-labelledby="titulo-sobre-portal">
      <h2 id="titulo-sobre-portal">Como funciona o portal</h2>

      <dl className="sobre-portal__fluxo">
        <div className="sobre-portal__linha">
          <dt>Consulta pública</dt>
          <dd>
            Explore o catálogo por campus, grau, turno ou modalidade. O acervo reúne os trabalhos
            aprovados pela coordenação.
          </dd>
        </div>
        <div className="sobre-portal__linha">
          <dt>Envio de projetos</dt>
          <dd>
            Alunos, professores e coordenadores podem enviar projetos. O orientador avalia primeiro
            as submissões de alunos. As demais seguem direto para a coordenação.
          </dd>
        </div>
      </dl>
    </section>
  )
}
