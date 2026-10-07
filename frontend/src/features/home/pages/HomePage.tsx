import { Link } from "react-router";
import Button from "../../../shared/components/ui/Button";
import DesignIcon from "../../../shared/components/ui/DesignIcon";
import PrototypeAction from "../../../shared/components/ui/PrototypeAction";
import SectionState from "../../../shared/components/ui/SectionState";
import CourseCard from "../../courses/components/CourseCard";
import ProjectListItem from "../../projects/components/ProjectListItem";
import ProjectIllustration from "../../projects/components/ProjectIllustration";
import { courses } from "../../courses/data/mocks/courses";
import { projects } from "../../projects/data/mocks/projects";

export default function HomePage() {
  return (
    <div className="home-page">
      <div className="container home-content">
        <section className="home-hero" aria-labelledby="home-title">
          <div className="hero-copy">
            <p className="hero-eyebrow">
              <span />
              Formação e produção acadêmica
            </p>
            <h1 id="home-title">
              Conheça os cursos.
              <br />
              Descubra o que eles
              <br className="desktop-break" /> produzem.
            </h1>
            <p className="hero-description">
              Explore disciplinas, conheça professores e descubra projetos
              desenvolvidos pelos estudantes.
            </p>
            <div className="hero-actions">
              <Button to="/cursos">Explorar cursos</Button>
              <Link to="/projetos" className="text-link">
                Conhecer projetos
                <DesignIcon name="imgContainer" />
              </Link>
            </div>
          </div>
          <article className="featured-project">
            <div className="featured-top">
              <span className="project-badge">Projeto integrador</span>
              <span className="approval-badge">
                <span />
                Aprovado
              </span>
            </div>
            <h2>Portal de Cursos</h2>
            <p className="featured-description">
              Uma vitrine da formação e das produções acadêmicas.
            </p>
            <dl className="featured-meta">
              <div>
                <dt>Curso</dt>
                <dd>Análise e Desenv. de Sistemas</dd>
              </div>
              <div>
                <dt>Autores</dt>
                <dd>João Silva e Luana Gomes</dd>
              </div>
              <div>
                <dt>Orientador</dt>
                <dd>Prof. Carlos Almeida</dd>
              </div>
            </dl>
            <div className="featured-visual">
              <ProjectIllustration />
            </div>
            <Link to="/projetos/portal" className="text-link featured-link">
              Conhecer este projeto
              <DesignIcon name="imgContainer1" />
            </Link>
          </article>
        </section>
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
        <section className="home-section" aria-labelledby="projects-title">
          <div className="section-heading">
            <div>
              <h2 id="projects-title">O conhecimento ganha forma aqui</h2>
              <p>
                Conheça trabalhos aprovados e desenvolvidos ao longo da
                formação.
              </p>
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
        <section className="submission-banner">
          <div>
            <p className="submission-eyebrow">
              <DesignIcon name="imgContainer6" />
              Fluxo de extensão e pesquisa
            </p>
            <h2>Seu projeto também pode fazer parte.</h2>
            <p className="submission-description">
              Envie sua produção acadêmica em PDF. Após a avaliação do
              orientador, os projetos aprovados ficam disponíveis para consulta
              pública.
            </p>
            <p className="submission-note">
              Não é necessário ter uma conta para enviar.
            </p>
          </div>
          <PrototypeAction className="primary-button">
            <DesignIcon name="imgContainer7" />
            Submeter projeto
          </PrototypeAction>
        </section>
      </div>
    </div>
  );
}
