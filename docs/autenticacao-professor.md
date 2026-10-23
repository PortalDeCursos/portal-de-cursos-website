# Autenticação e identificação de área — TADS-184 / TADS-197

Por orientação do usuário, o backend usuarioService não deve ser alterado. A entrada é unificada em `/login` para aluno, professor, coordenador e administrador: todos usam o mesmo formulário e a área é determinada pelo papel associado à conta após a autenticação. Os caminhos antigos de entrada são aliases para essa tela. O formulário preserva o design global dividido do portal.

## Contratos disponíveis no Swagger do serviço

- POST /auth/login: recebe `{ "email": "email-cadastrado", "senha": "senha-digitada" }`, retorna `{ "token": "JWT", "expiracao": 3600000 }`, duração em milissegundos.
- GET /usuarios: exige ADMIN no backend. A resposta permite localizar a própria conta com tipoUsuario ADMIN.
- GET /professores/buscar: permite localizar perfis docentes e identificar `PROFESSOR` ou `COORDENADOR` pelo `usuario.tipoUsuario` e `cursoId`.
- Nenhuma chamada a /auth/me, endpoint que não existe no contrato atual.

O Swagger também documenta CRUD de usuários, professores, alunos e coordenadores. O cliente versionado `src/api/v1` encaminha essas operações por `/api/v1/usuarios` no proxy local. `POST /alunos` e `POST /usuarios` são públicos; os demais endpoints protegidos usam `Authorization: Bearer <token>`. O cadastro de aluno requer `cursoId` numérico e um objeto `usuario` com `nome`, `email` e senha de pelo menos oito caracteres. Os identificadores locais de cursos do catálogo são slugs e não devem ser enviados como IDs do serviço.

O cliente src/pages/acesso/servicos/autenticarConta.js delega a identificação a identificarConta.js. As consultas de identidade usam Bearer e mantêm apenas campos necessários, descartando senha e outros campos da resposta. Falhas, papel desconhecido ou conta não localizada impedem a criação da sessão. Não há fallback de administrador nem escolha de papel pelo usuário. Nenhuma permissão é deduzida pelo formato do e-mail ou pelo conteúdo do JWT.

A sessão fica apenas em memória. Recarregar exige login; logout e expiração removem a sessão. O fluxo completo tem timeout de 15 segundos. Token e senha não são gravados em storage ou logs.

## Destino após entrar

- ADMIN: /administracao/painel.
- COORDENADOR: /coordenacao/painel, com escopo limitado ao `cursoId` do perfil.
- PROFESSOR: /professor/feed.
- ALUNO: /aluno/painel.
- O retorno solicitado precisa pertencer à área do papel autenticado. Professor não abre administração por URL; administrador não entra no feed de orientação do professor.
- A separação visual não substitui a autorização dos serviços.

## Execução

O proxy Vite encaminha /api/v1/usuarios para http://127.0.0.1:8080, removendo o prefixo. Assim, a consulta do frontend /api/v1/usuarios/usuarios corresponde ao GET /usuarios do backend. USUARIOS_API_URL permite alterar o destino em desenvolvimento. VITE_API_AUTENTICACAO permite usar a URL HTTPS completa de /auth/login; as consultas de identidade usam a mesma base do serviço, que precisa permitir CORS.

O proxy não funciona no GitHub Pages: produção precisa de serviço HTTPS com CORS ou hospedagem com reverse proxy. Credenciais inválidas podem chegar como 500 no tratamento atual do backend; o frontend informa a falha sem exibir detalhes internos.

## Limites

O aluno ainda não pode autenticar por este fluxo: o backend oferece cadastro, mas não fornece endpoint de autenticação/identificação por sessão do aluno. A interface direciona uma conta autenticada com papel `ALUNO` para `/aluno/painel`. O professor altera o próprio perfil somente no estado da sessão; foto/upload e gravação de perfil não estão integrados. O fluxo de submissões, estados e decisões é mantido em memória até a integração de endpoints de submissão; a notificação de e-mail à coordenação também depende de um serviço de notificações. O Swagger deste microsserviço não documenta gestão de cursos, disciplinas nem submissões. O endpoint `PUT /professores/{id}` aceita papéis `PROFESSOR`, `ADMIN` ou `COORDENADOR`, com autorização de escopo aplicada pelo backend.

Nenhuma alteração de backend, publicação remota ou atualização de ticket foi realizada nesta etapa.
