export async function consultarCursos(sinal) {
  const endereco = import.meta.env.VITE_API_CURSOS || `${import.meta.env.BASE_URL}data/cursos.json`
  const resposta = await fetch(endereco, {
    signal: sinal,
    headers: { Accept: 'application/json' },
    cache: 'no-store',
  })
  if (!resposta.ok) {
    const erro = new Error('Não foi possível carregar os cursos.')
    erro.codigo = resposta.status
    throw erro
  }
  const dados = await resposta.json()
  if (
    !Array.isArray(dados) ||
    dados.some((curso) => !curso.identificador || !curso.nome || !curso.sigla)
  ) {
    throw new Error('O catálogo recebido está em um formato inválido.')
  }
  return dados
}
