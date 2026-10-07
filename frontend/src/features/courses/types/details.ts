export interface CourseAcademicDetails {
  summary: string
  overviewTitle: string
  paragraphs: string[]
  hours: number
  moduleCount: number
  coordinator: string
  email: string
  schedule: string
  metrics: { value: string; label: string }[]
  studies: { title: string; description: string; icon: string }[]
  careers: { title: string; description: string }[]
  curriculum: { semester: number; subjects: string[] }[]
  faculty: { name: string; role: string; subjects: string }[]
}
export type CourseTab = 'overview' | 'curriculum' | 'faculty' | 'projects'
