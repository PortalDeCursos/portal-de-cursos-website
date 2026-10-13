import { Link } from 'react-router';
import DesignIcon from '../../../../shared/components/ui/DesignIcon';
import type { CatalogCourse } from '../../types/catalog';
export default function CatalogCourseCard({ course }: { course: CatalogCourse }) {
  return (
    <article className="catalog-course-card" data-degree={course.degree}>
      <div className="catalog-card-top">
        <span className="catalog-degree">
          {course.degree === 'Tecnologia' ? 'Graduação Tecnológica' : course.degree}
        </span>
        <span className="catalog-duration">
          <DesignIcon name="catalog-imgContainer2" />
          {course.durationLabel}
        </span>
      </div>
      <h2>
        {course.title} ({course.abbreviation})
      </h2>
      <span className="catalog-title-rule" aria-hidden="true" />
      <p>{course.description}</p>
      <div className="catalog-card-bottom">
        <ul className="catalog-card-meta" aria-label="Informações do curso">
          <li>
            <DesignIcon name="catalog-imgContainer3" />
            {course.duration} semestres
          </li>
          <li>
            <DesignIcon name="catalog-imgContainer4" />
            <span className="modality-badge" data-modality={course.level}>
              {course.level}
            </span>
          </li>
          <li>
            <DesignIcon
              name={course.shift === 'Matutino' ? 'catalog-imgContainer7' : 'catalog-imgContainer5'}
            />
            {course.shift}
          </li>
        </ul>
        <div className="catalog-card-actions">
          <span className="catalog-campus">{course.campus}</span>
          <Link to={'/cursos/' + course.id} className="text-link">
            Conhecer o curso
            <DesignIcon name="catalog-imgContainer6" />
          </Link>
        </div>
      </div>
    </article>
  );
}
