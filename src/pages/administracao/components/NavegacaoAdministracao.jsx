import { enderecoPrivado } from '../../../app/rotas.js'

const desenhos = {
  painel: (
    <>
      <rect x="3" y="3" width="7" height="7" rx="1.5" />
      <rect x="14" y="3" width="7" height="5" rx="1.5" />
      <rect x="14" y="12" width="7" height="9" rx="1.5" />
      <rect x="3" y="14" width="7" height="7" rx="1.5" />
    </>
  ),
  usuarios: (
    <>
      <path d="M16 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="10" cy="7" r="4" />
      <path d="M20 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
    </>
  ),
  professores: (
    <>
      <path d="M12 15a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z" />
      <path d="M5 21a7 7 0 0 1 14 0M19 8l1.5 1.5L23 7" />
      <path d="M4 5h4M6 3v4" />
    </>
  ),
  cursos: (
    <>
      <path d="m2 10 10-5 10 5-10 5-10-5Z" />
      <path d="M6 12v5c3.5 3 8.5 3 12 0v-5M22 10v6" />
    </>
  ),
  disciplinas: (
    <>
      <path d="M4 4.5A2.5 2.5 0 0 1 6.5 2H20v18H6.5A2.5 2.5 0 0 1 4 17.5z" />
      <path d="M4 17.5A2.5 2.5 0 0 1 6.5 15H20M8 6h8M8 9h7" />
    </>
  ),
  projetos: (
    <>
      <path d="M4 4h16v16H4z" />
      <path d="M8 2v4M16 2v4M8 11h8M8 15h5" />
    </>
  ),
  submissoes: (
    <>
      <path d="M8 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V8l-5-5H8Z" />
      <path d="M16 3v5h5M8 14l2.5 2.5L16 11" />
    </>
  ),
  perfil: (
    <>
      <circle cx="12" cy="8" r="4" />
      <path d="M5 21a7 7 0 0 1 14 0" />
    </>
  ),
}

function IconeNavegacao({ nome }) {
  return (
    <span className="painel-navegacao__icone" aria-hidden="true">
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {desenhos[nome]}
      </svg>
    </span>
  )
}

const grupos = [
  {
    titulo: 'Visão geral',
    itens: [['painel', 'Painel', 'painel', 'Resumo do portal']],
  },
  {
    titulo: 'Pessoas',
    itens: [
      ['usuarios', 'Usuários', 'usuarios', 'Contas e permissões'],
      ['professores', 'Professores', 'professores', 'Equipe docente'],
    ],
  },
  {
    titulo: 'Estrutura acadêmica',
    itens: [
      ['cursos', 'Cursos', 'cursos', 'Cursos do portal'],
      ['disciplinas', 'Disciplinas', 'disciplinas', 'Matrizes curriculares'],
      ['projetos', 'Projetos', 'projetos', 'Acervo acadêmico'],
    ],
  },
  {
    titulo: 'Acompanhamento',
    itens: [['submissoes', 'Submissões', 'submissoes', 'Projetos em avaliação']],
  },
  {
    titulo: 'Conta',
    itens: [['perfil', 'Meu perfil', 'perfil', 'Dados de acesso']],
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
                <IconeNavegacao nome={icone} />
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
