import { ErroApi, requisitarApi } from './cliente.js'

export const VERSAO = 'v1'

export async function listarSubmissoes(sinal) {
  const endpoint = import.meta.env.VITE_API_SUBMISSOES
  if (!endpoint) {
    return []
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
    throw new ErroApi('O serviço de submissões ainda não está conectado.', { status: 503 })
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
