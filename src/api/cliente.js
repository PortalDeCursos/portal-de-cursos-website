export const VERSAO_PADRAO_API = 'v1'

let versaoAtiva = import.meta.env.VITE_API_VERSAO || VERSAO_PADRAO_API

export function obterVersaoApi() {
  return versaoAtiva
}

export function definirVersaoApi(novaVersao) {
  if (typeof novaVersao === 'string' && novaVersao.trim()) {
    versaoAtiva = novaVersao.trim()
  }
}

export class ErroApi extends Error {
  constructor(mensagem, { status = 0, dados = null, causa = null } = {}) {
    super(mensagem)
    this.name = 'ErroApi'
    this.status = status
    this.dados = dados
    this.causa = causa
  }
}

export function obterBaseApi(modulo = 'usuarios', versao = versaoAtiva) {
  const customizada = import.meta.env.VITE_API_AUTENTICACAO
  if (customizada && modulo === 'usuarios') {
    try {
      const url = new URL(customizada, window.location.origin)
      url.pathname = url.pathname.replace(/\/auth\/login$/, '')
      url.search = ''
      url.hash = ''
      return url.href.replace(/\/$/, '')
    } catch {
      /* Segue com o caminho padrão versionado abaixo */
    }
  }

  const basePortal = import.meta.env.BASE_URL || '/'
  const baseLimpa = basePortal.endsWith('/') ? basePortal : `${basePortal}/`
  return `${window.location.origin}${baseLimpa}api/${versao}/${modulo}`
}

export async function requisitarApi(caminhoCompletoOuRelativo, opcoes = {}) {
  const {
    metodo = 'GET',
    corpo = null,
    token = null,
    headers = {},
    sinal = null,
    tempoLimiteMs = 15000,
  } = opcoes

  const cabecalhos = {
    Accept: 'application/json',
    ...(corpo ? { 'Content-Type': 'application/json' } : {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...headers,
  }

  const sinaisCancelamento = [AbortSignal.timeout(tempoLimiteMs)]
  if (sinal) sinaisCancelamento.push(sinal)
  const sinalCombinado = AbortSignal.any(sinaisCancelamento)

  let resposta
  try {
    resposta = await fetch(caminhoCompletoOuRelativo, {
      method: metodo,
      headers: cabecalhos,
      body: corpo ? JSON.stringify(corpo) : undefined,
      signal: sinalCombinado,
      credentials: 'omit',
      cache: 'no-store',
    })
  } catch (falha) {
    if (falha.name === 'AbortError' && sinal?.aborted) {
      throw falha
    }
    if (sinalCombinado.aborted && !sinal?.aborted) {
      throw new ErroApi('O serviço demorou para responder. Tente novamente em instantes.', {
        status: 408,
        causa: falha,
      })
    }
    throw new ErroApi(
      'Não foi possível conectar ao serviço. Verifique sua conexão e tente novamente.',
      { causa: falha },
    )
  }

  if (resposta.status === 204) {
    return null
  }

  let dados = null
  const tipoConteudo = resposta.headers.get('content-type') || ''
  if (tipoConteudo.includes('json')) {
    try {
      dados = await resposta.json()
    } catch (falhaJson) {
      throw new ErroApi('O serviço retornou uma resposta inesperada.', {
        status: resposta.status,
        causa: falhaJson,
      })
    }
  }

  if (!resposta.ok) {
    let mensagem = 'Ocorreu um erro ao comunicar com a API.'
    if (resposta.status < 500) {
      mensagem =
        (typeof dados?.detail === 'string' && dados.detail) ||
        (typeof dados?.title === 'string' && dados.title) ||
        mensagem
    }
    if (resposta.status === 401) {
      mensagem = 'Sua autenticação não foi aceita. Verifique seus dados ou faça login novamente.'
    } else if (resposta.status === 403) {
      mensagem = 'Sua conta não tem permissão para realizar esta operação.'
    } else if (resposta.status === 404) {
      mensagem = 'O recurso solicitado não foi encontrado.'
    } else if (resposta.status === 429) {
      mensagem = 'Muitas requisições. Aguarde um momento antes de tentar novamente.'
    } else if (resposta.status >= 500) {
      mensagem = 'O serviço está temporariamente indisponível. Tente novamente em breve.'
    }
    throw new ErroApi(mensagem, { status: resposta.status, dados })
  }

  return dados
}
