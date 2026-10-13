import { Link } from 'react-router';
import DesignIcon from '../../components/ui/DesignIcon';
import SectionState from '../../components/ui/SectionState';
import CourseCard from '../../features/courses/CourseCard';
import type { Course } from '../../features/courses/types';

export default function HomeCourseSection({ courses }: { courses: Course[] }) {
  return (
    <section className="home-section" aria-labelledby="courses-title">
      <div className="section-heading">
        <div>
          <h2 id="courses-title">Encontre seu caminho</h2>
          <p>Conheça a estrutura e as possibilidades de cada formação.</p>
        </div>
        <div className="section-controls">
          <Link to="/cursos" className="text-link">
            Ver todos os cursos
            <DesignIcon name="imgContainer1" />
          </Link>
        </div>
      </div>
      {courses.length > 0 ? (
        <div className="home-course-grid">
          {courses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      ) : (
        <SectionState kind="cursos" />
      )}
    </section>
  );
}
