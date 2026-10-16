export const basePortal = import.meta.env.BASE_URL

export function enderecoPrivado(caminho) {
  return `${basePortal}${caminho.replace(/^\//, '')}`
}
export function lerRota() {
  const caminho = window.location.pathname
    .slice(basePortal.length)
    .replace(/^\//, '')
    .replace(/\/$/, '')
  if (caminho === 'login') return 'acesso'
  if (caminho === 'professor' || caminho === 'professor/feed') return 'professor'
  if (caminho === 'professor/perfil') return caminho
  if (caminho.startsWith('professor/submissao/')) return caminho
  return window.location.hash.slice(1)
}
export function navegar(endereco, substituir = false) {
  window.history[substituir ? 'replaceState' : 'pushState'](null, '', endereco)
  window.dispatchEvent(new PopStateEvent('popstate'))
}
export function retornoProfessor() {
  const retorno = new URLSearchParams(window.location.search).get('retorno')
  return retorno && /^professor\/(feed|perfil|submissao\/[a-zA-Z0-9_-]+)$/.test(retorno)
    ? retorno
    : 'professor/feed'
}
