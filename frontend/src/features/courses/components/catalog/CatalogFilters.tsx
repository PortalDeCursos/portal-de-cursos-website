import DesignIcon from "../../../../shared/components/ui/DesignIcon";
import type { CourseFilters } from "../../types/catalog";
type Props = {
  filters: CourseFilters;
  onChange: (filters: CourseFilters) => void;
  onClear: () => void;
};
export default function CatalogFilters({ filters, onChange, onClear }: Props) {
  function update(key: keyof CourseFilters, value: string) {
    onChange({ ...filters, [key]: value });
  }
  return (
    <section className="catalog-filters" aria-label="Busca e filtros de cursos">
      <div className="catalog-search">
        <label htmlFor="course-search" className="sr-only">
          Buscar por nome ou sigla do curso
        </label>
        <DesignIcon name="catalog-imgIcon" />
        <input
          id="course-search"
          type="search"
          value={filters.query}
          onChange={(event) => update("query", event.target.value)}
          placeholder="Buscar por nome ou sigla do curso..."
        />
      </div>
      <div className="catalog-select">
        <label className="sr-only" htmlFor="course-degree">
          Grau de formação
        </label>
        <select
          id="course-degree"
          value={filters.degree}
          onChange={(event) => update("degree", event.target.value)}
        >
          <option value="">Grau: Todos</option>
          <option>Tecnologia</option>
          <option>Graduação</option>
          <option>Bacharelado</option>
        </select>
        <DesignIcon name="catalog-imgIcon1" />
      </div>
      <div className="catalog-select">
        <label className="sr-only" htmlFor="course-modality">
          Modalidade
        </label>
        <select
          id="course-modality"
          value={filters.modality}
          onChange={(event) => update("modality", event.target.value)}
        >
          <option value="">Modalidade: Todas</option>
          <option>Presencial</option>
          <option>Online</option>
          <option>Híbrido</option>
        </select>
        <DesignIcon name="catalog-imgIcon1" />
      </div>
      <div className="catalog-select">
        <label className="sr-only" htmlFor="course-shift">
          Turno de oferta
        </label>
        <select
          id="course-shift"
          value={filters.shift}
          onChange={(event) => update("shift", event.target.value)}
        >
          <option value="">Turno: Todos</option>
          <option>Matutino</option>
          <option>Noturno</option>
          <option>Integral</option>
        </select>
        <DesignIcon name="catalog-imgIcon1" />
      </div>
      <button type="button" className="catalog-clear" onClick={onClear}>
        <DesignIcon name="catalog-imgContainer1" />
        Limpar
      </button>
    </section>
  );
}
