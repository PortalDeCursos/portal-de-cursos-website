export function projetoEstaPublicado(projeto) {
  return projeto?.statusProjeto === 'PUBLICADO'
}

export function pegarIdsDisciplinas(projeto) {
  return Array.isArray(projeto?.disciplinasIds) ? [...projeto.disciplinasIds] : []
}

export function montarEdicaoProjeto(projeto, edicao) {
  if (!projeto?.id) throw new Error('Reabra o projeto antes de salvar a edição.')
  return {
    cursoId: projeto.cursoId,
    campusId: projeto.campusId,
    nome: edicao.titulo.trim(),
    resumo: edicao.resumo.trim(),
    descricao: edicao.objetivo.trim(),
    tipoProjeto: projeto.tipoProjeto,
    dataInicio: projeto.dataInicio,
    dataFim: projeto.dataFim,
    disciplinaIds: pegarIdsDisciplinas(projeto),
    autores: (projeto.autores || []).map(({ nome, email }) => ({ nome, email })),
    professores: (projeto.professores || []).map(({ professorId, papel }) => ({
      professorId,
      papel,
    })),
    documentos: (projeto.documentos || []).map(({ nomeArquivo, tipoDocumento, localizacao }) => ({
      nomeArquivo,
      tipoDocumento,
      localizacao,
    })),
  }
}

export function validarDatasProjeto(inicio, fim) {
  const dataValida = (valor) => {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(valor)) return false
    const data = new Date(`${valor}T12:00:00Z`)
    return !Number.isNaN(data.getTime()) && data.toISOString().slice(0, 10) === valor
  }
  if (!dataValida(inicio) || !dataValida(fim)) return 'Informe as datas de início e término.'
  if (fim < inicio) return 'A data de término deve ser igual ou posterior à data de início.'
  return ''
}

export function linkDoDocumentoValido(link) {
  try {
    const url = new URL(link)
    return ['http:', 'https:'].includes(url.protocol) && !url.username && !url.password
  } catch {
    return false
  }
}
