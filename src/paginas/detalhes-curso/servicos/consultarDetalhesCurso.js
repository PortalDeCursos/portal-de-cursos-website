export async function consultarDetalhesCurso(identificador, sinal) {
  const base = import.meta.env.VITE_API_DETALHES_CURSO
  const endereco = base ? `${base.replace(/\/$/, '')}/${encodeURIComponent(identificador)}` : `${import.meta.env.BASE_URL}dados/detalhes-cursos.json`
  const resposta = await fetch(endereco, { signal: sinal, headers: { Accept: 'application/json' }, cache: 'no-store' })
  if (!resposta.ok) {
    const erro = new Error('Não foi possível consultar os detalhes do curso.')
    erro.codigo = resposta.status
    throw erro
  }
  const dados = await resposta.json()
  const curso = Array.isArray(dados) ? dados.find(item => item.identificador === identificador) : dados
  if (!curso || curso.identificador !== identificador) {
    const erro = new Error('Curso não encontrado.')
    erro.codigo = 404
    throw erro
  }
  if (typeof curso.nome !== 'string' || !curso.sigla) throw new Error('Os dados do curso estão em um formato inválido.')
  return curso
}
