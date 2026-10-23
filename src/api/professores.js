import { ErroApi, obterBaseApi, requisitarApi } from './cliente.js'

export const VERSAO = 'v1'

export function formatarPerfilProfessor(item) {
  return {
    id: item.id,
    nome: item.usuario?.nome || 'Sem nome',
    email: item.usuario?.email || '',
    cursoId: item.cursoId,
    titulacao: item.titulacao || '',
    descricao: item.descricao || '',
  }
}

export async function listarProfessores(token, filtros = {}, sinal) {
  if (typeof filtros?.addEventListener === 'function' && sinal === undefined) {
    sinal = filtros
    filtros = {}
  }
  const base = obterBaseApi('usuarios', VERSAO)
  const parametros = new URLSearchParams()
  if (filtros.nome?.trim()) parametros.set('nome', filtros.nome.trim())
  if (filtros.titulacao) parametros.set('titulacao', filtros.titulacao)
  const query = parametros.size ? `?${parametros}` : ''
  const dados = await requisitarApi(`${base}/professores/buscar${query}`, {
    metodo: 'GET',
    token,
    sinal,
  })

  if (!Array.isArray(dados)) {
    throw new ErroApi('A lista de professores recebida é inválida.', { status: 502 })
  }

  return dados.map(formatarPerfilProfessor)
}

export async function obterProfessorPorId(token, id, sinal) {
  const base = obterBaseApi('usuarios', VERSAO)
  return requisitarApi(`${base}/professores/${encodeURIComponent(id)}`, {
    metodo: 'GET',
    token,
    sinal,
  })
}

export async function cadastrarProfessor(token, dados, sinal) {
  const base = obterBaseApi('usuarios', VERSAO)
  const resposta = await requisitarApi(`${base}/professores`, {
    metodo: 'POST',
    corpo: dados,
    token,
    sinal,
  })

  return formatarPerfilProfessor(resposta)
}

export async function excluirProfessor(token, id, sinal) {
  const base = obterBaseApi('usuarios', VERSAO)
  return requisitarApi(`${base}/professores/${encodeURIComponent(id)}`, {
    metodo: 'DELETE',
    token,
    sinal,
  })
}

export async function atualizarProfessor(token, id, dados, sinal) {
  const base = obterBaseApi('usuarios', VERSAO)
  const resposta = await requisitarApi(`${base}/professores/${encodeURIComponent(id)}`, {
    metodo: 'PUT',
    corpo: dados,
    token,
    sinal,
  })
  return formatarPerfilProfessor(resposta)
}

export const moduloProfessores = {
  versao: VERSAO,
  listar: listarProfessores,
  obterPorId: obterProfessorPorId,
  cadastrar: cadastrarProfessor,
  atualizar: atualizarProfessor,
  excluir: excluirProfessor,
  formatarPerfil: formatarPerfilProfessor,
}

export default moduloProfessores
