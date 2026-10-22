import { obterBaseApi, requisitarApi } from '../cliente.js'

export const VERSAO = 'v1'

function urlCoordenadores() {
  return `${obterBaseApi('usuarios', VERSAO)}/coordenadores`
}

export async function listarCoordenadores(token, filtros = {}, sinal) {
  const parametros = new URLSearchParams()
  if (filtros.nome?.trim()) parametros.set('nome', filtros.nome.trim())
  if (filtros.cursoId !== undefined && filtros.cursoId !== null && filtros.cursoId !== '') {
    parametros.set('cursoId', String(filtros.cursoId))
  }
  const query = parametros.size ? `?${parametros}` : ''
  return requisitarApi(`${urlCoordenadores()}/buscar${query}`, { metodo: 'GET', token, sinal })
}

export async function obterCoordenadorPorId(token, id, sinal) {
  return requisitarApi(`${urlCoordenadores()}/${encodeURIComponent(id)}`, {
    metodo: 'GET', token, sinal,
  })
}

export async function cadastrarCoordenador(token, dados, sinal) {
  return requisitarApi(urlCoordenadores(), { metodo: 'POST', corpo: dados, token, sinal })
}

export async function atualizarCoordenador(token, id, dados, sinal) {
  return requisitarApi(`${urlCoordenadores()}/${encodeURIComponent(id)}`, {
    metodo: 'PUT', corpo: dados, token, sinal,
  })
}

export async function excluirCoordenador(token, id, sinal) {
  return requisitarApi(`${urlCoordenadores()}/${encodeURIComponent(id)}`, {
    metodo: 'DELETE', token, sinal,
  })
}

export const moduloCoordenadores = {
  versao: VERSAO,
  listar: listarCoordenadores,
  obterPorId: obterCoordenadorPorId,
  cadastrar: cadastrarCoordenador,
  atualizar: atualizarCoordenador,
  excluir: excluirCoordenador,
}

export default moduloCoordenadores
