import { Link } from "react-router";
import DesignIcon from "../../../shared/components/ui/DesignIcon";
import type { Course } from "../types/course";
export default function CourseCard({ course }: { course: Course }) {
  return (
    <article className="course-card">
      <div className="course-card-top">
        <span className="course-badge">{course.category}</span>
        <span className="course-abbreviation">{course.abbreviation}</span>
      </div>
      <h3>{course.title}</h3>
      <p>{course.description}</p>
      <ul className="course-meta" aria-label="Informações do curso">
        <li>
          <DesignIcon name="imgContainer2" />
          {course.duration} semestres
        </li>
        <li>
          <DesignIcon name="imgContainer3" />
          {course.level}
        </li>
        <li>
          <DesignIcon
            name={
              course.shift === "Noturno" ? "imgContainer4" : "imgContainer5"
            }
          />
          {course.shift}
        </li>
      </ul>
      <Link to={"/cursos/" + course.id} className="text-link course-link">
        Conhecer o curso
        <DesignIcon name="imgContainer1" />
      </Link>
    </article>
  );
}
