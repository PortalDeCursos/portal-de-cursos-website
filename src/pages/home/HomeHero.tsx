import { Link } from 'react-router';
import Button from '../../components/ui/Button';
import ProjectIllustration from '../../features/projects/ProjectIllustration';

export default function HomeHero() {
  return (
    <section className="home-hero" aria-labelledby="home-title">
      <div className="hero-copy">
        <p className="hero-eyebrow">
          <span />F
        </p>
        <h1 id="home-title">
          Conheça os cursos.
          <br />
          Descubra o que eles
          <br className="desktop-break" /> produzem.
        </h1>
        <p className="hero-description">
          Explore disciplinas, conheça professores e descubra projetos desenvolvidos pelos
          estudantes.
        </p>
        <div className="hero-actions">
          <Button to="/cursos">Explorar cursos</Button>
          <Link to="/projetos" className="text-link">
            Conhecer projetos
            <span aria-hidden="true">→</span>
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
        <p className="featured-description">Uma vitrine da formação e das produções acadêmicas.</p>
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
          <span aria-hidden="true">→</span>
        </Link>
      </article>
    </section>
  );
}
