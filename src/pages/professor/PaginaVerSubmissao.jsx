import EtapasSubmissao from '@/shared/componentes/EtapasSubmissao.jsx'
import { useState } from 'react'
import '@/shared/styles/painel-informativo.css'
import './professor.css'
import { enderecoPrivado, navegar } from '../../app/rotas.js'
import ConfirmacaoGestao from '@/pages/administracao/componentes/ConfirmacaoGestao.jsx'
import { baixarDocumentoBlob, pegarUrlDownload } from '@/api/projetos.js'
import TextoFormatado from '@/shared/componentes/TextoFormatado.jsx'

function submissaoDoCurso(item, cursoId) {
  if (!item) return false
  if (!cursoId) return true
  return [item.cursoId, item.identificadorCurso]
    .filter((referencia) => referencia !== undefined && referencia !== null)
    .some((referencia) => String(referencia) === String(cursoId))
}

function submetidaAoOrientador(item, usuario) {
  const idUsuario = usuario?.professorId || usuario?.id
  if (item?.orientadorId && idUsuario) return String(item.orientadorId) === String(idUsuario)
  if (item?.orientadorId || !idUsuario) return false
  const nomeOrientador = item?.orientador?.toLocaleLowerCase('pt-BR').trim() || ''
  const nomeUsuario = usuario?.nome?.toLocaleLowerCase('pt-BR').trim() || ''
  return Boolean(nomeOrientador && nomeUsuario && nomeOrientador === nomeUsuario)
}

function rotuloDoTipo(tipoDocumento) {
  if (!tipoDocumento) return 'PDF'
  const texto = String(tipoDocumento)
  if (/link/i.test(texto)) return 'Link'
  return texto.replaceAll('_', ' ').toUpperCase()
}

function rotuloDoStatus(status) {
  return status === 'Aguardando Orientador'
    ? 'Aguardando orientador'
    : status === 'Aprovado pelo orientador'
      ? 'Aprovado pelo orientador'
      : status === 'Aguardando Coordenação'
        ? 'Aguardando coordenação'
        : status === 'Aprovado'
          ? 'Aprovado e publicado'
          : status === 'Recusado pelo orientador'
            ? 'Recusado pelo orientador'
            : status === 'Publicação recusada'
              ? 'Publicação recusada'
              : status
}

function textoAutores(autores) {
  return (autores || [])
    .map((autor) =>
      typeof autor === 'string'
        ? autor
        : `${autor.nome || ''}${autor.email ? ` (${autor.email})` : ''}`,
    )
    .join(' · ')
}

export default function PaginaVerSubmissao({
  item,
  tipoUsuario,
  usuario,
  token,
  cursoId,
  decisao,
  aoDecidir,
  aoEditar,
  aoRemover,
}) {
  const [justificativa, mudarJustificativa] = useState('')
  const [erro, mudarErro] = useState('')
  const [aviso, mudarAviso] = useState('')
  const [salvando, mudarSalvando] = useState(false)
  const [editando, mudarEditando] = useState(false)
  const [confirmandoRemocao, mudarConfirmandoRemocao] = useState(false)
  const [abrindoDocumento, mudarAbrindoDocumento] = useState(false)
  const [edicao, mudarEdicao] = useState(() => ({
    titulo: item?.titulo || '',
    resumo: item?.resumo || '',
    objetivo: item?.objetivo || '',
    tipo: item?.tipo || 'TCC',
    orientador: item?.orientador || '',
    autores: (item?.autores || []).map((autor) =>
      typeof autor === 'string' ? { nome: autor, email: '' } : autor,
    ),
    disciplinas: item?.disciplinas || [],
    documentos: (item?.documentos || []).map((d) =>
      typeof d === 'string' ? d : d?.nomeArquivo || d?.nome || '',
    ),
  }))

  const status = decisao?.status || decisao || item?.status || 'Aguardando Orientador'
  const classeStatus =
    {
      'Aprovado pelo orientador': 'aprovado-pelo-orientador',
      'Aguardando Coordenação': 'aguardando-coordenação',
      'Recusado pelo orientador': 'recusado-pelo-orientador',
      'Publicação recusada': 'publicação-recusada',
      'Precisa de revisão': 'em-análise',
    }[status] || status.toLowerCase().replaceAll(' ', '-')
  const volta = tipoUsuario === 'COORDENADOR' ? 'coordenacao/submissoes' : 'professor/feed'
  const visivel =
    item &&
    (tipoUsuario === 'COORDENADOR'
      ? submissaoDoCurso(item, cursoId)
      : tipoUsuario === 'PROFESSOR' && submetidaAoOrientador(item, usuario))

  if (!visivel) {
    return (
      <main id="conteudo" className="limite pagina-detalhes-submissao">
        <a className="pagina-detalhes-submissao__voltar" href={enderecoPrivado(volta)}>
          Voltar para submissões
        </a>
        <h1>Submissão não encontrada</h1>
        <p>O projeto solicitado não está disponível para esta área.</p>
      </main>
    )
  }

  const avaliacaoOrientador = tipoUsuario === 'PROFESSOR' && status === 'Aguardando Orientador'
  const avaliacaoCoordenador = tipoUsuario === 'COORDENADOR' && status === 'Aguardando Coordenação'

  function atualizar(campo, valor) {
    mudarEdicao((atual) => ({ ...atual, [campo]: valor }))
  }

  async function registrarDecisao(proximoStatus) {
    if (salvando) return
    if (proximoStatus === 'Recusado' && !justificativa.trim()) {
      mudarErro('Explique o motivo antes de recusar o projeto.')
      return
    }
    try {
      mudarSalvando(true)
      const resultado = await aoDecidir(proximoStatus, justificativa.trim())
      mudarAviso(resultado?.aviso || '')
    } catch (falha) {
      if (falha?.status === 404 && falha.message === 'O curso não possui coordenador designado.') {
        mudarErro(
          'O curso está sem coordenador designado. Peça à administração para vincular o coordenador ao curso antes de registrar a decisão.',
        )
        return
      }
      mudarErro(
        falha?.status === 503
          ? 'Não conseguimos confirmar a decisão porque um serviço está indisponível. Confira o andamento do projeto no painel antes de tentar novamente.'
          : 'Não foi possível salvar a decisão. Tente novamente.',
      )
      return
    } finally {
      mudarSalvando(false)
    }
    mudarJustificativa('')
    mudarErro('')
  }

  async function salvarEdicao(evento) {
    evento.preventDefault()
    if (salvando || !edicao.titulo.trim() || !edicao.resumo.trim() || !edicao.objetivo.trim())
      return
    mudarSalvando(true)
    mudarErro('')
    try {
      await aoEditar({ titulo: edicao.titulo, resumo: edicao.resumo, objetivo: edicao.objetivo })
      mudarEditando(false)
    } catch (falha) {
      mudarErro(falha.message || 'Não foi possível salvar. Confira os dados e tente novamente.')
    } finally {
      mudarSalvando(false)
    }
  }

  async function remover() {
    if (salvando) return
    mudarSalvando(true)
    mudarErro('')
    try {
      await aoRemover()
      navegar(enderecoPrivado(volta), true)
    } catch (falha) {
      mudarErro(falha.message || 'Não foi possível remover. Tente novamente.')
    } finally {
      mudarSalvando(false)
    }
  }

  const mensagemStatus =
    status === 'Aprovado'
      ? 'Esta submissão foi aprovada pelo coordenador e está publicada no portal.'
      : status === 'Aprovado pelo orientador' || status === 'Aguardando Coordenação'
        ? tipoUsuario === 'PROFESSOR'
          ? 'Você já aceitou orientar este projeto. Agora ele aguarda a avaliação da coordenação do curso.'
          : 'O orientador aceitou a submissão e ela aguarda a decisão da coordenação.'
        : status === 'Recusado pelo orientador' || status === 'Publicação recusada'
          ? `Esta submissão foi recusada.${decisao?.justificativa ? ` Motivo: ${decisao.justificativa}` : ''}`
          : 'A submissão aguarda aceite inicial do professor orientador.'

  return (
    <main id="conteudo" className="limite pagina-detalhes-submissao">
      {aviso && <p role="status">{aviso}</p>}
      {erro && !editando && !confirmandoRemocao && <p role="alert">{erro}</p>}
      <a className="pagina-detalhes-submissao__voltar" href={enderecoPrivado(volta)}>
        Voltar para submissões
      </a>

      <header className="pagina-detalhes-submissao__cabecalho">
        <div>
          <div className="pagina-detalhes-submissao__sinal">
            <span
              className={
                status === 'Aprovado'
                  ? 'pagina-detalhes-submissao__publicado'
                  : `status status--${classeStatus}`
              }
            >
              {status === 'Aprovado' ? 'Publicado no portal' : rotuloDoStatus(status)}
            </span>
            <span>{item.tipo}</span>
          </div>
          <h1>{item.titulo}</h1>
          {status !== 'Aprovado' && <EtapasSubmissao status={status} />}
          <p>
            Enviado por {item.autor} em {item.enviadoEm}
          </p>
        </div>
      </header>

      <div className="pagina-detalhes-submissao__grid">
        <section className="pagina-detalhes-submissao__principal">
          {editando ? (
            <form
              className="avaliacao-submissao avaliacao-submissao--formulario"
              onSubmit={salvarEdicao}
              aria-busy={salvando}
            >
              <h2>Editar submissão</h2>
              <label>
                Título
                <input
                  className="campo"
                  required
                  maxLength={255}
                  value={edicao.titulo}
                  onChange={(evento) => atualizar('titulo', evento.target.value)}
                />
              </label>
              <label>
                Resumo
                <textarea
                  maxLength={500}
                  className="campo"
                  required
                  rows="4"
                  value={edicao.resumo}
                  onChange={(evento) => atualizar('resumo', evento.target.value)}
                />
              </label>
              <label>
                Descrição
                <textarea
                  className="campo"
                  required
                  rows="4"
                  value={edicao.objetivo}
                  onChange={(evento) => atualizar('objetivo', evento.target.value)}
                />
              </label>
              <p>
                Você pode atualizar o título, o resumo e a descrição. Os demais dados permanecem
                vinculados ao projeto.
              </p>
              {erro && <p role="alert">{erro}</p>}
              <div className="avaliacao-submissao__acoes">
                <button className="botao-primario" type="submit" disabled={salvando}>
                  {salvando ? 'Salvando…' : 'Salvar edição'}
                </button>
                <button
                  className="botao-secundario"
                  type="button"
                  onClick={() => mudarEditando(false)}
                  disabled={salvando}
                >
                  Cancelar
                </button>
              </div>
            </form>
          ) : (
            <>
              <div>
                <h2>Resumo</h2>
                <TextoFormatado
                  texto={item.resumo}
                  className="pagina-detalhes-submissao__texto-projeto"
                />
              </div>
              <div>
                <h2>Descrição</h2>
                <TextoFormatado
                  texto={item.objetivo}
                  className="pagina-detalhes-submissao__texto-projeto"
                />
              </div>
              <div className="pagina-detalhes-submissao__documentos">
                <h2>Documentos enviados</h2>
                <ul className="documentos-submissao-professor">
                  {(item.documentos || []).map((documento, indice) => {
                    const objeto = typeof documento === 'object' && documento !== null
                    const nome = objeto
                      ? documento.nomeArquivo || documento.nome || `Documento ${indice + 1}`
                      : documento
                    const tipo = rotuloDoTipo(objeto ? documento.tipoDocumento : null)
                    const localizacao = objeto ? documento.localizacao : null
                    const ehUrl = localizacao && /^https?:\/\//i.test(localizacao)
                    const urlDestino = ehUrl
                      ? localizacao
                      : item?.id && documento?.id
                        ? pegarUrlDownload(item.id, documento.id)
                        : null

                    async function manipularCliqueDocumento(e) {
                      if (ehUrl) return
                      e.preventDefault()
                      mudarAbrindoDocumento(true)
                      try {
                        const blobUrl = await baixarDocumentoBlob(item.id, documento.id, token)
                        window.open(blobUrl, '_blank', 'noopener,noreferrer')
                      } catch {
                        mudarErro('Não foi possível abrir o documento. Tente novamente.')
                      } finally {
                        mudarAbrindoDocumento(false)
                      }
                    }

                    return (
                      <li key={documento?.id || nome || indice}>
                        {urlDestino ? (
                          <a
                            href={urlDestino}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="item-documento-interativo"
                            onClick={manipularCliqueDocumento}
                            title={`Abrir ${nome} em nova aba para pré-visualizar`}
                          >
                            <span className="documento-tipo" aria-hidden="true">
                              {tipo}
                            </span>
                            <span className="item-documento-nome">{nome}</span>
                            <span className="item-documento-gatilho">
                              {abrindoDocumento ? 'Abrindo…' : 'Abre em nova aba'}{' '}
                              <span className="item-documento-seta" aria-hidden="true">
                                ↗
                              </span>
                            </span>
                          </a>
                        ) : (
                          <div className="item-documento-estatico">
                            <span className="documento-tipo" aria-hidden="true">
                              {tipo}
                            </span>
                            <strong className="item-documento-nome">{nome}</strong>
                            <span className="documento-indisponivel">Arquivo enviado</span>
                          </div>
                        )}
                      </li>
                    )
                  })}
                </ul>
              </div>
            </>
          )}
        </section>

        <aside className="pagina-detalhes-submissao__lateral">
          <div className="pagina-detalhes-submissao__contexto">
            <span className="pagina-detalhes-submissao__indice">Dados da submissão</span>
            <div>
              <h2>Equipe</h2>
              <p>{textoAutores(item.autores)}</p>
            </div>
            {Array.isArray(item.professoresParticipantes) &&
              item.professoresParticipantes.length > 0 && (
                <div>
                  <h2>Docentes colaboradores</h2>
                  <p>{item.professoresParticipantes.join(', ')}</p>
                </div>
              )}
            <div>
              <h2>Curso</h2>
              <p>{item.cursoCompleto}</p>
            </div>
            <div>
              <h2>Orientação</h2>
              <p>{item.orientador}</p>
            </div>
            {Array.isArray(item.disciplinas) && item.disciplinas.length > 0 && (
              <div>
                <h2>Disciplinas associadas</h2>
                <p>{item.disciplinas.join(', ')}</p>
              </div>
            )}
          </div>

          {avaliacaoOrientador || avaliacaoCoordenador ? (
            <div className="avaliacao-submissao pagina-detalhes-submissao__decisao">
              <span className="pagina-detalhes-submissao__indice">Próxima decisão</span>
              <h2>
                {avaliacaoCoordenador ? 'Avaliação do coordenador' : 'Avaliação do orientador'}
              </h2>
              <p className="pagina-detalhes-submissao__decisao-intro">
                {avaliacaoCoordenador
                  ? 'O orientador aprovou esta submissão. Decida se ela será publicada no portal.'
                  : 'Leia o projeto e indique se poderá acompanhar esta produção. Após o aceite, ela seguirá ao coordenador do curso.'}
              </p>
              <label htmlFor={`justificativa-${item.identificador}`}>
                Motivo da decisão <small>necessário em caso de recusa</small>
                <textarea
                  className="campo"
                  id={`justificativa-${item.identificador}`}
                  rows="4"
                  value={justificativa}
                  onChange={(evento) => {
                    mudarJustificativa(evento.target.value)
                    mudarErro('')
                  }}
                  placeholder="Explique o que precisa ser revisto..."
                />
              </label>
              {erro && (
                <p className="avaliacao-submissao__erro" role="alert">
                  {erro}
                </p>
              )}
              <div className="avaliacao-submissao__acoes">
                <button
                  type="button"
                  className="botao-primario"
                  disabled={salvando}
                  onClick={() => registrarDecisao(avaliacaoCoordenador ? 'Aprovado' : 'Em análise')}
                >
                  {avaliacaoCoordenador ? 'Aprovar e publicar' : 'Aceitar como orientador'}
                </button>
                {avaliacaoCoordenador && (
                  <button type="button" className="botao-secundario" disabled={salvando} onClick={() => mudarEditando(true)}>Editar projeto</button>
                )}
                <button
                  type="button"
                  className="botao-secundario"
                  disabled={salvando}
                  onClick={() => registrarDecisao('Recusado')}
                >
                  Recusar submissão
                </button>
              </div>
            </div>
          ) : tipoUsuario === 'COORDENADOR' ? (
            <div className="avaliacao-submissao pagina-detalhes-submissao__decisao">
              <span className="pagina-detalhes-submissao__indice">Gestão do curso</span>
              <h2>Editar ou remover</h2>
              <p className="pagina-detalhes-submissao__decisao-intro">
                Você pode corrigir ou remover submissões do curso, inclusive as que enviou ou
                orienta.
              </p>
              <div className="avaliacao-submissao__acoes">
                <button
                  type="button"
                  className="botao-primario"
                  onClick={() => mudarEditando(true)}
                >
                  Editar projeto
                </button>
                <button
                  type="button"
                  className="botao-secundario"
                  onClick={() => mudarConfirmandoRemocao(true)}
                >
                  Remover submissão
                </button>
              </div>
            </div>
          ) : status !== 'Aprovado' ? (
            <p
              className={`pagina-detalhes-submissao__aviso pagina-detalhes-submissao__aviso--${status
                .toLowerCase()
                .replaceAll(' ', '-')}`}
              role="status"
            >
              {mensagemStatus}
            </p>
          ) : null}
        </aside>
      </div>

      {confirmandoRemocao && (
        <ConfirmacaoGestao rotulo="titulo-remover-submissao">
          <h2 id="titulo-remover-submissao">Remover esta submissão?</h2>
          <p>Este registro será removido permanentemente do sistema.</p>
          {erro && <p role="alert">{erro}</p>}
          <div className="gestao-acoes">
            <button
              className="botao-secundario"
              type="button"
              onClick={() => mudarConfirmandoRemocao(false)}
              disabled={salvando}
            >
              Manter submissão
            </button>
            <button className="gestao-excluir" type="button" onClick={remover} disabled={salvando}>
              Confirmar remoção
            </button>
          </div>
        </ConfirmacaoGestao>
      )}
    </main>
  )
}
