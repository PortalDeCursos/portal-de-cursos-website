import { ErroApi, requisitarApi } from '../cliente.js'

export const VERSAO = 'v1'

export async function listarCursos(sinal) {
  const endereco = import.meta.env.VITE_API_CURSOS || `${import.meta.env.BASE_URL}data/cursos.json`

  const dados = await requisitarApi(endereco, {
    metodo: 'GET',
    sinal,
  })

  if (
    !Array.isArray(dados) ||
    dados.some((curso) => !curso.identificador || !curso.nome || !curso.sigla)
  ) {
    throw new ErroApi('O catálogo recebido está em um formato inválido.', { status: 502 })
  }

  return dados
}

export async function obterCursoPorId(identificador, sinal) {
  const base = import.meta.env.VITE_API_DETALHES_CURSO
  const endereco = base
    ? `${base.replace(/\/$/, '')}/${encodeURIComponent(identificador)}`
    : `${import.meta.env.BASE_URL}data/detalhes-cursos.json`

  const dados = await requisitarApi(endereco, {
    metodo: 'GET',
    sinal,
  })

  const curso = Array.isArray(dados)
    ? dados.find((item) => item.identificador === identificador)
    : dados

  if (!curso || curso.identificador !== identificador) {
    throw new ErroApi('Curso não encontrado.', { status: 404 })
  }

  if (typeof curso.nome !== 'string' || !curso.sigla) {
    throw new ErroApi('Os dados do curso estão em um formato inválido.', { status: 502 })
  }

  return curso
}

export const moduloCursos = {
  versao: VERSAO,
  listar: listarCursos,
  obterPorId: obterCursoPorId,
}

export default moduloCursos
