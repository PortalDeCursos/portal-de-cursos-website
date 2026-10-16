import { api } from '../../../api/index.js'

export async function consultarCursos(sinal) {
  return api.cursos.listar(sinal)
}

export default consultarCursos
