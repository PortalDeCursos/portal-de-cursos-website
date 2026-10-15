import { useState } from 'react'
import { submissoes } from '../../data/submissoes.js'
import './professor.css'

export default function PaginaDetalhesSubmissao({ identificador }) {
  const item = submissoes.find((submissao) => submissao.identificador === identificador)
  const [status, definirStatus] = useState(item?.status || 'Em análise')
  const [justificativa, definirJustificativa] = useState('')
  const [erro, definirErro] = useState('')

  if (!item) {
    return (
      <main id="conteudo" className="limite pagina-detalhes-submissao">
        <a className="pagina-detalhes-submissao__voltar" href="#professor">
          Voltar para submissões
        </a>
        <h1>Submissão não encontrada</h1>
        <p>O projeto solicitado não está disponível.</p>
      </main>
    )
  }

  function registrarDecisao(proximaStatus) {
    if (proximaStatus === 'Recusado' && !justificativa.trim()) {
      definirErro('Informe uma justificativa para registrar esta decisão.')
      return
    }
    definirStatus(proximaStatus)
    definirJustificativa('')
    definirErro('')
  }

  return (
    <main id="conteudo" className="limite pagina-detalhes-submissao">
      <a className="pagina-detalhes-submissao__voltar" href="#professor">
        Voltar para submissões
      </a>
      <header className="pagina-detalhes-submissao__cabecalho">
        <div>
          <div className="pagina-detalhes-submissao__sinal">
            <span className={`status status--${status.toLowerCase().replace(' ', '-')}`}>
              {status}
            </span>
            <span>{item.tipo}</span>
          </div>
          <h1>{item.titulo}</h1>
          <p>
            {item.cursoCompleto} · enviado por {item.autor} em {item.enviadoEm}
          </p>
        </div>
        <div className="pagina-detalhes-submissao__marco">
          <span>Orientação</span>
          <strong>{item.orientador}</strong>
        </div>
      </header>

      <div className="pagina-detalhes-submissao__grid">
        <section className="pagina-detalhes-submissao__principal">
          <div>
            <span className="pagina-detalhes-submissao__indice">Sobre o projeto</span>
            <h2>Resumo</h2>
            <p>{item.resumo}</p>
          </div>
          <div>
            <h2>Objetivo e resultado esperado</h2>
            <p>{item.objetivo}</p>
          </div>
          <div className="pagina-detalhes-submissao__documentos">
            <h2>Documentos enviados</h2>
            <ul className="documentos-submissao-professor">
              {item.documentos.map((documento) => (
                <li key={documento}>
                  <span aria-hidden="true">PDF</span>
                  <strong>{documento}</strong>
                  <button type="button">Visualizar</button>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <aside className="pagina-detalhes-submissao__lateral">
          <div className="pagina-detalhes-submissao__contexto">
            <span className="pagina-detalhes-submissao__indice">Contexto</span>
            <div>
              <h2>Equipe</h2>
              <p>{item.autores.join(' · ')}</p>
            </div>
            <div>
              <h2>Curso</h2>
              <p>{item.cursoCompleto}</p>
            </div>
          </div>
          {status === 'Em análise' ? (
            <div className="avaliacao-submissao pagina-detalhes-submissao__decisao">
              <span className="pagina-detalhes-submissao__indice">Próxima decisão</span>
              <h2>Registrar orientação</h2>
              <p className="pagina-detalhes-submissao__decisao-intro">
                Leia o projeto e indique se poderá acompanhar esta produção.
              </p>
              <label htmlFor={`justificativa-${item.identificador}`}>
                Justificativa <small>obrigatória para recusar</small>
                <textarea
                  id={`justificativa-${item.identificador}`}
                  rows="4"
                  value={justificativa}
                  onChange={(evento) => {
                    definirJustificativa(evento.target.value)
                    definirErro('')
                  }}
                  placeholder="Registre uma orientação para o estudante..."
                />
              </label>
              {erro && <p className="avaliacao-submissao__erro">{erro}</p>}
              <div className="avaliacao-submissao__acoes">
                <button
                  type="button"
                  className="botao-primario"
                  onClick={() => registrarDecisao('Aceito')}
                >
                  Aceitar orientação
                </button>
                <button
                  type="button"
                  className="botao-secundario"
                  onClick={() => registrarDecisao('Recusado')}
                >
                  Recusar orientação
                </button>
              </div>
            </div>
          ) : (
            <p className="detalhe-submissao__aviso pagina-detalhes-submissao__decisao">
              Esta submissão já possui uma decisão registrada.
            </p>
          )}
        </aside>
      </div>
    </main>
  )
}
