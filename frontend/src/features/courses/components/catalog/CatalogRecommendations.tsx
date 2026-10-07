import { Link } from "react-router";
import DesignIcon from "../../../../shared/components/ui/DesignIcon";
import type { CatalogCourse } from "../../types/catalog";
export default function CatalogRecommendations({
  courses,
  onShowAll,
}: {
  courses: CatalogCourse[];
  onShowAll: () => void;
}) {
  return (
    <section className="catalog-recommendations">
      <div className="recommendations-heading">
        <div>
          <h2>Cursos em destaque institucional</h2>
          <p>
            Conheça outras possibilidades de formação no catálogo demonstrativo.
          </p>
        </div>
        <button type="button" className="text-link" onClick={onShowAll}>
          Ver todos os {courses.length} cursos →
        </button>
      </div>
      <div className="recommendation-grid">
        {courses
          .filter((course) => course.recommended)
          .map((course) => (
            <article key={course.id}>
              <div className="recommendation-top">
                <span>
                  {course.degree === "Tecnologia" ? "Tecnólogo" : course.degree}
                </span>
                <span>
                  <DesignIcon name="empty-imgContainer12" />
                  {course.durationLabel}
                </span>
              </div>
              <h3>{course.title}</h3>
              <p>{course.description}</p>
              <div className="recommendation-bottom">
                <span>
                  {course.campus} • {course.shift}
                </span>
                <Link to={"/cursos/" + course.id} className="text-link">
                  Detalhes →
                </Link>
              </div>
            </article>
          ))}
      </div>
    </section>
  );
}
