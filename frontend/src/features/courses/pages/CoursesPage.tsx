import { useSearchParams } from "react-router";
import CatalogHeader from "../components/catalog/CatalogHeader";
import CatalogFilters from "../components/catalog/CatalogFilters";
import CatalogCourseCard from "../components/catalog/CatalogCourseCard";
import CatalogSkeleton from "../components/catalog/CatalogSkeleton";
import CatalogEmpty from "../components/catalog/CatalogEmpty";
import CatalogSidebar from "../components/catalog/CatalogSidebar";
import CatalogSupport from "../components/catalog/CatalogSupport";
import CatalogRecommendations from "../components/catalog/CatalogRecommendations";
import ActiveCourseFilters from "../components/catalog/ActiveCourseFilters";
import { activeFilterCount } from "../utils/filterCourses";
import "../styles/catalog.css";
import {
  clearedFilters,
  defaultFilters,
} from "../types/catalog";
import type { CourseFilters } from "../types/catalog";
import { filterCourses } from "../utils/filterCourses";
import useCatalog from "../hooks/useCatalog";

export default function CoursesPage() {
  const catalog = useCatalog();
  const [params, setParams] = useSearchParams({
    degree: defaultFilters.degree,
    modality: defaultFilters.modality,
    campus: defaultFilters.campus,
  });
  const filters: CourseFilters = {
    query: params.get("q") ?? "",
    degree: params.get("degree") ?? "",
    modality: params.get("modality") ?? "",
    shift: params.get("shift") ?? "",
    campus: params.get("campus") ?? "",
    areas: params.getAll("area"),
    durations: params.getAll("duration"),
  };
  const filtered = filterCourses(catalog.courses, filters);
  const sort = params.get("sort") ?? "relevance";
  const sorted =
    sort === "name"
      ? [...filtered].sort((a, b) => a.title.localeCompare(b.title, "pt-BR"))
      : sort === "duration"
        ? [...filtered].sort((a, b) => a.duration - b.duration)
        : filtered;
  function updateFilters(next: CourseFilters) {
    const nextParams = new URLSearchParams();
    for (const [key, value] of Object.entries(next)) {
      if (Array.isArray(value))
        value.forEach((item) =>
          nextParams.append(key === "areas" ? "area" : "duration", item),
        );
      else if (value) nextParams.set(key === "query" ? "q" : key, value);
    }
    nextParams.set("all", "true");
    if (sort !== "relevance") nextParams.set("sort", sort);
    setParams(nextParams, { replace: true });
  }
  function clearFilters() {
    updateFilters(clearedFilters);
    document.getElementById("course-search")?.focus();
  }
  const noResults = catalog.status === "success" && filtered.length === 0;
  return (
    <div className="catalog-page">
      <div className="container catalog-content">
        <CatalogHeader />
        {catalog.status === "loading" ? (
          <CatalogSkeleton />
        ) : catalog.status === "error" ? (
          <section className="section-feedback" role="alert">
            <h2>Não foi possível carregar os cursos</h2>
            <p>Verifique sua conexão e tente novamente.</p>
            <button
              type="button"
              className="primary-button"
              onClick={catalog.retry}
            >
              Tentar novamente
            </button>
          </section>
        ) : (
          <>
            <CatalogFilters
              filters={filters}
              onChange={updateFilters}
              onClear={clearFilters}
            />
            {noResults ? (
              <ActiveCourseFilters
                filters={filters}
                onChange={updateFilters}
                onClear={clearFilters}
              />
            ) : (
              <div className="catalog-results-meta">
                <p role="status">
                  <strong>{filtered.length}</strong>{" "}
                  {filtered.length === 1
                    ? "curso encontrado"
                    : "cursos encontrados"}
                </p>
                <div className="catalog-context-tags">
                  {filters.campus && <span>{filters.campus}</span>}
                  {filters.degree && (
                    <span>
                      {filters.degree === "Tecnologia"
                        ? "Tecnologia Superior"
                        : filters.degree}
                    </span>
                  )}
                </div>
                <p className="catalog-period">
                  <span />
                  Período letivo demonstrativo: 2024.2
                </p>
              </div>
            )}
            {noResults ? (
              <div className="catalog-empty-layout">
                <CatalogSidebar
                  courses={catalog.courses}
                  filters={filters}
                  activeCount={activeFilterCount(filters)}
                  onChange={updateFilters}
                />
                <div className="catalog-empty-results">
                  <div className="empty-results-header">
                    <h2>
                      Resultados da busca{" "}
                      <span role="status">0 cursos encontrados</span>
                    </h2>
                    <label>
                      Ordenar por:{" "}
                      <select
                        value={sort}
                        onChange={(event) => {
                          const next = new URLSearchParams(params);
                          next.set("sort", event.target.value);
                          setParams(next, { replace: true });
                        }}
                      >
                        <option value="relevance">Mais relevantes</option>
                        <option value="name">Nome do curso</option>
                        <option value="duration">Menor duração</option>
                      </select>
                    </label>
                  </div>
                  <CatalogEmpty
                    onClear={clearFilters}
                    onShowAll={clearFilters}
                  />
                  <CatalogRecommendations
                    courses={catalog.courses}
                    onShowAll={clearFilters}
                  />
                </div>
              </div>
            ) : (
              <>
                <div className="catalog-grid">
                  {sorted.map((course) => (
                    <CatalogCourseCard key={course.id} course={course} />
                  ))}
                </div>
                <CatalogSupport />
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}
