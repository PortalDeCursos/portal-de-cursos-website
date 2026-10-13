import type { CatalogCourse } from '../features/courses/catalogTypes';

/** Fronteira de leitura: substituir por API mantendo o contrato da interface. */
export async function loadCourseCatalog(): Promise<CatalogCourse[]> {
  const { catalogCourses } = await import('../mocks/catalog');
  return catalogCourses;
}
