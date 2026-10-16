import { enderecoPrivado } from '../../../app/rotas.js'
import Icone from '../../../shared/components/icon/Icone.jsx'

const destinos = [
  ['painel', 'Visão geral', 'visao-detalhe'],
  ['professores', 'Professores', 'usuario'],
  ['cursos', 'Cursos', 'formacao-cursos'],
  ['projetos', 'Projetos', 'projetos-detalhe'],
  ['submissoes', 'Submissões', 'criterios-detalhe'],
  ['perfil', 'Meu perfil', 'usuario'],
]

export default function NavegacaoAdministracao({ rota }) {
  return (
    <aside className="painel-navegacao">
      <span className="painel-navegacao__titulo">Administração</span>
      <nav aria-label="Navegação administrativa">
        {destinos.map(([destino, titulo, icone]) => (
          <a
            key={destino}
            href={enderecoPrivado(`administracao/${destino}`)}
            aria-current={
              rota === `administracao/${destino}` ||
              (destino === 'painel' && rota === 'administracao')
                ? 'page'
                : undefined
            }
          >
            <Icone nome={icone} />
            {titulo}
          </a>
        ))}
      </nav>
      <p className="painel-navegacao__nota">Gerencie as pessoas e os conteúdos do portal.</p>
    </aside>
  )
}
