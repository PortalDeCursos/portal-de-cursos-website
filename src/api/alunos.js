import { obterBaseApi, requisitarApi } from './cliente.js'

export const VERSAO = 'v1'

function urlAlunos() {
  return `${obterBaseApi('usuarios', VERSAO)}/alunos`
}

export async function listarAlunos(token, filtros = {}, sinal) {
  const parametros = new URLSearchParams()
  if (filtros.nome?.trim()) parametros.set('nome', filtros.nome.trim())
  if (filtros.cursoId !== undefined && filtros.cursoId !== null && filtros.cursoId !== '') {
    parametros.set('cursoId', String(filtros.cursoId))
  }
  const query = parametros.size ? `?${parametros}` : ''
  return requisitarApi(`${urlAlunos()}/buscar${query}`, { metodo: 'GET', token, sinal })
}

export async function obterAlunoPorId(token, id, sinal) {
  return requisitarApi(`${urlAlunos()}/${encodeURIComponent(id)}`, { metodo: 'GET', token, sinal })
}

export async function cadastrarAluno(dados, sinal) {
  return requisitarApi(urlAlunos(), { metodo: 'POST', corpo: dados, sinal })
}

export async function atualizarAluno(token, id, dados, sinal) {
  return requisitarApi(`${urlAlunos()}/${encodeURIComponent(id)}`, {
    metodo: 'PUT',
    corpo: dados,
    token,
    sinal,
  })
}

export async function excluirAluno(token, id, sinal) {
  return requisitarApi(`${urlAlunos()}/${encodeURIComponent(id)}`, {
    metodo: 'DELETE',
    token,
    sinal,
  })
}

export const moduloAlunos = {
  versao: VERSAO,
  listar: listarAlunos,
  obterPorId: obterAlunoPorId,
  cadastrar: cadastrarAluno,
  atualizar: atualizarAluno,
  excluir: excluirAluno,
}

export default moduloAlunos
