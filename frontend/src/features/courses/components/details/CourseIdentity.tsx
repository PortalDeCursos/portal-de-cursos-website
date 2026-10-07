import { Link } from 'react-router'
import DesignIcon from '../../../../shared/components/ui/DesignIcon'
import type { CatalogCourse } from '../../types/catalog'
import type { CourseAcademicDetails } from '../../types/details'
export default function CourseIdentity({ course, details }: { course: CatalogCourse; details?: CourseAcademicDetails }) {
  const metadata = [
    { label: 'Grau', value: course.degree, note: 'Ensino Superior', icon: 'detail-imgContainer2' },
    { label: 'Duração', value: course.duration + ' Semestres', note: (course.duration / 2).toLocaleString('pt-BR') + ' anos letivos', icon: 'detail-imgContainer3' },
    { label: 'Modalidade', value: course.level, note: course.campus, icon: 'detail-imgContainer4' },
    { label: 'Turno', value: course.shift, note: details?.schedule ?? 'Consulte a coordenação', icon: 'detail-imgContainer5' },
    ...(details ? [{ label: 'Carga Horária', value: details.hours.toLocaleString('pt-BR') + ' h', note: 'Total integrado', icon: 'detail-imgContainer6' }, { label: 'Matriz', value: details.moduleCount + ' Módulos', note: 'Matriz demonstrativa', icon: 'detail-imgContainer7' }] : []),
  ]
  return <><div className="course-breadcrumb-row"><nav className="course-breadcrumb" aria-label="Navegação estrutural"><Link to="/">Início</Link><DesignIcon name="detail-imgContainer" /><Link to="/cursos">Cursos</Link><DesignIcon name="detail-imgContainer" /><span aria-current="page">{course.abbreviation}</span></nav><span className="course-category"><span />{course.degree === 'Tecnologia' ? 'Graduação Tecnológica' : course.degree}</span></div><div className="course-title-row"><div><h1>{course.title} ({course.abbreviation})</h1><p>{details?.summary ?? course.description}</p></div>{details && <aside className="course-recognition" aria-label="Reconhecimento institucional"><span className="course-icon-box"><DesignIcon name="detail-imgContainer1" /></span><div><p>Reconhecimento Institucional</p><strong>Nota Máxima no MEC</strong><small>Portaria de Renovação nº 412/2023</small></div></aside>}</div><dl className="course-metadata-grid">{metadata.map(item => <div key={item.label}><dt>{item.label}<DesignIcon name={item.icon} /></dt><dd>{item.value}</dd><p>{item.note}</p></div>)}</dl></>
}
