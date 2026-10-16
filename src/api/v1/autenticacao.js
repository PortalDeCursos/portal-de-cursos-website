import { ErroApi, obterBaseApi, requisitarApi } from '../cliente.js'

export const VERSAO = 'v1'

export async function autenticar(email, senha, sinal) {
  if (!email || !senha) {
    throw new ErroApi('E-mail e senha são obrigatórios para autenticação.', { status: 400 })
  }

  const base = obterBaseApi('usuarios', VERSAO)
  const url = `${base}/auth/login`

  let resposta
  try {
    resposta = await requisitarApi(url, {
      metodo: 'POST',
      corpo: { email, senha },
      sinal,
    })
  } catch (erro) {
    if (erro.status === 400 || erro.status === 401 || erro.status === 403) {
      throw new ErroApi('Não foi possível entrar. Confira seu e-mail e sua senha.', {
        status: erro.status,
        causa: erro,
      })
    }
    throw erro
  }

  if (
    !resposta ||
    typeof resposta.token !== 'string' ||
    !resposta.token ||
    typeof resposta.expiracao !== 'number' ||
    !Number.isFinite(resposta.expiracao) ||
    resposta.expiracao <= 0 ||
    resposta.expiracao > 86400000
  ) {
    throw new ErroApi('Não foi possível confirmar sua sessão. Resposta inválida do servidor.', {
      status: 502,
    })
  }

  return {
    token: resposta.token,
    expiraEm: Date.now() + resposta.expiracao,
    expiracao: resposta.expiracao,
  }
}

export const moduloAutenticacao = {
  versao: VERSAO,
  autenticar,
}

export default moduloAutenticacao
