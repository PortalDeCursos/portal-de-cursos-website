import { pegarBaseApi } from './cliente.js'

export function pegarEnderecoRecurso(recurso) {
  if (['cursos', 'disciplinas', 'campus', 'areas-conhecimento'].includes(recurso)) {
    return `${pegarBaseApi('academico')}/${recurso}`
  }
  return pegarBaseApi(recurso)
}
