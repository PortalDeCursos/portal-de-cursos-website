import { useState } from 'react'
import './professor.css'
import { enderecoPrivado, navegar } from '../../app/rotas.js'
import ConfirmacaoGestao from '../administracao/componentes/ConfirmacaoGestao.jsx'

function submissaoDoCurso(item, cursoId) {
  if (!item || !cursoId) return false
  return [item.cursoId, item.identificadorCurso]
    .filter((referencia) => referencia !== undefined && referencia !== null)
    .some((referencia) => String(referencia) === String(cursoId))
}

function submetidaAoOrientador(item, usuario) {
  if (item?.orientadorId && usuario?.professorId) {
    return String(item.orientadorId) === String(usuario.professorId)
  }
  const nomeOrientador = item?.orientador?.toLocaleLowerCase('pt-BR') || ''
  const nomeUsuario = usuario?.nome?.toLocaleLowerCase('pt-BR') || ''
  return Boolean(nomeOrientador && nomeUsuario && nomeOrientador.includes(nomeUsuario))
}

export default function PaginaDetalhesSubmissao({
  item: itemRecebido,
  tipoUsuario,
  usuario,
  cursoId,
  decisao,
  aoDecidir,
  aoEditar,
  aoRemover,
}) {
  const [justificativa, definirJustificativa] = useState('')
  const [erro, definirErro] = useState('')
  const [editando, definirEditando] = useState(false)
  const [confirmandoRemocao, definirConfirmandoRemocao] = useState(false)
  const item = itemRecebido
  const status = decisao?.status || decisao || item?.status || 'Aguardando Orientador'
  const volta = tipoUsuario === 'COORDENADOR' ? 'coordenacao/submissoes' : 'professor/feed'
  const visivel =
    item &&
    (tipoUsuario === 'COORDENADOR'
      ? submissaoDoCurso(item, cursoId)
      : tipoUsuario === 'PROFESSOR' && submetidaAoOrientador(item, usuario))
  const [edicao, definirEdicao] = useState(() => ({
    titulo: item?.titulo || '',
    resumo: item?.resumo || '',
    objetivo: item?.objetivo || '',
    tipo: item?.tipo || 'TCC',
    orientador: item?.orientador || '',
    autores: (item?.autores || []).map((autor) =>
      typeof autor === 'string' ? { nome: autor, email: '' } : autor,
    ),
    disciplinas: item?.disciplinas || [],
    documentos: item?.documentos || [],
  }))

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
  const avaliacaoCoordenador = tipoUsuario === 'COORDENADOR' && status === 'Em análise'

  function registrarDecisao(proximaStatus) {
    if (proximaStatus === 'Recusado' && !justificativa.trim()) {
      definirErro('Explique o motivo antes de recusar o projeto.')
      return
    }
    aoDecidir(proximaStatus, justificativa.trim())
    definirJustificativa('')
    definirErro('')
  }

  function salvarEdicao(evento) {
    evento.preventDefault()
    if (!edicao.titulo.trim() || !edicao.resumo.trim() || !edicao.objetivo.trim()) return
    aoEditar({
      titulo: edicao.titulo.trim(),
      resumo: edicao.resumo.trim(),
      objetivo: edicao.objetivo.trim(),
      tipo: edicao.tipo,
      orientador: edicao.orientador.trim(),
      autores: edicao.autores.map((autor) => ({ ...autor, email: autor.email || '' })),
      disciplinas: edicao.disciplinas,
      documentos: edicao.documentos,
    })
    definirEditando(false)
  }

  return (
    <main id="conteudo" className="limite pagina-detalhes-submissao">
      <a className="pagina-detalhes-submissao__voltar" href={enderecoPrivado(volta)}>
        Voltar para submissões
      </a>
      <header className="pagina-detalhes-submissao__cabecalho">
        <div>
          <div className="pagina-detalhes-submissao__sinal">
            <span className={`status status--${status.toLowerCase().replaceAll(' ', '-')}`}>
              {status}
            </span>
            <span>{item.tipo}</span>
          </div>
          <h1>{item.titulo}</h1>
          <p>
            {item.cursoCompleto} · enviado por {item.autor} em {item.enviadoEm}
          </p>
        </div>
        <div className="pagina-detalhes-submissao__marco">
          <span>Orientação</span>
          <strong>{item.orientador}</strong>
        </div>
      </header>
      <div className="pagina-detalhes-submissao__grid">
        <section className="pagina-detalhes-submissao__principal">
          {editando ? (
            <form className="avaliacao-submissao" onSubmit={salvarEdicao}>
              <h2>Editar submissão</h2>
              <label>
                Título
                <input
                  required
                  maxLength={200}
                  value={edicao.titulo}
                  onChange={(evento) => definirEdicao({ ...edicao, titulo: evento.target.value })}
                />
              </label>
              <label>
                Tipo de projeto
                <select
                  value={edicao.tipo}
                  onChange={(evento) => definirEdicao({ ...edicao, tipo: evento.target.value })}
                >
                  {['TCC', 'Projeto Integrador', 'Pesquisa', 'Extensão'].map((tipo) => (
                    <option key={tipo}>{tipo}</option>
                  ))}
                </select>
              </label>
              <label>
                Resumo
                <textarea
                  required
                  rows="4"
                  value={edicao.resumo}
                  onChange={(evento) => definirEdicao({ ...edicao, resumo: evento.target.value })}
                />
              </label>
              <label>
                Descrição
                <textarea
                  required
                  rows="4"
                  value={edicao.objetivo}
                  onChange={(evento) => definirEdicao({ ...edicao, objetivo: evento.target.value })}
                />
              </label>
              <label>
                Professor orientador
                <input
                  required
                  maxLength={200}
                  value={edicao.orientador}
                  onChange={(evento) =>
                    definirEdicao({ ...edicao, orientador: evento.target.value })
                  }
                />
              </label>
              <label>
                Integrantes, um por linha no formato Nome &lt;email&gt;
                <textarea
                  required
                  rows="3"
                  value={edicao.autores
                    .map((autor) => `${autor.nome || ''}${autor.email ? ` <${autor.email}>` : ''}`)
                    .join('\n')}
                  onChange={(evento) =>
                    definirEdicao({
                      ...edicao,
                      autores: evento.target.value
                        .split('\n')
                        .map((linha) => {
                          const [, nome, email = ''] =
                            linha.match(/^(.*?)(?:\s*<([^<>]*)>)?$/) || []
                          return { nome: nome?.trim() || '', email: email.trim() }
                        })
                        .filter((autor) => autor.nome && autor.email),
                    })
                  }
                />
              </label>
              <label>
                Disciplinas relacionadas, uma por linha
                <textarea
                  rows="3"
                  value={(edicao.disciplinas || []).join('\n')}
                  onChange={(evento) =>
                    definirEdicao({
                      ...edicao,
                      disciplinas: evento.target.value.split('\n').map((nome) => nome.trim()),
                    })
                  }
                />
              </label>
              <label>
                Documentos, um por linha
                <textarea
                  rows="3"
                  value={(edicao.documentos || []).join('\n')}
                  onChange={(evento) =>
                    definirEdicao({
                      ...edicao,
                      documentos: evento.target.value.split('\n').map((nome) => nome.trim()),
                    })
                  }
                />
              </label>
              <div className="avaliacao-submissao__acoes">
                <button className="botao-primario" type="submit">
                  Salvar edição
                </button>
                <button
                  className="botao-secundario"
                  type="button"
                  onClick={() => definirEditando(false)}
                >
                  Cancelar
                </button>
              </div>
            </form>
          ) : (
            <>
              <div>
                <span className="pagina-detalhes-submissao__indice">Sobre o projeto</span>
                <h2>Resumo</h2>
                <p>{item.resumo}</p>
              </div>
              <div>
                <h2>Descrição</h2>
                <p>{item.objetivo}</p>
              </div>
              <div className="pagina-detalhes-submissao__documentos">
                <h2>Documentos enviados</h2>
                <ul className="documentos-submissao-professor">
                  {(item.documentos || []).map((documento) => (
                    <li key={documento}>
                      <span aria-hidden="true">PDF</span>
                      <strong>{documento}</strong>
                      <span className="documento-indisponivel">Arquivo indisponível</span>
                    </li>
                  ))}
                </ul>
              </div>
            </>
          )}
        </section>
        <aside className="pagina-detalhes-submissao__lateral">
          <div className="pagina-detalhes-submissao__contexto">
            <span className="pagina-detalhes-submissao__indice">Contexto</span>
            <div>
              <h2>Equipe</h2>
              <p>
                {(item.autores || [])
                  .map((autor) =>
                    typeof autor === 'string'
                      ? autor
                      : `${autor.nome || ''}${autor.email ? ` (${autor.email})` : ''}`,
                  )
                  .join(' · ')}
              </p>
            </div>
            <div>
              <h2>Curso</h2>
              <p>{item.cursoCompleto}</p>
            </div>
          </div>
          {avaliacaoOrientador || avaliacaoCoordenador ? (
            <div className="avaliacao-submissao pagina-detalhes-submissao__decisao">
              <span className="pagina-detalhes-submissao__indice">Próxima decisão</span>
              <h2>
                {avaliacaoCoordenador ? 'Avaliação do coordenador' : 'Avaliação do orientador'}
              </h2>
              <p className="pagina-detalhes-submissao__decisao-intro">
                {avaliacaoCoordenador
                  ? 'O orientador aceitou esta submissão. Decida se ela será publicada no portal.'
                  : 'Leia o projeto e indique se poderá acompanhar esta produção. Após o aceite, ela seguirá ao coordenador do curso.'}
              </p>
              <label htmlFor={`justificativa-${item.identificador}`}>
                Motivo da decisão <small>necessário em caso de recusa</small>
                <textarea
                  id={`justificativa-${item.identificador}`}
                  rows="4"
                  value={justificativa}
                  onChange={(evento) => {
                    definirJustificativa(evento.target.value)
                    definirErro('')
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
                  onClick={() => registrarDecisao(avaliacaoCoordenador ? 'Aprovado' : 'Em análise')}
                >
                  {avaliacaoCoordenador ? 'Aprovar e publicar' : 'Aceitar como orientador'}
                </button>
                <button
                  type="button"
                  className="botao-secundario"
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
              <p>
                Você pode corrigir ou remover submissões do curso, inclusive as que enviou ou
                orienta.
              </p>
              <div className="avaliacao-submissao__acoes">
                <button
                  type="button"
                  className="botao-primario"
                  onClick={() => definirEditando(true)}
                >
                  Editar submissão
                </button>
                <button
                  type="button"
                  className="botao-secundario"
                  onClick={() => definirConfirmandoRemocao(true)}
                >
                  Remover submissão
                </button>
              </div>
            </div>
          ) : (
            <p className="detalhe-submissao__aviso pagina-detalhes-submissao__decisao">
              {status === 'Aprovado'
                ? 'Esta submissão foi aprovada e está disponível no portal.'
                : status === 'Recusado'
                  ? `Esta submissão foi recusada.${decisao?.justificativa ? ` Motivo: ${decisao.justificativa}` : ''}`
                  : 'A submissão aguarda avaliação do orientador ou do coordenador.'}
            </p>
          )}
        </aside>
      </div>{' '}
      {confirmandoRemocao && (
        <ConfirmacaoGestao rotulo="titulo-remover-submissao">
          <h2 id="titulo-remover-submissao">Remover esta submissão?</h2>
          <p>A remoção afeta apenas os dados desta sessão.</p>
          <div className="gestao-acoes">
            <button
              className="botao-secundario"
              type="button"
              onClick={() => definirConfirmandoRemocao(false)}
            >
              Manter submissão
            </button>
            <button
              className="gestao-excluir"
              type="button"
              onClick={() => {
                aoRemover()
                navegar(enderecoPrivado(volta), true)
              }}
            >
              Confirmar remoção
            </button>
          </div>
        </ConfirmacaoGestao>
      )}
      {tipoUsuario === 'COORDENADOR' && (aoEditar || aoRemover) && (
        <p className="gestao-nota">
          Decisões, edições e remoções ficam nesta sessão enquanto a API de submissões não estiver
          integrada.
        </p>
      )}
    </main>
  )
}
