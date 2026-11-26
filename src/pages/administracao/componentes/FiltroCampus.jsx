import { useEffect, useMemo, useRef, useState } from 'react'
import { Check, ChevronDown, MapPin, Search, X } from 'lucide-react'
import './conteudos/filtro-disciplinas.css'

const MAX_ATALHOS_CIDADES = 5

function normalizar(texto = '') {
  return String(texto)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLocaleLowerCase('pt-BR')
}

export default function FiltroCampus({
  busca,
  aoMudarBusca,
  cidadeFiltro,
  aoMudarCidadeFiltro,
  campus,
  totalFiltrado,
}) {
  const [menuAberto, mudarMenuAberto] = useState(false)
  const [buscaCidade, mudarBuscaCidade] = useState('')
  const containerRef = useRef(null)
  const triggerRef = useRef(null)
  const campoBuscaCidadeRef = useRef(null)

  const cidadesEnriquecidas = useMemo(() => {
    const mapa = new Map()
    for (const item of campus) {
      const nome = item.cidade?.trim()
      if (!nome) continue
      mapa.set(nome, (mapa.get(nome) || 0) + 1)
    }
    return [...mapa.entries()]
      .map(([nome, total]) => ({
        nome,
        total,
        textoBusca: normalizar(nome),
      }))
      .sort((a, b) => {
        if (b.total !== a.total) return b.total - a.total
        return a.nome.localeCompare(b.nome, 'pt-BR')
      })
  }, [campus])

  const cidadesFiltradas = useMemo(() => {
    const termo = normalizar(buscaCidade.trim())
    if (!termo) return cidadesEnriquecidas
    return cidadesEnriquecidas.filter((c) => c.textoBusca.includes(termo))
  }, [cidadesEnriquecidas, buscaCidade])

  const cidadeAtual = useMemo(
    () => cidadesEnriquecidas.find((c) => c.nome === cidadeFiltro) || null,
    [cidadesEnriquecidas, cidadeFiltro],
  )

  const atalhos = useMemo(() => {
    const comVarios = cidadesEnriquecidas.filter((c) => c.total > 1)
    if (comVarios.length > 0) return comVarios.slice(0, MAX_ATALHOS_CIDADES)
    return cidadesEnriquecidas.slice(0, MAX_ATALHOS_CIDADES)
  }, [cidadesEnriquecidas])

  const temFiltroAtivo = Boolean(busca.trim()) || cidadeFiltro !== 'todas'

  useEffect(() => {
    if (!menuAberto) return undefined
    const frame = requestAnimationFrame(() => campoBuscaCidadeRef.current?.focus())

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

  function selecionarCidade(valor) {
    aoMudarCidadeFiltro(valor)
    mudarMenuAberto(false)
    mudarBuscaCidade('')
    triggerRef.current?.focus()
  }

  function limparFiltros() {
    aoMudarBusca('')
    aoMudarCidadeFiltro('todas')
  }

  return (
    <div className="filtro-disciplinas" role="search" aria-label="Filtros de campus">
      <div className="filtro-disciplinas__barra filtro-disciplinas__barra--duas-colunas">
        <div className="filtro-disciplinas__campo filtro-disciplinas__campo--busca">
          <label htmlFor="busca-campus">Buscar campus</label>
          <div className="filtro-disciplinas__input-wrap">
            <Search className="filtro-disciplinas__icone" size={16} aria-hidden="true" />
            <input
              id="busca-campus"
              type="search"
              placeholder="Nome, acrônimo, cidade ou endereço"
              value={busca}
              onChange={(e) => aoMudarBusca(e.target.value)}
            />
          </div>
        </div>

        {cidadesEnriquecidas.length > 0 && (
          <div className="filtro-disciplinas__campo filtro-disciplinas__campo--curso" ref={containerRef}>
            <span className="filtro-disciplinas__rotulo" id="rotulo-filtro-cidade">
              Cidade
            </span>
            <button
              ref={triggerRef}
              type="button"
              className={`filtro-disciplinas__trigger ${menuAberto ? 'filtro-disciplinas__trigger--aberto' : ''}`}
              aria-haspopup="listbox"
              aria-expanded={menuAberto}
              aria-labelledby="rotulo-filtro-cidade"
              onClick={() => mudarMenuAberto((atual) => !atual)}
            >
              <span className="filtro-disciplinas__trigger-texto">
                <MapPin size={15} aria-hidden="true" />
                {cidadeAtual ? <strong>{cidadeAtual.nome}</strong> : <span>Todas as cidades</span>}
              </span>
              <span className="filtro-disciplinas__trigger-meta">
                <span className="filtro-disciplinas__contagem">
                  {cidadeAtual ? cidadeAtual.total : campus.length}
                </span>
                <ChevronDown size={16} aria-hidden="true" />
              </span>
            </button>

            {menuAberto && (
              <div className="filtro-disciplinas__popover" role="dialog" aria-label="Selecionar cidade">
                <div className="filtro-disciplinas__popover-busca">
                  <Search size={15} aria-hidden="true" />
                  <input
                    ref={campoBuscaCidadeRef}
                    type="search"
                    placeholder="Filtrar cidade…"
                    value={buscaCidade}
                    onChange={(e) => mudarBuscaCidade(e.target.value)}
                    aria-label="Filtrar cidades na lista"
                  />
                  {buscaCidade && (
                    <button
                      type="button"
                      className="filtro-disciplinas__limpar-busca"
                      onClick={() => mudarBuscaCidade('')}
                      aria-label="Limpar busca de cidade"
                    >
                      <X size={14} aria-hidden="true" />
                    </button>
                  )}
                </div>

                <div className="filtro-disciplinas__lista" role="listbox" aria-label="Cidades disponíveis">
                  {!buscaCidade.trim() && (
                    <button
                      type="button"
                      role="option"
                      aria-selected={cidadeFiltro === 'todas'}
                      className="filtro-disciplinas__opcao filtro-disciplinas__opcao--todos"
                      onClick={() => selecionarCidade('todas')}
                    >
                      <span className="filtro-disciplinas__opcao-info">
                        <strong>Todas as cidades</strong>
                        <small>{cidadesEnriquecidas.length} municípios cadastrados</small>
                      </span>
                      <span className="filtro-disciplinas__opcao-fim">
                        <span className="filtro-disciplinas__contagem filtro-disciplinas__contagem--ativo">
                          {campus.length}
                        </span>
                        {cidadeFiltro === 'todas' && <Check size={15} aria-hidden="true" />}
                      </span>
                    </button>
                  )}

                  {cidadesFiltradas.map((cidadeItem) => {
                    const selecionado = cidadeFiltro === cidadeItem.nome
                    return (
                      <button
                        key={cidadeItem.nome}
                        type="button"
                        role="option"
                        aria-selected={selecionado}
                        className="filtro-disciplinas__opcao"
                        onClick={() => selecionarCidade(cidadeItem.nome)}
                      >
                        <span className="filtro-disciplinas__opcao-info">
                          <strong>{cidadeItem.nome}</strong>
                        </span>
                        <span className="filtro-disciplinas__opcao-fim">
                          <span
                            className={`filtro-disciplinas__contagem ${
                              cidadeItem.total > 1 ? 'filtro-disciplinas__contagem--ativo' : ''
                            }`}
                          >
                            {cidadeItem.total}
                          </span>
                          {selecionado && <Check size={15} aria-hidden="true" />}
                        </span>
                      </button>
                    )
                  })}

                  {cidadesFiltradas.length === 0 && (
                    <p className="filtro-disciplinas__sem-resultados">
                      Nenhuma cidade encontrada para “{buscaCidade}”.
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="filtro-disciplinas__rodape">
        {cidadesEnriquecidas.length > 0 ? (
          <div className="filtro-disciplinas__atalhos" role="group" aria-label="Atalhos de cidades">
            <button
              type="button"
              className="filtro-disciplinas__atalho"
              aria-pressed={cidadeFiltro === 'todas'}
              onClick={() => aoMudarCidadeFiltro('todas')}
            >
              Todas <span>{campus.length}</span>
            </button>
            {atalhos.map((cidadeItem) => (
              <button
                key={cidadeItem.nome}
                type="button"
                className="filtro-disciplinas__atalho"
                aria-pressed={cidadeFiltro === cidadeItem.nome}
                onClick={() => aoMudarCidadeFiltro(cidadeItem.nome)}
              >
                {cidadeItem.nome} <span>{cidadeItem.total}</span>
              </button>
            ))}
            {cidadesEnriquecidas.length > atalhos.length && (
              <button
                type="button"
                className="filtro-disciplinas__mais"
                onClick={() => mudarMenuAberto(true)}
              >
                +{cidadesEnriquecidas.length - atalhos.length} cidades
              </button>
            )}
          </div>
        ) : (
          <span />
        )}

        <div className="filtro-disciplinas__resumo">
          <span className="filtro-disciplinas__total">
            {totalFiltrado === campus.length
              ? `${totalFiltrado} campus`
              : `${totalFiltrado} de ${campus.length} campus`}
          </span>
          {temFiltroAtivo && (
            <button type="button" className="filtro-disciplinas__limpar" onClick={limparFiltros}>
              Limpar filtros
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
