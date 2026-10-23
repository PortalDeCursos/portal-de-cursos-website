import { identificarConta as identificarContaApi } from '@/api/usuarios.js'

export async function identificarConta(token, email, sinal) {
  return identificarContaApi(token, email, sinal)
}

export default identificarConta
