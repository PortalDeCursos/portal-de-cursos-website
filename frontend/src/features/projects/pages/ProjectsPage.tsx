import { projects } from "../data/mocks/projects";
import ProjectListItem from "../components/ProjectListItem";
export default function ProjectsPage() {
  return (
    <div className="container page">
      <h1 className="page-title">Biblioteca de projetos</h1>
      <p className="my-6 text-muted">
        Conheça trabalhos aprovados e desenvolvidos ao longo da formação.
      </p>
      <ul className="project-list">
        {projects.map((project) => (
          <ProjectListItem key={project.id} project={project} />
        ))}
      </ul>
    </div>
  );
}
