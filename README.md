# Portal de Cursos

Portal acadêmico para descoberta de cursos, consulta de informações curriculares e
acompanhamento de produções desenvolvidas por estudantes. A interface foi construída em React e Vite, com foco em uma experiência clara para estudantes, professores e visitantes.

## Visão geral

O Portal de Cursos reúne, em uma única experiência:

- catálogo de cursos com busca, filtros e ordenação;
- páginas de detalhes com informações acadêmicas e matriz curricular;
- biblioteca de projetos e produções acadêmicas;
- fluxo de submissão organizado por tipo de produção;
- área do professor para revisar submissões;
- painel de administração e gestão acadêmica;
- temas claro e escuro integrados;
- estados de carregamento, erro e busca sem resultados.

## Requisitos

- Node.js 24 ou superior;
- npm;
- navegador moderno.

## Instalação rápida

Clone o repositório e instale as dependências:

```bash
git clone https://github.com/PortalDeCursos/portal-de-cursos-website.git
cd portal-de-cursos-website
npm install
```

Inicie o servidor de desenvolvimento:

```bash
npm run dev
```

Abra o endereço informado pelo Vite, normalmente `http://localhost:5173`.

## Scripts disponíveis

| Comando                | Finalidade                                    |
| ---------------------- | --------------------------------------------- |
| `npm run dev`          | Inicia o servidor de desenvolvimento          |
| `npm run build`        | Gera o build de produção em `dist/`           |
| `npm run preview`      | Serve localmente o build gerado               |
| `npm run lint`         | Executa o ESLint                              |
| `npm run format`       | Formata o projeto com Prettier                |
| `npm run format:check` | Verifica a formatação sem alterar arquivos    |
| `npm run check`        | Executa as verificações principais do projeto |

Antes de abrir um pull request ou commit:

```bash
npm run check
npm run format:check
```

## Rotas disponíveis

O frontend utiliza navegação baseada em rotas organizadas:

| Rota                       | Tela                                     |
| -------------------------- | ---------------------------------------- |
| `#inicio`                  | Página inicial                           |
| `#cursos`                  | Catálogo de cursos                       |
| `#curso/:id`               | Detalhes do curso                        |
| `#projetos`                | Biblioteca de projetos                   |
| `#submeter`                | Fluxo de submissão de produção acadêmica |
| `/login`                   | Login de acesso acadêmico                |
| `/professor/feed`          | Feed de avaliações do professor          |
| `/professor/submissao/:id` | Detalhes de uma submissão                |
| `/administracao/painel`    | Painel de gestão administrativa          |

## Configuração de ambiente e dados

O catálogo e a grade curricular conectam-se aos microsserviços acadêmicos correspondentes.

### Desenvolvimento com proxy Vite

O proxy do Vite recebe `/api/v1/cursos`, `/api/v1/disciplinas`, `/api/v1/campus` e
`/api/v1/areas-conhecimento`. Ele remove o prefixo `/api/v1` antes de encaminhar a requisição.
Defina as variáveis no `.env` (baseado em `.env.example`):

```bash
CURSOS_API_URL=http://127.0.0.1:8081
USUARIOS_API_URL=http://127.0.0.1:8080
```

### Produção sem proxy (Deploy estático)

Para deploys estáticos (como GitHub Pages), configure URLs públicas absolutas para que o bundle acesse as APIs diretamente:

```bash
VITE_API_CURSOS_URL=https://api.exemplo.edu.br/api/v1/cursos \
VITE_API_DISCIPLINAS_URL=https://api.exemplo.edu.br/api/v1/disciplinas npm run build
```

## Estrutura do projeto

```text
src/
  api/                   # Recursos HTTP e clientes de integração por domínio
  app/                   # Roteamento e composição global
  assets/                # Fontes, ícones e marca
  pages/                 # Páginas e módulos da aplicação
    acesso/              # Autenticação e telas de login
    administracao/       # Painel e cadastros administrativos
    cursos/              # Catálogo público de cursos
    detalhes-curso/      # Detalhes, matriz e informações curriculares
    inicio/              # Página inicial pública
    painel-aluno/        # Acompanhamento do estudante
    professor/           # Avaliação e acompanhamento do docente
    projetos/            # Vitrine de projetos acadêmicos
    submissao/           # Envio de produções
  shared/                # Componentes e estilos reutilizáveis
  styles/                # Design tokens e temas (claro/escuro)
```

## CI / CD

O workflow de CI é executado automaticamente em pushes e pull requests para as branches `main` e `develop`. Ele executa:

```bash
npm ci
npm run check
npm run format:check
```

## Referência visual

A interface segue as diretrizes do protótipo no [Figma do Portal de Cursos](https://www.figma.com/design/6NyMCCCMKYeNv6QRvZXzE4).
