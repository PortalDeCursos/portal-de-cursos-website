import type { CatalogCourse, CourseFilters } from "../types/catalog";
export function normalizeSearch(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLocaleLowerCase("pt-BR")
    .trim();
}
export function filterCourses(
  courses: CatalogCourse[],
  filters: CourseFilters,
) {
  const terms = normalizeSearch(filters.query).split(/\s+/).filter(Boolean);
  return courses.filter((course) => {
    const haystack = normalizeSearch(
      course.title + " " + course.abbreviation + " " + course.category,
    );
    const duration =
      course.duration <= 4 ? "short" : course.duration <= 8 ? "medium" : "long";
    return (
      terms.every((term) => haystack.includes(term)) &&
      (!filters.degree ||
        (filters.degree === "Graduação"
          ? true
          : course.degree === filters.degree)) &&
      (!filters.modality || course.level === filters.modality) &&
      (!filters.shift || course.shift === filters.shift) &&
      (!filters.campus || course.campus === filters.campus) &&
      (!filters.areas.length || filters.areas.includes(course.area)) &&
      (!filters.durations.length || filters.durations.includes(duration))
    );
  });
}

export function activeFilterCount(filters: CourseFilters) {
  return (
    [
      filters.query.trim(),
      filters.degree,
      filters.modality,
      filters.shift,
      filters.campus,
    ].filter(Boolean).length +
    filters.areas.length +
    filters.durations.length
  );
}
