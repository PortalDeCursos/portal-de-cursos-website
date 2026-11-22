export const formularioInicial = {
  nome: '',
  email: '',
  curso: '',
  orientador: '',
  dataInicio: '',
  dataFim: '',
  tipo: '',
  titulo: '',
  resumo: '',
  objetivos: '',
  informacoesEspecificas: '',
  disciplinas: [],
  autores: [],
  professoresParticipantes: [],
  projetoSemAlunos: false,
  documentos: {},
  linkMemoria: '',
  arquivosComplementares: [],
}

export const etapas = ['Identificação', 'Projeto', 'Equipe', 'Documentos']
export const TAMANHO_MAXIMO_DOCUMENTO = 10 * 1024 * 1024

export const nomesTiposProjeto = {
  'Projeto Integrador': 'Projeto Integrador',
  TCC: 'TCC',
  Pesquisa: 'Projeto de Pesquisa',
  Extensão: 'Projeto de Extensão',
}

export const tiposProjeto = {
  'Projeto Integrador': {
    descricao: 'Integra conhecimentos do curso em uma solução aplicada.',
    campoEspecifico: 'Requisitos, escopo e solução proposta',
    documentos: [
      { id: 'requisitos', nome: 'Documento do projeto', obrigatorio: true },
      { id: 'relatorio', nome: 'Relatório técnico complementar', obrigatorio: false },
      { id: 'anexos', nome: 'Anexos complementares', obrigatorio: false, multiplo: true },
    ],
  },
  TCC: {
    descricao: 'Trabalho de conclusão com pesquisa, fundamentação e resultados.',
    campoEspecifico: 'Problema de pesquisa, metodologia e resultados esperados',
    usaLinkMemoria: true,
    documentos: [],
  },
  Pesquisa: {
    descricao: 'Investigação acadêmica com método e resultados documentados.',
    campoEspecifico: 'Método, hipótese e resultados da pesquisa',
    documentos: [
      { id: 'protocolo', nome: 'Projeto ou protocolo de pesquisa', obrigatorio: true },
      { id: 'relatorio', nome: 'Relatório de pesquisa complementar', obrigatorio: false },
      { id: 'anexos', nome: 'Anexos complementares', obrigatorio: false, multiplo: true },
    ],
  },
  Extensão: {
    descricao: 'Ação acadêmica conectada às necessidades da comunidade.',
    campoEspecifico: 'Público atendido, impacto e execução da ação',
    documentos: [
      { id: 'plano', nome: 'Plano da ação de extensão', obrigatorio: true },
      { id: 'relatorio', nome: 'Relatório de execução complementar', obrigatorio: false },
      { id: 'anexos', nome: 'Anexos complementares', obrigatorio: false, multiplo: true },
    ],
  },
}
