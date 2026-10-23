import { requisitarApi } from './cliente.js'

export const VERSAO = 'v1'
const enderecoDisciplinas =
  import.meta.env.VITE_API_DISCIPLINAS_URL ||
  import.meta.env.VITE_API_DISCIPLINAS ||
  `${import.meta.env.BASE_URL}api/v1/disciplinas`

export async function listarDisciplinasPorCurso(cursoId, token, sinal) {
  const query = new URLSearchParams({ cursoId: String(cursoId) })
  const dados = await requisitarApi(`${enderecoDisciplinas}?${query}`, {
    metodo: 'GET',
    token,
    sinal,
  })
  if (!Array.isArray(dados)) return []
  const semestres = [
    'PRIMEIRO',
    'SEGUNDO',
    'TERCEIRO',
    'QUARTO',
    'QUINTO',
    'SEXTO',
    'SETIMO',
    'OITAVO',
    'NONO',
    'DECIMO',
  ]
  return dados.map((disciplina) => ({
    ...disciplina,
    cursoId: disciplina.cursoId ?? Number(cursoId),
    identificador: String(disciplina.id),
    semestreNumero: semestres.indexOf(disciplina.semestre) + 1,
    tipo: disciplina.obrigatoria ? 'Obrigatória' : 'Optativa',
  }))
}

export async function cadastrarDisciplina(token, dados, sinal) {
  return requisitarApi(enderecoDisciplinas, { metodo: 'POST', corpo: dados, token, sinal })
}

export async function atualizarDisciplina(token, id, dados, sinal) {
  return requisitarApi(`${enderecoDisciplinas.replace(/\/$/, '')}/${encodeURIComponent(id)}`, {
    metodo: 'PUT',
    corpo: dados,
    token,
    sinal,
  })
}

export async function excluirDisciplina(token, id, sinal) {
  return requisitarApi(`${enderecoDisciplinas.replace(/\/$/, '')}/${encodeURIComponent(id)}`, {
    metodo: 'DELETE',
    token,
    sinal,
  })
}

export const moduloDisciplinas = {
  versao: VERSAO,
  listarPorCurso: listarDisciplinasPorCurso,
  cadastrar: cadastrarDisciplina,
  atualizar: atualizarDisciplina,
  excluir: excluirDisciplina,
}

export default moduloDisciplinas
