import { Link } from "react-router";
import DesignIcon from "../../../../shared/components/ui/DesignIcon";
import type { CatalogCourse } from "../../types/catalog";
export default function CatalogCourseCard({
  course,
}: {
  course: CatalogCourse;
}) {
  return (
    <article className="catalog-course-card">
      <div className="catalog-card-top">
        <span className="catalog-degree">
          {course.degree === "Tecnologia"
            ? "Graduação Tecnológica"
            : course.degree}
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
            {course.level}
          </li>
          <li>
            <DesignIcon
              name={
                course.shift === "Matutino"
                  ? "catalog-imgContainer7"
                  : "catalog-imgContainer5"
              }
            />
            {course.shift}
          </li>
        </ul>
        <div className="catalog-card-actions">
          <p className="catalog-code">
            <span />
            {course.emec ? "Código e-MEC: " + course.emec : course.campus}
          </p>
          <Link to={"/cursos/" + course.id} className="text-link">
            Conhecer o curso
            <DesignIcon name="catalog-imgContainer6" />
          </Link>
        </div>
      </div>
    </article>
  );
}
