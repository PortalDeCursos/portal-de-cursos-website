import { obterCursoPorId } from '@/api/cursos.js'

export async function consultarDetalhesCurso(identificador, sinal) {
  return obterCursoPorId(identificador, sinal)
}

export default consultarDetalhesCurso
