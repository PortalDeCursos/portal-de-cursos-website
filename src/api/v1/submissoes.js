import { submissoes as dadosLocais } from '../../data/submissoes.js'
import { ErroApi, requisitarApi } from '../cliente.js'

export const VERSAO = 'v1'

export async function listarSubmissoes(sinal) {
  const endpoint = import.meta.env.VITE_API_SUBMISSOES
  if (!endpoint) {
    return [...dadosLocais]
  }

  const dados = await requisitarApi(endpoint, {
    metodo: 'GET',
    sinal,
  })

  if (!Array.isArray(dados)) {
    throw new ErroApi('A lista de submissões recebida está em um formato inválido.', {
      status: 502,
    })
  }

  return dados
}

export async function obterSubmissaoPorId(id, sinal) {
  const endpoint = import.meta.env.VITE_API_SUBMISSOES
  if (!endpoint) {
    const item = dadosLocais.find((submissao) => submissao.identificador === id)
    if (!item) {
      throw new ErroApi('Submissão não encontrada.', { status: 404 })
    }
    return item
  }

  return requisitarApi(`${endpoint.replace(/\/$/, '')}/${encodeURIComponent(id)}`, {
    metodo: 'GET',
    sinal,
  })
}

export const moduloSubmissoes = {
  versao: VERSAO,
  listar: listarSubmissoes,
  obterPorId: obterSubmissaoPorId,
}

export default moduloSubmissoes
