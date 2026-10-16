import { api } from '../../../api/index.js'

export async function identificarConta(token, email, sinal) {
  return api.usuarios.identificarConta(token, email, sinal)
}

export default identificarConta
