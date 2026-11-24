import { basePortal, enderecoPrivado } from '@/app/rotas.js'
import logoPortal from '@/assets/marca/logo-portal.png'
import './Rodape.css'

const NAVEGACAO_PADRAO = [
  { rotulo: 'Início', href: `${basePortal}#inicio` },
  { rotulo: 'Cursos', href: `${basePortal}#cursos` },
  { rotulo: 'Projetos', href: `${basePortal}#projetos` },
  { rotulo: 'Entrar no portal', href: enderecoPrivado('login') },
]

export default function Rodape({
  nomePortal = 'Portal de Cursos',
  descricao = 'Conheça a formação, a estrutura dos cursos e as produções acadêmicas desenvolvidas na instituição.',
  instituicao = 'IFRN',
  campus = 'Campus Natal-Central',
  email = 'coordenacao@ifrn.edu.br',
  navegacao = NAVEGACAO_PADRAO,
  hrefPrivacidade = enderecoPrivado('politica-de-privacidade'),
}) {
  function voltarAoTopo() {
    const reduzido = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    window.scrollTo({ top: 0, behavior: reduzido ? 'auto' : 'smooth' })
  }

  return (
    <footer className="rodape-portal">
      <div className="limite">
        <div className="rodape-portal__grade">
          <div className="rodape-portal__coluna">
            <a className="marca marca--cabecalho" href={`${basePortal}#inicio`}>
              <img className="marca__simbolo" src={logoPortal} alt="" width="28" height="28" />
              <span className="marca__texto">{nomePortal}</span>
            </a>
            <p className="rodape-portal__texto">{descricao}</p>
          </div>

          <nav className="rodape-portal__coluna" aria-label="Navegação no rodapé">
            <h2 className="rodape-portal__titulo">Navegação</h2>
            <ul className="rodape-portal__lista">
              {navegacao.map((item) => (
                <li key={item.href}>
                  <a href={item.href}>{item.rotulo}</a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="rodape-portal__coluna">
            <h2 className="rodape-portal__titulo">Institucional</h2>
            <ul className="rodape-portal__lista">
              <li>{instituicao}</li>
              <li>{campus}</li>
              {email && (
                <li>
                  <a href={`mailto:${email}`}>{email}</a>
                </li>
              )}
            </ul>
          </div>

          <div className="rodape-portal__coluna">
            <h2 className="rodape-portal__titulo">Privacidade</h2>
            <p className="rodape-portal__texto">
              Este portal não usa cookies de rastreamento nem guarda dados no seu navegador.
            </p>
            <a className="rodape-portal__link-privacidade" href={hrefPrivacidade}>
              Política de privacidade
            </a>
          </div>
        </div>

        <div className="rodape-portal__base">
          <p>
            © {new Date().getFullYear()} {nomePortal}. Todos os direitos reservados.
          </p>
          <button type="button" className="rodape-portal__topo" onClick={voltarAoTopo}>
            Voltar ao topo <span aria-hidden="true">↑</span>
          </button>
        </div>
      </div>
    </footer>
  )
}
