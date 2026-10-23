# Fluxos de professor e administração

## Regra confirmada pelo usuário

O professor gerencia somente o próprio perfil e as submissões, usando o feed anterior. O administrador gerencia professores, cursos, projetos e os demais conteúdos do portal. Não colocar a dashboard administrativa nem sua navegação no fluxo do professor.

## Rotas e apresentação

| Conta         | Entrada               | Navegação                                                                                 |
| ------------- | --------------------- | ----------------------------------------------------------------------------------------- |
| Professor     | /professor/feed       | Feed em cards, filtros à esquerda, detalhes de submissão e próprio perfil no header       |
| Administrador | /administracao/painel | Visão geral, professores, cursos, projetos, acompanhamento de submissões e próprio perfil |

O login /login mantém o layout anterior dividido com o logo local, identidade azul à esquerda e formulário à direita. O título Acesso institucional atende os dois papéis. Não existe seletor de papel no formulário. A rota anterior /professor/painel encaminha ao feed.

O header compartilhado conserva Ver portal, Sair da conta, perfil e tema. Seu logo, ícone de perfil e link Área restrita respeitam a área da conta autenticada. A administração tem sidebar no desktop e navegação horizontal no celular; o professor não tem essa sidebar.

## Identificação da conta

POST /auth/login mantém email e senha e recebe token e duração. Como a resposta não informa papel nem identidade, o frontend consulta os endpoints existentes com Bearer:

1. GET /usuarios, protegido no backend por hasRole('ADMIN'). Localiza a própria conta pelo e-mail autenticado e exige tipoUsuario ADMIN.
2. Para uma conta sem acesso administrativo, GET /professores/buscar localiza o registro da própria conta e exige tipoUsuario PROFESSOR.
3. Contas sem correspondência, respostas inválidas e falhas não recebem papel por padrão. Nenhuma sessão é criada sem identificar o papel.

Não decodificar JWT para inventar permissões. O e-mail serve para localizar a própria conta na resposta do servidor, não para conceder papel. Os retornos de navegação são validados por área e não aceitam URLs externas. A barreira de interface impede a troca de área por digitação de rota, mas a autorização de cada operação permanece responsabilidade do backend. O frontend descarta campos não utilizados, sem persistir senhas ou tokens.

## Gestão implementada e limites

| Recurso                                | Interface                                            | Integração                                                                              |
| -------------------------------------- | ---------------------------------------------------- | --------------------------------------------------------------------------------------- |
| Professores                            | Consulta, busca, cadastro, confirmação e exclusão    | GET /professores/buscar, POST /professores e DELETE /professores/:id existentes         |
| Edição de professor pelo administrador | Indicação da limitação, sem botão que promete salvar | PUT /professores/:id exige PROFESSOR no contrato atual; não foi alterado                |
| Cursos                                 | Consulta, busca, novo, edição e remoção de rascunho  | Estado em memória; sem publicação e sem gravação em arquivos ou serviço                 |
| Projetos                               | Consulta, busca, novo, edição e remoção de rascunho  | Estado em memória; sem publicação e sem gravação em arquivos ou serviço                 |
| Submissões do professor                | Feed original, filtros, detalhes e decisão local     | Dados demonstrativos existentes; aguarda serviço de submissões e recorte por orientador |
| Submissões na administração            | Consulta de acompanhamento                           | Sem botões de aceitar orientação de professor                                           |
| Perfil próprio                         | Nome, titulação, apresentação e foto                 | Alterações locais nesta sessão; persistência e upload ainda não integrados              |

Rascunhos de cursos e projetos sobrevivem à navegação interna da sessão e são descartados em novo login, ao sair ou recarregar. O site público não apresenta rascunhos como conteúdo publicado. Cadastros e exclusões de professor usam o serviço real quando acionados pelo usuário; os testes automatizados interceptam essas requisições para não alterar dados reais.

Para completar a gestão de todos os conteúdos, faltam os contratos de escrita/publicação de cursos, projetos, matriz curricular/disciplinas e destaques, além de autorização administrativa para editar professores. Não alterar backend para preencher esses contratos sem nova autorização.

## Referência visual e crítica

O kit DashStack QXIjfTlTasJ4D1bZfr2fMM continua como referência da administração: 0:11258 para organização geral, 0:9001 e 0:7532 para tabelas/filtros e 0:1574 para formulários. O frame de login 0:1945 foi avaliado, mas o usuário pediu preservar o layout anterior. Os 37 frames foram mapeados na etapa anterior; vendas, estoque, faturas, preços e caixa de mensagens não pertencem ao fluxo atual.

Preservar Manrope, azul do portal, logo, JSX e CSS separados, tema claro/AMOLED, foco visível e movimento reduzido. Nenhum dado privado ou screenshot foi enviado a ferramenta externa durante este ajuste.
