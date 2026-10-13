import { Link } from 'react-router'
import DesignIcon from '../../../../shared/components/ui/DesignIcon'
import type { CatalogCourse } from '../../types/catalog'
import type { CourseAcademicDetails } from '../../types/details'

export default function CourseProjectsIdentity({ course, details }: { course: CatalogCourse; details?: CourseAcademicDetails }) {
  const metrics = [
    { label: 'Tempo de curso', value: (course.duration / 2).toLocaleString('pt-BR') + ' Anos letivos', icon: 'project-empty-imgContainer2' },
    { label: 'Disciplinas', value: details ? details.moduleCount + ' Componentes' : 'Consulte a matriz', icon: 'project-empty-imgContainer3' },
    { label: 'Coordenação', value: details?.coordinator ?? 'Consulte a instituição', icon: 'project-empty-imgContainer4' },
    { label: 'Departamento', value: course.area, icon: 'project-empty-imgContainer5' },
  ]
  return <section className="course-repository-identity">
    <nav className="course-breadcrumb" aria-label="Navegação estrutural"><Link to="/">Início</Link><DesignIcon name="project-empty-imgContainer" /><Link to="/cursos">Cursos</Link><DesignIcon name="project-empty-imgContainer" /><span aria-current="page">{course.abbreviation}</span></nav>
    <div className="repository-hero-grid">
      <div>
        <div className="repository-hero-badges"><span className="catalog-degree" data-degree={course.degree}>{course.degree === 'Tecnologia' ? 'Graduação Tecnológica' : course.degree}</span>{course.emec && <span className="repository-code">Cód. MEC {course.emec}</span>}<span className="repository-modality"><span />{course.level} · {course.shift}</span></div>
        <h1>{course.degree === 'Tecnologia' ? 'Tecnologia em ' : ''}{course.title}</h1>
        <p>{details ? 'Formação superior focada na concepção, modelagem, implantação e governança de soluções de software e infraestruturas digitais de alta complexidade.' : course.description}</p>
      </div>
      <aside className="repository-recognition" aria-label="Reconhecimento e duração">
        {details && <div className="repository-recognition-title"><span className="course-icon-box"><DesignIcon name="project-empty-imgContainer1" /></span><div><p>Reconhecimento</p><strong>Nota 5 MEC</strong></div></div>}
        <dl><div><dt>Carga horária</dt><dd>{details ? details.hours.toLocaleString('pt-BR') + ' horas' : 'Consulte a matriz'}</dd></div><div><dt>Duração</dt><dd>{course.duration} semestres</dd></div></dl>
      </aside>
    </div>
    <dl className="repository-metadata">{metrics.map(item => <div key={item.label}><span className="course-icon-box"><DesignIcon name={item.icon} /></span><div><dt>{item.label}</dt><dd>{item.value}</dd></div></div>)}</dl>
  </section>
}
