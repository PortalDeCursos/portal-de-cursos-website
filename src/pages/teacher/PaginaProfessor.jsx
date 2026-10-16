import { useMemo, useState } from 'react'
import { submissoes } from '../../data/submissoes.js'
import './professor.css'
import { enderecoPrivado } from '../../app/rotas.js'

const filtros = ['Todas', 'Em análise', 'Aceito', 'Recusado']

function statusDaSubmissao(item, decisoes) {
  return decisoes[item.identificador] || item.status
}

export default function PaginaProfessor() {
  const [filtro, definirFiltro] = useState('Todas')
  const [tipoFiltro, definirTipoFiltro] = useState('Todos')
  const [decisoes] = useState({})

  const resultados = useMemo(
    () =>
      submissoes.filter(
        (item) =>
          (filtro === 'Todas' || statusDaSubmissao(item, decisoes) === filtro) &&
          (tipoFiltro === 'Todos' || item.tipo === tipoFiltro),
      ),
    [decisoes, filtro, tipoFiltro],
  )

  const tipos = ['Todos', ...new Set(submissoes.map((item) => item.tipo))]

  return (
    <main id="conteudo" className="limite pagina-professor">
      <div className="pagina-professor__topo">
        <div>
          <h1>Submissões para acompanhar</h1>
          <p>Abra um projeto para revisar os detalhes e registrar sua decisão.</p>
        </div>
      </div>

      <div className="pagina-professor__layout">
        <aside className="pagina-professor__filtro-painel" aria-label="Filtros de submissões">
          <div>
            <span className="pagina-professor__filtro-etiqueta">Visualização</span>
            <strong>Filtrar submissões</strong>
            <p>Encontre projetos por tipo ou etapa de avaliação.</p>
          </div>
          <nav className="pagina-professor__filtros" aria-label="Filtrar por status">
            {filtros.map((opcao) => (
              <button
                className={filtro === opcao ? 'pagina-professor__filtro--ativo' : ''}
                type="button"
                key={opcao}
                aria-pressed={filtro === opcao}
                onClick={() => definirFiltro(opcao)}
              >
                <span>{opcao}</span>
                <small>
                  {opcao === 'Todas'
                    ? submissoes.length
                    : submissoes.filter((item) => statusDaSubmissao(item, decisoes) === opcao)
                        .length}
                </small>
              </button>
            ))}
          </nav>
          <label className="pagina-professor__tipo">
            <span>Tipo de produção</span>
            <select
              value={tipoFiltro}
              onChange={(evento) => definirTipoFiltro(evento.target.value)}
            >
              {tipos.map((tipo) => (
                <option value={tipo} key={tipo}>
                  {tipo}
                </option>
              ))}
            </select>
          </label>
        </aside>

        <section className="pagina-professor__resultados" aria-label="Feed de submissões">
          <div className="pagina-professor__feed-cabecalho">
            <strong>{resultados.length} submissões</strong>
            <span>mais recentes</span>
          </div>
          <div className="lista-submissoes">
            {resultados.map((item) => {
              const status = statusDaSubmissao(item, decisoes)
              return (
                <article className="submissao-feed" key={item.identificador}>
                  <a
                    href={enderecoPrivado(`professor/submissao/${item.identificador}`)}
                    className="submissao-feed__gatilho"
                  >
                    <span className="submissao-feed__marcador" aria-hidden="true" />
                    <span className="submissao-feed__conteudo">
                      <span className="submissao-feed__meta">
                        {item.autor} enviou · {item.enviadoEm}
                      </span>
                      <strong>{item.titulo}</strong>
                      <span className="submissao-feed__rodape">
                        <span
                          className={`status status--${status.toLowerCase().replace(' ', '-')}`}
                        >
                          {status}
                        </span>
                        <span>
                          {item.tipo} · {item.curso}
                        </span>
                      </span>
                    </span>
                    <span className="submissao-feed__expandir">Abrir projeto</span>
                  </a>
                </article>
              )
            })}
          </div>
          {!resultados.length && (
            <div className="pagina-professor__vazio">
              <h2>Nenhuma submissão neste filtro</h2>
              <p>Escolha outro status para continuar a revisão.</p>
            </div>
          )}
        </section>
      </div>
    </main>
  )
}
