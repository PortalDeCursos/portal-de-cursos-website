export default function ConteudoDestaque({ destaque, curso, projeto }) {
  const ficha = curso
    ? [
        ['Duração', curso.duracao],
        ['Modalidade', curso.modalidade],
        ['Turno', curso.turno],
      ]
    : [
        ['Curso', projeto.curso],
        ['Orientação', projeto.orientador],
      ]

  return (
    <div className="hero-destaque__conteudo">
      <h2>{destaque.tituloCurto}</h2>
      {curso && <p className="hero-destaque__nome-curso">{destaque.titulo}</p>}
      <p className="hero-destaque__resumo">{destaque.resumo}</p>
      <dl className="hero-destaque__ficha">
        {ficha.map(([rotulo, valor]) => (
          <div key={rotulo}>
            <dt className="somente-leitores">{rotulo}</dt>
            <dd>{valor}</dd>
          </div>
        ))}
      </dl>
      <a className="hero-destaque__acao" href={destaque.destino}>
        {destaque.acao}
        <span aria-hidden="true">→</span>
      </a>
    </div>
  )
}
