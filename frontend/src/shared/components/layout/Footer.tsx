import { Link } from "react-router";
import logo from "../../../assets/logo.png";
import PrototypeAction from "../ui/PrototypeAction";
export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-grid">
          <div>
            <div className="footer-brand">
              <img src={logo} className="portal-logo" alt="" />
              <strong>
                Portal de <span className="brand-highlight">Cursos</span>
              </strong>
            </div>
            <p>
              Plataforma acadêmica institucional de divulgação de matrizes
              curriculares, cursos de graduação, pós-graduação e projetos
              científicos.
            </p>
            <span className="institution-badge">
              Ambiente Demonstrativo Institucional
            </span>
          </div>
          <nav aria-label="Navegação acadêmica">
            <h2>Navegação acadêmica</h2>
            <Link to="/">Página Inicial</Link>
            <Link to="/cursos">Catálogo de Cursos</Link>
            <Link to="/projetos">Projetos de Extensão</Link>
            <PrototypeAction>Submissão de Propostas</PrototypeAction>
          </nav>
          <nav aria-label="Acesso e legislação">
            <h2>Acesso e legislação</h2>
            {[
              "Portal do Docente e Discente",
              "Termos de Uso e Privacidade",
              "Regulamento de Ensino",
            ].map((title) => (
              <PrototypeAction key={title} title={title}>
                {title}
              </PrototypeAction>
            ))}
          </nav>
        </div>
        <div className="footer-bottom">
          <p>
            © 2025 Portal de Cursos Acadêmicos. Todos os direitos reservados.
          </p>
          <p className="demo-note">
            Nota: Todos os dados apresentados possuem finalidade estritamente
            demonstrativa e pedagógica.
          </p>
        </div>
      </div>
    </footer>
  );
}
