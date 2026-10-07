import test from 'node:test'
import assert from 'node:assert/strict'
import { filterCourses, normalizeSearch, activeFilterCount } from '../src/features/courses/utils/filterCourses.ts'
const data = [
  { title: 'Análise e Desenvolvimento de Sistemas', abbreviation: 'TADS', category: 'Tecnologia', duration: 6, degree: 'Tecnologia', level: 'Presencial', shift: 'Noturno', campus: 'Campus Central', area: 'Exatas e Tecnologia' },
  { title: 'Redes de Computadores', abbreviation: 'Redes', category: 'Tecnologia', duration: 6, degree: 'Tecnologia', level: 'Presencial', shift: 'Matutino', campus: 'Campus Central', area: 'Exatas e Tecnologia' },
  { title: 'Engenharia de Software', abbreviation: 'ES', category: 'Tecnologia', duration: 10, degree: 'Bacharelado', level: 'Presencial', shift: 'Integral', campus: 'Campus Central', area: 'Engenharias e Produção' },
]
const clear = { query: '', degree: '', modality: '', shift: '', campus: '', areas: [], durations: [] }
test('busca ignora acentos e espaços nas extremidades', () => {
  assert.equal(normalizeSearch('  ANÁLISE  '), 'analise')
  assert.equal(filterCourses(data, { ...clear, query: 'analise sistemas' }).length, 1)
})
test('busca inclui sigla do curso', () => assert.equal(filterCourses(data, { ...clear, query: 'tads' })[0].abbreviation, 'TADS'))
test('filtros se combinam e respeitam modalidade e turno', () => {
  assert.equal(filterCourses(data, { ...clear, degree: 'Tecnologia', modality: 'Presencial', shift: 'Matutino' })[0].abbreviation, 'Redes')
  assert.equal(filterCourses(data, { ...clear, modality: 'Online' }).length, 0)
})
test('área e duração trabalham em conjunto', () => assert.equal(filterCourses(data, { ...clear, areas: ['Engenharias e Produção'], durations: ['long'] })[0].abbreviation, 'ES'))
test('busca inexistente não retorna cursos e limpar recupera catálogo', () => {
  assert.equal(filterCourses(data, { ...clear, query: 'Inteligência Artificial Quântica' }).length, 0)
  assert.equal(filterCourses(data, clear).length, 3)
})
test('contador inclui cada filtro ativo e ignora termo vazio', () => assert.equal(activeFilterCount({ ...clear, query: '  ', degree: 'Graduação', areas: ['Exatas e Tecnologia'], durations: ['medium'] }), 3))

test('projetos são isolados por curso e categoria', async () => {
  const { filterCourseProjects } = await import('../src/features/projects/utils/filterProjects.ts')
  const projects = [{ courseId: 'tads', category: 'TCC', id: 'a' }, { courseId: 'redes', category: 'Pesquisa', id: 'b' }, { courseId: 'tads', category: 'Projeto integrador', id: 'c' }]
  assert.deepEqual(filterCourseProjects(projects, 'tads').map(project => project.id), ['a', 'c'])
  assert.equal(filterCourseProjects(projects, 'tads', 'Pesquisa').length, 0)
  assert.equal(filterCourseProjects(projects, 'redes', 'Pesquisa')[0].id, 'b')
  assert.equal(filterCourseProjects(projects, 'computacao').length, 0)
})
