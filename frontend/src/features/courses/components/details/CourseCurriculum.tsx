import type { CatalogCourse } from '../../types/catalog'
import type { CourseAcademicDetails } from '../../types/details'
import PrototypeAction from '../../../../shared/components/ui/PrototypeAction'
export default function CourseCurriculum({ course, details }: { course: CatalogCourse; details?: CourseAcademicDetails }) {
  const semesters = details?.curriculum ?? [{ semester: 1, subjects: course.lessons }]
  return <section className="course-white-panel course-curriculum"><div className="course-content-heading"><div><h2>Grade curricular</h2><p>Organização demonstrativa dos componentes ao longo da formação.</p></div><PrototypeAction title="Matriz curricular em PDF" className="catalog-secondary-button">Consultar matriz em PDF</PrototypeAction></div>{semesters.map((semester, index) => <details key={semester.semester} open={index === 0}><summary><span>{semester.semester}º semestre</span><small>{semester.subjects.length} componentes</small></summary><ul>{semester.subjects.map(subject => <li key={subject}><span>{subject}</span>{details && <small>75 h</small>}</li>)}</ul></details>)}</section>
}
