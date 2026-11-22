import { projetoEstaPublicado } from '@/shared/utils/contratoProjetos.js'
import { listarCursos } from '@/api/cursos.js'
import { listarProfessores } from '@/api/professores.js'
import { listarProjetos } from '@/api/projetos.js'

const ROTULOS_TIPO = {
  TCC: 'TCC',
  PROJETO_INTEGRADOR: 'Projeto integrador',
  PROJETO_PESQUISA: 'Pesquisa',
  PROJETO_EXTENSAO: 'Extensão',
}

export async function buscarProjetosPublicados(sinal, aoAvisos = () => {}, consultas = {}) {
  async function consultar(chave, carregar) {
    if (Object.hasOwn(consultas, chave)) return consultas[chave]
    const dados = await carregar()
    sinal?.throwIfAborted()
    consultas[chave] = dados
    return dados
  }
  const [dadosProjetos, dadosCursos, dadosProfessores] = await Promise.all([
    consultar('projetos', () => listarProjetos(null, sinal)),
    consultar('cursos', () => listarCursos(sinal)).catch(() => {
      aoAvisos('Não foi possível carregar os cursos. Tente novamente para completar os dados.')
      return []
    }),
    consultar('professores', () => listarProfessores(null, {}, sinal)).catch(() => {
      aoAvisos(
        'Não foi possível carregar os orientadores. Tente novamente para completar os dados.',
      )
      return []
    }),
  ])

  const mapaCursos = new Map(
    (Array.isArray(dadosCursos) ? dadosCursos : []).map((c) => [String(c.id), c]),
  )
  const mapaProfessores = new Map(
    (Array.isArray(dadosProfessores) ? dadosProfessores : []).map((prof) => [
      String(prof.id),
      prof.nome || prof.usuario?.nome || '',
    ]),
  )

  const listaBruta = Array.isArray(dadosProjetos) ? dadosProjetos : []
  const publicadosValidos = listaBruta.filter(projetoEstaPublicado).map((p) => {
    const idCurso = p.cursoId ? String(p.cursoId) : null
    const infoCurso = idCurso ? mapaCursos.get(idCurso) : null

    let nomeCurso = ''
    if (infoCurso?.sigla) nomeCurso = infoCurso.sigla
    else if (infoCurso?.acronimo) nomeCurso = infoCurso.acronimo
    else if (infoCurso?.nome) nomeCurso = infoCurso.nome
    else if (p.curso && !/^#?\d+$/.test(String(p.curso).trim())) {
      nomeCurso = String(p.curso)
        .replace(/^Curso\s*#?/i, '')
        .trim()
    } else if (idCurso) {
      nomeCurso = `Curso ${idCurso}`
    }

    const orientadorVinculo = p.professores?.find((prof) => prof.papel === 'ORIENTADOR')
    const idProf =
      orientadorVinculo?.professorId || p.orientadorId || p.professores?.[0]?.professorId
    const nomeOrientador =
      p.orientador ||
      (idProf && mapaProfessores.get(String(idProf))) ||
      orientadorVinculo?.nome ||
      'Orientação acadêmica'

    return {
      id: p.id,
      identificador: String(p.id),
      nome: p.nome,
      descricao: p.descricao || p.resumo || '',
      resumo: p.resumo || '',
      tipo: ROTULOS_TIPO[p.tipoProjeto] || p.tipoProjeto || 'TCC',
      curso: nomeCurso || 'Geral',
      autores:
        Array.isArray(p.autores) && p.autores.length
          ? p.autores.map((a) => (typeof a === 'string' ? a : a.nome)).join(', ')
          : 'Não informado',
      orientador: nomeOrientador,
      status: 'PUBLICADO',
    }
  })

  // Retorna diretamente da API do backend sem usar mocks ou sementes falsas
  return publicadosValidos
}
