import {
  definirVersaoApi,
  ErroApi,
  obterBaseApi,
  obterVersaoApi,
  requisitarApi,
  VERSAO_PADRAO_API,
} from './cliente.js'
import {
  apiV1,
  moduloAutenticacao,
  moduloCursos,
  moduloDisciplinas,
  moduloProfessores,
  moduloSubmissoes,
  moduloUsuarios,
  moduloAlunos,
  moduloCoordenadores,
} from './v1/index.js'

/**
 * Registro de versões disponíveis da API.
 * Novas versões (ex: v2) podem ser registradas modularmente.
 */
export const versoesDisponiveis = {
  v1: apiV1,
}

/**
 * Carrega um módulo da API pela versão desejada ou ativa.
 *
 * @param {'auth'|'autenticacao'|'usuarios'|'professores'|'cursos'|'submissoes'} nomeModulo
 * @param {string} [versao] - Versão da API (padrão: versão ativa)
 * @returns {any} Módulo modularizado da API
 */
export function carregarModuloApi(nomeModulo, versao = obterVersaoApi()) {
  const apiVersao = versoesDisponiveis[versao]
  if (!apiVersao) {
    throw new ErroApi(`Versão "${versao}" da API não está disponível.`, { status: 404 })
  }

  const alias = nomeModulo === 'autenticacao' ? 'auth' : nomeModulo
  const modulo = apiVersao[alias]
  if (!modulo) {
    throw new ErroApi(`Módulo "${nomeModulo}" não encontrado na API versão ${versao}.`, {
      status: 404,
    })
  }
  return modulo
}

/**
 * Instância ativa da API modularizada.
 * Por padrão expõe os módulos da versão ativa configurada (ex: v1).
 */
export const api = {
  get versao() {
    return obterVersaoApi()
  },
  definirVersao: definirVersaoApi,
  carregarModulo: carregarModuloApi,
  v1: apiV1,
  auth: moduloAutenticacao,
  usuarios: moduloUsuarios,
  professores: moduloProfessores,
  cursos: moduloCursos,
  disciplinas: moduloDisciplinas,
  submissoes: moduloSubmissoes,
  alunos: moduloAlunos,
  coordenadores: moduloCoordenadores,
}

export {
  VERSAO_PADRAO_API,
  obterVersaoApi,
  definirVersaoApi,
  obterBaseApi,
  requisitarApi,
  ErroApi,
  apiV1,
  moduloAutenticacao,
  moduloUsuarios,
  moduloAlunos,
  moduloCoordenadores,
  moduloProfessores,
  moduloCursos,
  moduloDisciplinas,
  moduloSubmissoes,
}

export default api
