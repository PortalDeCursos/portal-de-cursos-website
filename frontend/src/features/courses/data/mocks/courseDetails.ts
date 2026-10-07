import type { CourseAcademicDetails } from '../../types/details'
const modules = [
  ['Algoritmos e Lógica de Programação', 'Fundamentos de Computação', 'Matemática Aplicada', 'Comunicação e Expressão', 'Introdução ao Desenvolvimento Web', 'Projeto Integrador I'],
  ['Programação Orientada a Objetos', 'Estruturas de Dados', 'Banco de Dados I', 'Engenharia de Requisitos', 'Interfaces e Acessibilidade', 'Projeto Integrador II'],
  ['Engenharia de Software', 'Banco de Dados II', 'Desenvolvimento Full-Stack', 'Redes de Computadores', 'Projeto Integrador III'],
  ['Arquitetura de Software', 'Sistemas Distribuídos', 'Qualidade e Testes', 'Computação em Nuvem', 'Projeto Integrador IV'],
  ['Inteligência Artificial', 'Engenharia de Dados', 'Cibersegurança', 'DevOps e Entrega Contínua', 'Projeto Integrador V'],
  ['Governança de TI', 'Ética e Proteção de Dados', 'Empreendedorismo', 'Tópicos Avançados', 'Projeto Integrador VI'],
]
export const courseDetails: Record<string, CourseAcademicDetails> = {
  tads: {
    summary: 'Transforme problemas complexos em soluções digitais de alto impacto por meio da engenharia moderna de software, dados e arquitetura em nuvem.',
    overviewTitle: 'Engenharia de software focada na criação de tecnologia sólida, escalável e ética.',
    paragraphs: [
      'O curso superior de Tecnologia em Análise e Desenvolvimento de Sistemas (TADS) prepara profissionais para liderar a concepção, o projeto, a codificação, o teste e a evolução de ecossistemas computacionais robustos. O alinhamento pedagógico conecta fundamentos teóricos da ciência da computação às práticas mais exigidas pela indústria contemporânea, enfatizando governança, segurança e alta disponibilidade.',
      'Ao longo de seis semestres, o acadêmico é imerso em projetos aplicados reais, articulando arquiteturas distribuídas, bancos de dados relacionais e analíticos, padrões de projeto desacoplados e esteiras contínuas de entrega (DevOps).',
    ],
    hours: 2400, moduleCount: 32, coordinator: 'Prof. Dr. M. Arantes', email: 'tads@faculdade.edu.br', schedule: '19h00 às 22h30',
    metrics: [{ value: '100%', label: 'Prática laboratorial' }, { value: '06', label: 'Projetos no portfólio' }, { value: '94%', label: 'Empregabilidade anual' }],
    studies: [
      { title: 'Desenvolvimento Full-Stack Moderno', description: 'Arquiteturas reativas em TypeScript, APIs RESTful e GraphQL, persistência distribuída e interfaces seguras e acessíveis.', icon: 'detail-imgMargin' },
      { title: 'Engenharia de Software, Cloud & DevOps', description: 'Microsserviços conteinerizados com Docker e Kubernetes, automação CI/CD, monitorabilidade e governança de infraestrutura como código (IaC).', icon: 'detail-imgMargin1' },
      { title: 'Inteligência Artificial & Big Data', description: 'Modelos preditivos, engenharia de dados, processamento analítico com Python e integração com agentes autônomos.', icon: 'detail-imgMargin2' },
      { title: 'Cibersegurança e Proteção de Dados', description: 'Diretrizes OWASP, autenticação federada (OAuth2/OIDC), criptografia e conformidade técnica com a LGPD.', icon: 'detail-imgMargin3' },
    ],
    careers: [
      { title: 'Arquiteto(a) de Soluções', description: 'Desenho de sistemas corporativos escaláveis e estratégicos.' },
      { title: 'Engenheiro(a) de Software', description: 'Implementação de código confiável em times multidisciplinares.' },
      { title: 'Dev Full-Stack & Mobile', description: 'Criação de ponta a ponta para plataformas nativas e web.' },
      { title: 'Especialista QA & Testes', description: 'Automação de testes funcionais, segurança e performance.' },
    ],
    curriculum: modules.map((subjects, index) => ({ semester: index + 1, subjects })),
    faculty: [
      { name: 'Prof. Carlos Almeida', role: 'Professor e orientador', subjects: 'Engenharia de software · Projetos integradores' },
      { name: 'Profa. Marina Costa', role: 'Professora e pesquisadora', subjects: 'Redes de computadores · Internet das coisas' },
    ],
  },
}
