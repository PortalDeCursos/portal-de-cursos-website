import { useEffect, useState } from "react";
import DesignIcon from "../../../../shared/components/ui/DesignIcon";
import PrototypeAction from "../../../../shared/components/ui/PrototypeAction";
import type { CatalogCourse, CourseFilters } from "../../types/catalog";
const areas = [
  "Exatas e Tecnologia",
  "Ciências da Saúde",
  "Ciências Humanas e Sociais",
  "Gestão e Negócios",
  "Engenharias e Produção",
];
const durations = [
  { value: "short", label: "Até 2 anos" },
  { value: "medium", label: "De 2,5 a 4 anos" },
  { value: "long", label: "Mais de 4 anos" },
];
export default function CatalogSidebar({
  courses,
  filters,
  activeCount,
  onChange,
}: {
  courses: CatalogCourse[];
  filters: CourseFilters;
  activeCount: number;
  onChange: (filters: CourseFilters) => void;
}) {
  const [expanded, setExpanded] = useState(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia("(min-width: 768px)").matches,
  );
  useEffect(() => {
    const media = window.matchMedia("(min-width: 768px)");
    const update = () => setExpanded(media.matches);
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);
  function toggle(key: "areas" | "durations", value: string) {
    onChange({
      ...filters,
      [key]: filters[key].includes(value)
        ? filters[key].filter((item) => item !== value)
        : [...filters[key], value],
    });
  }
  return (
    <aside className="catalog-sidebar" aria-label="Filtros detalhados">
      <details
        className="sidebar-disclosure"
        open={expanded}
        onToggle={(event) => setExpanded(event.currentTarget.open)}
      >
        <summary className="sidebar-disclosure-toggle">Refinar filtros</summary>
        <div>
          <div className="sidebar-title">
            <h2>
              <DesignIcon name="empty-imgContainer5" />
              Filtrar cursos
            </h2>
            <span>{activeCount} ativos</span>
          </div>
          <details open>
            <summary>
              Área de conhecimento
              <DesignIcon name="empty-imgContainer6" />
            </summary>
            <div className="sidebar-options">
              {areas.map((area) => (
                <label key={area}>
                  <input
                    type="checkbox"
                    checked={filters.areas.includes(area)}
                    onChange={() => toggle("areas", area)}
                  />
                  <span>{area}</span>
                  <small>
                    {courses.filter((course) => course.area === area).length}
                  </small>
                </label>
              ))}
            </div>
          </details>
          <details open>
            <summary>
              Turno de oferta
              <DesignIcon name="empty-imgContainer6" />
            </summary>
            <div className="sidebar-options">
              {["Matutino", "Noturno", "Integral"].map((shift) => (
                <label key={shift}>
                  <input
                    type="radio"
                    name="sidebar-shift"
                    checked={filters.shift === shift}
                    onChange={() => onChange({ ...filters, shift })}
                  />
                  <span>{shift}</span>
                  <small>
                    {courses.filter((course) => course.shift === shift).length}
                  </small>
                </label>
              ))}
              <button
                type="button"
                className="text-link"
                onClick={() => onChange({ ...filters, shift: "" })}
              >
                Todos os turnos
              </button>
            </div>
          </details>
          <details open>
            <summary>
              Duração prevista
              <DesignIcon name="empty-imgContainer6" />
            </summary>
            <div className="sidebar-options">
              {durations.map((duration) => (
                <label key={duration.value}>
                  <input
                    type="checkbox"
                    checked={filters.durations.includes(duration.value)}
                    onChange={() => toggle("durations", duration.value)}
                  />
                  <span>{duration.label}</span>
                </label>
              ))}
            </div>
          </details>
          <div className="sidebar-campus">
            <label htmlFor="course-campus">Campus</label>
            <select
              id="course-campus"
              value={filters.campus}
              onChange={(event) =>
                onChange({ ...filters, campus: event.target.value })
              }
            >
              <option value="">Todos os campi</option>
              <option>Campus Central</option>
              <option>Campus Norte</option>
            </select>
          </div>
          <div className="vocational-help">
            <h3>
              <DesignIcon name="empty-imgContainer7" />
              Dúvida vocacional?
            </h3>
            <p>
              A coordenação acadêmica disponibiliza orientação sobre as
              possibilidades de formação.
            </p>
            <PrototypeAction title="Agendar atendimento" className="text-link">
              Agendar atendimento →
            </PrototypeAction>
          </div>
        </div>
      </details>
    </aside>
  );
}
