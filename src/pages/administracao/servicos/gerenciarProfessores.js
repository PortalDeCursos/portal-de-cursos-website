import { api } from '../../../api/index.js'

export async function listarProfessores(token, sinal) {
  return api.professores.listar(token, sinal)
}

export async function cadastrarProfessor(token, dados) {
  return api.professores.cadastrar(token, dados)
}

export async function excluirProfessor(token, id) {
  return api.professores.excluir(token, id)
}

export default {
  listarProfessores,
  cadastrarProfessor,
  excluirProfessor,
}
