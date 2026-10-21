import { useEffect, useMemo, useState } from 'react'
import { api } from '../../../api/index.js'
import { listarProfessores } from '../servicos/gerenciarProfessores.js'

export default function GestaoUsuarios({ token }) {
  const [consulta, definirConsulta] = useState({ estado: 'carregando', itens: [], erro: '' })
  const [busca, definirBusca] = useState('')
  const [papel, definirPapel] = useState('todos')
  const [curso, definirCurso] = useState('todos')
  const [tentativa, definirTentativa] = useState(0)

  useEffect(() => {
    const controle = new AbortController()
    Promise.all([
      api.usuarios.consultarUsuarios(token, controle.signal),
      listarProfessores(token, controle.signal).catch(() => []),
    ])
      .then(([itens, professores]) => {
        if (!controle.signal.aborted) {
          const cursosPorEmail = new Map(professores.map((p) => [p.email.toLowerCase(), p.cursoId]))
          const contas = Array.isArray(itens)
            ? itens.map((item) => ({
                ...item,
                cursoId: item.cursoId ?? cursosPorEmail.get(item.email?.toLowerCase()),
              }))
            : null
          definirConsulta(
            contas
              ? { estado: 'pronto', itens: contas, erro: '' }
              : { estado: 'erro', itens: [], erro: 'A lista de contas recebida é inválida.' },
          )
        }
      })
      .catch((erro) => {
        if (!controle.signal.aborted) {
          definirConsulta({ estado: 'erro', itens: [], erro: erro.message })
        }
      })
    return () => controle.abort()
  }, [tentativa, token])

  const filtrados = useMemo(
    () =>
      consulta.itens.filter((item) => {
        const termo = `${item.nome || ''} ${item.email || ''} ${item.username || ''} ${item.tipoUsuario || ''}`
        const cursoId = item.cursoId ?? item.professor?.cursoId ?? ''
        return (
          termo.toLocaleLowerCase('pt-BR').includes(busca.trim().toLocaleLowerCase('pt-BR')) &&
          (papel === 'todos' || item.tipoUsuario === papel) &&
          (curso === 'todos' || String(cursoId) === curso)
        )
      }),
    [busca, consulta.itens, papel, curso],
  )
  const cursos = [...new Set(consulta.itens.map((item) => item.cursoId).filter(Boolean))]

  return (
    <>
      <header className="painel-titulo">
        <div>
          <h1>Usuários</h1>
          <p>Encontre contas por nome, papel ou curso.</p>
        </div>
      </header>
      {consulta.estado === 'carregando' && <p role="status">Carregando contas…</p>}
      {consulta.estado === 'erro' && (
        <div className="gestao-aviso" role="alert">
          <p>{consulta.erro}</p>
          <button
            className="botao-secundario"
            type="button"
            onClick={() => {
              definirConsulta({ estado: 'carregando', itens: [], erro: '' })
              definirTentativa((valor) => valor + 1)
            }}
          >
            Tentar novamente
          </button>
        </div>
      )}
      {consulta.estado === 'pronto' && (
        <section className="painel-secao">
          <div className="gestao-filtros">
            <label className="gestao-busca">
              Buscar usuário
              <input
                type="search"
                value={busca}
                onChange={(evento) => definirBusca(evento.target.value)}
                placeholder="Nome ou e-mail"
              />
            </label>
            <label className="gestao-busca">
              Papel
              <select value={papel} onChange={(evento) => definirPapel(evento.target.value)}>
                <option value="todos">Todos os papéis</option>
                {['ALUNO', 'PROFESSOR', 'COORDENADOR', 'ADMIN'].map((tipo) => (
                  <option key={tipo} value={tipo}>
                    {tipo === 'ADMIN' ? 'Administrador' : tipo[0] + tipo.slice(1).toLowerCase()}
                  </option>
                ))}
              </select>
            </label>
            <label className="gestao-busca">
              Curso
              <select value={curso} onChange={(evento) => definirCurso(evento.target.value)}>
                <option value="todos">Todos os cursos</option>
                {cursos.map((cursoId) => (
                  <option key={cursoId} value={String(cursoId)}>
                    Curso {cursoId}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <div
            className="tabela-submissoes"
            role="region"
            aria-label="Contas do portal"
            tabIndex={0}
          >
            <table>
              <thead>
                <tr>
                  <th scope="col">Pessoa</th>
                  <th scope="col">Papel</th>
                  <th scope="col">Curso</th>
                </tr>
              </thead>
              <tbody>
                {filtrados.map((item) => (
                  <tr key={item.id || item.email}>
                    <th scope="row">
                      {item.nome || 'Sem nome'}
                      <span>{item.email}</span>
                    </th>
                    <td>{item.tipoUsuario || 'Não informado'}</td>
                    <td>{item.cursoId || '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {!filtrados.length && <p className="painel-vazio">Nenhuma conta encontrada.</p>}
        </section>
      )}
      <p className="gestao-nota">
        A lista reúne as contas cadastradas e os vínculos docentes disponíveis no serviço.
      </p>
    </>
  )
}
