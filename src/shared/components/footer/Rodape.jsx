import { enderecoPrivado } from '../../../app/rotas.js'
import '../../styles/estrutura.css'

export default function Rodape() {
  return (
    <footer className="rodape">
      <div className="limite">
        <div className="rodape__colunas">
          <div>
            <a className="marca" href="#inicio">
              Portal de Cursos
            </a>
            <p>
              Conheça a formação, a estrutura dos cursos e as produções acadêmicas desenvolvidas
              pelos estudantes.
            </p>
          </div>
          <nav aria-label="Navegação no rodapé">
            <h2>Navegação acadêmica</h2>
            <a href="#inicio">Página inicial</a>
            <a href="#cursos">Catálogo de cursos</a>
            <a href="#projetos">Produções acadêmicas</a>
            <a href="#submeter">Submeter projeto</a>
          </nav>
          <div>
            <h2>Acesso ao portal</h2>
            <a href={enderecoPrivado('login')}>Área de professores e administradores</a>
            <p>Os trabalhos são publicados após a aprovação do orientador.</p>
          </div>
        </div>
        <div className="rodape__base">
          <p>© {new Date().getFullYear()} Portal de Cursos.</p>
          <small>Formação, projetos e acompanhamento acadêmico.</small>
        </div>
      </div>
    </footer>
  )
}
