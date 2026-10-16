export const basePortal = import.meta.env.BASE_URL

export function enderecoPrivado(caminho) {
  return `${basePortal}${caminho.replace(/^\//, '')}`
}
export function lerRota() {
  const caminho = window.location.pathname
    .slice(basePortal.length)
    .replace(/^\//, '')
    .replace(/\/$/, '')
  if (['administracao/login', 'login/admin', 'admin/login'].includes(caminho))
    return 'acesso-administracao'
  if (['professor/login', 'login/professor', 'login'].includes(caminho)) return 'acesso-professor'
  if (['professor', 'professor/feed', 'professor/painel'].includes(caminho)) return 'professor'
  if (caminho === 'professor/perfil') return caminho
  if (caminho === 'administracao' || caminho.startsWith('administracao/')) return caminho
  if (caminho.startsWith('professor/submissao/')) return caminho
  return window.location.hash.slice(1)
}
export function navegar(endereco, substituir = false) {
  window.history[substituir ? 'replaceState' : 'pushState'](null, '', endereco)
  window.dispatchEvent(new PopStateEvent('popstate'))
}
export function retornoAutenticado(tipoUsuario) {
  const retorno = new URLSearchParams(window.location.search).get('retorno')
  const permitido =
    tipoUsuario === 'ADMIN'
      ? /^administracao\/(painel|professores|cursos|projetos|submissoes|perfil)$/
      : /^professor\/(feed|perfil|submissao\/[a-zA-Z0-9_-]+)$/
  return retorno && permitido.test(retorno)
    ? retorno
    : tipoUsuario === 'ADMIN'
      ? 'administracao/painel'
      : 'professor/feed'
}
