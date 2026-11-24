let sessaoAtual = null

export function pegarSessao() {
  return sessaoAtual
}

export function definirSessao(novaSessao) {
  sessaoAtual = novaSessao || null
  return sessaoAtual
}

export function limparSessao() {
  sessaoAtual = null
}
