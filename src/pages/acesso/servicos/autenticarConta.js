import { api } from '../../../api/index.js'

export async function autenticarConta(identificacao, senha, sinal) {
  const sessaoAutenticada = await api.auth.autenticar(identificacao, senha, sinal)
  const conta = await api.usuarios.identificarConta(sessaoAutenticada.token, identificacao, sinal)

  return {
    ...conta,
    token: sessaoAutenticada.token,
    expiraEm: sessaoAutenticada.expiraEm,
  }
}

export default autenticarConta
