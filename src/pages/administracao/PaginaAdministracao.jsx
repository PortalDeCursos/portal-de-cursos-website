import { useCallback, useEffect, useState } from 'react'
import { listarAreasConhecimento, listarCampus, listarCursos } from '@/api/cursos.js'
import { listarDisciplinasPorCurso } from '@/api/disciplinas.js'
import { enderecoPrivado } from '../../app/rotas.js'
import GestaoConteudos from './components/GestaoConteudos.jsx'
import GestaoProfessores from './components/GestaoProfessores.jsx'
import GestaoUsuarios from './components/GestaoUsuarios.jsx'
import TabelaSubmissoes from './components/TabelaSubmissoes.jsx'
import '@/shared/styles/painel.css'
import './administracao.css'

function PainelAdministracao({ token }) {
  const [resumo, definirResumo] = useState(null)
  const [carregando, definirCarregando] = useState(true)
  const [erro, definirErro] = useState('')

  const carregar = useCallback(
    async (sinal) => {
      definirCarregando(true)
      definirErro('')
      try {
        const [cursos, campus, areas] = await Promise.all([
          listarCursos(sinal),
          listarCampus(sinal),
          listarAreasConhecimento(sinal),
        ])
        const disciplinasPorCurso = await Promise.all(
          cursos.map((curso) => listarDisciplinasPorCurso(curso.id, token, sinal)),
        )
        definirResumo({
          cursos,
          disciplinas: disciplinasPorCurso.flat(),
          campus,
          areas,
        })
      } catch (falha) {
        if (!sinal?.aborted)
          definirErro(falha.message || 'Não foi possível carregar os dados acadêmicos.')
      } finally {
        if (!sinal?.aborted) definirCarregando(false)
      }
    },
    [token],
  )

  useEffect(() => {
    const controller = new AbortController()
    queueMicrotask(() => carregar(controller.signal))
    return () => controller.abort()
  }, [carregar])

  return (
    <>
      <header className="painel-titulo">
        <div>
          <h1>Painel inicial</h1>
          <p>Acompanhe as formações e matérias cadastradas e acesse as tarefas mais comuns.</p>
        </div>
        <button className="botao-secundario" onClick={() => carregar()} disabled={carregando}>
          {carregando ? 'Atualizando…' : 'Atualizar informações'}
        </button>
      </header>
      {erro && (
        <div className="gestao-aviso" role="alert">
          <p>
            Não foi possível carregar as informações agora. Confira se o sistema está disponível e
            tente de novo.
          </p>
          <button className="botao-secundario" onClick={() => carregar()} disabled={carregando}>
            Tentar novamente
          </button>
        </div>
      )}
      {carregando && !resumo ? (
        <p className="gestao-aviso" role="status">
          Carregando as informações…
        </p>
      ) : resumo ? (
        <>
          <section className="administracao-indicadores" aria-label="Resumo da instituição">
            {[
              ['Formações', resumo.cursos.length, 'administracao/cursos'],
              ['Matérias', resumo.disciplinas.length, 'administracao/disciplinas'],
              ['Unidades', resumo.campus.length, 'administracao/cursos'],
              ['Áreas de estudo', resumo.areas.length, 'administracao/cursos'],
            ].map(([rotulo, total, destino]) => (
              <a className="administracao-indicador" href={enderecoPrivado(destino)} key={rotulo}>
                <span>{rotulo}</span>
                <strong>{total}</strong>
              </a>
            ))}
          </section>
          <section
            className="painel-secao administracao-registros"
            aria-labelledby="cursos-recentes"
          >
            <header>
              <div>
                <h2 id="cursos-recentes">Formações cadastradas</h2>
                <p>Consulte as formações já disponíveis no portal.</p>
              </div>
              <a href={enderecoPrivado('administracao/cursos')}>
                Ver e organizar formações <span aria-hidden="true">→</span>
              </a>
            </header>
            {resumo.cursos.length ? (
              <div
                className="tabela-submissoes"
                role="region"
                aria-label="Formações cadastradas"
                tabIndex={0}
              >
                <table>
                  <caption className="somente-leitores">Formações disponíveis no portal</caption>
                  <thead>
                    <tr>
                      <th scope="col">Formação</th>
                      <th scope="col">Tipo</th>
                      <th scope="col">Formato das aulas</th>
                      <th scope="col">Período</th>
                    </tr>
                  </thead>
                  <tbody>
                    {resumo.cursos.slice(0, 8).map((curso) => (
                      <tr key={curso.id}>
                        <th scope="row">
                          {curso.nome}
                          <span>{curso.sigla}</span>
                        </th>
                        <td>{curso.grau}</td>
                        <td>{curso.modalidade}</td>
                        <td>{curso.turno}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="administracao-vazio">
                <strong>Ainda não há formações cadastradas.</strong>
                <p>Adicione a primeira formação para começar a organizar as matérias.</p>
                <a className="botao-primario" href={enderecoPrivado('administracao/cursos')}>
                  Cadastrar formação
                </a>
              </div>
            )}
          </section>
          <section className="administracao-secao-atalhos">
            <header>
              <div>
                <h2>O que você quer fazer?</h2>
                <p>Escolha uma tarefa para continuar.</p>
              </div>
            </header>
            <div className="administracao-categorias">
              {[
                [
                  'Pessoas',
                  [
                    ['usuarios', 'Contas de acesso', 'Gerencie quem pode entrar no portal'],
                    ['professores', 'Professores', 'Cadastre e atualize quem dá aula'],
                  ],
                ],
                [
                  'Formações e matérias',
                  [
                    ['cursos', 'Formações', `${resumo.cursos.length} no portal · ver e organizar`],
                    [
                      'disciplinas',
                      'Matérias',
                      `${resumo.disciplinas.length} no portal · ver e organizar`,
                    ],
                    ['projetos', 'Trabalhos acadêmicos', 'Consulte os trabalhos cadastrados'],
                  ],
                ],
              ].map(([titulo, itens]) => (
                <section className="administracao-categoria" key={titulo}>
                  <h3>{titulo}</h3>
                  <ul>
                    {itens.map(([destino, nome, descricao]) => (
                      <li key={destino}>
                        <a href={enderecoPrivado(`administracao/${destino}`)}>
                          <span className="administracao-categoria__texto">
                            <strong>{nome}</strong>
                            <small>{descricao}</small>
                          </span>
                          <svg aria-hidden="true" viewBox="0 0 16 16">
                            <path d="M3 8h9M8 3l5 5-5 5" />
                          </svg>
                        </a>
                      </li>
                    ))}
                  </ul>
                </section>
              ))}
            </div>
          </section>
        </>
      ) : null}
    </>
  )
}

export default function PaginaAdministracao({ secao, sessao, rascunhos, aoAlterar, submissoes }) {
  if (secao === 'usuarios')
    return (
      <main id="conteudo" className="pagina-painel">
        <GestaoUsuarios token={sessao.token} />
      </main>
    )
  if (secao === 'professores')
    return (
      <main id="conteudo" className="pagina-painel">
        <GestaoProfessores token={sessao.token} />
      </main>
    )
  if (['cursos', 'disciplinas', 'projetos'].includes(secao))
    return (
      <main id="conteudo" className="pagina-painel">
        <GestaoConteudos
          key={secao}
          dominio={secao}
          itens={rascunhos[secao]}
          cursos={rascunhos.cursos}
          disciplinas={rascunhos.disciplinas}
          token={sessao.token}
          aoAlterar={(itens) => aoAlterar(secao, itens)}
        />
      </main>
    )
  if (secao === 'submissoes')
    return (
      <main id="conteudo" className="pagina-painel">
        <header className="painel-titulo">
          <div>
            <h1>Submissões do portal</h1>
            <p>Consulte as submissões de todos os cursos.</p>
          </div>
        </header>
        <section className="painel-secao">
          <TabelaSubmissoes itens={submissoes} somenteConsulta />
        </section>
        <p className="gestao-nota">
          As submissões aparecerão aqui quando o serviço estiver conectado. Nenhum dado de exemplo é
          exibido.
        </p>
      </main>
    )
  return (
    <main id="conteudo" className="pagina-painel">
      <PainelAdministracao token={sessao.token} />
    </main>
  )
}
