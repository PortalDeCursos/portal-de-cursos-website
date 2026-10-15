import './informacoes-academicas.css'

export default function InformacoesAcademicas({ curso, aba }) {
  const grade = aba === 'grade-curricular'
  const itens = (grade ? curso.grade : curso.professores) || []
  return <section className="bloco-detalhe informacoes-academicas"><h2>{grade ? 'Grade curricular' : 'Corpo docente'}</h2>{itens.length ? <div className="informacoes-academicas__lista">{itens.map((item, indice) => <article key={item.identificador || item.codigo || indice}><h3>{item.nome}</h3>{grade ? <p>{item.codigo} · {item.cargaHoraria} horas · {item.semestre}º semestre</p> : <p>{item.titulacao}</p>}<p>{item.descricao}</p></article>)}</div> : <div className="informacoes-academicas__vazio"><h3>{grade ? 'A matriz curricular ainda não está disponível' : 'Os professores ainda não foram cadastrados'}</h3><p>{grade ? 'As disciplinas, cargas horárias e semestres serão exibidos após o cadastro da matriz curricular do curso.' : 'Os perfis dos professores e suas disciplinas de interesse serão exibidos após o cadastro do corpo docente.'}</p><a className="botao-secundario" href={`#curso/${curso.identificador}`}>Voltar à visão geral</a></div>}</section>
}
