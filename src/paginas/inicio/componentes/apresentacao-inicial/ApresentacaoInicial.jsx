import { useEffect, useRef, useState } from 'react'
import { cursos } from '../../../../dados/cursos.js'
import { projetos } from '../../../../dados/projetos.js'
import Ligacao from '../../../../compartilhados/componentes/ligacao/Ligacao.jsx'
import ConteudoDestaque from './ConteudoDestaque.jsx'
import './apresentacao-inicial.css'

const destaques = [
  { titulo: 'Análise e Desenvolvimento de Sistemas', categoria: 'Curso em destaque', destino: '#curso/tads', acao: 'Conhecer o curso', tipo: 'curso', identificador: 'tads' },
  { titulo: 'Portal de Cursos', categoria: 'Projeto Integrador em destaque', destino: '#projeto/portal-cursos', acao: 'Conhecer o projeto', tipo: 'integrador', identificador: 'portal-cursos' },
  { titulo: 'Acessibilidade em aplicações web', categoria: 'TCC em destaque', destino: '#projeto/acessibilidade-web', acao: 'Conhecer o TCC', tipo: 'tcc', identificador: 'acessibilidade-web' },
]

export default function ApresentacaoInicial() {
  const [indice, definirIndice] = useState(0)
  const [automatico, definirAutomatico] = useState(() => !window.matchMedia('(prefers-reduced-motion: reduce)').matches)
  const [sobre, definirSobre] = useState(false)
  const [visivel, definirVisivel] = useState(() => !document.hidden)
  const [direcao, definirDirecao] = useState('avancar')
  const gesto = useRef(null)
  const aprovados = projetos.filter(projeto => projeto.status === 'Aprovado')

  useEffect(() => {
    const acompanhar = () => definirVisivel(!document.hidden)
    const preferencia = window.matchMedia('(prefers-reduced-motion: reduce)')
    const reduzir = evento => { if (evento.matches) definirAutomatico(false) }
    document.addEventListener('visibilitychange', acompanhar)
    preferencia.addEventListener('change', reduzir)
    return () => { document.removeEventListener('visibilitychange', acompanhar); preferencia.removeEventListener('change', reduzir) }
  }, [])

  useEffect(() => {
    if (!automatico || sobre || !visivel || indice === destaques.length - 1) return
    const temporizador = window.setTimeout(() => {
      definirDirecao('avancar')
      definirIndice(indice + 1)
      if (indice + 1 === destaques.length - 1) definirAutomatico(false)
    }, 5500)
    return () => window.clearTimeout(temporizador)
  }, [indice, automatico, sobre, visivel])

  function selecionar(proximo) {
    definirAutomatico(false)
    definirDirecao(proximo < indice ? 'voltar' : 'avancar')
    definirIndice(Math.max(0, Math.min(destaques.length - 1, proximo)))
  }

  function iniciarGesto(evento) {
    if (evento.button !== 0 || evento.target.closest('a, button')) return
    gesto.current = { x: evento.clientX, y: evento.clientY }
    evento.currentTarget.setPointerCapture(evento.pointerId)
    definirAutomatico(false)
  }

  function concluirGesto(evento) {
    if (!gesto.current) return
    const deslocamento = evento.clientX - gesto.current.x
    const vertical = evento.clientY - gesto.current.y
    if (Math.abs(deslocamento) > 45 && Math.abs(deslocamento) > Math.abs(vertical)) selecionar(indice + (deslocamento < 0 ? 1 : -1))
    gesto.current = null
  }

  return <section id="inicio" className="hero-inicial" aria-labelledby="titulo-inicial">
    <div className="hero-inicial__texto">
      <p className="hero-inicial__rotulo"><span />Cursos, pessoas e descobertas</p>
      <h1 id="titulo-inicial">Conhecimento que <span>ganha forma.</span></h1>
      <p className="hero-inicial__descricao">Descubra o que você pode aprender — e o que pode criar. Conheça os cursos, explore a formação e veja os projetos desenvolvidos pelos estudantes.</p>
      <div className="hero-inicial__acoes"><a className="botao-primario" href="#cursos">Explorar cursos <span aria-hidden="true">↗</span></a><Ligacao destino="#projetos">Conhecer projetos</Ligacao></div>
      <dl className="hero-inicial__numeros"><div><dd>{String(cursos.length).padStart(2, '0')}</dd><dt>Cursos para explorar</dt></div><div><dd>{String(aprovados.length).padStart(2, '0')}</dd><dt>Projetos aprovados</dt></div><div><dd>04</dd><dt>Tipos de produção</dt></div></dl>
      <small className="hero-inicial__nota">Explore o catálogo demonstrativo do portal.</small>
    </div>
    <div className={`hero-carrossel hero-carrossel--${direcao}`} role="region" aria-roledescription="carrossel" aria-label="Descubra o Portal de Cursos" onMouseEnter={() => definirSobre(true)} onMouseLeave={() => definirSobre(false)} onFocusCapture={() => definirAutomatico(false)}>
      <div className="hero-carrossel__janela" onPointerDown={iniciarGesto} onPointerUp={concluirGesto} onPointerCancel={() => { gesto.current = null }} onKeyDown={evento => { if (evento.key === 'ArrowRight') { evento.preventDefault(); selecionar(indice + 1) } if (evento.key === 'ArrowLeft') { evento.preventDefault(); selecionar(indice - 1) } }} tabIndex={0} aria-label="Destaques. Use as setas do teclado ou arraste para navegar.">
        {destaques.map((destaque, posicao) => <article className={`hero-carrossel__slide ${posicao === indice ? 'hero-carrossel__slide--ativo' : ''}`} key={destaque.tipo} role="group" aria-roledescription="slide" aria-label={`${posicao + 1} de ${destaques.length}: ${destaque.titulo}`} aria-hidden={posicao !== indice} inert={posicao !== indice}>
          <ConteudoDestaque destaque={destaque} curso={cursos.find(curso => curso.identificador === destaque.identificador)} projeto={aprovados.find(projeto => projeto.identificador === destaque.identificador)} />
        </article>)}
      </div>
      <div className="hero-carrossel__controles"><div className="hero-carrossel__indicadores" role="group" aria-label="Escolher destaque">{destaques.map((destaque, posicao) => <button key={destaque.tipo} className={posicao === indice ? 'selecionado' : ''} aria-label={`Mostrar destaque ${posicao + 1}: ${destaque.titulo}`} aria-pressed={posicao === indice} onClick={() => selecionar(posicao)} />)}</div><span className="hero-carrossel__modo">{automatico ? 'Descubra o portal' : 'Explore no seu ritmo'}</span><div className="hero-carrossel__setas">{automatico && <button aria-label="Pausar carrossel" onClick={() => definirAutomatico(false)}>Ⅱ</button>}<button aria-label="Destaque anterior" disabled={indice === 0} onClick={() => selecionar(indice - 1)}>←</button><button aria-label="Próximo destaque" disabled={indice === destaques.length - 1} onClick={() => selecionar(indice + 1)}>→</button></div></div>
      <p className="somente-leitores" role="status" aria-live={automatico ? 'off' : 'polite'}>Destaque {indice + 1} de {destaques.length}. {destaques[indice].titulo}.</p>
    </div>
  </section>
}
