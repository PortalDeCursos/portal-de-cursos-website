import { useEffect, useMemo, useRef, useState } from 'react'
import { Check, ChevronDown, Search, X } from 'lucide-react'
import './filtro-disciplinas.css'

function normalizar(texto = '') {
  return String(texto)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLocaleLowerCase('pt-BR')
}

export default function SeletorCursoPesquisavel({
  id,
  ariaDescribedBy,
  value = '',
  disabled = false,
  required = false,
  cursos = [],
  dominio = 'disciplinas',
  aoAlterar,
}) {
  const [aberto, mudarAberto] = useState(false)
  const [busca, mudarBusca] = useState('')
  const containerRef = useRef(null)
  const triggerRef = useRef(null)
  const inputBuscaRef = useRef(null)

  const opcoes = useMemo(() => {
    return cursos
      .map((itemCurso) => {
        const valor = String(
          ['disciplinas', 'projetos'].includes(dominio)
            ? itemCurso.id
            : itemCurso.identificador || itemCurso.id,
        )
        const sigla = itemCurso.sigla || itemCurso.acronimo || ''
        const nome = itemCurso.nome || sigla || `Curso ${valor}`
        const campus = itemCurso.campus || itemCurso.campusNome || ''
        const turno = itemCurso.turno || ''
        return {
          valor,
          sigla: sigla || nome,
          nome,
          campus,
          turno,
          textoBusca: normalizar(`${sigla} ${nome} ${campus} ${turno}`),
        }
      })
      .sort((a, b) => {
        const cmpNome = a.nome.localeCompare(b.nome, 'pt-BR')
        if (cmpNome !== 0) return cmpNome
        return a.campus.localeCompare(b.campus, 'pt-BR')
      })
  }, [cursos, dominio])

  const filtradas = useMemo(() => {
    const termo = normalizar(busca.trim())
    if (!termo) return opcoes
    return opcoes.filter((item) => item.textoBusca.includes(termo))
  }, [opcoes, busca])

  const atual = useMemo(
    () => opcoes.find((item) => item.valor === String(value)) || null,
    [opcoes, value],
  )

  useEffect(() => {
    if (!aberto) return undefined
    const frame = requestAnimationFrame(() => inputBuscaRef.current?.focus())

    function aoClicarFora(evento) {
      if (containerRef.current && !containerRef.current.contains(evento.target)) {
        mudarAberto(false)
      }
    }

    function aoPressionarTecla(evento) {
      if (evento.key === 'Escape') {
        mudarAberto(false)
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
  }, [aberto])

  function selecionar(novoValor) {
    aoAlterar(novoValor)
    mudarAberto(false)
    mudarBusca('')
    triggerRef.current?.focus()
  }

  return (
    <div className="seletor-curso-form" ref={containerRef}>
      {required && (
        <input
          className="seletor-curso-form__validacao"
          tabIndex={-1}
          aria-hidden="true"
          required
          value={value}
          onChange={() => {}}
          onInvalid={(evento) => {
            evento.preventDefault()
            if (!disabled) mudarAberto(true)
          }}
        />
      )}

      <button
        id={id}
        ref={triggerRef}
        type="button"
        disabled={disabled}
        aria-describedby={ariaDescribedBy}
        aria-haspopup="listbox"
        aria-expanded={aberto}
        className={`filtro-disciplinas__trigger ${aberto ? 'filtro-disciplinas__trigger--aberto' : ''}`}
        onClick={() => !disabled && mudarAberto((estado) => !estado)}
      >
        <span className="filtro-disciplinas__trigger-texto">
          {atual ? (
            <>
              <span className="filtro-disciplinas__sigla">{atual.sigla}</span>
              <strong>{atual.nome}</strong>
              {atual.campus && <small>· {atual.campus}</small>}
            </>
          ) : (
            <span className="seletor-curso-form__placeholder">Selecione um curso</span>
          )}
        </span>
        <span className="filtro-disciplinas__trigger-meta">
          <ChevronDown size={16} aria-hidden="true" />
        </span>
      </button>

      {aberto && !disabled && (
        <div
          className="filtro-disciplinas__popover seletor-curso-form__popover"
          role="dialog"
          aria-label="Pesquisar curso"
        >
          <div className="filtro-disciplinas__popover-busca">
            <Search size={15} aria-hidden="true" />
            <input
              ref={inputBuscaRef}
              type="search"
              placeholder="Buscar por nome, sigla ou campus…"
              value={busca}
              onChange={(e) => mudarBusca(e.target.value)}
              aria-label="Filtrar cursos"
            />
            {busca && (
              <button
                type="button"
                className="filtro-disciplinas__limpar-busca"
                onClick={() => mudarBusca('')}
                aria-label="Limpar busca"
              >
                <X size={14} aria-hidden="true" />
              </button>
            )}
          </div>

          <div className="filtro-disciplinas__lista" role="listbox" aria-label="Cursos disponíveis">
            {filtradas.map((item) => {
              const selecionado = item.valor === String(value)
              return (
                <button
                  key={item.valor}
                  type="button"
                  role="option"
                  aria-selected={selecionado}
                  className="filtro-disciplinas__opcao"
                  onClick={() => selecionar(item.valor)}
                >
                  <span className="filtro-disciplinas__opcao-info">
                    <span className="filtro-disciplinas__opcao-linha">
                      <span className="filtro-disciplinas__sigla">{item.sigla}</span>
                      <strong>{item.nome}</strong>
                    </span>
                    {(item.campus || item.turno) && (
                      <small>{[item.campus, item.turno].filter(Boolean).join(' · ')}</small>
                    )}
                  </span>
                  {selecionado && (
                    <span className="filtro-disciplinas__opcao-fim">
                      <Check size={15} aria-hidden="true" />
                    </span>
                  )}
                </button>
              )
            })}

            {filtradas.length === 0 && (
              <p className="filtro-disciplinas__sem-resultados">
                Nenhum curso encontrado para “{busca}”.
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
