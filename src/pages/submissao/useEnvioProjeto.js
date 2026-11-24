import { useEffect, useRef, useState } from 'react'
import {
  cadastrarProjeto,
  encaminharProjetoParaCoordenacao,
  enviarDocumentoProjeto,
} from '@/api/projetos.js'
import { listarCoordenadores } from '@/api/coordenadores.js'
import { enviarNotificacaoProjeto } from '@/api/notificacoes.js'

function criarEnvioInicial() {
  return {
    projetoId: null,
    cadastro: { estado: 'pendente', mensagem: 'Aguardando envio.' },
    encaminhamento: { estado: 'pendente', mensagem: 'Aguardando o cadastro.' },
    arquivos: [],
    notificacao: { estado: 'pendente', mensagem: 'Aguardando o cadastro.' },
  }
}

function resultadoIncerto(falha) {
  return !falha.status || falha.status < 400 || [408, 504].includes(falha.status)
}

export default function useEnvioProjeto({ sessao, aoSubmeter }) {
  const [envio, mudarEnvio] = useState(criarEnvioInicial)
  const cadastroBloqueado = useRef(false)
  const projetoId = useRef(null)
  const cadastroIncerto = useRef(false)
  const encaminhamentoEmAndamento = useRef(false)
  const arquivosEmAndamento = useRef(new Set())
  const temPendencias =
    ['enviando', 'incerto'].includes(envio.cadastro.estado) ||
    envio.notificacao.estado === 'enviando' ||
    (envio.projetoId &&
      (['pendente', 'enviando', 'falhou'].includes(envio.encaminhamento.estado) ||
        envio.arquivos.some((item) => item.estado !== 'concluido')))

  useEffect(() => {
    if (!temPendencias) return
    function avisarAntesDeSair(evento) {
      evento.preventDefault()
      evento.returnValue = ''
    }
    window.addEventListener('beforeunload', avisarAntesDeSair)
    return () => window.removeEventListener('beforeunload', avisarAntesDeSair)
  }, [temPendencias])

  function atualizarEtapa(etapa, estado, mensagem) {
    mudarEnvio((anterior) => ({ ...anterior, [etapa]: { estado, mensagem } }))
  }

  function atualizarArquivo(indice, estado, mensagem) {
    mudarEnvio((anterior) => ({
      ...anterior,
      arquivos: anterior.arquivos.map((item, atual) =>
        atual === indice ? { ...item, estado, mensagem } : item,
      ),
    }))
  }

  async function executarEncaminhamento(id) {
    if (encaminhamentoEmAndamento.current) return false
    encaminhamentoEmAndamento.current = true
    atualizarEtapa('encaminhamento', 'enviando', 'Consultando e atualizando o encaminhamento…')
    try {
      await encaminharProjetoParaCoordenacao(id, sessao.token)
      atualizarEtapa('encaminhamento', 'concluido', 'Encaminhado à coordenação.')
      return true
    } catch {
      atualizarEtapa(
        'encaminhamento',
        'falhou',
        'Não conseguimos confirmar o encaminhamento. Tente novamente para consultar a situação atual e continuar.',
      )
      return false
    } finally {
      encaminhamentoEmAndamento.current = false
    }
  }

  async function tentarEncaminhamento() {
    if (!projetoId.current || envio.encaminhamento.estado !== 'falhou') return
    await executarEncaminhamento(projetoId.current)
  }

  async function executarArquivo(indice, arquivo) {
    if (arquivosEmAndamento.current.has(indice)) return
    arquivosEmAndamento.current.add(indice)
    atualizarArquivo(indice, 'enviando', 'Enviando arquivo…')
    try {
      await enviarDocumentoProjeto(projetoId.current, arquivo, sessao.token)
      atualizarArquivo(indice, 'concluido', 'Arquivo enviado.')
    } catch (falha) {
      const incerto = resultadoIncerto(falha)
      atualizarArquivo(
        indice,
        incerto ? 'incerto' : 'falhou',
        incerto
          ? 'Não conseguimos confirmar o envio deste arquivo. Confira os anexos do projeto no painel antes de reenviar.'
          : 'Não foi possível enviar este arquivo. Verifique o formato e tente novamente.',
      )
    } finally {
      arquivosEmAndamento.current.delete(indice)
    }
  }

  async function tentarArquivo(indice, confirmouAusencia = false) {
    const item = envio.arquivos[indice]
    if (!projetoId.current || !item) return
    if (item.estado !== 'falhou' && !(item.estado === 'incerto' && confirmouAusencia)) return
    await executarArquivo(indice, item.arquivo)
  }

  async function enviarProjeto({ dto, submissaoLocal, orientador, arquivos }) {
    if (cadastroBloqueado.current || projetoId.current || cadastroIncerto.current) return false
    cadastroBloqueado.current = true
    atualizarEtapa('cadastro', 'enviando', 'Salvando o projeto…')
    let projetoCriado
    try {
      projetoCriado = await cadastrarProjeto(dto, sessao.token)
      if (!projetoCriado?.id) {
        throw new Error('Não foi possível registrar o projeto. Tente novamente.')
      }
    } catch (falha) {
      const incerto = resultadoIncerto(falha)
      cadastroIncerto.current = incerto
      let mensagem =
        falha.message || 'Não foi possível cadastrar o projeto. Confira os dados e tente novamente.'
      if (incerto) {
        mensagem =
          'Não conseguimos confirmar se o projeto foi enviado. Confira seu painel antes de tentar de novo.'
      } else if (falha.status >= 500) {
        mensagem =
          'Não foi possível concluir o envio agora. Confira no painel antes de tentar novamente.'
      } else if (
        falha.status === 409 &&
        falha.detalhe === 'Já existe um projeto cadastrado com esse nome.'
      ) {
        mensagem =
          sessao.tipoUsuario === 'ALUNO'
            ? 'Já existe um projeto com esse nome. Confira no painel do aluno.'
            : 'Já existe um projeto com esse nome. Confira no seu painel.'
      }
      atualizarEtapa('cadastro', incerto ? 'incerto' : 'falhou', mensagem)
      cadastroBloqueado.current = false
      throw new Error(mensagem)
    }

    projetoId.current = projetoCriado.id
    const arquivosParaEnviar = arquivos.filter((arquivo) => arquivo instanceof File)
    mudarEnvio((anterior) => ({
      ...anterior,
      projetoId: projetoCriado.id,
      cadastro: { estado: 'concluido', mensagem: 'Projeto cadastrado.' },
      arquivos: arquivosParaEnviar.map((arquivo) => ({
        arquivo,
        estado: 'pendente',
        mensagem: 'Aguardando envio.',
      })),
    }))

    const destinatarios = []
    let erroDestinatarios = ''
    if (sessao.tipoUsuario === 'ALUNO') {
      const email = orientador?.email || orientador?.usuario?.email
      if (email) destinatarios.push(email)
    } else if (sessao.tipoUsuario === 'COORDENADOR') {
      if (sessao.usuario?.email) destinatarios.push(sessao.usuario.email)
    } else {
      atualizarEtapa('notificacao', 'enviando', 'Consultando os destinatários do aviso…')
      try {
        const coordenadores = await listarCoordenadores(sessao.token, { cursoId: dto.cursoId })
        destinatarios.push(
          ...(Array.isArray(coordenadores)
            ? coordenadores
                .map((item) => item.professor?.usuario?.email || item.usuario?.email || item.email)
                .filter(Boolean)
            : []),
        )
      } catch {
        erroDestinatarios =
          'Projeto salvo. Não conseguimos consultar os destinatários para confirmar o aviso. Acompanhe pelo painel.'
      }
    }

    let encaminhamentoFalhou = false
    if (sessao.tipoUsuario === 'ALUNO') {
      atualizarEtapa(
        'encaminhamento',
        'concluido',
        'A avaliação do orientador faz parte do cadastro. Acompanhe o andamento no painel.',
      )
    } else {
      encaminhamentoFalhou = !(await executarEncaminhamento(projetoCriado.id))
    }

    if (erroDestinatarios) {
      atualizarEtapa('notificacao', 'falhou', erroDestinatarios)
    } else if (encaminhamentoFalhou) {
      atualizarEtapa(
        'notificacao',
        'falhou',
        'Projeto salvo. Tente o encaminhamento novamente. O aviso por e-mail ainda não foi confirmado.',
      )
    } else {
      atualizarEtapa('notificacao', 'enviando', 'Enviando o aviso por e-mail…')
      try {
        await enviarNotificacaoProjeto(
          {
            statusProjeto: sessao.tipoUsuario === 'ALUNO' ? 'EM_ANALISE' : 'ANALISE_PUBLICACAO',
            nomeProjeto: dto.nome,
            tipoProjeto: dto.tipoProjeto,
            destinatarios,
            nomeResponsavel: sessao.usuario?.nome,
          },
          sessao.token,
        )
        atualizarEtapa('notificacao', 'concluido', 'Solicitação de aviso recebida.')
      } catch {
        atualizarEtapa(
          'notificacao',
          'falhou',
          'Projeto salvo. Não conseguimos confirmar o aviso por e-mail. Acompanhe pelo painel.',
        )
      }
    }

    for (const [indice, arquivo] of arquivosParaEnviar.entries()) {
      await executarArquivo(indice, arquivo)
    }
    aoSubmeter?.({
      ...submissaoLocal,
      id: projetoCriado.id,
      identificador: String(projetoCriado.id),
    })
    cadastroBloqueado.current = false
    return true
  }

  function liberarNovoCadastro() {
    cadastroIncerto.current = false
    atualizarEtapa('cadastro', 'pendente', 'Confira os dados antes de enviar novamente.')
  }

  function limparEnvio() {
    projetoId.current = null
    cadastroIncerto.current = false
    mudarEnvio(criarEnvioInicial())
  }

  return {
    envio,
    temPendencias,
    enviarProjeto,
    tentarEncaminhamento,
    tentarArquivo,
    liberarNovoCadastro,
    limparEnvio,
  }
}
