# Arquitetura

O frontend é uma SPA com React Router. app inicializa o roteador e declara rotas; PortalLayout compartilha header e rodapé; shared concentra elementos reutilizáveis; features agrupa páginas componentes hooks serviços dados tipos filtros e estilos por domínio.

## Fronteira de dados

`src/features/courses/services/courseCatalog.ts` expõe `loadCourseCatalog(): Promise<CatalogCourse[]>`. Hoje carrega o módulo de mocks. `useCatalog` mantém loading/success/error, descarta respostas depois de desmontar e permite retry. Ao implementar API, substitua a função do serviço, valide o payload recebido e preserve o contrato usado pela UI. Não espalhe fetch pelos cartões.

Home, projetos e dados detalhados ainda leem mocks diretamente. Migrá-los para serviços é uma etapa futura, documentada no roadmap; não há um backend fictício escondido.

## Estado e navegação

Filtros e abas persistem na URL. Não duplique listas filtradas em estado: derive-as dos dados e parâmetros. As abas dos cursos oferecem setas/Home/End. O menu móvel fecha ao navegar e com Escape, devolvendo o foco ao botão. Header permanece sticky; o logo usa o asset local e Cursos permanece azul.

## Estilos e conteúdo

Tokens compartilhados e acadêmicos estão em src/styles/index.css. CSS de catálogo e detalhes fica perto de suas features. Use componentes compartilhados para elementos repetidos, sem abstrair cada frase. Dados de curso só devem aparecer quando pertencem ao curso selecionado.

## Limites atuais

Não existem sessões, permissões, persistência ou envio de dados. PrototypeAction explicita ações pendentes. Não use apenas controles visuais para proteger futuras rotas: autorização deverá ser validada no servidor.


## Regras de dependência

AppRoutes importa páginas de cada funcionalidade e usa PortalLayout como rota pai. Páginas compõem seus componentes e elementos de shared. Serviços de curso dependem dos tipos e dados do próprio domínio. Tipos e filtros não dependem de componentes React.

Evite arquivos index que reexportam todo o domínio e ocultam dependências. Use importações diretas para deixar a origem de cada componente clara. Não crie outra pasta global de páginas ou mocks para novas funcionalidades: coloque o conteúdo no domínio responsável.

Os testes de catálogo importam os filtros do domínio. O gerador de fixtures foi atualizado para os caminhos novos e continua renderizando os componentes reais. A reorganização preserva URLs filtros estado das abas e comportamento visual.
