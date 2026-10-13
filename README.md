# Portal de Cursos

Protótipo navegável de um portal acadêmico, implementado em React, TypeScript, Vite e Tailwind CSS a partir do Figma. Os dados acadêmicos, indicadores e contatos são demonstrativos.

## Começar

Use Node.js 24 e npm. Instale as dependências uma vez:

```sh
npm ci
npm run dev
```

Abra o endereço mostrado pelo Vite. ```sh
npm run check # lint + testes + build + fixtures visuais
npm run preview # prévia do build

````

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
src/
  components/layout/    # Header e Footer
  components/ui/        # Elementos compartilhados
  features/courses/     # Catálogo, filtros, tipos e detalhes
  features/projects/    # Projetos e filtros
  services/             # Acesso a dados, hoje por mocks
  mocks/                # Conteúdo demonstrativo
  pages/                # Composição das telas
  App.tsx               # Rotas e layout global
````

Assets locais ficam em `src/assets` e `public/design`. A origem visual é o [protótipo no Figma](https://www.figma.com/design/6NyMCCCMKYeNv6QRvZXzE4). A publicação do código não concede uma licença independente para marcas ou materiais de terceiros.

## Fluxo de desenvolvimento

`main` guarda a versão validada. `develop` é a base para desenvolvimento futuro; ambas começam com a mesma versão preparada. A tag `prototype-baseline` preserva o protótipo anterior às melhorias. Crie branches curtas como `feat/api-courses` a partir de `develop`, abra PR para `develop` e valide antes de promover uma versão para `main`. Evite branches permanentes para cada experimento.

A CI executa lint, testes, build e geração de fixtures em pushes e PRs. Os relatórios gerados em `reports` ficam fora do Git e são disponibilizados como artefatos da CI.

Leia [CONTRIBUTING.md](CONTRIBUTING.md), [arquitetura](docs/architecture.md) e [roadmap](docs/roadmap.md).

## Publicação futura

O build está em `dist`. Configure a hospedagem SPA para redirecionar rotas para `index.html`. O carregador nativo da configuração Vite evita uma incompatibilidade do módulo Tailwind no Windows; por isso usamos Node 24. Este repositório não publica automaticamente o site.
