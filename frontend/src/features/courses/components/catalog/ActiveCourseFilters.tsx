import DesignIcon from "../../../../shared/components/ui/DesignIcon";
import type { CourseFilters } from "../../types/catalog";

export default function ActiveCourseFilters({
  filters,
  onChange,
  onClear,
}: {
  filters: CourseFilters;
  onChange: (filters: CourseFilters) => void;
  onClear: () => void;
}) {
  const values: {
    key: "query" | "degree" | "modality" | "shift" | "campus";
    label: string;
  }[] = [
    { key: "query", label: "Termo" },
    { key: "degree", label: "Grau" },
    { key: "modality", label: "Modalidade" },
    { key: "shift", label: "Turno" },
    { key: "campus", label: "Campus" },
  ];
  return (
    <div className="active-course-filters">
      <span className="active-filters-label">
        <DesignIcon name="empty-imgContainer3" />
        Filtros ativos:
      </span>
      <div className="filter-chips">
        {values
          .filter((item) => filters[item.key].trim())
          .map((item) => (
            <button
              type="button"
              key={item.key}
              aria-label={
                "Remover filtro " + item.label + ": " + filters[item.key]
              }
              onClick={() => onChange({ ...filters, [item.key]: "" })}
            >
              {item.label}: {filters[item.key]}
              <DesignIcon
                name={
                  item.key === "query"
                    ? "empty-imgButtonRemoverTermo"
                    : "empty-imgButtonRemoverFiltroDeGraduacao"
                }
              />
            </button>
          ))}
        {(["areas", "durations"] as const).flatMap((key) =>
          filters[key].map((value) => (
            <button
              type="button"
              key={key + value}
              aria-label={"Remover filtro " + value}
              onClick={() =>
                onChange({
                  ...filters,
                  [key]: filters[key].filter((item) => item !== value),
                })
              }
            >
              {key === "durations"
                ? ({
                    short: "Até 2 anos",
                    medium: "De 2,5 a 4 anos",
                    long: "Mais de 4 anos",
                  }[value] ?? value)
                : value}
              <DesignIcon name="empty-imgButtonRemoverFiltroDeGraduacao" />
            </button>
          )),
        )}
      </div>
      <button type="button" onClick={onClear} className="text-link">
        <DesignIcon name="empty-imgContainer4" />
        Redefinir busca
      </button>
    </div>
  );
}
