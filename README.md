# Portal de Cursos

Protótipo navegável de um portal acadêmico, implementado em React, TypeScript, Vite e Tailwind CSS a partir do Figma. Os dados acadêmicos, indicadores e contatos são demonstrativos.

## Começar

Use Node.js 24 e npm. Instale as dependências do frontend uma vez:

```sh
npm --prefix frontend ci
npm run dev
```

Abra o endereço mostrado pelo Vite. Os comandos da raiz encaminham para `frontend`:

```sh
npm run check        # lint + testes + build + fixtures visuais
npm run preview      # prévia do build
```

## O que funciona

- Home, catálogo, biblioteca de projetos e páginas de detalhes.
- Busca sem distinção de acentos, filtros combinados e estado da busca na URL.
- Abas de curso por teclado, grade por semestre e projetos filtrados por curso.
- Skeleton, estado vazio e falha com nova tentativa no catálogo.
- Header persistente com logo local, navegação ativa e menu móvel acessível.

Submissão, autenticação, documentos e contato exibem um aviso de integração pendente. Não há backend, envio de formulários ou login real. As fontes Manrope e JetBrains Mono são carregadas pelo Google Fonts e precisam de internet.

## Rotas

| Rota | Tela |
| --- | --- |
| `/` | Home |
| `/cursos` | Catálogo com filtros |
| `/cursos/tads` | Detalhes do TADS |
| `/cursos/:courseId` | Detalhes de curso |
| `/projetos` | Biblioteca |
| `/projetos/:projectId` | Detalhes de projeto |

## Organização

```text
frontend/src/
  app/                   # Inicialização e rotas
  shared/
    components/layout/   # Header Footer e PortalLayout
    components/ui/       # Elementos reutilizáveis
    pages/               # Página não encontrada
  features/
    home/pages/          # Home
    courses/
      components/        # Cartões catálogo e detalhes
      pages/             # Catálogo e detalhes de curso
      hooks/             # Estado de carregamento e retry
      services/          # Fronteira de acesso a dados
      data/mocks/        # Dados demonstrativos
      types/             # Contratos do domínio
      utils/             # Busca e filtros
      styles/            # Estilos específicos
    projects/
      components/        # Listas ilustrações e estado vazio
      pages/             # Biblioteca e detalhes
      data/mocks/        # Projetos demonstrativos
      types/             # Contratos do domínio
      utils/             # Filtros
  styles/                # Tokens e estilos globais
  assets/                # Imagens importadas
  main.tsx               # Entrada do frontend
```

Assets locais ficam em `frontend/src/assets` e `frontend/public/design`. A origem visual é o [protótipo no Figma](https://www.figma.com/design/6NyMCCCMKYeNv6QRvZXzE4). A publicação do código não concede uma licença independente para marcas ou materiais de terceiros.

## Fluxo de desenvolvimento

`main` guarda a versão validada. `develop` é a base para desenvolvimento futuro; ambas começam com a mesma versão preparada. A tag `prototype-baseline` preserva o protótipo anterior às melhorias. Crie branches curtas como `feat/api-courses` a partir de `develop`, abra PR para `develop` e valide antes de promover uma versão para `main`. Evite branches permanentes para cada experimento.

A CI executa lint, testes, build e geração de fixtures em pushes e PRs. Os relatórios gerados em `frontend/reports` ficam fora do Git e são disponibilizados como artefatos da CI.

Leia [CONTRIBUTING.md](CONTRIBUTING.md), [arquitetura](docs/architecture.md) e [roadmap](docs/roadmap.md).

## Publicação futura

O build está em `frontend/dist`. Configure a hospedagem SPA para redirecionar rotas para `index.html`. O carregador nativo da configuração Vite evita uma incompatibilidade do módulo Tailwind no Windows; por isso usamos Node 24. Este repositório não publica automaticamente o site.

