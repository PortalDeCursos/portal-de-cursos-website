import { api } from '../../../api/index.js'

export async function consultarDetalhesCurso(identificador, sinal) {
  return api.cursos.obterPorId(identificador, sinal)
}

export default consultarDetalhesCurso
