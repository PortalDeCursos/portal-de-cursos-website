import NavegacaoPainel from '@/shared/componentes/NavegacaoPainel.jsx'

const grupos = [
  { titulo: 'Visão geral', itens: [['painel', 'Painel', 'visao-detalhe', 'Resumo do curso']] },
  {
    titulo: 'Meu curso',
    itens: [
      ['curso', 'Dados do curso', 'formacao-cursos', 'Informações e apresentação'],
      ['disciplinas', 'Disciplinas', 'matriz-detalhe', 'Matriz curricular'],
      ['professores', 'Professores', 'docentes-detalhe', 'Equipe docente'],
      ['projetos', 'Projetos', 'projetos-detalhe', 'Produção acadêmica'],
    ],
  },
  {
    titulo: 'Avaliação',
    itens: [['submissoes', 'Submissões', 'criterios-detalhe', 'Analisar projetos']],
  },
  { titulo: 'Conta', itens: [['perfil', 'Meu perfil', 'usuario', 'Dados de acesso']] },
]

export default function NavegacaoCoordenacao({ rota, usuario, aoSair }) {
  return (
    <NavegacaoPainel
      area="coordenacao"
      titulo="Coordenação"
      papel="Coordenação"
      grupos={grupos}
      rota={rota}
      usuario={usuario}
      aoSair={aoSair}
    />
  )
}
