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

export async function buscarUsuarios(token, filtros = {}, sinal) {
  const base = obterBaseApi('usuarios', VERSAO)
  const parametros = new URLSearchParams()
  if (filtros.nome?.trim()) parametros.set('nome', filtros.nome.trim())
  const query = parametros.size ? `?${parametros}` : ''
  return requisitarApi(`${base}/usuarios/buscar${query}`, { metodo: 'GET', token, sinal })
}

export async function obterUsuarioPorId(token, id, sinal) {
  const base = obterBaseApi('usuarios', VERSAO)
  return requisitarApi(`${base}/usuarios/${encodeURIComponent(id)}`, { metodo: 'GET', token, sinal })
}

export async function cadastrarUsuario(dados, sinal) {
  const base = obterBaseApi('usuarios', VERSAO)
  return requisitarApi(`${base}/usuarios`, { metodo: 'POST', corpo: dados, sinal })
}

export async function atualizarUsuario(token, id, dados, sinal) {
  const base = obterBaseApi('usuarios', VERSAO)
  return requisitarApi(`${base}/usuarios/${encodeURIComponent(id)}`, {
    metodo: 'PUT', corpo: dados, token, sinal,
  })
}

export async function excluirUsuario(token, id, sinal) {
  const base = obterBaseApi('usuarios', VERSAO)
  return requisitarApi(`${base}/usuarios/${encodeURIComponent(id)}`, {
    metodo: 'DELETE', token, sinal,
  })
}

export async function identificarConta(token, email, sinal) {
  const base = obterBaseApi('usuarios', VERSAO)
  const corresponde = (conta) =>
    typeof conta?.email === 'string' && conta.email.toLowerCase() === email.toLowerCase()

  // Este endpoint aceita contas autenticadas; /usuarios exige papel ADMIN.
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
      (item) =>
        corresponde(item.usuario) &&
        ['PROFESSOR', 'COORDENADOR'].includes(item.usuario.tipoUsuario),
    )
    if (professor) {
      const cursoId = professor.cursoId ?? professor.curso?.id ?? professor.curso?.identificador
      if (professor.usuario.tipoUsuario === 'COORDENADOR' && !cursoId) {
        throw new ErroApi('A conta de coordenação não possui um curso vinculado.', { status: 403 })
      }
      return {
        tipoUsuario: professor.usuario.tipoUsuario,
        usuario: {
          id: professor.usuario.id,
          professorId: professor.id,
          cursoId,
          curso: professor.curso
            ? {
                id: professor.curso.id,
                identificador: professor.curso.identificador,
                nome: professor.curso.nome,
                sigla: professor.curso.sigla,
              }
            : null,
          nome: professor.usuario.nome || email,
          email: professor.usuario.email,
          titulacao: professor.titulacao || '',
          descricao: professor.descricao || '',
        },
      }
    }
  }

  let listaUsuarios
  try {
    listaUsuarios = await requisitarApi(`${base}/usuarios`, {
      metodo: 'GET',
      token,
      sinal,
    })
  } catch (falha) {
    throw new ErroApi('Não foi possível confirmar as permissões da conta. Tente novamente.', {
      status: falha.status,
      causa: falha,
    })
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

  throw new ErroApi('Esta conta não possui acesso à área de professor ou de administração.', {
    status: 403,
  })
}

export const moduloUsuarios = {
  versao: VERSAO,
  consultarUsuarios,
  buscar: buscarUsuarios,
  obterPorId: obterUsuarioPorId,
  cadastrar: cadastrarUsuario,
  atualizar: atualizarUsuario,
  excluir: excluirUsuario,
  identificarConta,
}

export default moduloUsuarios
