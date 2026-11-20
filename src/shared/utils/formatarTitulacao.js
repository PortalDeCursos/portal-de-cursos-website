const MAPA_TITULACAO = {
  GRADUACAO: 'Graduação',
  ESPECIALIZACAO: 'Especialização',
  MESTRADO: 'Mestrado',
  DOUTORADO: 'Doutorado',
  POS_DOUTORADO: 'Pós-doutorado',
}

export function formatarTitulacao(valor) {
  if (!valor) return ''
  const chave = String(valor)
    .trim()
    .toUpperCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[\s-]+/g, '_')
  if (MAPA_TITULACAO[chave]) return MAPA_TITULACAO[chave]
  const texto = String(valor).trim().toLowerCase()
  return texto.charAt(0).toLocaleUpperCase('pt-BR') + texto.slice(1)
}
