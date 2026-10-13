import { Link } from 'react-router';
import DesignIcon from '../../components/ui/DesignIcon';
import SectionState from '../../components/ui/SectionState';
import ProjectListItem from '../../features/projects/ProjectListItem';
import type { Project } from '../../features/projects/types';

export default function HomeProjectSection({ projects }: { projects: Project[] }) {
  return (
    <section className="home-section" aria-labelledby="projects-title">
      <div className="section-heading">
        <div>
          <h2 id="projects-title">O conhecimento ganha forma aqui</h2>
          <p>Conheça trabalhos aprovados e desenvolvidos ao longo da formação.</p>
        </div>
        <div className="section-controls">
          <Link to="/projetos" className="text-link">
            Explorar biblioteca de projetos
            <DesignIcon name="imgContainer1" />
          </Link>
        </div>
      </div>
      {projects.length > 0 ? (
        <ul className="project-list">
          {projects.map((project) => (
            <ProjectListItem key={project.id} project={project} />
          ))}
        </ul>
      ) : (
        <SectionState kind="projetos" />
      )}
    </section>
  );
}
