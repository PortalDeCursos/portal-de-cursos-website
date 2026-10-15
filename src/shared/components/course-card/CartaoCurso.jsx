import Icone from '../icon/Icone.jsx'
import Ligacao from '../link/Ligacao.jsx'
import './cartao-curso.css'

export default function CartaoCurso({ curso }) {
  return (
    <article className="cartao-curso">
      <div className="cartao-curso__topo">
        <span className="etiqueta etiqueta--neutra">{curso.grau}</span>
        <strong>{curso.sigla}</strong>
      </div>
      <h3>{curso.nome}</h3>
      <p>{curso.descricao}</p>
      <ul className="cartao-curso__informacoes">
        <li>
          <Icone nome="duracao" />
          {curso.duracao}
        </li>
        <li>
          <Icone nome="localizacao" />
          {curso.modalidade}
        </li>
        <li>
          <Icone nome={curso.turno === 'Noturno' ? 'lua' : 'sol'} />
          {curso.turno}
        </li>
      </ul>
      <Ligacao destino={`#curso/${curso.identificador}`}>Conhecer o curso</Ligacao>
    </article>
  )
}
