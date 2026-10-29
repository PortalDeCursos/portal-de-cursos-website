import { ErroApi, requisitarApi } from './cliente.js'

export const VERSAO = 'v1'

export const STATUS_PROJETO = {
  EM_ANALISE: 'EM_ANALISE',
  APROVADO: 'APROVADO',
  RECUSADO: 'RECUSADO',
  ANALISE_PUBLICACAO: 'ANALISE_PUBLICACAO',
  PUBLICADO: 'PUBLICADO',
  RECUSADO_PUBLICACAO: 'RECUSADO_PUBLICACAO',
  REVISAO: 'REVISAO',
}

export const TIPO_PROJETO = {
  TCC: 'TCC',
  PROJETO_INTEGRADOR: 'PROJETO_INTEGRADOR',
  PROJETO_PESQUISA: 'PROJETO_PESQUISA',
  PROJETO_EXTENSAO: 'PROJETO_EXTENSAO',
  OUTROS: 'OUTROS',
}

function obterUrlBaseProjetos() {
  const custom = import.meta.env.VITE_API_PROJETOS_URL
  if (custom) {
    return custom.replace(/\/$/, '')
  }
  const basePortal = import.meta.env.BASE_URL || '/'
  const baseLimpa = basePortal.endsWith('/') ? basePortal : `${basePortal}/`
  return `${window.location.origin}${baseLimpa}api/${VERSAO}/projetos`
}

/**
 * Lista todos os projetos acadêmicos cadastrados no microsserviço
 */
export async function listarProjetos(sinal) {
  const url = obterUrlBaseProjetos()
  const dados = await requisitarApi(url, {
    metodo: 'GET',
    sinal,
  })

  if (!Array.isArray(dados)) {
    throw new ErroApi('A resposta da listagem de projetos é inválida.', { status: 502 })
  }

  return dados
}

/**
 * Busca os dados de um projeto específico por ID
 */
export async function obterProjetoPorId(id, sinal) {
  const url = `${obterUrlBaseProjetos()}/${encodeURIComponent(id)}`
  return requisitarApi(url, {
    metodo: 'GET',
    sinal,
  })
}

/**
 * Cadastra um novo projeto no microsserviço de projetos
 * @param {Object} projeto - DTO com { cursoId, orientadorId, autores, disciplinaIds, nome, descricao, tipoProjeto, arquivoPdf }
 */
export async function cadastrarProjeto(projeto, token = null, sinal = null) {
  const url = obterUrlBaseProjetos()
  return requisitarApi(url, {
    metodo: 'POST',
    corpo: projeto,
    token,
    sinal,
  })
}

/**
 * Atualiza os dados de um projeto existente
 */
export async function atualizarProjeto(id, projeto, token = null, sinal = null) {
  const url = `${obterUrlBaseProjetos()}/${encodeURIComponent(id)}`
  return requisitarApi(url, {
    metodo: 'PUT',
    corpo: projeto,
    token,
    sinal,
  })
}

/**
 * Altera o status de avaliação ou publicação de um projeto
 * @param {number|string} id
 * @param {string} status - Um dos valores de STATUS_PROJETO
 */
export async function atualizarStatusProjeto(id, status, token = null, sinal = null) {
  const url = `${obterUrlBaseProjetos()}/${encodeURIComponent(id)}/status`
  return requisitarApi(url, {
    metodo: 'PUT',
    corpo: { statusProjeto: status },
    token,
    sinal,
  })
}

/**
 * Remove um projeto pelo ID
 */
export async function excluirProjeto(id, token = null, sinal = null) {
  const url = `${obterUrlBaseProjetos()}/${encodeURIComponent(id)}`
  return requisitarApi(url, {
    metodo: 'DELETE',
    token,
    sinal,
  })
}

export const moduloProjetos = {
  versao: VERSAO,
  listar: listarProjetos,
  obterPorId: obterProjetoPorId,
  cadastrar: cadastrarProjeto,
  atualizar: atualizarProjeto,
  atualizarStatus: atualizarStatusProjeto,
  excluir: excluirProjeto,
}

export default moduloProjetos
