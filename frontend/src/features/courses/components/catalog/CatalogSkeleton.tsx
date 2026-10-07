import DesignIcon from "../../../../shared/components/ui/DesignIcon";
export default function CatalogSkeleton() {
  return (
    <div
      className="catalog-loading"
      role="status"
      aria-label="Carregando cursos"
    >
      <span className="sr-only">Carregando cursos. Aguarde.</span>
      <div aria-hidden="true">
        <div className="catalog-loading-count skeleton-block" />
        <div className="catalog-filters loading-filters">
          <div className="loading-search">
            <DesignIcon name="loading-imgIcon" />
            <span className="skeleton-block" />
          </div>
          {[0, 1, 2].map((i) => (
            <div className="loading-select" key={i}>
              <span className="skeleton-block" />
              <DesignIcon name="loading-imgContainer1" />
            </div>
          ))}
        </div>
        <div className="catalog-grid">
          {[0, 1].map((i) => (
            <div className="catalog-skeleton-card" key={i}>
              <div className="skeleton-top">
                <span className="skeleton-block" />
                <span className="skeleton-block" />
              </div>
              <div className="skeleton-title">
                <span className="skeleton-block" />
                <span className="skeleton-block" />
              </div>
              <div className="skeleton-description">
                <span />
                <span />
                <span />
              </div>
              <div className="skeleton-meta">
                {[0, 1, 2].map((j) => (
                  <div key={j}>
                    <span className="skeleton-block" />
                    <span className="skeleton-block" />
                  </div>
                ))}
              </div>
              <div className="skeleton-bottom">
                <span />
                <span className="skeleton-block" />
              </div>
            </div>
          ))}
        </div>
        <div className="skeleton-pagination">
          {[0, 1, 2, 3].map((i) => (
            <span key={i} />
          ))}
        </div>
      </div>
    </div>
  );
}
