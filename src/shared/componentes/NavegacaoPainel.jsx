import { useId, useRef, useState } from 'react'
import { enderecoPrivado } from '@/app/rotas.js'
import Icone from './Icone.jsx'
import { Avatar } from './Cabecalho.jsx'
import './navegacao-painel.css'

export default function NavegacaoPainel({ area, titulo, papel, grupos, rota, usuario, aoSair }) {
  const [aberto, definirAberto] = useState(false)
  const [compacto, definirCompacto] = useState(false)
  const [busca, definirBusca] = useState('')
  const campoBusca = useRef(null)
  const idMenu = useId()
  const termo = normalizar(busca.trim())
  const resultados = grupos.map((grupo) => ({
    ...grupo,
    itens: grupo.itens.filter(([, nome, , descricao]) => normalizar(`${nome} ${descricao}`).includes(termo)),
  })).filter((grupo) => grupo.itens.length)

  return (
    <aside className="navegacao-painel" data-compacto={compacto}>
      <div className="navegacao-painel__cabecalho">
        <button className="navegacao-painel__toggle" type="button" aria-expanded={aberto}
          aria-controls={idMenu} onClick={() => definirAberto(!aberto)}>
          {aberto ? 'Fechar menu' : 'Menu'}
        </button>
      </div>

      <div id={idMenu} className="navegacao-painel__corpo" data-aberto={aberto}>
        <div className="navegacao-painel__barra">
          <button className="navegacao-painel__buscar" type="button" aria-label="Buscar no menu"
            title="Buscar no menu" onClick={() => {
              definirCompacto(false)
              requestAnimationFrame(() => campoBusca.current?.focus())
            }}>
            <span aria-hidden="true"><Icone nome="pesquisar" /></span>
          </button>
          <label className="navegacao-painel__busca">
            <span aria-hidden="true"><Icone nome="pesquisar" /></span>
            <input ref={campoBusca} type="search" aria-label="Buscar no menu" placeholder="Buscar no menu"
              value={busca} onChange={(event) => definirBusca(event.target.value)} />
          </label>
          <button className="navegacao-painel__recolher" type="button"
            aria-label={compacto ? 'Expandir barra lateral' : 'Recolher barra lateral'}
            title={compacto ? 'Expandir barra lateral' : 'Recolher barra lateral'}
            aria-expanded={!compacto} aria-controls={idMenu}
            onClick={() => { definirCompacto(!compacto); definirBusca('') }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true">
              <rect x="3" y="5" width="18" height="14" rx="3" />
              <path d="M9 5v14" />
            </svg>
          </button>
        </div>

        <nav aria-label={`Menu de ${titulo.toLocaleLowerCase('pt-BR')}`}>
          {resultados.map(({ titulo: grupo, itens }) => (
            <section key={grupo}>
              <h2>{grupo}</h2>
              {itens.map(([destino, nome, icone]) => {
                const caminho = `${area}/${destino}`
                const ativo = rota === caminho || rota?.startsWith(`${caminho}/`) ||
                  (destino === 'painel' && rota === area)
                return (
                  <a key={destino} href={enderecoPrivado(caminho)} aria-label={nome} title={nome}
                    aria-current={ativo ? 'page' : undefined}
                    onClick={() => { definirAberto(false); definirBusca('') }}>
                    <span aria-hidden="true"><Icone nome={icone} /></span>
                    <span className="navegacao-painel__rotulo">{nome}</span>
                  </a>
                )
              })}
            </section>
          ))}
          {resultados.length === 0 && <p role="status">Nenhuma opção encontrada.</p>}
        </nav>

        <div className="navegacao-painel__rodape">
          {usuario && (
            <div className="navegacao-painel__conta" title={usuario.nome}>
              <span
                className={`cabecalho__perfil cabecalho__perfil--${area === 'administracao' ? 'admin' : 'coordenador'}`}
                aria-hidden="true"
              >
                <Avatar usuario={usuario} />
              </span>
              <div><strong>{usuario.nome}</strong><small>{papel}</small></div>
            </div>
          )}
          {aoSair && (
            <button type="button" onClick={aoSair} aria-label="Sair" title="Sair">
              <span aria-hidden="true"><Icone nome="saida" /></span>
              <span className="navegacao-painel__rotulo">Sair</span>
            </button>
          )}
        </div>
      </div>
    </aside>
  )
}

function normalizar(texto) {
  return texto.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLocaleLowerCase('pt-BR')
}
