import { Link } from "react-router";
import DesignIcon from "../../../shared/components/ui/DesignIcon";
import type { Project } from "../types/project";
export default function ProjectListItem({ project }: { project: Project }) {
  return (
    <li className="project-item">
      <div className="project-copy">
        <div className="project-tags">
          <span
            className={
              "project-badge " +
              (project.category === "Pesquisa"
                ? "research"
                : project.category === "TCC"
                  ? "tcc"
                  : "")
            }
          >
            {project.category}
          </span>
          <span>• Curso {project.courseLabel}</span>
        </div>
        <h3>{project.title}</h3>
        <p>{project.description}</p>
        <p className="advisor">
          Orientador: <strong>{project.advisor}</strong>
        </p>
      </div>
      <Link to={"/projetos/" + project.id} className="text-link project-link">
        Ver projeto
        <DesignIcon name="imgContainer1" />
      </Link>
    </li>
  );
}
