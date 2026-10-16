export async function autenticarProfessor(identificacao, senha, sinal) {
  const endereco =
    import.meta.env.VITE_API_AUTENTICACAO || `${import.meta.env.BASE_URL}api/usuarios/auth/login`
  if (!endereco)
    throw new Error(
      'O acesso ainda não está conectado ao serviço de Usuários. Tente novamente quando a integração estiver disponível.',
    )
  let url
  try {
    url = new URL(endereco, window.location.origin)
  } catch {
    throw new Error('O endereço do serviço de acesso precisa ser configurado pela administração.')
  }
  const desenvolvimentoLocal =
    url.protocol === 'http:' && ['localhost', '127.0.0.1', '[::1]'].includes(url.hostname)
  if (url.protocol !== 'https:' && !desenvolvimentoLocal) {
    throw new Error('O serviço de acesso precisa de uma conexão segura.')
  }
  let resposta
  try {
    resposta = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({ email: identificacao, senha }),
      signal: sinal,
      cache: 'no-store',
      credentials: 'omit',
    })
  } catch (erro) {
    if (erro.name === 'AbortError') throw erro
    throw new Error(
      'Não foi possível conectar ao serviço. Verifique sua conexão e tente novamente.',
      { cause: erro },
    )
  }
  if ([400, 401, 403].includes(resposta.status))
    throw new Error('Não foi possível entrar. Confira seu e-mail e sua senha.')
  if (resposta.status === 429)
    throw new Error('Muitas tentativas de acesso. Aguarde um pouco antes de tentar novamente.')
  if (!resposta.ok)
    throw new Error('O serviço de acesso está indisponível. Tente novamente em instantes.')
  let dados
  try {
    dados = await resposta.json()
  } catch {
    throw new Error('O serviço retornou uma resposta inesperada. Tente novamente.')
  }
  if (
    typeof dados.token !== 'string' ||
    !dados.token ||
    typeof dados.expiracao !== 'number' ||
    !Number.isFinite(dados.expiracao) ||
    dados.expiracao <= 0 ||
    dados.expiracao > 86400000
  ) {
    throw new Error('Não foi possível confirmar sua sessão. Entre em contato com a administração.')
  }
  // A API original retorna somente o token e sua duração, sem dados de perfil.
  // O frontend não infere permissões a partir do e-mail ou do conteúdo do JWT.
  return {
    usuario: { email: identificacao, nome: identificacao },
    token: dados.token,
    expiraEm: Date.now() + dados.expiracao,
  }
}
