import type { Course } from '../../types/course'
export const courses: Course[] = [
  { id: 'tads', title: 'Análise e Desenvolvimento de Sistemas', category: 'Tecnologia', abbreviation: 'TADS', description: 'Desenvolva aplicações e transforme problemas em soluções digitais com foco em inovação e arquitetura de software moderna.', duration: 6, level: 'Presencial', shift: 'Noturno', lessons: ['Programação e algoritmos', 'Banco de dados', 'Engenharia de software', 'Desenvolvimento web', 'Projeto integrador'] },
  { id: 'redes', title: 'Redes de Computadores', category: 'Tecnologia', abbreviation: 'Redes', description: 'Planeje, implemente e gerencie redes de computadores, serviços de comunicação e infraestrutura em nuvem segura.', duration: 6, level: 'Presencial', shift: 'Matutino', lessons: ['Fundamentos de redes', 'Infraestrutura e serviços', 'Segurança de redes', 'Computação em nuvem', 'Internet das coisas'] },
]
