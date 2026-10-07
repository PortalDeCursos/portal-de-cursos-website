import { Link, useParams } from "react-router";
import { projects } from "../data/mocks/projects";
import NotFoundPage from "../../../shared/pages/NotFoundPage";
export default function ProjectDetailsPage() {
  const { projectId } = useParams();
  const project = projects.find((item) => item.id === projectId);
  if (!project) return <NotFoundPage />;
  return (
    <div className="container page">
      <Link
        to={"/cursos/" + project.courseId}
        className="text-sm font-bold text-brand"
      >
        ← Voltar ao curso
      </Link>
      <p className="mt-8 text-sm font-bold text-brand">Projeto prático</p>
      <h1 className="page-title mt-4">{project.title}</h1>
      <p className="mt-6 max-w-2xl text-lg text-muted">{project.description}</p>
      <ul aria-label="Tecnologias" className="mt-6 flex flex-wrap gap-3">
        {project.skills.map((skill) => (
          <li
            key={skill}
            className="rounded-md border border-border bg-surface px-3 py-2 text-sm"
          >
            {skill}
          </li>
        ))}
      </ul>
      <h2 className="mt-12 text-2xl font-bold">Passo a passo</h2>
      <ol className="mt-5 list-inside list-decimal space-y-4 text-muted">
        {project.steps.map((step) => (
          <li key={step}>{step}</li>
        ))}
      </ol>
    </div>
  );
}
