function papelDoUsuario(usuario) {
  const bruto = usuario?.tipoUsuario || usuario?.role || ''
  return String(bruto).replace(/^ROLE_/, '').toUpperCase()
}

function cursoIdDoUsuario(usuario) {
  return usuario?.cursoId ?? usuario?.curso?.id ?? usuario?.usuario?.cursoId ?? usuario?.usuario?.curso?.id ?? null
}

export function ehProfessor(usuario) {
  return papelDoUsuario(usuario) === 'PROFESSOR'
}

export function ehCoordenador(usuario) {
  return papelDoUsuario(usuario) === 'COORDENADOR'
}

export function ehAdmin(usuario) {
  return papelDoUsuario(usuario) === 'ADMIN'
}

export function podeSubmeterProjeto(usuario) {
  return ehProfessor(usuario)
}

export function podeEditarProjeto(usuario, projeto) {
  if (ehAdmin(usuario)) return true
  if (!ehCoordenador(usuario) || !projeto) return false
  const cursoUsuario = cursoIdDoUsuario(usuario)
  const cursoProjeto = projeto.cursoId ?? projeto.curso?.id ?? null
  if (cursoUsuario === null || cursoProjeto === null) return false
  return String(cursoUsuario) === String(cursoProjeto)
}
