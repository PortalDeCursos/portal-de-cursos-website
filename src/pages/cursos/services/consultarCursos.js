import { listarCursos } from '@/api/cursos.js'

export async function consultarCursos(sinal) {
  return listarCursos(sinal)
}

export default consultarCursos
