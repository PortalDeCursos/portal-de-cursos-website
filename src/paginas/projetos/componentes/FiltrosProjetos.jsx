import './filtros-projetos.css'

export default function FiltrosProjetos({ busca, definirBusca, tipo, definirTipo, curso, definirCurso, publicados, limpar }) {
  return (
<aside className="pagina-projetos__filtros" aria-label="Filtros de projetos"><h2>Filtrar projetos</h2><label>Buscar projeto<input type="search" value={busca} onChange={evento => definirBusca(evento.target.value)} placeholder="Nome ou palavra-chave" /></label><label>Tipo de trabalho<select value={tipo} onChange={evento => definirTipo(evento.target.value)}><option value="">Todos os tipos</option>{['TCC', 'Projeto integrador', 'Pesquisa', 'Extensão'].map(item => <option key={item}>{item}</option>)}</select></label><label>Curso<select value={curso} onChange={evento => definirCurso(evento.target.value)}><option value="">Todos os cursos</option>{[...new Set(publicados.map(item => item.curso))].map(item => <option key={item}>{item}</option>)}</select></label><button className="botao-secundario" onClick={limpar}>Limpar filtros</button></aside>
  )
}
