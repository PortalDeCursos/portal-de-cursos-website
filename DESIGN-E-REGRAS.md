# Design e regras do Portal de Cursos

## Referência e escopo

Frames `7:2` e `9:2117` do arquivo Figma `6NyMCCCMKYeNv6QRvZXzE4`: ambos apresentam a mesma página inicial. Os documentos do projeto definem o escopo. A interface usa dados ilustrativos locais; autenticação, submissão, PDFs e notificações dependem dos microsserviços e não são simulados como operações concluídas.

## Organização por página

- `src/paginas/inicio/PaginaInicial.jsx`: composição da página Início.
- `src/paginas/inicio/inicio.css`: estilos da página.
- `src/paginas/inicio/componentes`: apresentação, cursos em destaque, projetos em destaque, convite de submissão e destaque do projeto, separados por responsabilidade.
- `src/compartilhados/componentes`: componentes reutilizados, cada um em sua pasta pelo nome: cabeçalho, rodapé, ícone, ligação, cartão de curso, item de projeto e janela de contexto.
- `src/compartilhados/estilos`: estilos usados por mais de um componente.
- `src/dados`: dados demonstrativos compartilhados.
- `src/aplicacao`: composição e estado global.
- `src/estilos` e `src/recursos`: variáveis visuais, ícones e fontes.

Novas páginas devem ganhar pastas com seu nome em `paginas`, incluindo CSS e componentes exclusivos. Não organizar a interface por pastas de microsserviços. Reaproveitar elementos entre páginas em `compartilhados`. Identificadores próprios em português, sem acentos; textos da interface com acentuação. React e CSS sempre separados. Preservar nomes técnicos do ecossistema.

## Sistema visual

Manrope, pesos 400 a 800; conteúdo central de até 1280px, margens internas de 48px no desktop, 32px no tablet e 24px no celular. Introdução em proporção 7/5, cursos em duas colunas, uma no celular. Fundo claro `#f9f9ff`, superfícies brancas, azul `#0046d2`, título `#00050e`, texto `#44474c`. Espaçamento principal de 40px e cartões com 24px internos. Raios de 8px para botões, 12px para cartões e 16px para o convite. Títulos de 48px, 36px, 28px e 22px, reduzidos no celular.

Tema escuro por variáveis semânticas em `globais.css`. Preferência inicial do sistema e escolha persistida em localStorage quando disponível. Botão com lua/sol no cabeçalho, nome acessível e estado pressionado.

## Adaptações do protótipo

Removidos controles Normal/Skeleton/Vazio/Erro, links sem destinos de legislação e portal do discente. Rótulo de convite ampliado para Produção acadêmica, incluindo TCC e Projeto Integrador. Usar marca textual, pois os espaços de logotipo nos frames estão vazios. Detalhes e listas abrem em janelas acessíveis; ações que exigem backend informam sua indisponibilidade. Não inventar grades, documentos ou autenticação. Dados ilustrativos identificados no rodapé.

## Acessibilidade e evolução

HTML semântico, um H1, hierarquia de títulos, foco visível, navegação por teclado, link de pular conteúdo, menu móvel com estado e dialog nativo com Escape. Respeitar movimento reduzido. Em integrações futuras, implementar carregamento, vazio e erro reais, sem seletores públicos de simulação. Publicar apenas projetos aprovados. Alunos submetem sem login; apenas professores e administradores autenticam. Autorização deve ser validada no backend. Serviços previstos: Usuários, Cursos, Projetos e Notificação. Não armazenar senhas no frontend.

## Modo AMOLED

Fundo e cabeçalho preto puro `#000000`, cartões `#0c0c0c`, superfícies secundárias `#141414` e bordas `#292929`. Sem brilho azul no fundo. Textos claros e acento azul mantêm a hierarquia. A preferência escura já salva continua válida.

## Catálogo de cursos

Referências adicionais do Figma: `9:2765` (resultados), `9:3190` (carregamento), `9:3711` (erro), `9:3335` (sem resultados), `9:3686` (cabeçalho), `9:3662` (rodapé principal), `9:3681` (base do rodapé).

A página fica em `src/paginas/cursos`, com componentes e CSS separados por responsabilidade. Cabeçalho compartilhado com navegação ativa e rodapé específico do catálogo. Filtros permanecem à esquerda no desktop em todos os estados; em telas estreitas, painel recolhível antes dos resultados. A busca e os filtros combinam texto, grau, modalidade, campus, área, turno e duração, com etiquetas removíveis e redefinição. Ordenação por relevância, nome e duração.

Dados locais demonstrativos são consultados de forma assíncrona em `/dados/cursos.json`. `VITE_API_CURSOS` pode apontar para uma API que retorne o mesmo formato. Carregamento, erro e vazio decorrem da consulta e filtros reais, sem controles públicos de simulação. Falhas HTTP mostram o código recebido; falhas de rede não inventam código 503. Tentar novamente refaz a consulta. Preferências ficam em sessionStorage e são mantidas após falha. Requisições são canceladas ao sair da página.

Removidos números fictícios de 48 cursos, período 2024.2, agendamento, suporte e repositório de PPC sem dados ou destinos no projeto. Sugestões usam apenas os cursos disponíveis. Códigos e-MEC e campus seguem exemplos ilustrativos do Figma, sem afirmar dados institucionais reais. Ano de copyright acompanha a data atual.

## Marca no cabeçalho

Logo fornecido pelo usuário com fundo removido usando a ferramenta de imagem, salvo em `src/recursos/marca/logo-portal.png`. Símbolo acompanhado de Portal de Cursos; a palavra Cursos e a navegação ativa usam o azul da marca `#135afe`. Cabeçalho em grade com colunas laterais equilibradas para centralizar a navegação. No celular, marca, alternador de tema e menu mantêm alinhamento horizontal. Regras específicas em `cabecalho/cabecalho.css`.

## Detalhes do curso e página de projetos

Frames `10:4128`, `10:4468` e `10:4732` implementados como visão geral, projetos sem resultados e carregamento em `paginas/detalhes-curso`. Rota `#curso/tads`, abas acessíveis por URL, teclado e histórico. A antiga janela de curso foi substituída por página. Grade e docentes mostram estados vazios quando não cadastrados. Produções aprovadas são filtradas por curso e tipo; o filtro Pesquisa do TADS demonstra o estado sem resultados usando os dados atuais. Carregamento corresponde ao fetch real de `/dados/detalhes-cursos.json`; API futura configurável por `VITE_API_DETALHES_CURSO`.

Não apresentar como fatos notas MEC, empregabilidade, ISSN, notas mínimas, portarias, contatos ou datas de avaliação que existem apenas no protótipo. Informações locais e fotografia são identificadas como ilustrativas.

A aba Projetos do cabeçalho abre a página `paginas/projetos`, em `#projetos`; `#biblioteca` é um endereço equivalente. A listagem geral não é modal. A busca e os filtros de curso e tipo ficam à esquerda no desktop. Os detalhes individuais de um projeto ainda usam a janela existente.

Linha de seção ativa aplicada a Início, Cursos, Projetos e ações restritas. Cabeçalho opaco branco no claro e `#111318` no AMOLED, com borda e contraste para se separar do fundo. A marca permanece centralizada no mesmo alinhamento de navegação.

## Hero e carrossel da inicial

Hero atualizado com marketing-site-skill, ui-craft e animate. Título e ações principais permanecem fixos; o carrossel apresenta formação, produções aprovadas e o fluxo de submissão. Quantidades derivadas dos dados locais, identificadas como demonstração. A fotografia já existente é ilustrativa.

Transição em opacity e transform: fade de 400ms e deslocamento de 40px em 600ms. Avanço automático a cada 5,5 segundos por um único percurso, sem retorno automático ao primeiro destaque. Ao chegar ao último slide, a navegação torna-se manual. Arrastar, clicar nos controles ou focar o carrossel também interrompe o automático. Hover e aba do navegador oculta pausam o avanço. Movimento reduzido desativa o avanço e as transições. Slides inativos ficam inert e ocultos para leitores de tela. Controles incluem indicadores, setas, pausa e teclado.

Correção de conteúdo do hero: os slides destacam curso, Projeto Integrador e TCC específicos, com informações do catálogo e links individuais. Não utilizar fotografia genérica como se fosse imagem do projeto. Os dados atuais não têm capas reais de projetos; usar ficha acadêmica sem inventar imagens.

## Cartão do catálogo

Refinado com ui-ux-pro-max e webapp-ui-skill: nome sem sigla duplicada, duração exibida uma única vez, ficha semântica com duração/modalidade/turno, campus e código e-MEC secundários. Ação com altura mínima de 46px, nome acessível específico, foco e hover sem alterar dimensões. Mesmos tokens nos temas claro e AMOLED. JSX e CSS continuam separados.
