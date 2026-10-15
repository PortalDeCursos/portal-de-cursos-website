import ItemProjeto from '../../../../shared/components/project-item/ItemProjeto.jsx'
import Ligacao from '../../../../shared/components/link/Ligacao.jsx'
import { projetos } from '../../../../data/projetos.js'

export default function ProjetosEmDestaque() {
  const aprovados = projetos.filter((projeto) => projeto.status === 'Aprovado')
  return (
    <section id="projetos" className="secao" aria-labelledby="titulo-projetos">
      <div className="secao__cabecalho">
        <div>
          <h2 id="titulo-projetos">O conhecimento ganha forma aqui</h2>
          <p>Conheça trabalhos aprovados e desenvolvidos ao longo da formação.</p>
        </div>
        <Ligacao destino="#biblioteca">Explorar biblioteca de projetos</Ligacao>
      </div>
      <div className="lista-projetos">
        {aprovados.map((projeto) => (
          <ItemProjeto key={projeto.identificador} projeto={projeto} />
        ))}
      </div>
    </section>
  )
}
