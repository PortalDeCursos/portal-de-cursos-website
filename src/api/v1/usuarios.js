import { ErroApi, obterBaseApi, requisitarApi } from '../cliente.js'

export const VERSAO = 'v1'

export async function consultarUsuarios(token, sinal) {
  const base = obterBaseApi('usuarios', VERSAO)
  return requisitarApi(`${base}/usuarios`, {
    metodo: 'GET',
    token,
    sinal,
  })
}

export async function identificarConta(token, email, sinal) {
  const base = obterBaseApi('usuarios', VERSAO)
  const corresponde = (conta) =>
    typeof conta?.email === 'string' && conta.email.toLowerCase() === email.toLowerCase()

  let listaUsuarios = null
  try {
    listaUsuarios = await requisitarApi(`${base}/usuarios`, {
      metodo: 'GET',
      token,
      sinal,
    })
  } catch (falha) {
    if (falha.status !== 403) {
      throw new ErroApi('Não foi possível confirmar as permissões da conta. Tente novamente.', {
        status: falha.status,
        causa: falha,
      })
    }
  }

  if (Array.isArray(listaUsuarios)) {
    const admin = listaUsuarios.find(corresponde)
    if (admin?.tipoUsuario === 'ADMIN') {
      return {
        tipoUsuario: 'ADMIN',
        usuario: {
          id: admin.id,
          nome: admin.nome || email,
          email: admin.email,
        },
      }
    }
  }

  // Se não foi identificado como ADMIN ou tomou 403, consulta o endpoint de professores
  let listaProfessores
  try {
    listaProfessores = await requisitarApi(`${base}/professores/buscar`, {
      metodo: 'GET',
      token,
      sinal,
    })
  } catch (falhaProf) {
    throw new ErroApi('Não foi possível consultar o perfil desta conta.', {
      status: falhaProf.status,
      causa: falhaProf,
    })
  }

  if (Array.isArray(listaProfessores)) {
    const professor = listaProfessores.find(
      (item) => corresponde(item.usuario) && item.usuario.tipoUsuario === 'PROFESSOR',
    )
    if (professor) {
      return {
        tipoUsuario: 'PROFESSOR',
        usuario: {
          id: professor.usuario.id,
          professorId: professor.id,
          nome: professor.usuario.nome || email,
          email: professor.usuario.email,
          titulacao: professor.titulacao || '',
          descricao: professor.descricao || '',
        },
      }
    }
  }

  throw new ErroApi('Esta conta não possui acesso à área de professor ou de administração.', {
    status: 403,
  })
}

export const moduloUsuarios = {
  versao: VERSAO,
  consultarUsuarios,
  identificarConta,
}

export default moduloUsuarios
