import { enderecoPrivado } from '../../app/rotas.js'
import GestaoConteudos from './componentes/GestaoConteudos.jsx'
import GestaoProfessores from './componentes/GestaoProfessores.jsx'
import TabelaSubmissoes from '../painel/componentes/TabelaSubmissoes.jsx'
import '../painel/painel.css'
import './administracao.css'

export default function PaginaAdministracao({ secao, sessao, rascunhos, aoAlterar, submissoes }) {
  if (secao === 'professores')
    return (
      <main id="conteudo" className="pagina-painel">
        <GestaoProfessores token={sessao.token} />
      </main>
    )
  if (['cursos', 'projetos'].includes(secao))
    return (
      <main id="conteudo" className="pagina-painel">
        <GestaoConteudos
          key={secao}
          dominio={secao}
          itens={rascunhos[secao]}
          aoAlterar={(itens) => aoAlterar(secao, itens)}
        />
      </main>
    )
  if (secao === 'submissoes')
    return (
      <main id="conteudo" className="pagina-painel">
        <header className="painel-titulo">
          <div>
            <h1>Submissões do portal</h1>
            <p>Acompanhe o andamento das orientações acadêmicas.</p>
          </div>
        </header>
        <section className="painel-secao">
          <TabelaSubmissoes itens={submissoes} somenteConsulta />
        </section>
        <p className="gestao-nota">
          Consulta demonstrativa até a integração com o serviço de submissões. As decisões de
          orientação pertencem ao professor.
        </p>
      </main>
    )
  return (
    <main id="conteudo" className="pagina-painel">
      <header className="painel-titulo">
        <div>
          <h1>Administração do portal</h1>
          <p>Gerencie pessoas, formações e produções acadêmicas.</p>
        </div>
      </header>
      <div className="administracao-atalhos">
        {[
          ['professores', 'Professores', 'Cadastros e vínculos acadêmicos.'],
          ['cursos', 'Cursos', `${rascunhos.cursos.length} cursos na versão de trabalho.`],
          ['projetos', 'Projetos', `${rascunhos.projetos.length} produções na versão de trabalho.`],
        ].map(([destino, titulo, descricao]) => (
          <a key={destino} href={enderecoPrivado(`administracao/${destino}`)}>
            <h2>{titulo}</h2>
            <p>{descricao}</p>
            <span>
              Gerenciar {titulo.toLowerCase()} <span aria-hidden="true">→</span>
            </span>
          </a>
        ))}
      </div>
      <section className="painel-secao">
        <header>
          <div>
            <h2>Acompanhamento de submissões</h2>
            <p>Visibilidade das produções recebidas no portal.</p>
          </div>
          <a href={enderecoPrivado('administracao/submissoes')}>
            Ver todas <span aria-hidden="true">→</span>
          </a>
        </header>
        <TabelaSubmissoes itens={submissoes} somenteConsulta />
      </section>
      <p className="gestao-nota">
        Cursos e projetos são rascunhos de trabalho em memória. A publicação e os demais conteúdos
        acadêmicos dependem dos contratos de gestão dos serviços correspondentes.
      </p>
    </main>
  )
}
