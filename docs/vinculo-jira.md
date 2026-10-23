# vínculo com o jira

branch: `feat/tads-184-login-e-area-do-professor`

base e destino do pr: `develop`.

- [tads-184 — tela de login](https://pjpedro158.atlassian.net/browse/TADS-184): página própria de entrada, formulário e mensagens de validação.
- [tads-197 — integração com as apis e autenticação jwt](https://pjpedro158.atlassian.net/browse/TADS-197): conexão com o contrato original de login, sessão em memória, expiração, saída e barreira de navegação.
- [tads-187 — tela de perfil do professor](https://pjpedro158.atlassian.net/browse/TADS-187): tela de edição de informações e foto apenas na sessão.
- [tads-194 — portal público: listagem e detalhe de cursos](https://pjpedro158.atlassian.net/browse/TADS-194): refinamentos dos cards e da navegação pública presentes nesta entrega.
- [tads-198 — interface responsiva](https://pjpedro158.atlassian.net/browse/TADS-198): ajustes de hero, cabeçalho e telas em desktop e celular.

o perfil e a foto podem ser editados apenas na sessão. o backend não foi alterado, e o login original não informa o papel da conta. por isso, esta entrega não conclui autorização por perfil nem persistência dos dados do professor.

os nomes da branch, do commit e do pr ficam em minúsculas, conforme pedido. as urls mantêm as chaves oficiais do jira. o vínculo fica explícito neste arquivo e no pr, sem depender de reconhecimento automático da chave em minúsculas.

o contributing não existe na raiz desta versão; foram conferidos o fluxo de contribuição do readme e a cópia anterior do contributing no backup local. ambos orientam partir de develop, usar feat/fix/docs e abrir pr para develop.
