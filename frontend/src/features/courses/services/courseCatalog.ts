import type { CatalogCourse } from '../types/catalog'

/** Fronteira de leitura: substituir por API mantendo o contrato da interface. */
export async function loadCourseCatalog(): Promise<CatalogCourse[]> {
  const { catalogCourses } = await import('../data/mocks/catalog')
  return catalogCourses
}
