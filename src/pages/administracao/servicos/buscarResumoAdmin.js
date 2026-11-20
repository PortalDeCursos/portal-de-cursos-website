import { listarAreasConhecimento, listarCampus, listarCursos } from '@/api/cursos.js'
import { listarDisciplinasPorCurso } from '@/api/disciplinas.js'

export async function buscarResumoAdmin(token, sinal) {
  const [cursos, campus, areas] = await Promise.all([
    listarCursos(sinal),
    listarCampus(sinal, token),
    listarAreasConhecimento(sinal, token),
  ])

  const disciplinasPorCurso = await Promise.all(
    cursos.map((curso) => listarDisciplinasPorCurso(curso.id, token, sinal)),
  )

  return {
    cursos,
    disciplinas: disciplinasPorCurso.flat(),
    campus,
    areas,
  }
}
