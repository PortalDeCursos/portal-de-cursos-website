# Arquitetura

O projeto usa uma única raiz de aplicação em `frontend/`; não há um segundo projeto aninhado em `frontend/frontend`.

O frontend é uma SPA com React Router. App organiza rotas e layout; páginas compõem componentes; features concentram domínio, filtros e tipos; services concentra a leitura dos dados.

## Fronteira de dados

`src/services/courseCatalog.ts` expõe `loadCourseCatalog(): Promise<CatalogCourse[]>`. Hoje carrega o módulo de mocks. `useCatalog` mantém loading/success/error, descarta respostas depois de desmontar e permite retry. Ao implementar API, substitua a função do serviço, valide o payload recebido e preserve o contrato usado pela UI. Não espalhe fetch pelos cartões.

Home, projetos e dados detalhados ainda leem mocks diretamente. Migrá-los para serviços é uma etapa futura, documentada no roadmap; não há um backend fictício escondido.

## Estado e navegação

Filtros e abas persistem na URL. Não duplique listas filtradas em estado: derive-as dos dados e parâmetros. As abas dos cursos oferecem setas/Home/End. O menu móvel fecha ao navegar e com Escape, devolvendo o foco ao botão. Header permanece sticky; o logo usa o asset local e Cursos permanece azul.

## Estilos e conteúdo

Tokens compartilhados e acadêmicos estão em index.css. CSS de catálogo e detalhes fica perto de suas features. Use componentes compartilhados para elementos repetidos, sem abstrair cada frase. Dados de curso só devem aparecer quando pertencem ao curso selecionado.

## Limites atuais

Não existem sessões, permissões, persistência ou envio de dados. PrototypeAction explicita ações pendentes. Não use apenas controles visuais para proteger futuras rotas: autorização deverá ser validada no servidor.
