export const VERSAO_PADRAO_API = ''

let versaoAtiva = import.meta.env.VITE_API_VERSAO || VERSAO_PADRAO_API

export function pegarVersaoApi() {
  return versaoAtiva
}

export function mudarVersaoApi(novaVersao) {
  if (typeof novaVersao === 'string') {
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
    this.detalhe = dados?.detail || null
    this.titulo = dados?.title || null
    this.errosValidacao = dados?.errors || null
  }
}

export function pegarBaseApi(modulo = 'usuarios', versao = versaoAtiva) {
  const basePortal = import.meta.env.BASE_URL || '/'
  const baseLimpa = basePortal.endsWith('/') ? basePortal : `${basePortal}/`
  const segmentoVersao = versao ? `${versao}/` : ''
  return `${window.location.origin}${baseLimpa}api/${segmentoVersao}${modulo}`
}

export async function chamarApi(caminhoCompletoOuRelativo, opcoes = {}) {
  const {
    metodo = 'GET',
    corpo = null,
    token = null,
    headers = {},
    sinal = null,
    tempoLimiteMs = 15000,
    formatoResposta = 'json',
  } = opcoes

  const multipart = corpo instanceof FormData
  const possuiCorpo = corpo !== null && corpo !== undefined
  const cabecalhos = {
    Accept: 'application/json',
    ...(possuiCorpo && !multipart ? { 'Content-Type': 'application/json' } : {}),
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
      body: possuiCorpo ? (multipart ? corpo : JSON.stringify(corpo)) : undefined,
      signal: sinalCombinado,
      credentials: 'omit',
      cache: 'no-store',
    })
  } catch (falha) {
    if (falha.name === 'AbortError' && sinal?.aborted) {
      throw falha
    }
    if (sinalCombinado.aborted && !sinal?.aborted) {
      throw new ErroApi('A operação demorou mais que o esperado. Tente novamente.', {
        status: 408,
        causa: falha,
      })
    }
    throw new ErroApi(
      'Sem conexão no momento. Verifique sua internet e tente novamente.',
      { causa: falha },
    )
  }

  if (resposta.status === 204) {
    return null
  }

  if (resposta.ok && formatoResposta === 'blob') return resposta.blob()

  let dados = null
  const tipoConteudo = resposta.headers.get('content-type') || ''
  if (tipoConteudo.includes('json')) {
    try {
      dados = await resposta.json()
    } catch (falhaJson) {
      throw new ErroApi('Não foi possível concluir a ação agora. Tente novamente.', {
        status: resposta.status,
        causa: falhaJson,
      })
    }
  }

  if (!resposta.ok) {
    // Tratamento global para 401: notifica aplicação para limpar sessão e redirecionar ao login
    if (resposta.status === 401 && token) {
      try {
        sessionStorage.removeItem('portal-cursos-sessao')
        window.dispatchEvent(new CustomEvent('portal-sessao-expirada'))
      } catch {
        /* storage bloqueado */
      }
    }

    let mensagem = 'Não foi possível completar sua solicitação. Tente novamente.'

    if (dados?.detail && typeof dados.detail === 'string') {
      mensagem = dados.detail
    } else if (dados?.title && typeof dados.title === 'string') {
      mensagem = dados.title
    }

    if (dados?.errors && typeof dados.errors === 'object' && Object.keys(dados.errors).length > 0) {
      const msgs = Object.values(dados.errors)
      mensagem = msgs.join('. ')
    }

    if (resposta.status === 401) {
      mensagem = token
        ? 'Sua sessão expirou. Entre novamente.'
        : 'E-mail ou senha incorretos.'
    } else if (resposta.status === 403) {
      mensagem = 'Sua conta não tem permissão para realizar esta operação.'
    } else if (resposta.status === 404 && !dados?.detail) {
      mensagem = 'Este item não foi encontrado ou foi removido.'
    } else if (resposta.status === 429) {
      mensagem = 'Muitas tentativas seguidas. Aguarde alguns instantes.'
    } else if (resposta.status >= 500 && !dados?.detail) {
      mensagem = 'Sistema temporariamente indisponível. Tente novamente em instantes.'
    }

    throw new ErroApi(mensagem, { status: resposta.status, dados })
  }

  return dados
}
