import DesignIcon from '../../../../shared/components/ui/DesignIcon'
import PrototypeAction from '../../../../shared/components/ui/PrototypeAction'
import ProjectListItem from '../../../projects/components/ProjectListItem'
import CourseProjectsEmpty from '../../../projects/components/CourseProjectsEmpty'
import { filterCourseProjects } from '../../../projects/utils/filterProjects'
import type { Project } from '../../../projects/types/project'
import type { CatalogCourse } from '../../types/catalog'
const categories = ['TCC', 'Projeto integrador', 'Pesquisa', 'Extensão']
const guides = [
  { title: 'Critérios de Publicação', text: 'Apenas monografias com nota final superior a 7,0 e com termo de autorização assinado pelo corpo docente compõem o acervo digital público.', icon: 'project-empty-imgContainer11' },
  { title: 'Diretrizes de TCC', text: 'Consulte a matriz metodológica institucional, modelos no formato ABNT e o manual de submissão no portal do aluno.', icon: 'project-empty-imgContainer12' },
  { title: 'Dúvidas Frequentes', text: 'Acompanhe a tramitação do seu projeto integrador junto à comissão coordenadora pelo e-mail institucional do curso.', icon: 'project-empty-imgContainer13' },
]
export default function CourseProjects({ course, projects, category, onCategoryChange }: { course: CatalogCourse; projects: Project[]; category: string; onCategoryChange: (value: string) => void }) {
  const all = filterCourseProjects(projects, course.id)
  const filtered = filterCourseProjects(projects, course.id, category)
  return <section className="course-projects"><div className="course-projects-heading"><div><h2>Repositório de Produções do Curso</h2><p>Produção científica, monográfica e tecnológica de discentes orientados.</p></div><div className="project-category-filters" role="group" aria-label="Filtrar projetos por categoria"><button type="button" aria-pressed={!category} onClick={() => onCategoryChange('')}>Todos <span>{all.length}</span></button>{categories.map(item => <button key={item} type="button" aria-pressed={category === item} onClick={() => onCategoryChange(item)}>{item}</button>)}</div></div><div className="course-publication-note"><DesignIcon name="project-empty-imgContainer6" /><p>Exibição restrita a relatórios e artefatos integralmente homologados pelo comitê orientador e coordenação acadêmica.</p><PrototypeAction className="text-link" title="Enviar Trabalho">Enviar Trabalho</PrototypeAction></div><p className="sr-only" role="status">{filtered.length} projetos encontrados</p>{filtered.length ? <ul className="project-list">{filtered.map(project => <ProjectListItem key={project.id} project={project} />)}</ul> : <CourseProjectsEmpty abbreviation={course.abbreviation} filtered={all.length > 0} onClear={() => onCategoryChange('')} />}<div className="course-project-guides">{guides.map(guide => <article key={guide.title}><span className="course-icon-box"><DesignIcon name={guide.icon} /></span><h3>{guide.title}</h3><p>{guide.text}</p></article>)}</div></section>
}
