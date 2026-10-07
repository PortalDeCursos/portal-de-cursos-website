import { Link } from "react-router";
import DesignIcon from "../../../shared/components/ui/DesignIcon";
import PrototypeAction from "../../../shared/components/ui/PrototypeAction";
export default function CourseProjectsEmpty({
  abbreviation,
  filtered,
  onClear,
}: {
  abbreviation: string;
  filtered: boolean;
  onClear: () => void;
}) {
  return (
    <section
      className="course-projects-empty"
      aria-labelledby="course-projects-empty-title"
    >
      <div className="projects-empty-symbol">
        <DesignIcon name="project-empty-imgSvg" />
        <span aria-hidden="true">i</span>
      </div>
      <h3 id="course-projects-empty-title">
        {filtered
          ? "Nenhum projeto encontrado nesta categoria"
          : "Nenhum projeto publicado para este curso no momento"}
      </h3>
      <p>
        {filtered
          ? "Experimente outra categoria ou consulte todos os projetos aprovados deste curso."
          : "Os trabalhos acadêmicos de estudantes do " +
            abbreviation +
            " (TCC, Projetos Integradores e Pesquisas) serão exibidos aqui assim que forem avaliados e aprovados pelo professor orientador."}
      </p>
      <div className="projects-empty-actions">
        {filtered ? (
          <button
            type="button"
            onClick={onClear}
            className="catalog-secondary-button"
          >
            Ver todos os projetos do curso
          </button>
        ) : (
          <Link to="/projetos" className="catalog-secondary-button">
            <DesignIcon name="project-empty-imgContainer7" />
            Conhecer biblioteca geral de projetos
          </Link>
        )}
        <PrototypeAction className="primary-button">
          <DesignIcon name="project-empty-imgContainer8" />
          Submeter um projeto discente
        </PrototypeAction>
      </div>
      <div className="projects-empty-calendar">
        <p>
          <DesignIcon name="project-empty-imgContainer9" />
          Ciclo demonstrativo: 2024.2
        </p>
        <span>•</span>
        <p>
          <DesignIcon name="project-empty-imgContainer10" />
          Banca do protótipo: Dezembro/2024
        </p>
      </div>
    </section>
  );
}
