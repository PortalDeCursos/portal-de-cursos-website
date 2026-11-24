import { MODULOS } from './config.js'
import { repetirConsulta } from './repetirConsulta.js'
import { limparSessao, pegarSessao } from './sessaoMemoria.js'

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

export function pegarBaseApi(modulo = 'usuarios') {
  return MODULOS[modulo] || `${MODULOS.usuarios.replace(/\/usuarios$/, '')}/${modulo}`
}

export function chamarApi(caminhoCompletoOuRelativo, opcoes = {}) {
  return repetirConsulta(() => chamarUmaVez(caminhoCompletoOuRelativo, opcoes), opcoes)
}

async function chamarUmaVez(caminhoCompletoOuRelativo, opcoes = {}) {
  const {
    metodo = 'GET',
    corpo = null,
    token = null,
    publico = false,
    headers = {},
    sinal = null,
    tempoLimiteMs = 15000,
    formatoResposta = 'json',
  } = opcoes

  const tokenFinal = publico ? null : token || pegarSessao()?.token || null
  const multipart = corpo instanceof FormData
  const possuiCorpo = corpo !== null && corpo !== undefined
  const cabecalhos = {
    Accept: 'application/json',
    ...(possuiCorpo && !multipart ? { 'Content-Type': 'application/json' } : {}),
    ...(tokenFinal ? { Authorization: `Bearer ${tokenFinal}` } : {}),
    ...headers,
  }

  const controle = new AbortController()
  let expirouTempo = false
  const temporizador = setTimeout(() => {
    expirouTempo = true
    controle.abort()
  }, tempoLimiteMs)

  function aoAbortarExterno() {
    controle.abort(sinal?.reason)
  }

  if (sinal) {
    if (sinal.aborted) {
      clearTimeout(temporizador)
      controle.abort(sinal.reason)
    } else {
      sinal.addEventListener('abort', aoAbortarExterno, { once: true })
    }
  }

  let resposta
  try {
    resposta = await fetch(caminhoCompletoOuRelativo, {
      method: metodo,
      headers: cabecalhos,
      body: possuiCorpo ? (multipart ? corpo : JSON.stringify(corpo)) : undefined,
      signal: controle.signal,
      credentials: 'omit',
      cache: 'no-store',
    })
  } catch (falha) {
    if (sinal?.aborted) {
      throw falha
    }
    if (expirouTempo) {
      throw new ErroApi('A operação demorou mais que o esperado. Tente novamente.', {
        status: 408,
        causa: falha,
      })
    }
    throw new ErroApi('Sem conexão no momento. Verifique sua internet e tente novamente.', {
      causa: falha,
    })
  } finally {
    clearTimeout(temporizador)
    if (sinal) {
      sinal.removeEventListener('abort', aoAbortarExterno)
    }
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
    if (resposta.status === 401 && tokenFinal) {
      limparSessao()
      window.dispatchEvent(new CustomEvent('portal-sessao-expirada'))
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
      mensagem = tokenFinal
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
