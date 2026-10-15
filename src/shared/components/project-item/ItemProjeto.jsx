import Ligacao from '../link/Ligacao.jsx'
import '../../styles/projetos.css'

export default function ItemProjeto({ projeto }) {
  return (
    <article className="item-projeto">
      <div>
        <div className="item-projeto__tipo">
          <span className="etiqueta">{projeto.tipo}</span>
          <span>• Curso {projeto.curso}</span>
        </div>
        <h3>{projeto.nome}</h3>
        <p>{projeto.descricao}</p>
        <small>
          Orientador: <strong>{projeto.orientador}</strong>
        </small>
      </div>
      <Ligacao destino={`#projeto/${projeto.identificador}`}>Ver projeto</Ligacao>
    </article>
  )
}
