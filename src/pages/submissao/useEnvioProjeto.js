import { useRef, useState } from 'react'
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

  async function enviarProjeto({ dto, submissaoLocal, orientador, arquivos }) {
    if (cadastroBloqueado.current || projetoId.current || cadastroIncerto.current) return false
    cadastroBloqueado.current = true
    atualizarEtapa('cadastro', 'enviando', 'Salvando o projeto…')
    let projetoCriado
    try {
      projetoCriado = await cadastrarProjeto(dto, sessao.token)
      if (!projetoCriado?.id) {
        throw new Error('O servidor não retornou a identificação do projeto.')
      }
    } catch (falha) {
      const incerto = resultadoIncerto(falha)
      cadastroIncerto.current = incerto
      const mensagem = incerto
        ? 'Não conseguimos confirmar se o projeto foi enviado. Confira seu painel antes de tentar de novo.'
        : falha.message ||
          'Não foi possível cadastrar o projeto. Confira os dados e tente novamente.'
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
          'Não foi possível consultar os e-mails da coordenação. Avise a coordenação e acompanhe o projeto pelo painel.'
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
        'O aviso não foi enviado porque o encaminhamento não foi confirmado. Avise a coordenação e acompanhe o projeto pelo painel.',
      )
    } else {
      atualizarEtapa('notificacao', 'enviando', 'Enviando o aviso por e-mail…')
      try {
        // TODO: confirmar com Notificações se o evento do RabbitMQ já envia o e-mail
        await enviarNotificacaoProjeto(
          {
            statusProjeto: sessao.tipoUsuario === 'ALUNO' ? 'EM_ANALISE' : 'ANALISE_PUBLICACAO',
            nomeProjeto: dto.nome,
            tipoProjeto: dto.tipoProjeto,
            destinatarios,
          },
          sessao.token,
        )
        atualizarEtapa('notificacao', 'concluido', 'Aviso enviado.')
      } catch {
        atualizarEtapa(
          'notificacao',
          'falhou',
          'Não conseguimos confirmar o envio do e-mail. Avise o responsável e acompanhe o projeto pelo painel.',
        )
      }
    }

    for (const [indice, arquivo] of arquivosParaEnviar.entries()) {
      atualizarArquivo(indice, 'enviando', 'Enviando arquivo…')
      try {
        await enviarDocumentoProjeto(projetoCriado.id, arquivo, sessao.token)
        atualizarArquivo(indice, 'concluido', 'Arquivo enviado.')
      } catch (falha) {
        atualizarArquivo(
          indice,
          resultadoIncerto(falha) ? 'incerto' : 'falhou',
          resultadoIncerto(falha)
            ? 'Não conseguimos confirmar o envio deste arquivo. Confira os anexos do projeto no painel.'
            : 'O serviço recusou este arquivo. Confira os anexos do projeto no painel.',
        )
      }
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

  return { envio, enviarProjeto, tentarEncaminhamento, liberarNovoCadastro, limparEnvio }
}
