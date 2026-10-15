import Icone from '../../../../shared/components/icon/Icone.jsx'

export default function ConteudoDestaque({ destaque, curso, projeto }) {
  return (
    <>
      <div className={`hero-destaque__conteudo hero-destaque__conteudo--${destaque.tipo}`}>
        <div className="hero-destaque__topo">
          <span className="etiqueta">{curso ? curso.grau : projeto.tipo}</span>
          <span className="hero-destaque__situacao">{curso ? curso.sigla : 'Aprovado'}</span>
        </div>
        <div className="hero-destaque__identidade">
          <span className="hero-destaque__icone">
            <Icone
              nome={
                curso
                  ? 'grau-detalhe'
                  : destaque.tipo === 'tcc'
                    ? 'grade-detalhe'
                    : 'projetos-detalhe'
              }
            />
          </span>
          <span>
            {curso
              ? 'Formação superior'
              : destaque.tipo === 'tcc'
                ? 'Trabalho de Conclusão de Curso'
                : 'Da sala de aula para a comunidade'}
          </span>
        </div>
        <p className="hero-destaque__resumo">{curso ? curso.descricao : projeto.descricao}</p>
        <dl className="hero-destaque__ficha">
          {curso ? (
            <>
              <div>
                <dt>Duração</dt>
                <dd>{curso.duracao}</dd>
              </div>
              <div>
                <dt>Modalidade</dt>
                <dd>{curso.modalidade}</dd>
              </div>
              <div>
                <dt>Turno</dt>
                <dd>{curso.turno}</dd>
              </div>
            </>
          ) : (
            <>
              <div>
                <dt>Curso</dt>
                <dd>{projeto.curso}</dd>
              </div>
              {projeto.autores && (
                <div>
                  <dt>Autores</dt>
                  <dd>{projeto.autores}</dd>
                </div>
              )}
              <div>
                <dt>Orientador</dt>
                <dd>{projeto.orientador}</dd>
              </div>
            </>
          )}
        </dl>
      </div>
      <div className="hero-destaque__legenda">
        <p>{destaque.categoria}</p>
        <h2>{destaque.titulo}</h2>
        <a href={destaque.destino}>
          {destaque.acao}
          <span aria-hidden="true">↗</span>
        </a>
      </div>
    </>
  )
}
