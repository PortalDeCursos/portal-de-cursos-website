import { moduloAutenticacao } from './autenticacao.js'
import { moduloUsuarios } from './usuarios.js'
import { moduloProfessores } from './professores.js'
import { moduloCursos } from './cursos.js'
import { moduloDisciplinas } from './disciplinas.js'
import { moduloSubmissoes } from './submissoes.js'
import { moduloAlunos } from './alunos.js'
import { moduloCoordenadores } from './coordenadores.js'

export const VERSAO = 'v1'

export {
  moduloAutenticacao,
  moduloUsuarios,
  moduloProfessores,
  moduloCursos,
  moduloDisciplinas,
  moduloSubmissoes,
  moduloAlunos,
  moduloCoordenadores,
}

export const apiV1 = {
  versao: VERSAO,
  auth: moduloAutenticacao,
  usuarios: moduloUsuarios,
  professores: moduloProfessores,
  cursos: moduloCursos,
  disciplinas: moduloDisciplinas,
  submissoes: moduloSubmissoes,
  alunos: moduloAlunos,
  coordenadores: moduloCoordenadores,
}

export default apiV1
