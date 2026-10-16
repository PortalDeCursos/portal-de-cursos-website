import { ErroApi, obterBaseApi, requisitarApi } from '../cliente.js'

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

export async function listarProfessores(token, sinal) {
  const base = obterBaseApi('usuarios', VERSAO)
  const dados = await requisitarApi(`${base}/professores/buscar`, {
    metodo: 'GET',
    token,
    sinal,
  })

  if (!Array.isArray(dados)) {
    throw new ErroApi('A lista de professores recebida é inválida.', { status: 502 })
  }

  return dados.map(formatarPerfilProfessor)
}

export async function cadastrarProfessor(token, dados) {
  const base = obterBaseApi('usuarios', VERSAO)
  const resposta = await requisitarApi(`${base}/professores`, {
    metodo: 'POST',
    corpo: dados,
    token,
  })

  return formatarPerfilProfessor(resposta)
}

export async function excluirProfessor(token, id) {
  const base = obterBaseApi('usuarios', VERSAO)
  return requisitarApi(`${base}/professores/${encodeURIComponent(id)}`, {
    metodo: 'DELETE',
    token,
  })
}

export const moduloProfessores = {
  versao: VERSAO,
  listar: listarProfessores,
  cadastrar: cadastrarProfessor,
  excluir: excluirProfessor,
  formatarPerfil: formatarPerfilProfessor,
}

export default moduloProfessores
