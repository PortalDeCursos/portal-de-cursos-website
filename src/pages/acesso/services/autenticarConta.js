import { autenticar } from '@/api/autenticacao.js'
import { identificarAluno, identificarConta } from '@/api/usuarios.js'

export async function autenticarConta(identificacao, senha, sinal) {
  const sessaoAutenticada = await autenticar(identificacao, senha, sinal)
  const conta =
    sessaoAutenticada.tipoUsuario === 'ALUNO'
      ? await identificarAluno(sessaoAutenticada.token, identificacao, sinal)
      : await identificarConta(sessaoAutenticada.token, identificacao, sinal)

  return {
    ...conta,
    token: sessaoAutenticada.token,
    expiraEm: sessaoAutenticada.expiraEm,
  }
}

export default autenticarConta
