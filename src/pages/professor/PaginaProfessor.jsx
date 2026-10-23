import { useMemo, useState } from 'react'
import './professor.css'
import { basePortal, enderecoPrivado } from '../../app/rotas.js'

const filtros = ['Todas', 'Aguardando Orientador', 'Em análise', 'Aprovado', 'Recusado']

function orientaSubmissao(item, usuario) {
  if (item.orientadorId && usuario?.professorId) {
    return String(item.orientadorId) === String(usuario.professorId)
  }
  const nomeOrientador = item.orientador?.toLocaleLowerCase('pt-BR') || ''
  const nomeUsuario = usuario?.nome?.toLocaleLowerCase('pt-BR') || ''
  return Boolean(nomeOrientador && nomeUsuario && nomeOrientador.includes(nomeUsuario))
}

export default function PaginaProfessor({ submissoes, usuario }) {
  const [filtro, definirFiltro] = useState('Todas')
  const [tipoFiltro, definirTipoFiltro] = useState('Todos')
  const orientacoes = useMemo(
    () =>
      submissoes.filter(
        (item) =>
          orientaSubmissao(item, usuario) &&
          item.tipoAutor !== 'PROFESSOR' &&
          item.tipoAutor !== 'COORDENADOR',
      ),
    [submissoes, usuario],
  )

  const resultados = useMemo(
    () =>
      orientacoes.filter(
        (item) =>
          (filtro === 'Todas' || item.status === filtro) &&
          (tipoFiltro === 'Todos' || item.tipo === tipoFiltro),
      ),
    [filtro, orientacoes, tipoFiltro],
  )

  const tipos = ['Todos', ...new Set(orientacoes.map((item) => item.tipo))]

  return (
    <main id="conteudo" className="limite pagina-professor">
      <div className="pagina-professor__topo">
        <div>
          <h1>Submissões para acompanhar</h1>
          <p>
            Veja somente as submissões em que você consta como orientador e faça a avaliação
            inicial.
          </p>
        </div>
        <a className="botao-primario" href={`${basePortal}#submeter`}>
          Submeter projeto
        </a>
      </div>

      <div className="pagina-professor__layout">
        <aside className="pagina-professor__filtro-painel" aria-label="Filtros de submissões">
          <div>
            <span className="pagina-professor__filtro-etiqueta">Visualização</span>
            <strong>Filtrar submissões</strong>
            <p>Encontre projetos por tipo ou etapa da orientação.</p>
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
                    ? orientacoes.length
                    : orientacoes.filter((item) => item.status === opcao).length}
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
              const status = item.status
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
