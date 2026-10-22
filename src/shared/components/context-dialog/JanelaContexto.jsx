import { useEffect, useRef } from 'react'
import './janela-contexto.css'

export default function JanelaContexto({ rota, destinoAoFechar = 'inicio' }) {
  const janela = useRef(null)
  const aberta = ['biblioteca', 'submeter', 'acesso'].includes(rota)
  useEffect(() => {
    if (aberta && !janela.current.open) janela.current.showModal()
    if (!aberta && janela.current.open) janela.current.close()
  }, [aberta, rota])
  const fechar = () => {
    window.location.hash = destinoAoFechar
  }
  const titulo = { biblioteca: 'Produções acadêmicas', submeter: 'Submeter projeto', acesso: 'Área restrita' }[rota]
  return (
    <dialog
      ref={janela}
      className="janela"
      aria-labelledby="titulo-janela"
      onCancel={fechar}
      onClick={(evento) => {
        if (evento.target === janela.current) fechar()
      }}
    >
      <div className="janela__cabecalho">
        <h2 id="titulo-janela">{titulo}</h2>
        <button className="janela__fechar" onClick={fechar} aria-label="Fechar janela">
          ×
        </button>
      </div>
      {rota === 'submeter' && (
        <>
          <p>
            Envie um TCC, Projeto Integrador, projeto de Pesquisa ou de Extensão para avaliação do
            professor orientador.
          </p>
          <p>
            O envio exige nome e e-mail dos autores, título, curso, orientador, disciplinas
            relacionadas, tipo, descrição e documento em PDF.
          </p>
          <p className="aviso">
            O envio será habilitado após a conexão com os microsserviços. Nenhum arquivo ou dado
            pessoal é coletado nesta etapa.
          </p>
        </>
      )}
    </dialog>
  )
}
