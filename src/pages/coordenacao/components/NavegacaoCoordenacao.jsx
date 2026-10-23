import { enderecoPrivado } from '../../../app/rotas.js'
import Icone from '@/shared/components/Icone.jsx'

const grupos = [
  { titulo: 'Visão geral', itens: [['painel', 'Painel', 'visao-detalhe', 'Resumo do curso']] },
  {
    titulo: 'Meu curso',
    itens: [
      ['curso', 'Dados do curso', 'formacao-cursos', 'Informações e apresentação'],
      ['disciplinas', 'Disciplinas', 'matriz-detalhe', 'Matriz curricular'],
      ['professores', 'Professores', 'usuario', 'Equipe docente'],
      ['projetos', 'Projetos', 'projetos-detalhe', 'Produção acadêmica'],
    ],
  },
  {
    titulo: 'Avaliação',
    itens: [['submissoes', 'Submissões', 'criterios-detalhe', 'Analisar projetos']],
  },
  { titulo: 'Conta', itens: [['perfil', 'Meu perfil', 'usuario', 'Dados de acesso']] },
]

export default function NavegacaoCoordenacao({ rota }) {
  return (
    <aside className="painel-navegacao">
      <span className="painel-navegacao__titulo">Coordenação do curso</span>
      <nav aria-label="Navegação da coordenação">
        {grupos.map((grupo) => (
          <section className="painel-navegacao__grupo" key={grupo.titulo}>
            <h2>{grupo.titulo}</h2>
            {grupo.itens.map(([destino, titulo, icone, descricao]) => (
              <a
                key={destino}
                href={enderecoPrivado(`coordenacao/${destino}`)}
                aria-current={
                  rota === `coordenacao/${destino}` ||
                  (destino === 'painel' && rota === 'coordenacao')
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
      <p className="painel-navegacao__nota">Gestão e avaliação do seu curso</p>
    </aside>
  )
}
