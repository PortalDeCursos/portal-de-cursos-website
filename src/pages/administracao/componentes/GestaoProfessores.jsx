import EstadoErro from '@/shared/componentes/EstadoErro.jsx'
import { Fragment, useEffect, useState } from 'react'
import {
  atualizarProfessor,
  cadastrarProfessor,
  excluirProfessor,
  listarProfessores,
} from '../servicos/gerenciarProfessores.js'
import {
  atualizarCoordenador,
  cadastrarCoordenador,
  listarCoordenadores,
} from '@/api/coordenadores.js'
import { designarCoordenador, listarCursos } from '@/api/cursos.js'
import FormularioProfessor from './FormularioProfessor.jsx'
import ConfirmacaoGestao from './ConfirmacaoGestao.jsx'
import '../estilos/gestao.css'
import '../estilos/geral.css'

export default function GestaoProfessores({ token, cursoId }) {
  const [consulta, mudarConsulta] = useState({ estado: 'carregando', dados: [], erro: '' })
  const [listaCursos, mudarListaCursos] = useState([])
  const [tentativa, mudarTentativa] = useState(0)
  const [busca, mudarBusca] = useState('')
  const [criando, mudarCriando] = useState(false)
  const [editando, mudarEditando] = useState(null)
  const [formEdicao, mudarFormEdicao] = useState({
    nome: '',
    email: '',
    senha: '',
    titulacao: 'MESTRADO',
    cursoId: '',
    descricao: '',
    vincularCoordenacao: false,
  })
  const [exclusao, mudarExclusao] = useState(null)
  const [ocupado, mudarOcupado] = useState(false)
  const [erro, mudarErro] = useState('')
  const [mensagem, mudarMensagem] = useState('')

  useEffect(() => {
    const controle = new AbortController()

    Promise.allSettled([
      listarProfessores(token, controle.signal),
      listarCursos(controle.signal, token),
    ]).then(([resProfessores, resCursos]) => {
      if (controle.signal.aborted) return

      if (resCursos.status === 'fulfilled' && Array.isArray(resCursos.value)) {
        mudarListaCursos(resCursos.value)
      }

      if (resProfessores.status === 'fulfilled') {
        mudarConsulta({ estado: 'pronto', dados: resProfessores.value, erro: '' })
      } else {
        mudarConsulta({
          estado: 'erro',
          dados: [],
          erro: resProfessores.reason?.message || 'Erro ao carregar professores',
        })
      }
    })

    return () => controle.abort()
  }, [token, tentativa])
  async function salvar(dados) {
    if (ocupado) return
    mudarOcupado(true)
    mudarErro('')
    mudarMensagem('')
    try {
      const professor = await cadastrarProfessor(token, dados)
      mudarConsulta((atual) => ({ ...atual, dados: [...atual.dados, professor] }))
      mudarCriando(false)
      if (dados.usuario.tipoUsuario === 'COORDENADOR') {
        try {
          const coordenador = await cadastrarCoordenador(token, { professorId: professor.id, cursoId: dados.cursoId })
          await designarCoordenador(token, dados.cursoId, coordenador.id)
        } catch (falha) {
          mudarErro(`Professor cadastrado, mas o vínculo de coordenação falhou. ${falha.message}`)
          return
        }
        mudarMensagem('Professor cadastrado e vinculado à coordenação do curso.')
      } else {
        mudarMensagem('Professor cadastrado.')
      }
    } catch (falha) {
      mudarErro(falha.message)
    } finally {
      mudarOcupado(false)
    }
  }
  function abrirEdicao(item) {
    if (editando?.id === item.id) {
      mudarEditando(null)
      return
    }
    mudarEditando(item)
    mudarExclusao(null)
    mudarCriando(false)
    mudarErro('')
    mudarMensagem('')
    mudarFormEdicao({
      nome: item.nome || '',
      email: item.email || '',
      senha: '',
      titulacao: item.titulacao || 'MESTRADO',
      cursoId: item.cursoId ? String(item.cursoId) : '',
      descricao: item.descricao || 'Docente do curso.',
      vincularCoordenacao: false,
    })
  }

  function gerarSenhaAleatoria() {
    const caracteres = 'abcdefghijklmnopqrstuvwxyz'
    const maiusculas = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
    const numeros = '0123456789'
    const especiais = '@$!%*#?&'
    let senha = maiusculas[Math.floor(Math.random() * maiusculas.length)]
    senha += especiais[Math.floor(Math.random() * especiais.length)]
    for (let i = 0; i < 4; i += 1) {
      senha += caracteres[Math.floor(Math.random() * caracteres.length)]
    }
    for (let i = 0; i < 2; i += 1) {
      senha += numeros[Math.floor(Math.random() * numeros.length)]
    }
    mudarFormEdicao((atual) => ({ ...atual, senha }))
  }

  async function salvarEdicao(evento) {
    evento.preventDefault()
    if (ocupado || !editando) return
    mudarOcupado(true)
    mudarErro('')
    mudarMensagem('')
    try {
      const cursoIdNumero = formEdicao.cursoId ? Number(formEdicao.cursoId) : editando.cursoId
      if (formEdicao.senha.trim()) {
        const atualizado = await atualizarProfessor(token, editando.id, {
          titulacao: formEdicao.titulacao,
          descricao: formEdicao.descricao.trim() || 'Docente do curso.',
          cursoId: cursoIdNumero,
          usuario: {
            nome: formEdicao.nome.trim(),
            email: formEdicao.email.trim(),
            senha: formEdicao.senha,
          },
        })
        mudarConsulta((atual) => ({
          ...atual,
          dados: atual.dados.map((item) => (item.id === editando.id ? atualizado : item)),
        }))
      }
      if (formEdicao.vincularCoordenacao && cursoIdNumero) {
        const listaCoord = await listarCoordenadores(token)
        const existente = (Array.isArray(listaCoord) ? listaCoord : []).find(
          (c) =>
            String(c.professorId ?? c.professor?.id) === String(editando.id),
        )
        let coordenadorId = existente?.id
        if (coordenadorId) {
          await atualizarCoordenador(token, existente.id, {
            professorId: editando.id,
            cursoId: cursoIdNumero,
          })
        } else {
          const criado = await cadastrarCoordenador(token, {
            professorId: editando.id,
            cursoId: cursoIdNumero,
          })
          coordenadorId = criado.id
        }
        await designarCoordenador(token, cursoIdNumero, coordenadorId)
        mudarMensagem(
          formEdicao.senha.trim()
            ? 'Professor atualizado e vinculado à coordenação do curso.'
            : 'Professor vinculado à coordenação do curso.',
        )
      } else if (formEdicao.senha.trim()) {
        mudarMensagem('Professor atualizado.')
      } else {
        mudarErro('Informe a senha para atualizar os dados do professor ou marque o vínculo de coordenação.')
        return
      }
      mudarEditando(null)
    } catch (falha) {
      mudarErro(falha.message)
    } finally {
      mudarOcupado(false)
    }
  }

  async function remover() {
    if (ocupado || !exclusao) return
    mudarOcupado(true)
    mudarErro('')
    mudarMensagem('')
    try {
      await excluirProfessor(token, exclusao.id)
      mudarConsulta((atual) => ({
        ...atual,
        dados: atual.dados.filter((item) => item.id !== exclusao.id),
      }))
      mudarExclusao(null)
      mudarMensagem('Professor excluído.')
    } catch (falha) {
      mudarErro(falha.message)
    } finally {
      mudarOcupado(false)
    }
  }
  const mapaCursos = new Map(listaCursos.map((c) => [String(c.id), c]))

  const itens = consulta.dados
    .filter((item) => !cursoId || String(item.cursoId) === String(cursoId))
    .filter((item) =>
      `${item.nome} ${item.email}`
        .toLocaleLowerCase('pt-BR')
        .includes(busca.trim().toLocaleLowerCase('pt-BR')),
    )
  const cursosVinculados =
    listaCursos.length > 0
      ? listaCursos
      : [
          ...new Map(
            consulta.dados
              .filter((item) => item.cursoId)
              .map((item) => [
                String(item.cursoId),
                { id: item.cursoId, nome: `Curso ${item.cursoId}` },
              ]),
          ).values(),
        ]
  return (
    <>
      <header className="painel-titulo">
        <div>
          <h1>Professores</h1>
          <p>
            {cursoId
              ? 'Cadastre e gerencie os professores vinculados ao seu curso.'
              : 'Cadastre docentes e acompanhe os vínculos acadêmicos.'}
          </p>
        </div>
        <button
          className="botao-primario"
          onClick={() => {
            mudarCriando(true)
            mudarErro('')
            mudarExclusao(null)
          }}
          disabled={ocupado || consulta.estado !== 'pronto'}
          aria-expanded={criando}
          aria-controls="cadastro-professor"
        >
          {criando ? 'Fechar cadastro' : 'Novo professor'}
        </button>
      </header>
      {mensagem && (
        <p className="gestao-aviso" role="status">
          {mensagem}
        </p>
      )}
      {criando && (
        <div className="gestao-expansao gestao-expansao--novo" id="cadastro-professor">
          <FormularioProfessor
            aoSalvar={salvar}
            aoCancelar={() => {
              mudarCriando(false)
              mudarErro('')
            }}
            ocupado={ocupado}
            erro={erro}
            cursoIdInicial={cursoId || ''}
            cursosVinculados={cursosVinculados}
          />
        </div>
      )}
      {consulta.estado === 'carregando' && <p role="status">Carregando professores…</p>}
      {consulta.estado === 'erro' && (
        <EstadoErro
          titulo="A lista de professores não foi carregada"
          mensagem={consulta.erro}
          aoTentarNovamente={() => {
            mudarConsulta({ estado: 'carregando', dados: [], erro: '' })
            mudarTentativa((valor) => valor + 1)
          }}
        />
      )}
      {consulta.estado === 'pronto' && (
        <section className="painel-secao">
          <div className="painel__cabecalho gestao-professores__busca">
            <label className="gestao-busca">
              Buscar professor
              <input
                className="campo"
                type="search"
                value={busca}
                onChange={(e) => mudarBusca(e.target.value)}
                placeholder="Nome ou e-mail"
              />
            </label>
            <span className="painel-contagem">
              {itens.length} {itens.length === 1 ? 'professor' : 'professores'}
            </span>
          </div>
          <div
            className="tabela-container"
            role="region"
            aria-label="Professores cadastrados"
            tabIndex={0}
          >
            <table className="tabela">
              <thead>
                <tr>
                  <th scope="col">Professor</th>
                  <th scope="col">Titulação</th>
                  <th scope="col">Curso</th>
                  <th scope="col">Ações</th>
                </tr>
              </thead>
              <tbody>
                {itens.map((item) => (
                  <Fragment key={item.id}>
                    <tr>
                      <th scope="row">
                        <span className="tabela__titulo">{item.nome}</span>
                        <span className="tabela__descricao">{item.email}</span>
                      </th>
                      <td>
                        {{
                          MESTRADO: 'Mestrado',
                          DOUTORADO: 'Doutorado',
                          ESPECIALIZACAO: 'Especialização',
                          GRADUACAO: 'Graduação',
                        }[item.titulacao] || item.titulacao}
                      </td>
                      <td>
                        {(() => {
                          const c = mapaCursos.get(String(item.cursoId))
                          return c
                            ? c.sigla || c.acronimo || c.nome
                            : item.cursoId
                              ? `Curso ${item.cursoId}`
                              : '—'
                        })()}
                      </td>
                      <td>
                        <div className="gestao-acoes">
                          <button
                            type="button"
                            className="botao-secundario botao--pequeno"
                            aria-expanded={editando?.id === item.id}
                            aria-controls={`editar-professor-${item.id}`}
                            onClick={() => abrirEdicao(item)}
                            disabled={ocupado}
                          >
                            {editando?.id === item.id ? 'Fechar' : 'Editar'}
                            <span className="somente-leitores"> {item.nome}</span>
                          </button>
                          <button
                            type="button"
                            className="gestao-excluir"
                            aria-expanded={exclusao?.id === item.id}
                            aria-controls={`excluir-professor-${item.id}`}
                            onClick={() => {
                              mudarExclusao(exclusao?.id === item.id ? null : item)
                              mudarEditando(null)
                              mudarCriando(false)
                              mudarErro('')
                            }}
                            disabled={ocupado}
                          >
                            Excluir<span className="somente-leitores"> {item.nome}</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                    {editando?.id === item.id && (
                      <tr className="gestao-linha-expandida">
                        <td colSpan={4} id={`editar-professor-${item.id}`}>
                          <form className="gestao-formulario" onSubmit={salvarEdicao}>
                            <h2>Editar {item.nome}</h2>
                            {erro && <p role="alert">{erro}</p>}
                            <div className="gestao-grade">
                              <label>
                                Nome
                                <input
                                  required
                                  value={formEdicao.nome}
                                  onChange={(e) =>
                                    mudarFormEdicao((atual) => ({ ...atual, nome: e.target.value }))
                                  }
                                />
                              </label>
                              <label>
                                E-mail
                                <input
                                  type="email"
                                  required
                                  value={formEdicao.email}
                                  onChange={(e) =>
                                    mudarFormEdicao((atual) => ({ ...atual, email: e.target.value }))
                                  }
                                />
                              </label>
                              <label>
                                Titulação
                                <select
                                  value={formEdicao.titulacao}
                                  onChange={(e) =>
                                    mudarFormEdicao((atual) => ({
                                      ...atual,
                                      titulacao: e.target.value,
                                    }))
                                  }
                                >
                                  <option value="GRADUACAO">Graduação</option>
                                  <option value="ESPECIALIZACAO">Especialização</option>
                                  <option value="MESTRADO">Mestrado</option>
                                  <option value="DOUTORADO">Doutorado</option>
                                </select>
                              </label>
                              <label>
                                Curso
                                <select
                                  value={formEdicao.cursoId}
                                  onChange={(e) =>
                                    mudarFormEdicao((atual) => ({
                                      ...atual,
                                      cursoId: e.target.value,
                                    }))
                                  }
                                  disabled={Boolean(cursoId)}
                                >
                                  <option value="">Selecione um curso</option>
                                  {listaCursos.map((c) => (
                                    <option key={c.id} value={String(c.id)}>
                                      {c.nome}
                                    </option>
                                  ))}
                                </select>
                              </label>
                              <label>
                                Descrição
                                <input
                                  value={formEdicao.descricao}
                                  onChange={(e) =>
                                    mudarFormEdicao((atual) => ({
                                      ...atual,
                                      descricao: e.target.value,
                                    }))
                                  }
                                />
                              </label>
                              <label>
                                Nova senha (a atual será substituída)
                                <div style={{ display: 'flex', gap: '8px' }}>
                                  <input
                                    type="text"
                                    minLength={8}
                                    placeholder="Mínimo 8 caracteres"
                                    value={formEdicao.senha}
                                    onChange={(e) =>
                                      mudarFormEdicao((atual) => ({
                                        ...atual,
                                        senha: e.target.value,
                                      }))
                                    }
                                  />
                                  <button
                                    type="button"
                                    className="botao-secundario"
                                    onClick={gerarSenhaAleatoria}
                                    title="Gerar nova senha automática"
                                    style={{ whiteSpace: 'nowrap', padding: '0 12px' }}
                                  >
                                    Gerar
                                  </button>
                                </div>
                              </label>
                            </div>
                            {!cursoId && (
                              <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <input
                                  type="checkbox"
                                  checked={formEdicao.vincularCoordenacao}
                                  onChange={(e) =>
                                    mudarFormEdicao((atual) => ({
                                      ...atual,
                                      vincularCoordenacao: e.target.checked,
                                    }))
                                  }
                                />
                                <span>Vincular como coordenador do curso selecionado</span>
                              </label>
                            )}
                            <div className="gestao-acoes">
                              <button
                                type="button"
                                className="botao-secundario"
                                onClick={() => {
                                  mudarEditando(null)
                                  mudarErro('')
                                }}
                                disabled={ocupado}
                              >
                                Cancelar
                              </button>
                              <button type="submit" className="botao-primario" disabled={ocupado}>
                                {ocupado ? 'Salvando…' : 'Salvar alterações'}
                              </button>
                            </div>
                          </form>
                        </td>
                      </tr>
                    )}
                    {exclusao?.id === item.id && (
                      <tr className="gestao-linha-expandida">
                        <td colSpan={4} id={`excluir-professor-${item.id}`}>
                          <ConfirmacaoGestao rotulo={`titulo-excluir-professor-${item.id}`}>
                            <h2 id={`titulo-excluir-professor-${item.id}`}>Excluir {item.nome}?</h2>
                            <p>O cadastro será removido. Esta ação não pode ser desfeita.</p>
                            {erro && <p role="alert">{erro}</p>}
                            <div className="gestao-acoes">
                              <button
                                className="botao-secundario"
                                onClick={() => {
                                  mudarExclusao(null)
                                  mudarErro('')
                                }}
                                disabled={ocupado}
                              >
                                Manter professor
                              </button>
                              <button
                                className="gestao-excluir"
                                onClick={remover}
                                disabled={ocupado}
                              >
                                {ocupado ? 'Excluindo…' : 'Confirmar exclusão'}
                              </button>
                            </div>
                          </ConfirmacaoGestao>
                        </td>
                      </tr>
                    )}
                  </Fragment>
                ))}
              </tbody>
            </table>
          </div>
          {!itens.length && (
            <p className="painel-vazio">
              {busca ? 'Nenhum professor encontrado nesta busca.' : 'Nenhum professor cadastrado.'}
            </p>
          )}
        </section>
      )}
      {cursoId && (
        <p className="gestao-nota">
          A lista e os cadastros estão limitados ao curso vinculado à coordenação.
        </p>
      )}
    </>
  )
}
