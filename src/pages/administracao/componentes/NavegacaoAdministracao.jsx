import NavegacaoPainel from '@/shared/componentes/NavegacaoPainel.jsx'

const grupos = [
  {
    titulo: 'Visão geral',
    itens: [['painel', 'Painel', 'visao-detalhe', 'Resumo do portal']],
  },
  {
    titulo: 'Pessoas',
    itens: [
      ['usuarios', 'Usuários', 'usuario', 'Contas e permissões'],
      ['professores', 'Professores', 'docentes-detalhe', 'Equipe docente'],
    ],
  },
  {
    titulo: 'Estrutura acadêmica',
    itens: [
      ['cursos', 'Cursos', 'formacao-cursos', 'Cursos do portal'],
      ['disciplinas', 'Disciplinas', 'matriz-detalhe', 'Matrizes curriculares'],
      ['campus', 'Campus', 'localizacao', 'Unidades acadêmicas'],
      ['areas', 'Áreas', 'areas-detalhe', 'Áreas do conhecimento'],
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

export default function NavegacaoAdministracao({ rota, usuario, aoSair }) {
  return (
    <NavegacaoPainel
      area="administracao"
      titulo="Administração"
      papel="Administrador"
      grupos={grupos}
      rota={rota}
      usuario={usuario}
      aoSair={aoSair}
    />
  )
}
