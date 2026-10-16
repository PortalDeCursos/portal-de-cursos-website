# Login com o backend original — TADS-184 / TADS-197

Por orientação do usuário, o backend usuarioService não deve ser modificado. As alterações que o assistente havia feito em controllers, service, security, exception handler, DTO e testes foram desfeitas; application.properties do usuário foi preservado.

## Contrato existente

- POST /auth/login com `{ "email": "email-cadastrado", "senha": "senha-digitada" }`.
- Resposta: `{ "token": "JWT", "expiracao": 3600000 }`, duração em milissegundos.
- Não existe chamada a /auth/me. O backend original não oferece essa rota.
- O backend aceita e-mail, não nome de usuário.

O frontend mantém token e expiração somente em memória. Recarregar exige novo login; sair remove a sessão. Senhas e tokens não são persistidos nem registrados. Rotas de interface exigem uma sessão e a aplicação trata erros e timeout de 15 segundos.

A resposta original não contém id, nome nem perfil. A identidade exibida é o e-mail informado ao autenticar; o frontend não fabrica perfil nem decodifica o JWT para conceder permissões. A sessão indica autenticação, **não comprova que o usuário é professor**. O feed permanece demonstrativo. Autorizações de dados e ações precisam ser aplicadas pelos serviços existentes; não há alegação de autorização por perfil no frontend.

## Executar localmente

O proxy Vite encaminha /api/usuarios para http://127.0.0.1:8080, removendo o prefixo. Se necessário, configure USUARIOS_API_URL em .env.local e reinicie o Vite. Inicie o usuarioService original com Java 21 e seu banco PostgreSQL configurado. VITE_API_AUTENTICACAO é opcional e pode apontar diretamente para a URL completa HTTPS de /auth/login; nesse caso, a API precisa oferecer CORS.

O proxy do Vite só funciona em desenvolvimento. GitHub Pages precisa de API HTTPS acessível com CORS ou de outra hospedagem com reverse proxy. Login e feed continuam em /login e /professor/feed, com layout independente e retorno aos detalhes solicitados.

Credenciais inválidas no backend original podem chegar como 500 por causa do tratamento genérico de exceções. O frontend informa a falha sem exibir detalhes internos; não altera o servidor para corrigir esse status.

Tickets: TADS-184 e TADS-197. Nenhuma alteração de status no Jira ou publicação remota realizada.
