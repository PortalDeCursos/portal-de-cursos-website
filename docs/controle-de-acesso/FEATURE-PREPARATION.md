# Preparação — controle de acesso e navegação por perfil

feature_id: controle-acesso-por-perfil
feature_title: Navegação pública e áreas protegidas por perfil
status: blocked
owner_role: planner
last_updated: 2026-10-19

## 1. Problema e objetivo

problem_statement: O cabeçalho público expõe Área do Professor e Administração ao visitante, duplica ações e a sessão atual só existe em memória; após recarregar uma rota privada ela não pode ser validada.
primary_user: Visitante, professor autenticado e administrador autenticado.
value: Cada pessoa vê apenas caminhos compatíveis com seu acesso e uma URL privada nunca apresenta conteúdo sem sessão válida.
goal: Ter um único contrato de navegação por estado de autenticação e uma guarda de rotas que preserve o destino permitido após o login.
mvp_slice: Cabeçalho público com quatro links e Entrar; um acesso contextual por perfil após autenticação; redirecionamento de visitante em rota privada.
deferred_scope: Persistência de perfil, publicação de cursos/projetos e mudanças no usuarioService.
feature_flag: Não definido; avaliar antes de rollout se a área autenticada já estiver em produção.
rollback: Reverter somente o conjunto de alterações de navegação e guarda de rota; não remover nem invalidar sessões no backend.
required_artifacts:
- Decisão de contrato de identidade autenticada.
- Matriz de rotas e perfis aprovada.
- Relatório de validação de navegação, teclado e URLs diretas.
wiki_updates:
- docs/regras-interface.md
- docs/autenticacao-professor.md

## 2. Comportamento aceito

| Estado | Navegação principal | Ações à direita | Rotas privadas permitidas |
| --- | --- | --- | --- |
| Visitante | Início, Cursos, Projetos, Submeter projeto | Entrar e tema | Nenhuma |
| Professor | Início, Cursos, Projetos, Submeter projeto e Área do Professor | Nome/foto, tema e saída | `/professor/feed`, `/professor/perfil`, `/professor/submissao/:id` |
| Administrador | Início, Cursos, Projetos, Submeter projeto e Administração | Nome/foto, tema e saída | `/administracao/painel`, `/administracao/professores`, `/administracao/cursos`, `/administracao/projetos`, `/administracao/submissoes`, `/administracao/perfil` |

Regras de interação:

- O visitante não vê nomes, ícones ou atalhos de áreas privadas; só vê **Entrar**.
- Administração e Área do Professor são mutuamente exclusivas no cabeçalho autenticado.
- O botão de tema permanece no extremo direito e tem nome acessível.
- Uma URL privada sem sessão válida redireciona ao login com retorno interno permitido.
- Uma conta autenticada em área de outro perfil vai para sua própria área; o servidor continua sendo a autoridade das permissões.

## 3. Inventário técnico e limites

changed_subsystems:
- `src/shared/components/header/Cabecalho.jsx`
- `src/app/Aplicacao.jsx`
- `src/app/rotas.js`
- `src/api/v1/autenticacao.js`
- `src/api/v1/usuarios.js`
- `.github/workflows/pages.yml`

constraints:
- Somente frontend está autorizado; não alterar `usuarioService`.
- Não conceder perfil por e-mail, escolha de tela ou decodificação local de JWT.
- Não gravar senha nem token em logs.
- React e CSS permanecem separados e os temas claro/AMOLED continuam disponíveis.

assumptions:
- O backend continua validando Bearer em toda operação protegida.
- A página de login comum pode retornar para as duas áreas após identificar o perfil no servidor.

open_questions:
- Qual contrato oficial identifica o usuário autenticado e seu papel sem listar todos os usuários/professores: resposta do login enriquecida ou `GET /auth/me`? **Bloqueante.**
- Como a sessão válida será retomada após atualização da página sem expor o JWT indevidamente? **Bloqueante.**
- O deploy do GitHub Pages deve gerar HTML para todas as rotas privadas de administração ou migrar essas rotas para hash? **Bloqueante para URL direta publicada.**

security_privacy_notes:
- A interface pode orientar e redirecionar, mas não substitui autorização do backend.
- A verificação de identidade deve ser feita por resposta autenticada do servidor; o frontend não deve confiar em conteúdo decodificado do token para liberar área.
- Capturas e relatórios não devem registrar token, e-mail real ou dados de professor.

non_functional_requirements:
- Sem overflow horizontal em 320 px, 390 px e desktop.
- Todos os links e botões operáveis por teclado, com foco visível.
- O redirecionamento não pode aceitar URL externa no parâmetro `retorno`.

## 4. Alarmes ativos

### A-AUTH-001

alarm_id: A-AUTH-001
alarm_type: placeholder
severity: critical
status: active
scope: feature
applies_to: controle-acesso-por-perfil
location: contrato de identidade autenticada
summary: Não há contrato de identidade individual para revalidar papel e sessão após recarregar uma rota privada.
current_value: O login retorna token e expiração; a identificação atual consulta listas de usuários ou professores.
why_present: O contrato existente não informa usuário/papel no login e não expõe `/auth/me`.
missing_to_replace: Decisão documentada do responsável pela API sobre resposta de login com identidade ou endpoint autenticado de identidade.
replacement_target: Uma resposta autenticada mínima com `id`, `nome`, `email` e `tipoUsuario`, ou endpoint equivalente.
replacement_plan: Formalizar o contrato com a equipe de backend, validar CORS e usar somente a identidade da própria sessão para montar o estado do cliente.
owner_role: product_owner
blocks:
- ready
- in_progress
- approved
- done
must_propagate: true

### A-DEPLOY-001

alarm_id: A-DEPLOY-001
alarm_type: placeholder
severity: blocking
status: active
scope: feature
applies_to: controle-acesso-por-perfil
location: `.github/workflows/pages.yml`
summary: O GitHub Pages só prepara HTML para login e rotas de professor; URLs de administração não têm artefato explícito de rota direta.
current_value: Apenas `login`, `professor/feed` e `professor/perfil` recebem cópia de `index.html`.
why_present: A publicação atual não lista as rotas administrativas.
missing_to_replace: Decisão de hospedagem e lista final de rotas com acesso direto suportado.
replacement_target: Todas as rotas privadas previstas devem carregar a aplicação antes da guarda de sessão.
replacement_plan: Atualizar o mecanismo de fallback no workflow ou adotar URLs hash para as áreas privadas, então testar URLs publicadas em janela anônima.
owner_role: devops_owner
blocks:
- ready
- in_progress
- approved
- done
must_propagate: true

## 5. Critérios de aceite do recurso

- Em estado visitante, o DOM do header contém exatamente os quatro links públicos, Entrar e o seletor de tema; não contém Administração nem Área do Professor.
- Em sessão de professor, existe somente Área do Professor e as rotas administrativas redirecionam ao feed.
- Em sessão de administrador, existe somente Administração e as rotas de professor redirecionam ao painel.
- O retorno após login aceita apenas rotas internas pertencentes ao perfil autenticado.
- Abrir cada rota privada em nova aba, com sessão ausente ou expirada, chega à tela de login sem revelar conteúdo privado.
- O mesmo comportamento funciona na hospedagem de destino, não somente no Vite local.
