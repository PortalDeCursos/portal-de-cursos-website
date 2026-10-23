import './visao-geral.css'

export default function VisaoGeral({ curso }) {
  return (
    <section
      className="bloco-detalhe visao-curso visao-curso__apresentacao"
      aria-labelledby="titulo-visao-geral"
    >
      <div>
        <p className="visao-curso__rotulo">Informações do curso</p>
        <h2 id="titulo-visao-geral">Sobre o curso</h2>
        <p>{curso.descricao}</p>
      </div>
      <dl className="visao-curso__numeros">
        <div>
          <dt>Campus</dt>
          <dd>{curso.campus || 'A informar'}</dd>
        </div>
        <div>
          <dt>Área de conhecimento</dt>
          <dd>{curso.area || 'A informar'}</dd>
        </div>
        <div>
          <dt>Carga horária</dt>
          <dd>{curso.cargaHoraria || 'A informar'}</dd>
        </div>
        <div>
          <dt>Disciplinas na matriz</dt>
          <dd>{curso.componentes || 'A informar'}</dd>
        </div>
      </dl>
    </section>
  )
}
