import { chamarApi, pegarBaseApi } from './cliente.js'

function urlFotos() {
  return `${pegarBaseApi('usuarios')}/fotos`
}

export async function buscarFotoUsuario(usuarioId, sinal = null, token = null) {
  return chamarApi(`${urlFotos()}/${encodeURIComponent(usuarioId)}`, {
    metodo: 'GET',
    token,
    publico: !token,
    formatoResposta: 'blob',
    sinal,
    headers: { Accept: 'image/*' },
  })
}

export async function salvarFotoUsuario(usuarioId, arquivo, { atualizar = false, token = null, sinal = null } = {}) {
  const corpo = new FormData()
  corpo.append('usuarioId', String(usuarioId))
  corpo.append('foto', arquivo)

  const metodo = atualizar ? 'PUT' : 'POST'
  try {
    return await chamarApi(urlFotos(), { metodo, corpo, token, sinal })
  } catch (falha) {
    if (!atualizar && falha?.status === 409) {
      return chamarApi(urlFotos(), { metodo: 'PUT', corpo, token, sinal })
    }
    throw falha
  }
}
