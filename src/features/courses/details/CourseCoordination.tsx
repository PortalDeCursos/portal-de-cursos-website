import DesignIcon from '../../../components/ui/DesignIcon';
import PrototypeAction from '../../../components/ui/PrototypeAction';
import type { CatalogCourse } from '../catalogTypes';
import type { CourseAcademicDetails } from './types';
export default function CourseCoordination({
  course,
  details,
}: {
  course: CatalogCourse;
  details?: CourseAcademicDetails;
}) {
  return (
    <aside className="course-coordination">
      <DesignIcon name="detail-imgContainer14" />
      <div>
        <h2>Coordenação Acadêmica do {course.abbreviation}</h2>
        <p>
          {details
            ? 'Atendimento presencial no Bloco B, Sala 204 · E-mail institucional: ' + details.email
            : 'Consulte a instituição para informações de atendimento.'}
        </p>
      </div>
      <PrototypeAction title="Regulamento Geral do Curso" className="text-link">
        Regulamento Geral do Curso
        <DesignIcon name="detail-imgContainer15" />
      </PrototypeAction>
    </aside>
  );
}
