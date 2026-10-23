import { useEffect, useMemo, useState } from 'react'
import { listarCampus, listarCursos } from '@/api/cursos.js'
import { enderecoPrivado } from '@/app/rotas.js'

function iniciais(valor = '') {
  return valor
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((parte) => parte[0])
    .join('')
    .toLocaleUpperCase('pt-BR')
}

function IconeCampus({ tipo }) {
  const desenhos = {
    cursos: (
      <>
        <path d="M3 9 12 4l9 5-9 5-9-5Z" />
        <path d="M7 11.2v4.3c3 2.3 7 2.3 10 0v-4.3M21 9v6" />
      </>
    ),
    identificacao: (
      <>
        <path d="M6 3h9l4 4v14H6a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Z" />
        <path d="M14 3v5h5M8 13h8M8 17h6" />
      </>
    ),
    descricao: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 11v5M12 8h.01" />
      </>
    ),
  }[tipo]
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {desenhos}
    </svg>
  )
}

export default function GestaoCampus({ identificador }) {
  const [campus, definirCampus] = useState([])
  const [cursos, definirCursos] = useState(null)
  const [busca, definirBusca] = useState('')
  const [estado, definirEstado] = useState('carregando')
  const [erro, definirErro] = useState('')
  const [tentativa, definirTentativa] = useState(0)

  useEffect(() => {
    const controller = new AbortController()
    Promise.all([
      listarCampus(controller.signal),
      listarCursos(controller.signal).catch(() => null),
    ])
      .then(([itensCampus, itensCursos]) => {
        if (controller.signal.aborted) return
        if (!Array.isArray(itensCampus)) throw new Error('A lista de campus recebida é inválida.')
        definirCampus(itensCampus)
        definirCursos(itensCursos)
        definirEstado('pronto')
      })
      .catch((falha) => {
        if (!controller.signal.aborted) {
          definirErro(falha.message || 'Não foi possível carregar os campus.')
          definirEstado('erro')
        }
      })
    return () => controller.abort()
  }, [tentativa])

  const resultados = useMemo(
    () =>
      campus.filter((item) =>
        `${item.nome || ''} ${item.acronimo || ''} ${item.descricao || ''}`
          .toLocaleLowerCase('pt-BR')
          .includes(busca.trim().toLocaleLowerCase('pt-BR')),
      ),
    [busca, campus],
  )

  function tentarNovamente() {
    definirEstado('carregando')
    definirErro('')
    definirTentativa((valor) => valor + 1)
  }

  if (estado === 'carregando')
    return (
      <p className="gestao-aviso" role="status">
        Carregando campus…
      </p>
    )
  if (estado === 'erro')
    return (
      <div className="gestao-aviso" role="alert">
        <p>{erro}</p>
        <button className="botao-secundario" onClick={tentarNovamente}>
          Tentar novamente
        </button>
      </div>
    )

  const selecionado = identificador
    ? campus.find((item) => String(item.id) === identificador)
    : null

  if (identificador && !selecionado)
    return (
      <section className="painel-secao campus-vazio">
        <h1>Campus não encontrado</h1>
        <p>Não foi possível localizar esta unidade nos dados disponíveis.</p>
        <a className="botao-secundario" href={enderecoPrivado('administracao/campus')}>
          Voltar para Campus
        </a>
      </section>
    )

  if (selecionado) {
    const cursosVinculados = cursos?.filter(
      (curso) => String(curso.campusId ?? '') === String(selecionado.id),
    )
    return (
      <>
        <nav className="campus-caminho" aria-label="Caminho da página">
          <a href={enderecoPrivado('administracao/cursos')}>Estrutura acadêmica</a>
          <span aria-hidden="true">›</span>
          <a href={enderecoPrivado('administracao/campus')}>Campus</a>
          <span aria-hidden="true">›</span>
          <span aria-current="page">{selecionado.nome}</span>
        </nav>
        <a className="campus-voltar" href={enderecoPrivado('administracao/campus')}>
          <span aria-hidden="true">←</span> Voltar para Campus
        </a>
        <header className="painel-titulo campus-detalhe-titulo">
          <div>
            <span className="administracao-boas-vindas__rotulo">
              Campus{selecionado.id != null ? ` · #${selecionado.id}` : ''}
            </span>
            <h1>{selecionado.nome}</h1>
            {selecionado.descricao && <p>{selecionado.descricao}</p>}
          </div>
          {selecionado.acronimo && <span className="campus-sigla">{selecionado.acronimo}</span>}
        </header>
        <div className="campus-detalhe-grade">
          <section className="campus-detalhe-cartao">
            <header>
              <span className="campus-detalhe-icone">
                <IconeCampus tipo="cursos" />
              </span>
              <div>
                <h2>Cursos vinculados</h2>
                <p>Formações associadas a esta unidade.</p>
              </div>
            </header>
            {cursosVinculados ? (
              <strong className="campus-detalhe-valor">{cursosVinculados.length}</strong>
            ) : (
              <span className="campus-detalhe-valor campus-detalhe-valor--texto">Indisponível</span>
            )}
          </section>
          <section className="campus-detalhe-cartao">
            <header>
              <span className="campus-detalhe-icone">
                <IconeCampus tipo="identificacao" />
              </span>
              <div>
                <h2>Identificação</h2>
                <p>Dados cadastrados para esta unidade.</p>
              </div>
            </header>
            <dl>
              {selecionado.nome && (
                <div>
                  <dt>Nome</dt>
                  <dd>{selecionado.nome}</dd>
                </div>
              )}
              {selecionado.acronimo && (
                <div>
                  <dt>Acrônimo</dt>
                  <dd>{selecionado.acronimo}</dd>
                </div>
              )}
            </dl>
          </section>
          <section className="campus-detalhe-cartao">
            <header>
              <span className="campus-detalhe-icone">
                <IconeCampus tipo="descricao" />
              </span>
              <div>
                <h2>Descrição</h2>
                <p>Texto institucional disponível no serviço.</p>
              </div>
            </header>
            <p className="campus-detalhe-descricao">
              {selecionado.descricao || 'Sem descrição cadastrada.'}
            </p>
          </section>
        </div>
      </>
    )
  }

  return (
    <>
      <header className="painel-titulo">
        <div>
          <span className="administracao-boas-vindas__rotulo">Estrutura acadêmica</span>
          <h1>Campus</h1>
          <p>Unidades físicas e polos cadastrados no portal.</p>
        </div>
      </header>
      <section className="painel-secao campus-lista">
        <label className="gestao-busca">
          Buscar campus
          <input
            type="search"
            value={busca}
            onChange={(evento) => definirBusca(evento.target.value)}
            placeholder="Nome, acrônimo ou descrição"
          />
        </label>
        <div
          className="tabela-submissoes"
          role="region"
          aria-label="Campus cadastrados"
          tabIndex={0}
        >
          <table>
            <thead>
              <tr>
                <th scope="col">Nome</th>
                <th scope="col">Sigla</th>
                <th scope="col">Descrição</th>
              </tr>
            </thead>
            <tbody>
              {resultados.map((item) => (
                <tr key={item.id ?? item.nome}>
                  <th scope="row">
                    {item.id != null ? (
                      <a
                        href={enderecoPrivado(
                          `administracao/campus/${encodeURIComponent(item.id)}`,
                        )}
                      >
                        {item.nome}
                      </a>
                    ) : (
                      item.nome
                    )}
                  </th>
                  <td>
                    <span className="campus-lista-sigla">
                      {item.acronimo || iniciais(item.nome)}
                    </span>
                  </td>
                  <td>{item.descricao || '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {!resultados.length && <p className="painel-vazio">Nenhum campus encontrado.</p>}
        <p className="campus-lista-contagem">
          {resultados.length} de {campus.length} campus
        </p>
      </section>
      <p className="gestao-nota">
        Esta tela consulta os campus disponíveis. O serviço atual não oferece operações de cadastro
        ou edição de campus.
      </p>
    </>
  )
}
