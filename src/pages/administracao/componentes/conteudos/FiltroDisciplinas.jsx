import { useEffect, useMemo, useRef, useState } from 'react'
import { Check, ChevronDown, Search, X } from 'lucide-react'
import './filtro-disciplinas.css'

const MAX_ATALHOS_CURSOS = 6

function normalizar(texto = '') {
  return String(texto)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLocaleLowerCase('pt-BR')
}

export default function FiltroDisciplinas({
  busca,
  aoMudarBusca,
  cursoFiltro,
  aoMudarCursoFiltro,
  tipoFiltro,
  aoMudarTipoFiltro,
  cursosDisponiveis,
  itensPermitidos,
  totalFiltrado,
  mostrarFiltroCurso,
}) {
  const [menuAberto, mudarMenuAberto] = useState(false)
  const [buscaCurso, mudarBuscaCurso] = useState('')
  const containerRef = useRef(null)
  const triggerRef = useRef(null)
  const campoBuscaCursoRef = useRef(null)

  const contagensPorCurso = useMemo(() => {
    const mapa = new Map()
    for (const item of itensPermitidos) {
      const chave = String(item.cursoId ?? '')
      mapa.set(chave, (mapa.get(chave) || 0) + 1)
    }
    return mapa
  }, [itensPermitidos])

  const cursosEnriquecidos = useMemo(() => {
    return cursosDisponiveis
      .map((cursoItem) => {
        const id = String(cursoItem.id)
        const sigla = cursoItem.sigla || cursoItem.acronimo || ''
        const nome = cursoItem.nome || sigla || `Curso ${id}`
        const campus = cursoItem.campus || cursoItem.campusNome || ''
        const total = contagensPorCurso.get(id) || 0
        return {
          id,
          sigla: sigla || nome,
          nome,
          campus,
          total,
          textoBusca: normalizar(`${sigla} ${nome} ${campus}`),
        }
      })
      .sort((a, b) => {
        if (b.total !== a.total) return b.total - a.total
        const cmpSigla = a.sigla.localeCompare(b.sigla, 'pt-BR')
        if (cmpSigla !== 0) return cmpSigla
        return a.campus.localeCompare(b.campus, 'pt-BR')
      })
  }, [cursosDisponiveis, contagensPorCurso])

  const cursosComDisciplinas = useMemo(
    () => cursosEnriquecidos.filter((c) => c.total > 0),
    [cursosEnriquecidos],
  )

  const cursosFiltrados = useMemo(() => {
    const termo = normalizar(buscaCurso.trim())
    if (!termo) return cursosEnriquecidos
    return cursosEnriquecidos.filter((c) => c.textoBusca.includes(termo))
  }, [cursosEnriquecidos, buscaCurso])

  const gruposPopover = useMemo(() => {
    const ativos = cursosFiltrados.filter((c) => c.total > 0)
    const vazios = cursosFiltrados.filter((c) => c.total === 0)
    return { ativos, vazios }
  }, [cursosFiltrados])

  const cursoAtual = useMemo(
    () => cursosEnriquecidos.find((c) => c.id === cursoFiltro) || null,
    [cursosEnriquecidos, cursoFiltro],
  )

  const temFiltroAtivo =
    Boolean(busca.trim()) ||
    (mostrarFiltroCurso && cursoFiltro !== 'todos') ||
    tipoFiltro !== 'todos'

  useEffect(() => {
    if (!menuAberto) return undefined
    const frame = requestAnimationFrame(() => campoBuscaCursoRef.current?.focus())

    function aoClicarFora(evento) {
      if (containerRef.current && !containerRef.current.contains(evento.target)) {
        mudarMenuAberto(false)
      }
    }

    function aoPressionarTecla(evento) {
      if (evento.key === 'Escape') {
        mudarMenuAberto(false)
        triggerRef.current?.focus()
      }
    }

    document.addEventListener('mousedown', aoClicarFora)
    document.addEventListener('keydown', aoPressionarTecla)
    return () => {
      cancelAnimationFrame(frame)
      document.removeEventListener('mousedown', aoClicarFora)
      document.removeEventListener('keydown', aoPressionarTecla)
    }
  }, [menuAberto])

  function selecionarCurso(id) {
    aoMudarCursoFiltro(id)
    mudarMenuAberto(false)
    mudarBuscaCurso('')
    triggerRef.current?.focus()
  }

  function limparFiltros() {
    aoMudarBusca('')
    aoMudarCursoFiltro('todos')
    aoMudarTipoFiltro('todos')
  }

  return (
    <div className="filtro-disciplinas" role="search" aria-label="Filtros de disciplinas">
      <div className="filtro-disciplinas__barra">
        <div className="filtro-disciplinas__campo filtro-disciplinas__campo--busca">
          <label htmlFor="busca-disciplina">Buscar matéria</label>
          <div className="filtro-disciplinas__input-wrap">
            <Search className="filtro-disciplinas__icone" size={16} aria-hidden="true" />
            <input
              id="busca-disciplina"
              type="search"
              placeholder="Nome ou código da disciplina"
              value={busca}
              onChange={(e) => aoMudarBusca(e.target.value)}
            />
          </div>
        </div>

        {mostrarFiltroCurso && (
          <div className="filtro-disciplinas__campo filtro-disciplinas__campo--curso" ref={containerRef}>
            <span className="filtro-disciplinas__rotulo" id="rotulo-filtro-curso">
              Curso
            </span>
            <button
              ref={triggerRef}
              type="button"
              className={`filtro-disciplinas__trigger ${menuAberto ? 'filtro-disciplinas__trigger--aberto' : ''}`}
              aria-haspopup="listbox"
              aria-expanded={menuAberto}
              aria-labelledby="rotulo-filtro-curso"
              onClick={() => mudarMenuAberto((atual) => !atual)}
            >
              <span className="filtro-disciplinas__trigger-texto">
                {cursoAtual ? (
                  <>
                    <strong>{cursoAtual.sigla}</strong>
                    {cursoAtual.campus && <small>{cursoAtual.campus}</small>}
                  </>
                ) : (
                  <span>Todos os cursos</span>
                )}
              </span>
              <span className="filtro-disciplinas__trigger-meta">
                <span className="filtro-disciplinas__contagem">
                  {cursoAtual ? cursoAtual.total : itensPermitidos.length}
                </span>
                <ChevronDown size={16} aria-hidden="true" />
              </span>
            </button>

            {menuAberto && (
              <div className="filtro-disciplinas__popover" role="dialog" aria-label="Selecionar curso">
                <div className="filtro-disciplinas__popover-busca">
                  <Search size={15} aria-hidden="true" />
                  <input
                    ref={campoBuscaCursoRef}
                    type="search"
                    placeholder="Filtrar por sigla, nome ou campus…"
                    value={buscaCurso}
                    onChange={(e) => mudarBuscaCurso(e.target.value)}
                    aria-label="Filtrar cursos na lista"
                  />
                  {buscaCurso && (
                    <button
                      type="button"
                      className="filtro-disciplinas__limpar-busca"
                      onClick={() => mudarBuscaCurso('')}
                      aria-label="Limpar busca de curso"
                    >
                      <X size={14} aria-hidden="true" />
                    </button>
                  )}
                </div>

                <div className="filtro-disciplinas__lista" role="listbox" aria-label="Cursos disponíveis">
                  {!buscaCurso.trim() && (
                    <button
                      type="button"
                      role="option"
                      aria-selected={cursoFiltro === 'todos'}
                      className="filtro-disciplinas__opcao filtro-disciplinas__opcao--todos"
                      onClick={() => selecionarCurso('todos')}
                    >
                      <span className="filtro-disciplinas__opcao-info">
                        <strong>Todos os cursos</strong>
                        <small>{cursosEnriquecidos.length} cursos cadastrados</small>
                      </span>
                      <span className="filtro-disciplinas__opcao-fim">
                        <span className="filtro-disciplinas__contagem filtro-disciplinas__contagem--ativo">
                          {itensPermitidos.length}
                        </span>
                        {cursoFiltro === 'todos' && <Check size={15} aria-hidden="true" />}
                      </span>
                    </button>
                  )}

                  {gruposPopover.ativos.length > 0 && (
                    <div className="filtro-disciplinas__grupo">
                      <div className="filtro-disciplinas__grupo-titulo">
                        Com disciplinas ({gruposPopover.ativos.length})
                      </div>
                      {gruposPopover.ativos.map((cursoItem) => {
                        const selecionado = cursoFiltro === cursoItem.id
                        return (
                          <button
                            key={cursoItem.id}
                            type="button"
                            role="option"
                            aria-selected={selecionado}
                            className="filtro-disciplinas__opcao"
                            onClick={() => selecionarCurso(cursoItem.id)}
                          >
                            <span className="filtro-disciplinas__opcao-info">
                              <span className="filtro-disciplinas__opcao-linha">
                                <span className="filtro-disciplinas__sigla">{cursoItem.sigla}</span>
                                <strong>{cursoItem.nome}</strong>
                              </span>
                              {cursoItem.campus && <small>{cursoItem.campus}</small>}
                            </span>
                            <span className="filtro-disciplinas__opcao-fim">
                              <span className="filtro-disciplinas__contagem filtro-disciplinas__contagem--ativo">
                                {cursoItem.total}
                              </span>
                              {selecionado && <Check size={15} aria-hidden="true" />}
                            </span>
                          </button>
                        )
                      })}
                    </div>
                  )}

                  {gruposPopover.vazios.length > 0 && (
                    <div className="filtro-disciplinas__grupo">
                      <div className="filtro-disciplinas__grupo-titulo">
                        Sem disciplinas ({gruposPopover.vazios.length})
                      </div>
                      {gruposPopover.vazios.map((cursoItem) => {
                        const selecionado = cursoFiltro === cursoItem.id
                        return (
                          <button
                            key={cursoItem.id}
                            type="button"
                            role="option"
                            aria-selected={selecionado}
                            className="filtro-disciplinas__opcao filtro-disciplinas__opcao--vazio"
                            onClick={() => selecionarCurso(cursoItem.id)}
                          >
                            <span className="filtro-disciplinas__opcao-info">
                              <span className="filtro-disciplinas__opcao-linha">
                                <span className="filtro-disciplinas__sigla">{cursoItem.sigla}</span>
                                <strong>{cursoItem.nome}</strong>
                              </span>
                              {cursoItem.campus && <small>{cursoItem.campus}</small>}
                            </span>
                            <span className="filtro-disciplinas__opcao-fim">
                              <span className="filtro-disciplinas__contagem">0</span>
                              {selecionado && <Check size={15} aria-hidden="true" />}
                            </span>
                          </button>
                        )
                      })}
                    </div>
                  )}

                  {cursosFiltrados.length === 0 && (
                    <p className="filtro-disciplinas__sem-resultados">
                      Nenhum curso encontrado para “{buscaCurso}”.
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        <div className="filtro-disciplinas__campo filtro-disciplinas__campo--tipo">
          <span className="filtro-disciplinas__rotulo" id="rotulo-filtro-tipo">
            Tipo
          </span>
          <div
            className="filtro-disciplinas__segmentado"
            role="group"
            aria-labelledby="rotulo-filtro-tipo"
          >
            {[
              ['todos', 'Todas'],
              ['obrigatoria', 'Obrigatórias'],
              ['optativa', 'Optativas'],
            ].map(([valor, rotulo]) => (
              <button
                key={valor}
                type="button"
                aria-pressed={tipoFiltro === valor}
                onClick={() => aoMudarTipoFiltro(valor)}
              >
                {rotulo}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="filtro-disciplinas__rodape">
        {mostrarFiltroCurso && cursosComDisciplinas.length > 0 ? (
          <div className="filtro-disciplinas__atalhos" role="group" aria-label="Cursos com disciplinas">
            <button
              type="button"
              className="filtro-disciplinas__atalho"
              aria-pressed={cursoFiltro === 'todos'}
              onClick={() => aoMudarCursoFiltro('todos')}
            >
              Todas <span>{itensPermitidos.length}</span>
            </button>
            {cursosComDisciplinas.slice(0, MAX_ATALHOS_CURSOS).map((cursoItem) => (
              <button
                key={cursoItem.id}
                type="button"
                className="filtro-disciplinas__atalho"
                aria-pressed={cursoFiltro === cursoItem.id}
                onClick={() => aoMudarCursoFiltro(cursoItem.id)}
                title={`${cursoItem.nome}${cursoItem.campus ? ` — ${cursoItem.campus}` : ''}`}
              >
                {cursoItem.sigla}
                {cursoItem.campus ? ` · ${cursoItem.campus}` : ''}
                <span>{cursoItem.total}</span>
              </button>
            ))}
            {cursosComDisciplinas.length > MAX_ATALHOS_CURSOS && (
              <button
                type="button"
                className="filtro-disciplinas__mais"
                onClick={() => mudarMenuAberto(true)}
              >
                +{cursosComDisciplinas.length - MAX_ATALHOS_CURSOS} cursos
              </button>
            )}
          </div>
        ) : (
          <span />
        )}

        <div className="filtro-disciplinas__resumo">
          <span className="filtro-disciplinas__total">
            {totalFiltrado === itensPermitidos.length
              ? `${totalFiltrado} ${totalFiltrado === 1 ? 'disciplina' : 'disciplinas'}`
              : `${totalFiltrado} de ${itensPermitidos.length} disciplinas`}
          </span>
          {temFiltroAtivo && (
            <button
              type="button"
              className="filtro-disciplinas__limpar"
              onClick={limparFiltros}
            >
              Limpar filtros
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
