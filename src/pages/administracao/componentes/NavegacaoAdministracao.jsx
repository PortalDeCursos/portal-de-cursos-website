import { enderecoPrivado } from '../../../app/rotas.js'
import Icone from '../../../shared/components/icon/Icone.jsx'

const grupos = [
  {
    titulo: 'Visão geral',
    itens: [['painel', 'Painel', 'visao-detalhe', 'Resumo do portal']],
  },
  {
    titulo: 'Pessoas',
    itens: [
      ['usuarios', 'Usuários', 'usuario', 'Contas e permissões'],
      ['professores', 'Professores', 'usuario', 'Equipe docente'],
    ],
  },
  {
    titulo: 'Estrutura acadêmica',
    itens: [
      ['cursos', 'Cursos', 'formacao-cursos', 'Cursos do portal'],
      ['disciplinas', 'Disciplinas', 'matriz-detalhe', 'Matrizes curriculares'],
      ['projetos', 'Projetos', 'projetos-detalhe', 'Acervo acadêmico'],
    ],
  },
  {
    titulo: 'Acompanhamento',
    itens: [['submissoes', 'Submissões', 'criterios-detalhe', 'Projetos em avaliação']],
  },
  {
    titulo: 'Conta',
    itens: [['perfil', 'Meu perfil', 'usuario', 'Dados de acesso']],
  },
]

export default function NavegacaoAdministracao({ rota }) {
  return (
    <aside className="painel-navegacao">
      <span className="painel-navegacao__titulo">Administração</span>
      <nav aria-label="Navegação administrativa">
        {grupos.map((grupo) => (
          <section className="painel-navegacao__grupo" key={grupo.titulo}>
            <h2>{grupo.titulo}</h2>
            {grupo.itens.map(([destino, titulo, icone, descricao]) => (
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
                <span className="painel-navegacao__texto">
                  <strong>{titulo}</strong>
                  <small>{descricao}</small>
                </span>
              </a>
            ))}
          </section>
        ))}
      </nav>
      <p className="painel-navegacao__nota">Gestão geral do Portal de Cursos</p>
    </aside>
  )
}
