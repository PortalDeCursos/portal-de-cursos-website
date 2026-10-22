import Ligacao from '../../../../shared/components/link/Ligacao.jsx'

export default function ProjetosEmDestaque() {
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
        <p className="painel-vazio">Os trabalhos aparecerão aqui quando forem cadastrados.</p>
      </div>
    </section>
  )
}
