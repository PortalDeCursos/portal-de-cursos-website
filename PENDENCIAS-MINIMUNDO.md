# Situação em relação ao minimundo

Comparação com a seção 3 do Documento de Requisitos do Portal de Cursos, versão 0.4. A interface atual utiliza exemplos locais; telas prontas não representam funcionalidades integradas aos microsserviços.

| Participante ou área | Implementado na interface | Falta implementar |
| --- | --- | --- |
| Visitante | Início, catálogo de cursos, detalhes com abas, biblioteca de projetos aprovados, buscas e filtros | Dados reais, matriz curricular completa, professores e disciplinas de interesse, documentos PDF dos projetos |
| Aluno | Acesso à explicação da submissão | Página e formulário de submissão com nome, e-mail, curso, orientador, tipo, descrição, autores e disciplinas; seleção e validação de PDF; envio e confirmação |
| Professor | Explicação da área restrita | Login, painel, visualizar e editar o próprio perfil, listar submissões sob sua orientação, consultar PDF e aprovar ou recusar |
| Administrador | Estrutura visual pública reutilizável | Login e painel de gerenciamento de usuários, cursos, professores, disciplinas e projetos, incluindo cadastro, consulta, edição e exclusão |
| Projetos | Listagem pública filtrada por status Aprovado e por curso ou tipo; detalhes ilustrativos | Persistência, autores completos, orientador e disciplinas reais, PDF, nomes únicos, status Em Análise/Aprovado/Recusado e transições autorizadas |
| Notificações | Nenhuma integração | Evento de nova submissão e envio assíncrono de e-mail ao professor responsável |

## Regras pendentes

Validar exclusividade de e-mail e username, permissões de administrador e professor, vínculos entre cursos/disciplinas/professores/projetos, campos obrigatórios, tipos permitidos, PDF obrigatório, existência prévia de cadastros e publicação somente após aprovação. A filtragem visual de aprovados existe; o backend ainda deve impedir acesso público aos demais projetos e arquivos.

## Integração e requisitos técnicos associados

Conectar APIs Spring Boot, autenticação JWT e armazenamento seguro de senhas no backend, bancos independentes por serviço, mensageria, Docker Compose, Swagger/OpenAPI e uma API externa real. A configuração opcional de endpoints de Cursos e Detalhes não significa que esses serviços já foram implementados.

## Ordem sugerida

1. Completar matriz curricular e perfis públicos dos professores.
2. Implementar autenticação e permissões.
3. Construir os cadastros administrativos que alimentam a submissão.
4. Implementar submissão e armazenamento de PDF.
5. Construir avaliação do professor, publicação e notificações.
6. Concluir integrações e verificar o fluxo completo com dados persistidos.

O minimundo não exige conta nem login para alunos. O acesso autenticado é destinado a professores e administradores.
