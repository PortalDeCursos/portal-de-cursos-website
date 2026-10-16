import { moduloAutenticacao } from './autenticacao.js'
import { moduloUsuarios } from './usuarios.js'
import { moduloProfessores } from './professores.js'
import { moduloCursos } from './cursos.js'
import { moduloSubmissoes } from './submissoes.js'

export const VERSAO = 'v1'

export { moduloAutenticacao, moduloUsuarios, moduloProfessores, moduloCursos, moduloSubmissoes }

export const apiV1 = {
  versao: VERSAO,
  auth: moduloAutenticacao,
  usuarios: moduloUsuarios,
  professores: moduloProfessores,
  cursos: moduloCursos,
  submissoes: moduloSubmissoes,
}

export default apiV1
