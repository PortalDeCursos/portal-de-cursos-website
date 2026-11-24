import './indicadores.css'

const tons = {
  primario: 'var(--azul)',
  andamento: 'var(--azul)',
  pendente: 'var(--aviso)',
  sucesso: 'var(--sucesso)',
  erro: 'var(--erro)',
  neutro: 'var(--borda)',
}

export default function Indicadores({
  itens,
  rotulo = 'Resumo',
  carregando = false,
}) {
  return (
    <dl
      className="indicadores"
      aria-label={rotulo}
      aria-busy={carregando || undefined}
    >
      {itens.map(({ titulo, valor, detalhe, destino, tom = 'primario' }) => (
        <div
          key={titulo}
          className={`indicadores__item${destino ? ' indicadores__item--interativo' : ''}`}
          style={{ '--cor-indicador': tons[tom] || tons.primario }}
        >
          <dt className="indicadores__titulo">
            {destino ? (
              <a href={destino} className="indicadores__link">
                {titulo}
              </a>
            ) : (
              titulo
            )}
          </dt>

          <dd className="indicadores__valor">
            {carregando ? (
              <span className="indicadores__esqueleto" aria-hidden="true" />
            ) : (
              valor
            )}
          </dd>

          {detalhe && <dd className="indicadores__detalhe">{detalhe}</dd>}
        </div>
      ))}
    </dl>
  )
}