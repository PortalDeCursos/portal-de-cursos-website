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
| `/professor/login`         | Login da área do professor (`/login`)    |
| `/administracao/login`     | Login da equipe de administração         |

## Configuração de dados

O catálogo e a grade curricular usam o microsserviço de cursos. O frontend mantém `/api/v1` no
contrato de requisições; a pasta removida na refatoração era apenas uma organização local de
arquivos.

### Desenvolvimento com proxy Vite

O proxy do Vite recebe `/api/v1/cursos`, `/api/v1/disciplinas`, `/api/v1/campus` e
`/api/v1/areas-conhecimento`. Ele remove o prefixo `/api/v1` antes de encaminhar a requisição.
Defina os alvos do proxy somente no ambiente Node:

```bash
CURSOS_API_URL=http://127.0.0.1:8081
USUARIOS_API_URL=http://127.0.0.1:8080
```

Confirme com a equipe de backend se o serviço expõe `/cursos` ou `/api/v1/cursos` antes de
alterar o `rewrite` do proxy.

### Produção sem proxy

Em um deploy estático, como GitHub Pages, o proxy não existe. Configure URLs públicas absolutas
para o bundle chamar os serviços diretamente:

```bash
VITE_API_CURSOS_URL=https://exemplo.edu.br/api/v1/cursos \
VITE_API_DISCIPLINAS_URL=https://exemplo.edu.br/api/v1/disciplinas npm run build
```

No GitHub Pages, cadastre `VITE_API_CURSOS_URL`, `VITE_API_DISCIPLINAS_URL` e, quando houver
autenticação remota, `VITE_API_AUTENTICACAO` como variáveis do repositório. O workflow de Pages
as injeta somente durante o build; elas devem conter URLs públicas e nunca segredos.

Os cursos são carregados da resposta paginada da API, e as disciplinas usam o identificador do
curso retornado pelo serviço. Variáveis com o prefixo `VITE_` são expostas no navegador; nunca
coloque credenciais ou segredos nelas. Os nomes antigos `VITE_API_CURSOS` e
`VITE_API_DISCIPLINAS` continuam aceitos durante a transição.

## Estrutura do projeto

As pastas técnicas usam nomes em inglês. Componentes, textos e identificadores próprios do
domínio permanecem em português do Brasil, sem acentos em nomes de arquivos ou símbolos.

```text
src/
  api/                   # Recursos HTTP por domínio
  app/                   # Roteamento e composição global
  assets/                # Fontes e recursos locais
  pages/                 # Páginas agrupadas por domínio
    inicio/              # Página inicial
    cursos/              # Catálogo de cursos
    detalhes-curso/      # Informações de uma formação
    projetos/            # Biblioteca de projetos
    submissao/           # Fluxo de submissão
    professor/           # Feed e detalhes de avaliações
  shared/                # Componentes e estilos compartilhados
  styles/                # Tokens e estilos globais
```

Consulte [a estrutura detalhada](./docs/ESTRUTURA.md) para as responsabilidades de cada pasta.

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

Consulte [as regras de interface](./docs/regras-interface.md) e
[o fluxo de autenticação](./docs/autenticacao-professor.md) antes de alterar telas compartilhadas.

## CI

O workflow de CI é executado em pushes para `main` e `develop`, além de pull requests para
essas branches. Ele utiliza Node.js 24 e executa:

```bash
npm ci
npm run lint
npm run format:check
npm run build
```

## Limitações atuais

A página `/login` usa o mesmo serviço de autenticação para as duas áreas: professor entra no feed `/professor/feed`, administrador entra em `/administracao/painel`. O papel é consultado nos endpoints existentes do serviço, sem seletor de papel no cliente. Para conectar a autenticação, execute o serviço de Usuários conforme
[o contrato de integração](docs/autenticacao-professor.md). O proxy local aponta para `http://127.0.0.1:8080`; altere `USUARIOS_API_URL` se necessário. Sem serviço disponível, a interface informa a falha e não cria uma sessão demonstrativa.

O frontend possui integração de consulta e gestão de cursos e disciplinas com o serviço acadêmico de Cursos. Ainda faltam:

- persistência de projetos e submissões em serviços próprios;
- autorização por perfil nos serviços acadêmicos correspondentes;
- upload e armazenamento de documentos;
- envio de notificações;
- decisão de professor persistida em serviço;
- autorização por perfil;
- integração institucional para estudantes e professores.

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
