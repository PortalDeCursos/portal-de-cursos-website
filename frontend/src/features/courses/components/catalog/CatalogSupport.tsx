import { Link } from "react-router";
import DesignIcon from "../../../../shared/components/ui/DesignIcon";
import PrototypeAction from "../../../../shared/components/ui/PrototypeAction";
export default function CatalogSupport() {
  return (
    <section className="catalog-support">
      <div className="support-symbol">
        <DesignIcon name="catalog-imgContainer8" />
      </div>
      <div>
        <h2>Não encontrou a formação que procurava?</h2>
        <p>
          Consulte nossos projetos acadêmicos e grupos de extensão ou entre em
          contato com as coordenações de área para orientações sobre ingresso e
          transferências.
        </p>
      </div>
      <div className="support-actions">
        <Link to="/projetos" className="catalog-secondary-button">
          <DesignIcon name="catalog-imgContainer9" />
          Ver projetos
        </Link>
        <PrototypeAction
          className="catalog-contact"
          title="Falar com a coordenação"
        >
          <DesignIcon name="catalog-imgContainer10" />
          Falar com a coordenação
        </PrototypeAction>
      </div>
    </section>
  );
}
