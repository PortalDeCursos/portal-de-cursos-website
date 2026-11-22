import test from 'node:test'
import assert from 'node:assert/strict'
import {
  projetoEstaPublicado,
  pegarIdsDisciplinas,
  montarEdicaoProjeto,
  validarDatasProjeto,
  linkDoDocumentoValido,
} from '../../src/shared/utils/contratoProjetos.js'
import { repetirConsulta } from '../../src/api/repetirConsulta.js'

test('o aceite do orientador não torna o projeto público', () => {
  for (const statusProjeto of [
    'EM_ANALISE',
    'APROVADO',
    'ANALISE_PUBLICACAO',
    'RECUSADO',
    'RECUSADO_PUBLICACAO',
    'REVISAO',
    undefined,
  ]) {
    assert.equal(projetoEstaPublicado({ statusProjeto }), false)
  }
  assert.equal(projetoEstaPublicado({ statusProjeto: 'PUBLICADO' }), true)
})

test('a leitura preserva os IDs de disciplinas devolvidos pelo serviço', () => {
  const projeto = { disciplinasIds: [3, 9] }
  const ids = pegarIdsDisciplinas(projeto)
  assert.deepEqual(ids, [3, 9])
  ids.pop()
  assert.deepEqual(projeto.disciplinasIds, [3, 9])
  assert.deepEqual(pegarIdsDisciplinas({}), [])
})

test('a edição altera o texto e mantém os vínculos exigidos no cadastro', () => {
  const projeto = {
    id: 7,
    cursoId: 2,
    campusId: 1,
    tipoProjeto: 'TCC',
    dataInicio: '2026-11-01',
    dataFim: '2026-11-26',
    disciplinasIds: [5, 8],
    autores: [{ nome: 'Autor', email: 'autor@example.org' }],
    professores: [{ professorId: 12, papel: 'ORIENTADOR' }],
    documentos: [
      {
        id: 3,
        nomeArquivo: 'link-memoria.txt',
        tipoDocumento: 'LINK_MEMORIA',
        localizacao: 'https://example.org/trabalho',
      },
    ],
  }
  const original = structuredClone(projeto)
  const dto = montarEdicaoProjeto(projeto, {
    titulo: ' Novo título ',
    resumo: ' Resumo ',
    objetivo: ' Objetivos ',
  })
  assert.equal(dto.nome, 'Novo título')
  assert.equal(dto.descricao, 'Objetivos')
  assert.deepEqual(dto.disciplinaIds, [5, 8])
  assert.deepEqual(dto.autores, projeto.autores)
  assert.deepEqual(dto.professores, projeto.professores)
  assert.equal(dto.documentos[0].localizacao, projeto.documentos[0].localizacao)
  assert.equal(dto.dataInicio, projeto.dataInicio)
  assert.equal(dto.tipoProjeto, 'TCC')
  assert.deepEqual(projeto, original)
})

test('não monta edição sem um projeto confirmado', () => {
  assert.throws(() => montarEdicaoProjeto(null, {}), /Reabra o projeto/)
})

test('datas são reais, obrigatórias e não permitem término antes do início', () => {
  assert.notEqual(validarDatasProjeto('', ''), '')
  assert.notEqual(validarDatasProjeto('2026-02-30', '2026-03-01'), '')
  assert.notEqual(validarDatasProjeto('2026-11-26', '2026-11-22'), '')
  assert.equal(validarDatasProjeto('2026-11-22', '2026-11-26'), '')
  assert.equal(validarDatasProjeto('2026-11-22', '2026-11-22'), '')
})

test('links rejeitam protocolos executáveis e credenciais embutidas', () => {
  for (const link of [
    'javascript:alert(1)',
    'data:text/html,teste',
    'https://usuario:senha@example.org',
    'endereço inválido',
  ])
    assert.equal(linkDoDocumentoValido(link), false)
  assert.equal(linkDoDocumentoValido('https://example.org/trabalho'), true)
})

test('consulta recuperável repete com limite e devolve o resultado', async () => {
  let chamadas = 0
  const resultado = await repetirConsulta(
    async () => {
      chamadas++
      if (chamadas < 3) throw Object.assign(new Error('Indisponível'), { status: 503 })
      return 'ok'
    },
    { intervalo: 1 },
  )
  assert.equal(resultado, 'ok')
  assert.equal(chamadas, 3)
})

test('falha persistente de GET para após três tentativas', async () => {
  let chamadas = 0
  await assert.rejects(
    repetirConsulta(
      async () => {
        chamadas++
        throw Object.assign(new Error('Sem conexão'), { status: 0 })
      },
      { intervalo: 1 },
    ),
  )
  assert.equal(chamadas, 3)
})

test('cadastro, edição e exclusão nunca são repetidos automaticamente', async () => {
  for (const metodo of ['POST', 'PUT', 'PATCH', 'DELETE']) {
    let chamadas = 0
    await assert.rejects(
      repetirConsulta(
        async () => {
          chamadas++
          throw Object.assign(new Error('Tempo esgotado'), { status: 408 })
        },
        { metodo, intervalo: 1 },
      ),
    )
    assert.equal(chamadas, 1, metodo)
  }
})

test('erros de permissão, validação e inexistência não são repetidos', async () => {
  for (const status of [400, 401, 403, 404, 409, 422]) {
    let chamadas = 0
    await assert.rejects(
      repetirConsulta(
        async () => {
          chamadas++
          throw Object.assign(new Error('Consulta recusada'), { status })
        },
        { intervalo: 1 },
      ),
    )
    assert.equal(chamadas, 1)
  }
})

test('cancelar durante a espera impede outra tentativa', async () => {
  const controle = new AbortController()
  let chamadas = 0
  const consulta = repetirConsulta(
    async () => {
      chamadas++
      throw Object.assign(new Error('Indisponível'), { status: 503 })
    },
    { sinal: controle.signal, intervalo: 100 },
  )
  setTimeout(() => controle.abort(), 5)
  await assert.rejects(consulta, { name: 'AbortError' })
  assert.equal(chamadas, 1)
})
