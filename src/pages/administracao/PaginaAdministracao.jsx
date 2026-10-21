import { enderecoPrivado } from '../../app/rotas.js'
import GestaoConteudos from './componentes/GestaoConteudos.jsx'
import GestaoProfessores from './componentes/GestaoProfessores.jsx'
import GestaoUsuarios from './componentes/GestaoUsuarios.jsx'
import TabelaSubmissoes from '../painel/componentes/TabelaSubmissoes.jsx'
import '../painel/painel.css'
import './administracao.css'

export default function PaginaAdministracao({ secao, sessao, rascunhos, aoAlterar, submissoes }) {
  const aguardandoOrientador = submissoes.filter((item) =>
    item.status.toLocaleLowerCase('pt-BR').includes('orientador'),
  ).length
  const emAnalise = submissoes.filter((item) =>
    item.status.toLocaleLowerCase('pt-BR').includes('análise'),
  ).length
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
            <p>
              Consulte as submissões de todos os cursos. O orientador faz a avaliação inicial e o
              coordenador decide a publicação.
            </p>
          </div>
        </header>
        <section className="painel-secao">
          <TabelaSubmissoes itens={submissoes} somenteConsulta />
        </section>
        <p className="gestao-nota">
          Consulta demonstrativa até a integração com o serviço de submissões. A avaliação cabe ao
          orientador e ao coordenador nas etapas correspondentes.
        </p>
      </main>
    )
  return (
    <main id="conteudo" className="pagina-painel">
      <header className="painel-titulo">
        <div>
          <h1>Administração do portal</h1>
          <p>Acompanhe as submissões e acesse a gestão acadêmica do portal.</p>
        </div>
      </header>
      <div className="administracao-visao">
        <section
          className="painel-secao administracao-submissoes"
          aria-labelledby="submissoes-titulo"
        >
          <header>
            <div>
              <h2 id="submissoes-titulo">Acompanhamento de submissões</h2>
              <p>Visão geral dos projetos enviados ao portal.</p>
            </div>
            <a href={enderecoPrivado('administracao/submissoes')}>
              Ver todas <span aria-hidden="true">→</span>
            </a>
          </header>
          {submissoes.length ? (
            <TabelaSubmissoes itens={submissoes} somenteConsulta />
          ) : (
            <div className="administracao-vazio">
              <strong>Nenhuma submissão para acompanhar</strong>
              <p>As submissões aparecerão aqui quando forem registradas no portal.</p>
            </div>
          )}
        </section>
        <aside className="painel-secao administracao-etapas" aria-labelledby="etapas-titulo">
          <header>
            <div>
              <h2 id="etapas-titulo">Etapas de avaliação</h2>
              <p>Consulta administrativa</p>
            </div>
          </header>
          <dl>
            <div>
              <dt>Aguardando orientador</dt>
              <dd>{aguardandoOrientador}</dd>
            </div>
            <div>
              <dt>Em análise</dt>
              <dd>{emAnalise}</dd>
            </div>
            <div className="administracao-etapas__total">
              <dt>Total de submissões</dt>
              <dd>{submissoes.length}</dd>
            </div>
          </dl>
          <p className="administracao-etapas__nota">
            A avaliação é feita pelo orientador e pelo coordenador do curso. O administrador apenas
            acompanha o andamento.
          </p>
        </aside>
      </div>
      <section className="administracao-secao-atalhos" aria-labelledby="atalhos-titulo">
        <header>
          <div>
            <h2 id="atalhos-titulo">Gestão do portal</h2>
            <p>Acesse cadastros de pessoas e da estrutura acadêmica.</p>
          </div>
        </header>
        <div className="administracao-categorias">
          {[
            {
              titulo: 'Pessoas',
              itens: [
                ['usuarios', 'Usuários', 'Contas e permissões'],
                ['professores', 'Professores', 'Equipe docente'],
              ],
            },
            {
              titulo: 'Estrutura acadêmica',
              itens: [
                ['cursos', 'Cursos', `${rascunhos.cursos.length} na versão de trabalho`],
                [
                  'disciplinas',
                  'Disciplinas',
                  `${rascunhos.disciplinas.length} na versão de trabalho`,
                ],
                ['projetos', 'Projetos', `${rascunhos.projetos.length} na versão de trabalho`],
              ],
            },
          ].map((categoria) => (
            <section className="administracao-categoria" key={categoria.titulo}>
              <h3>{categoria.titulo}</h3>
              <ul>
                {categoria.itens.map(([destino, titulo, descricao]) => (
                  <li key={destino}>
                    <a href={enderecoPrivado(`administracao/${destino}`)}>
                      <span className="administracao-categoria__texto">
                        <strong>{titulo}</strong>
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
      <p className="gestao-nota">
        A administração cuida dos coordenadores e da gestão geral do portal. Cursos e projetos desta
        versão são rascunhos em memória; a publicação depende da integração com os serviços de
        gestão.
      </p>
    </main>
  )
}
