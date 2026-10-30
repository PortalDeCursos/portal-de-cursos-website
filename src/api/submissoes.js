import { ErroApi, requisitarApi } from './cliente.js'

export const VERSAO = ''

function obterUrlBaseProjetos() {
  const custom = import.meta.env.VITE_API_PROJETOS_URL
  if (custom) {
    return custom.replace(/\/$/, '')
  }
  const basePortal = import.meta.env.BASE_URL || '/'
  const baseLimpa = basePortal.endsWith('/') ? basePortal : `${basePortal}/`
  const segmentoVersao = VERSAO ? `${VERSAO}/` : ''
  return `${window.location.origin}${baseLimpa}api/${segmentoVersao}projetos`
}

export async function listarSubmissoes(token = null, sinal = null) {
  const endpoint = obterUrlBaseProjetos()
  const dados = await requisitarApi(endpoint, {
    metodo: 'GET',
    token,
    sinal,
  })

  if (!Array.isArray(dados)) {
    throw new ErroApi('A lista de submissões recebida está em um formato inválido.', {
      status: 502,
    })
  }

  return dados
}

export async function obterSubmissaoPorId(id, token = null, sinal = null) {
  const endpoint = obterUrlBaseProjetos()
  return requisitarApi(`${endpoint}/${encodeURIComponent(id)}`, {
    metodo: 'GET',
    token,
    sinal,
  })
}

export const moduloSubmissoes = {
  versao: VERSAO,
  listar: listarSubmissoes,
  obterPorId: obterSubmissaoPorId,
}

export default moduloSubmissoes
