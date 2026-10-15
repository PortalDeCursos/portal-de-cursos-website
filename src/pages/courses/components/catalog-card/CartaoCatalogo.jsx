import Icone from '../../../../shared/components/icon/Icone.jsx'
import './cartao-catalogo.css'

export default function CartaoCatalogo({ curso }) {
  const informacoes = [
    ['Duração', curso.duracao, 'duracao-cursos'],
    ['Modalidade', curso.modalidade, 'modalidade-cursos'],
    ['Turno', curso.turno, curso.turno === 'Noturno' ? 'noturno-cursos' : 'matutino-cursos'],
  ]

  return (
    <article className="cartao-catalogo">
      <div className="cartao-catalogo__topo">
        <span className="cartao-catalogo__simbolo">
          <Icone nome="grau-detalhe" />
        </span>
        <span className="cartao-catalogo__grau">
          {curso.grau === 'Tecnologia' ? 'Graduação tecnológica' : curso.grau}
        </span>
        <span className="cartao-catalogo__sigla">{curso.sigla}</span>
      </div>
      <h2>{curso.nome}</h2>
      <p className="cartao-catalogo__descricao">{curso.descricao}</p>
      <dl className="cartao-catalogo__metadados">
        {informacoes.map(([rotulo, valor, icone]) => (
          <div key={rotulo}>
            <dt>
              <Icone nome={icone} />
              {rotulo}
            </dt>
            <dd>{valor || 'A informar'}</dd>
          </div>
        ))}
      </dl>
      <div className="cartao-catalogo__base">
        {curso.campus && (
          <p className="cartao-catalogo__campus">
            <Icone nome="localizacao" />
            {curso.campus}
          </p>
        )}
        {curso.codigoMec && (
          <small className="cartao-catalogo__registro">e-MEC {curso.codigoMec}</small>
        )}
      </div>
      <a
        className="cartao-catalogo__acao"
        href={`#curso/${curso.identificador}`}
        aria-label={`Conhecer o curso de ${curso.nome}`}
      >
        Conhecer o curso <Icone nome="seta-cursos" />
      </a>
    </article>
  )
}
