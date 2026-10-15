import { useEffect, useRef } from 'react'
import { projetos } from '../../../dados/projetos.js'
import './janela-contexto.css'

export default function JanelaContexto({ rota, destinoAoFechar = 'inicio' }) {
  const janela = useRef(null)
  const projeto = projetos.find(item => rota === `projeto/${item.identificador}`)
  const aberta = Boolean(projeto || ['submeter', 'acesso'].includes(rota))
  useEffect(() => {
    if (aberta && !janela.current.open) janela.current.showModal()
    if (!aberta && janela.current.open) janela.current.close()
  }, [aberta, rota])
  const fechar = () => { window.location.hash = destinoAoFechar }
  const titulo = projeto?.nome || ({ biblioteca: 'Produções acadêmicas', submeter: 'Submeter projeto', acesso: 'Área restrita' })[rota]
  return <dialog ref={janela} className="janela" aria-labelledby="titulo-janela" onCancel={fechar} onClick={evento => { if (evento.target === janela.current) fechar() }}><div className="janela__cabecalho"><h2 id="titulo-janela">{titulo}</h2><button className="janela__fechar" onClick={fechar} aria-label="Fechar janela">×</button></div>
    {projeto && <><span className="etiqueta">{projeto.tipo} · {projeto.status}</span><p>{projeto.descricao}</p><p><strong>Curso:</strong> {projeto.curso}</p><p><strong>Orientador:</strong> {projeto.orientador}</p>{projeto.autores && <p><strong>Autores:</strong> {projeto.autores}</p>}<p className="aviso">Este projeto é ilustrativo. O documento PDF ainda não está disponível.</p></>}
    {rota === 'submeter' && <><p>Envie um TCC, Projeto Integrador, projeto de Pesquisa ou de Extensão para avaliação do professor orientador.</p><p>O envio exige nome e e-mail dos autores, título, curso, orientador, disciplinas relacionadas, tipo, descrição e documento em PDF.</p><p className="aviso">O envio será habilitado após a conexão com os microsserviços. Nenhum arquivo ou dado pessoal é coletado nesta demonstração.</p></>}
    {rota === 'acesso' && <><p>Espaço destinado a professores e administradores.</p><p>Professores podem atualizar o próprio perfil e avaliar as produções sob sua orientação. Administradores gerenciam os cadastros do portal.</p><p className="aviso">A autenticação será disponibilizada com a integração ao serviço de Usuários.</p></>}
  </dialog>
}
