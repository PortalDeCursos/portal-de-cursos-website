import { Link } from "react-router";
import DesignIcon from "../../../../shared/components/ui/DesignIcon";
export default function CatalogHeader() {
  return (
    <>
      <nav aria-label="Navegação estrutural" className="catalog-breadcrumb">
        <Link to="/">Início</Link>
        <DesignIcon name="catalog-imgContainer" />
        <span aria-current="page">Cursos</span>
      </nav>
      <div className="catalog-heading">
        <p className="catalog-eyebrow">
          <span />
          Catálogo acadêmico
        </p>
        <h1>Conheça nossos cursos</h1>
        <p>
          Explore a formação, as disciplinas, os professores e as produções de
          cada curso.
        </p>
      </div>
    </>
  );
}
