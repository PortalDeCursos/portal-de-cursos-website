import Icone from '@/shared/components/Icone.jsx'
import CartaoCatalogo from './CartaoCatalogo.jsx'
import './estados-catalogo.css'

export default function CatalogoVazio({ limpar, cursos }) {
  return (
    <>
      <section className="catalogo-vazio" aria-labelledby="titulo-vazio">
        <span className="estado-catalogo__icone">
          <Icone nome="sem-resultados-cursos" />
        </span>
        <h2 id="titulo-vazio">Nenhum curso encontrado</h2>
        <p>
          Não encontramos cursos correspondentes aos critérios ou termos pesquisados. Tente ajustar
          os filtros ou utilizar palavras-chave mais genéricas.
        </p>
        <div className="estado-catalogo__acoes">
          <button className="botao-primario" onClick={limpar}>
            <Icone nome="limpar-filtros-cursos" />
            Limpar filtros
          </button>
          <button className="botao-secundario" onClick={limpar}>
            <Icone nome="catalogo-cursos" />
            Ver catálogo completo
          </button>
        </div>
        <div className="catalogo-vazio__dicas">
          <h3>
            <Icone nome="dica-cursos" />
            Dicas para encontrar o que você procura
          </h3>
          <ul>
            {[
              'Verifique se não há erros de digitação no termo digitado.',
              'Experimente termos mais amplos, como “Sistemas” ou “Redes”.',
              'Remova filtros de campus ou modalidade para ampliar os resultados.',
              'Consulte o catálogo completo para conhecer as formações disponíveis.',
            ].map((dica) => (
              <li key={dica}>
                <Icone nome="confirmacao-cursos" />
                {dica}
              </li>
            ))}
          </ul>
        </div>
      </section>
      {cursos.length > 0 && (
        <section className="sugestoes-catalogo" aria-labelledby="titulo-sugestoes">
          <h2 id="titulo-sugestoes">Cursos em destaque</h2>
          <p>Conheça outras possibilidades de formação.</p>
          <div className="grade-catalogo">
            {cursos.slice(0, 2).map((curso) => (
              <CartaoCatalogo key={curso.identificador} curso={curso} />
            ))}
          </div>
        </section>
      )}
    </>
  )
}
