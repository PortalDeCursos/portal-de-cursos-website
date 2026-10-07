import DesignIcon from "../../../../shared/components/ui/DesignIcon";
const tips = [
  "Verifique se não há erros de digitação no termo digitado.",
  "Experimente usar termos mais amplos (ex: “Computação”, “Sistemas”).",
  "Remova filtros de campus ou modalidade para ampliar os resultados.",
  "Consulte outras opções de grau de formação no catálogo.",
];
export default function CatalogEmpty({
  onClear,
  onShowAll,
}: {
  onClear: () => void;
  onShowAll: () => void;
}) {
  return (
    <section className="catalog-empty" aria-labelledby="empty-title">
      <div className="empty-symbol">
        <DesignIcon name="empty-imgContainer8" />
      </div>
      <h2 id="empty-title">Nenhum curso encontrado</h2>
      <p>
        Não encontramos cursos correspondentes aos critérios ou termos
        pesquisados. Tente ajustar os filtros ou utilizar palavras-chave mais
        genéricas.
      </p>
      <div className="empty-actions">
        <button type="button" className="primary-button" onClick={onClear}>
          <DesignIcon name="empty-imgContainer9" />
          Limpar filtros
        </button>
        <button
          type="button"
          className="catalog-secondary-button"
          onClick={onShowAll}
        >
          <DesignIcon name="empty-imgContainer10" />
          Ver catálogo completo
        </button>
      </div>
      <div className="empty-tips">
        <h3>
          <DesignIcon name="empty-imgContainer11" />
          Dicas para encontrar o que você procura:
        </h3>
        <ul>
          {tips.map((tip) => (
            <li key={tip}>
              <DesignIcon name="empty-imgMargin" />
              <span>{tip}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
