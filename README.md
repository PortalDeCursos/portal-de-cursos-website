# Portal de Cursos

Portal acadêmico para descoberta de cursos, consulta de informações curriculares e
acompanhamento de produções desenvolvidas por estudantes. Este repositório contém o
frontend do sistema, desenvolvido em React JSX e Vite, com arquivos CSS separados.
O backend existe em repositórios próprios e é organizado em microsserviços.

## Arquitetura e repositórios

| Componente                            | Responsabilidade                                                                   | Repositório                                                                              |
| ------------------------------------- | ---------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------- |
| Frontend                              | Interface web do portal                                                            | [portal-de-cursos-website](https://github.com/PortalDeCursos/portal-de-cursos-website)   |
| Microsserviço de Cursos               | Gerenciamento de cursos e disciplinas                                              | [portal-de-cursos-mscursos](https://github.com/PortalDeCursos/portal-de-cursos-mscursos) |
| Microsserviço de Usuários             | Gerenciamento de usuários e autenticação                                           | [usuarioService](https://github.com/PortalDeCursos/usuarioService)                       |
| Microsserviço de Produções Acadêmicas | Gerenciamento e consulta de Projetos Integradores, de Extensão, de Pesquisa e TCCs | [portal-de-cursos-projects](https://github.com/PortalDeCursos/portal-de-cursos-projects) |

A existência dos microsserviços é independente do estágio de integração de cada tela.
O frontend ainda utiliza dados locais e ações locais em alguns fluxos; isso não significa
que o sistema seja apenas um protótipo ou que não possua backend. A configuração e a
execução de cada serviço devem seguir os arquivos e as orientações do respectivo repositório.

## Perfis e acesso

- Visitantes consultam as informações públicas e os projetos aprovados.
- Alunos submetem produções acadêmicas sem exigência de conta ou login, conforme os requisitos.
- Professores e administradores são os perfis com autenticação prevista no sistema.
- Permissões e publicação de projetos aprovados devem ser garantidas pelas APIs.

## Visão geral

O Portal de Cursos reúne, em uma única experiência:

- catálogo de cursos com busca, filtros e ordenação;
- páginas de detalhes com informações acadêmicas;
- biblioteca de projetos e produções;
- fluxo de submissão organizado por tipo de produção;
- feed do professor para revisar submissões e registrar uma decisão local;
- temas claro e escuro;
- estados de carregamento, erro e busca sem resultados.

## Requisitos

- Node.js 24 ou versão compatível com o pipeline de CI;
- npm;
- navegador moderno.

## Instalação rápida

Clone o repositório e instale as dependências:

```bash
git clone https://github.com/PortalDeCursos/portal-de-cursos-website.git
cd portal-de-cursos-website
npm ci
```

Inicie o servidor de desenvolvimento:

```bash
npm run dev
```

Abra o endereço informado pelo Vite, normalmente `http://localhost:5173`.

## Comandos

| Comando                | Finalidade                                    |
| ---------------------- | --------------------------------------------- |
| `npm run dev`          | Inicia o servidor de desenvolvimento          |
| `npm run build`        | Gera o build de produção em `dist/`           |
| `npm run preview`      | Serve localmente o build gerado               |
| `npm run lint`         | Executa o ESLint                              |
| `npm run format`       | Formata o projeto com Prettier                |
| `npm run format:check` | Verifica a formatação sem alterar arquivos    |
| `npm run check`        | Executa as verificações principais do projeto |

Antes de abrir um pull request, execute:

```bash
npm run check
npm run format:check
```

## Rotas disponíveis

O frontend usa navegação por hash. As rotas são acessadas depois do `#` na URL.

| Rota                       | Tela                                     |
| -------------------------- | ---------------------------------------- |
| `#inicio`                  | Página inicial                           |
| `#cursos`                  | Catálogo de cursos                       |
| `#curso/tads`              | Detalhes do curso de TADS                |
| `#curso/redes`             | Detalhes do curso de Redes               |
| `#projetos`                | Biblioteca de projetos                   |
| `#submeter`                | Fluxo de submissão de produção acadêmica |
| `#professor`               | Feed de avaliações do professor          |
| `#professor/submissao/:id` | Detalhes de uma submissão                |
| `#acesso`                  | Informações de acesso à área restrita    |

## Configuração de dados

O catálogo utiliza os arquivos locais:

- `public/data/cursos.json`;
- `public/data/detalhes-cursos.json`.

Para integrar o catálogo ao microsserviço de Cursos, defina `VITE_API_CURSOS` antes de iniciar
o Vite:

```bash
# .env.local — substitua pelos endereços reais dos serviços
VITE_API_CURSOS=https://exemplo.edu.br/api/cursos
VITE_API_DETALHES_CURSO=https://exemplo.edu.br/api/cursos
```

Reinicie o Vite após alterar as variáveis. O endereço de detalhes recebe o identificador
do curso ao final do caminho. Os endereços acima são exemplos, não endpoints confirmados.

O endpoint do catálogo deve responder com uma lista de cursos no formato compatível com
`public/data/cursos.json`. Variáveis com o prefixo `VITE_` são expostas no navegador; nunca
coloque credenciais ou segredos nelas.

## Estrutura do projeto

As pastas técnicas usam nomes em inglês. Componentes, textos e identificadores próprios do
domínio permanecem em português do Brasil, sem acentos em nomes de arquivos ou símbolos.

```text
public/
  data/                  # Mocks consumidos pela aplicação
src/
  app/                   # Roteamento e composição global
  assets/                # Fontes e recursos locais
  data/                  # Dados usados por telas demonstrativas
  pages/                 # Páginas agrupadas por domínio
    course-details/      # Detalhes de cursos
    courses/             # Catálogo de cursos
    home/                # Página inicial
    projects/            # Biblioteca de projetos
    submission/          # Fluxo de submissão
    teacher/             # Feed e detalhes de avaliações
  shared/                # Componentes compartilhados
  styles/                # Tokens e estilos globais
```

## Desenvolvimento

O fluxo recomendado é:

1. Partir da branch `develop`.
2. Criar uma branch curta com prefixo `feat/`, `fix/` ou `docs/`.
3. Manter páginas, componentes e estilos próximos ao domínio correspondente.
4. Reutilizar tokens, cabeçalho, rodapé e componentes compartilhados.
5. Validar desktop, mobile, teclado e estados de carregamento, erro e vazio em alterações de
   interface.
6. Executar `npm run check` e `npm run format:check`.
7. Abrir o pull request para `develop`, descrevendo comportamento, validação e limitações.

As decisões de implementação devem respeitar os contratos dos microsserviços e os requisitos do projeto.

## CI

O workflow de CI é executado em pushes para `main` e `develop`, além de pull requests para
essas branches. Ele utiliza Node.js 24 e executa:

```bash
npm ci
npm run lint
npm run build
```

## Estado das integrações do frontend

O backend está distribuído nos microsserviços listados acima. Nesta versão do frontend,
os seguintes pontos ainda precisam ser integrados ou validados de ponta a ponta:

- autenticação e autorização por perfil com o serviço de Usuários;
- consulta dos dados reais de cursos e disciplinas, com adaptação aos contratos das APIs;
- envio e persistência de submissões e documentos no serviço de Produções Acadêmicas;
- consulta e persistência das decisões do professor;
- consulta pública de projetos aprovados a partir da API;
- acompanhamento do resultado de operações e notificações.

Sem configuração de API, o catálogo consulta os JSONs locais. As ações locais de submissão
e avaliação ainda não comprovam gravação ou processamento no backend. Antes de considerar
um fluxo integrado, conferir o contrato do serviço e validar o percurso completo na interface.
Esta lista descreve o estado do frontend e não afirma ausência dessas funcionalidades nos
microsserviços.

## Referência visual

A interface parte do protótipo de produto disponível no
[Figma do Portal de Cursos](https://www.figma.com/design/6NyMCCCMKYeNv6QRvZXzE4).

Assets, marcas e materiais de terceiros permanecem sujeitos aos direitos de seus
respectivos titulares. A publicação deste código não concede licença independente sobre
esses materiais.

## Licença

Este repositório ainda não possui um arquivo de licença publicado. Até que uma licença seja
incluída pelos responsáveis, o código e os materiais associados devem ser tratados como
propriedade do projeto, sem autorização implícita para redistribuição ou uso comercial.

## Contato

Consulte as issues e os pull requests do repositório para acompanhar decisões, melhorias e
integrações futuras.
