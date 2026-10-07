import type { Course } from './course'
export interface CatalogCourse extends Omit<Course, 'shift'> {
  shift: 'Noturno' | 'Matutino' | 'Integral'
  degree: 'Tecnologia' | 'Bacharelado'
  campus: string
  area: string
  emec?: string
  durationLabel: string
  recommended?: boolean
}
export interface CourseFilters {
  query: string
  degree: string
  modality: string
  shift: string
  campus: string
  areas: string[]
  durations: string[]
}
export const defaultFilters: CourseFilters = { query: '', degree: 'Tecnologia', modality: 'Presencial', shift: '', campus: 'Campus Central', areas: [], durations: [] }
export const clearedFilters: CourseFilters = { query: '', degree: '', modality: '', shift: '', campus: '', areas: [], durations: [] }
