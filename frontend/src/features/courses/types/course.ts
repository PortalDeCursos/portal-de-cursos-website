export interface Course {
  id: string
  title: string
  category: string
  description: string
  duration: number
  level: string
  abbreviation: string
  shift: 'Noturno' | 'Matutino'
  lessons: string[]
}
