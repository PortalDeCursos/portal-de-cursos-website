# Portal de Cursos

Portal acadêmico para descoberta de cursos, consulta de informações curriculares e
acompanhamento de produções desenvolvidas por estudantes. A interface foi construída como
um protótipo navegável em React e Vite, com conteúdo local e foco em uma experiência clara
para estudantes, professores e visitantes.

> O projeto contém dados acadêmicos e documentos de exemplo. Autenticação, persistência,
> envio de arquivos e integrações com serviços externos ainda não fazem parte do frontend.

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
| `/professor/feed`          | Feed de avaliações do professor          |
| `/professor/submissao/:id` | Detalhes de uma submissão                |
| `/login`                   | Login independente do professor          |

## Configuração de dados

O catálogo utiliza os arquivos locais:

- `public/data/cursos.json`;
- `public/data/detalhes-cursos.json`.

Para apontar o catálogo para um serviço externo, defina `VITE_API_CURSOS` antes de iniciar
o Vite:

```bash
VITE_API_CURSOS=https://exemplo.edu.br/api/cursos npm run dev
```

O endpoint deve responder com uma lista de cursos no formato compatível com
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
    courses/             # Catálogo e detalhes de cursos
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

Consulte [CONTRIBUTING.md](./CONTRIBUTING.md) para as regras completas de contribuição e
[DESIGN-E-REGRAS.md](./DESIGN-E-REGRAS.md) para as decisões de organização e interface.

## CI

O workflow de CI é executado em pushes para `main` e `develop`, além de pull requests para
essas branches. Ele utiliza Node.js 24 e executa:

```bash
npm ci
npm run lint
npm run build
```

## Limitações atuais

A página `/login` implementa o formulário de entrada do professor e a barreira de navegação
das rotas `/professor/feed` e `/professor/submissao/:id`. Para conectar a autenticação, execute o serviço de Usuários conforme
[o contrato de integração](docs/autenticacao-professor.md). O proxy local aponta para `http://127.0.0.1:8080`; altere `USUARIOS_API_URL` se necessário. Sem serviço disponível, a interface informa a falha e não cria uma sessão demonstrativa.

O frontend ainda não possui:

- backend ou persistência de dados;
- autenticação real;
- upload e armazenamento de documentos;
- envio de notificações;
- decisão de professor persistida em serviço;
- autorização por perfil;
- integração institucional para cursos, estudantes e professores.

As ações de submissão e avaliação disponíveis na interface servem para demonstrar o fluxo
e a organização da experiência. Antes de uso institucional, substitua os mocks por serviços
autorizados e revise o conteúdo acadêmico.

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
