import { projetoEstaPublicado, linkDoDocumentoValido } from '@/shared/utils/contratoProjetos.js'
import { useEffect, useRef, useState } from 'react'
import Icone from '@/shared/componentes/Icone.jsx'
import { formatarTitulacao } from '@/shared/utils/formatarTitulacao.js'
import { buscarProjetoPorId, listarDocumentosProjeto, pegarUrlDownload } from '@/api/projetos.js'
import { listarCursos } from '@/api/cursos.js'
import { listarProfessores } from '@/api/professores.js'
import { listarDisciplinasPorCurso } from '@/api/disciplinas.js'
import './detalhes-projeto.css'
import TextoFormatado from '@/shared/componentes/TextoFormatado.jsx'

const ROTULOS_TIPO = {
  TCC: 'Trabalho de conclusão de curso (TCC)',
  PROJETO_INTEGRADOR: 'Projeto integrador',
  PROJETO_PESQUISA: 'Iniciação científica e pesquisa',
  PROJETO_EXTENSAO: 'Extensão comunitária',
  OUTROS: 'Produção acadêmica',
}

const ROTULOS_STATUS = {
  PUBLICADO: 'Produção publicada',
  APROVADO: 'Aprovado para publicação',
  EM_ANALISE: 'Em análise inicial',
  ANALISE_PUBLICACAO: 'Em análise da coordenação',
  REVISAO: 'Em revisão',
  RECUSADO: 'Submissão recusada',
  RECUSADO_PUBLICACAO: 'Publicação recusada',
}

const MODIFICADOR_STATUS = {
  PUBLICADO: 'publicado',
  APROVADO: 'aprovado',
  EM_ANALISE: 'analise',
  ANALISE_PUBLICACAO: 'analise',
  REVISAO: 'revisao',
  RECUSADO: 'recusado',
  RECUSADO_PUBLICACAO: 'recusado',
}

const MODIFICADOR_TIPO = {
  TCC: 'tcc',
  PROJETO_INTEGRADOR: 'integrador',
  PROJETO_PESQUISA: 'pesquisa',
  PROJETO_EXTENSAO: 'extensao',
  OUTROS: 'tcc',
}

function formatarData(isoStr) {
  if (!isoStr) return null
  const partes = isoStr.split('-')
  if (partes.length === 3) {
    return `${partes[2]}/${partes[1]}/${partes[0]}`
  }
  return isoStr
}

export default function PaginaProjeto({ identificador }) {
  const consultas = useRef({ identificador, dados: {} })
  const [estado, mudarEstado] = useState('carregando')
  const [projeto, mudarProjeto] = useState(null)
  const [documentos, mudarDocumentos] = useState([])
  const [cursoInfo, mudarCursoInfo] = useState(null)
  const [orientadorInfo, mudarOrientadorInfo] = useState(null)
  const [disciplinasProjeto, mudarDisciplinasProjeto] = useState([])
  const [citacaoCopiada, mudarCitacaoCopiada] = useState(false)
  const [erro, mudarErro] = useState('')
  const [tentativa, mudarTentativa] = useState(0)
  const [avisos, mudarAvisos] = useState({})

  useEffect(() => {
    if (consultas.current.identificador !== identificador)
      consultas.current = { identificador, dados: {} }
    const dadosConsultados = consultas.current.dados
    async function consultar(chave, carregar) {
      if (Object.hasOwn(dadosConsultados, chave)) return dadosConsultados[chave]
      const dados = await carregar()
      controle.signal.throwIfAborted()
      dadosConsultados[chave] = dados
      return dados
    }
    let ativo = true
    const controle = new AbortController()

    async function carregar() {
      mudarEstado('carregando')
      mudarProjeto(null)
      mudarDocumentos([])
      mudarCursoInfo(null)
      mudarOrientadorInfo(null)
      mudarDisciplinasProjeto([])
      mudarAvisos({})
      const avisar = (consulta, mensagem) => {
        if (ativo) mudarAvisos((atuais) => ({ ...atuais, [consulta]: mensagem }))
      }
      try {
        const [dadosProjeto, listaCursos, listaProfessores] = await Promise.all([
          consultar('projeto', () => buscarProjetoPorId(identificador, null, controle.signal)),
          consultar('cursos', () => listarCursos(controle.signal)).catch(() => {
            avisar('cursos', 'Não foi possível consultar o curso.')
            return []
          }),
          consultar('professores', () => listarProfessores(null, {}, controle.signal)).catch(() => {
            avisar('professores', 'Não foi possível consultar o orientador.')
            return []
          }),
        ])

        if (!ativo) return
        if (!projetoEstaPublicado(dadosProjeto)) {
          delete dadosConsultados.projeto
          mudarEstado('erro')
          mudarErro('Projeto acadêmico não encontrado ou não está disponível.')
          return
        }

        mudarProjeto(dadosProjeto)

        // Busca documentos anexos
        consultar('documentos', () => listarDocumentosProjeto(identificador, null, controle.signal))
          .then((docs) => {
            if (ativo && Array.isArray(docs)) {
              mudarDocumentos(docs.length > 0 ? docs : dadosProjeto.documentos || [])
            }
          })
          .catch(() => {
            avisar(
              'documentos',
              'Não foi possível atualizar os documentos. A lista pode estar incompleta.',
            )
            if (ativo && dadosProjeto.documentos) {
              mudarDocumentos(dadosProjeto.documentos)
            }
          })

        // Vincula curso
        if (dadosProjeto.cursoId) {
          const c = listaCursos.find((item) => String(item.id) === String(dadosProjeto.cursoId))
          if (c) mudarCursoInfo(c)

          // Carrega disciplinas associadas do projeto
          if (
            Array.isArray(dadosProjeto.disciplinasIds) &&
            dadosProjeto.disciplinasIds.length > 0
          ) {
            consultar('disciplinas', () =>
              listarDisciplinasPorCurso(dadosProjeto.cursoId, null, controle.signal),
            )
              .then((todasDisc) => {
                if (!ativo || !Array.isArray(todasDisc)) return
                const selecionadas = todasDisc.filter((d) =>
                  dadosProjeto.disciplinasIds.includes(d.id),
                )
                mudarDisciplinasProjeto(selecionadas)
              })
              .catch(() => avisar('disciplinas', 'Não foi possível consultar as disciplinas.'))
          }
        }

        // Vincula orientador
        const orientadorVinculo = dadosProjeto.professores?.find((p) => p.papel === 'ORIENTADOR')
        const profId =
          orientadorVinculo?.professorId ||
          dadosProjeto.orientadorId ||
          dadosProjeto.professores?.[0]?.professorId
        if (profId) {
          const prof = listaProfessores.find((item) => String(item.id) === String(profId))
          if (prof) mudarOrientadorInfo(prof)
        }

        mudarEstado('pronto')
      } catch (err) {
        if (ativo && err.name !== 'AbortError') {
          mudarEstado('erro')
          mudarErro('Não foi possível carregar os detalhes do projeto.')
        }
      }
    }

    carregar()
    return () => {
      ativo = false
      controle.abort()
    }
  }, [identificador, tentativa])

  if (estado === 'carregando') {
    return (
      <main id="conteudo" className="limite pagina-detalhe-projeto">
        <div className="detalhe-projeto__carregando" role="status">
          <p>Carregando produção acadêmica…</p>
        </div>
      </main>
    )
  }

  if (estado === 'erro' || !projeto) {
    return (
      <main id="conteudo" className="limite pagina-detalhe-projeto">
        <section className="detalhe-projeto__painel-erro" role="alert">
          <h2>Projeto não encontrado</h2>
          <p>{erro || 'O projeto solicitado não foi localizado no acervo acadêmico.'}</p>
          <button
            type="button"
            className="botao-secundario"
            onClick={() => mudarTentativa((atual) => atual + 1)}
          >
            Tentar novamente
          </button>
          <a className="botao-secundario" href="#projetos">
            Voltar ao acervo de projetos
          </a>
        </section>
      </main>
    )
  }

  const autores =
    Array.isArray(projeto.autores) && projeto.autores.length > 0 ? projeto.autores : []

  const nomeCurso =
    cursoInfo?.sigla ||
    cursoInfo?.acronimo ||
    cursoInfo?.nome ||
    (projeto.cursoId ? `Curso ${projeto.cursoId}` : 'Curso não informado')
  const nomeCursoCompleto = cursoInfo?.nome || nomeCurso
  const linkCurso = cursoInfo?.identificador ? `#curso/${cursoInfo.identificador}` : '#cursos'

  const statusChave = projeto.statusProjeto || projeto.status || 'PUBLICADO'
  const rotuloStatus = ROTULOS_STATUS[statusChave] || statusChave
  const classeStatus = MODIFICADOR_STATUS[statusChave] || 'publicado'

  const tipoFormatado =
    ROTULOS_TIPO[projeto.tipoProjeto] || projeto.tipoProjeto || 'Trabalho Acadêmico'
  const classeTipo = MODIFICADOR_TIPO[projeto.tipoProjeto] || 'tcc'

  // Monta citação ABNT
  const anoProjeto = projeto.dataInicio ? projeto.dataInicio.substring(0, 4) : 'Data não informada'
  const primeiroAutor = autores[0]?.nome || 'AUTOR'
  const partesNome = primeiroAutor.trim().split(' ')
  const ultimoSobrenome =
    partesNome.length > 1
      ? partesNome[partesNome.length - 1].toUpperCase()
      : primeiroAutor.toUpperCase()
  const prenomes = partesNome.slice(0, -1).join(' ')
  const citacaoABNT = `${ultimoSobrenome}${prenomes ? `, ${prenomes}` : ''}. ${projeto.nome}. ${anoProjeto}. ${nomeCursoCompleto}.`

  const copiarCitacao = () => {
    if (navigator?.clipboard) {
      navigator.clipboard
        .writeText(citacaoABNT)
        .then(() => {
          mudarCitacaoCopiada(true)
          setTimeout(() => mudarCitacaoCopiada(false), 3000)
        })
        .catch(() =>
          mudarAvisos((atuais) => ({
            ...atuais,
            copia: 'Não foi possível copiar. Selecione o texto e copie manualmente.',
          })),
        )
    }
  }

  // Tratamento contra duplicidade de descrição e resumo
  const resumo = (projeto.resumo || '').trim()
  const descricao = (projeto.descricao || '').trim()
  const temDescricaoDiferente = descricao && descricao.toLowerCase() !== resumo.toLowerCase()

  return (
    <main id="conteudo" className="limite pagina-detalhe-projeto">
      {Object.keys(avisos).length > 0 && (
        <section role="status">
          {Object.entries(avisos).map(([consulta, mensagem]) => (
            <p key={consulta}>{mensagem}</p>
          ))}
          <button
            type="button"
            className="botao-secundario"
            onClick={() => mudarTentativa((atual) => atual + 1)}
          >
            Tentar novamente
          </button>
        </section>
      )}
      {/* Navegação de Trilha (Breadcrumb) */}
      <nav className="detalhe-projeto__trilha" aria-label="Você está aqui">
        <a href="#inicio">Início</a>
        <span aria-hidden="true">/</span>
        <a href="#projetos">Acervo de Projetos</a>
        <span aria-hidden="true">/</span>
        <span aria-current="page" className="detalhe-projeto__trilha-atual">
          {projeto.nome}
        </span>
      </nav>

      {/* Hero / Cabeçalho Editorial com Identidade Acadêmica */}
      <header className="detalhe-projeto__hero">
        <div className="detalhe-projeto__topo-chips">
          <span className={`detalhe-projeto__chip detalhe-projeto__chip--${classeTipo}`}>
            {tipoFormatado}
          </span>
          <span className={`detalhe-projeto__chip detalhe-projeto__chip--${classeStatus}`}>
            {rotuloStatus}
          </span>
          <a
            className="detalhe-projeto__chip-curso"
            href={linkCurso}
            title={`Acessar página de ${nomeCursoCompleto}`}
          >
            <Icone nome="catalogo-cursos" />
            <span>{nomeCurso}</span>
          </a>
        </div>

        <h1 className="detalhe-projeto__titulo-principal">{projeto.nome}</h1>

        <div className="detalhe-projeto__meta-hero">
          {projeto.dataInicio && (
            <div className="detalhe-projeto__meta-item">
              <span className="detalhe-projeto__meta-rotulo">Período de realização</span>
              <span className="detalhe-projeto__meta-dado">
                {formatarData(projeto.dataInicio)}
                {projeto.dataFim ? ` até ${formatarData(projeto.dataFim)}` : ''}
              </span>
            </div>
          )}
          <div className="detalhe-projeto__meta-item">
            <span className="detalhe-projeto__meta-rotulo">Área / curso</span>
            <span className="detalhe-projeto__meta-dado">
              <a
                className="detalhe-projeto__meta-dado-link"
                href={linkCurso}
                title={`Acessar informações do curso ${nomeCursoCompleto}`}
              >
                <span>{nomeCursoCompleto}</span>
                <span aria-hidden="true">↗</span>
              </a>
            </span>
          </div>
          <div className="detalhe-projeto__meta-item">
            <span className="detalhe-projeto__meta-rotulo">Campus</span>
            <span className="detalhe-projeto__meta-dado">
              {cursoInfo?.campusNome || cursoInfo?.campus || 'Campus não informado'}
            </span>
          </div>
        </div>
      </header>

      {/* Layout Split: Conteúdo Analítico à Esquerda + Painel Lateral à Direita */}
      <div className="detalhe-projeto__grid">
        <div className="detalhe-projeto__coluna-principal">
          {/* Seção de Resumo */}
          {resumo && (
            <section className="detalhe-projeto__secao-bloco" aria-labelledby="rotulo-resumo">
              <div className="detalhe-projeto__bloco-header">
                <Icone nome="grau-detalhe" />
                <h2 id="rotulo-resumo">Resumo da produção</h2>
              </div>
              <TextoFormatado texto={resumo} className="detalhe-projeto__paragrafo" />
            </section>
          )}

          {/* Seção de Metodologia e Detalhes (somente se não for idêntica ao resumo) */}
          {temDescricaoDiferente && (
            <section className="detalhe-projeto__secao-bloco" aria-labelledby="rotulo-detalhes">
              <div className="detalhe-projeto__bloco-header">
                <Icone nome="laboratorio" />
                <h2 id="rotulo-detalhes">Detalhamento e aplicação prática</h2>
              </div>
              <TextoFormatado texto={descricao} className="detalhe-projeto__paragrafo" />
            </section>
          )}

          {/* Disciplinas e Componentes Integrados */}
          {disciplinasProjeto.length > 0 && (
            <section className="detalhe-projeto__secao-bloco" aria-labelledby="rotulo-disciplinas">
              <div className="detalhe-projeto__bloco-header">
                <Icone nome="matriz-detalhe" />
                <h2 id="rotulo-disciplinas">Componentes curriculares vinculados</h2>
              </div>
              <p className="detalhe-projeto__subtexto-secao">
                Conhecimentos acadêmicos articulados durante o desenvolvimento deste trabalho:
              </p>
              <div className="detalhe-projeto__disciplinas-tags">
                {disciplinasProjeto.map((disc) => (
                  <div key={disc.id} className="detalhe-projeto__disciplina-card">
                    <strong>{disc.nome}</strong>
                    {disc.codigo && <code>{disc.codigo}</code>}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Repositório e Documentos Técnicos */}
          <section className="detalhe-projeto__secao-bloco" aria-labelledby="rotulo-documentos">
            <div className="detalhe-projeto__bloco-header">
              <Icone nome="biblioteca-detalhe" />
              <h2 id="rotulo-documentos">Acervo e documentação técnica</h2>
            </div>
            {documentos.length > 0 ? (
              <ul className="detalhe-projeto__documentos-lista">
                {documentos.map((doc, idx) => {
                  const nomeDoc =
                    doc.nomeArquivo ||
                    doc.nomeOriginal ||
                    doc.nome ||
                    `Documento Técnico #${idx + 1}`
                  const urlDownload = linkDoDocumentoValido(doc.localizacao)
                    ? doc.localizacao
                    : pegarUrlDownload(projeto.id, doc.id)
                  const ehLinkExterno =
                    doc.tipoDocumento === 'LINK_MEMORIA' ||
                    (doc.localizacao && doc.localizacao.startsWith('http'))

                  return (
                    <li key={doc.id || idx} className="detalhe-projeto__documento-item">
                      <div className="detalhe-projeto__doc-icone-box">
                        <Icone nome="grau-detalhe" />
                      </div>
                      <div className="detalhe-projeto__doc-texto">
                        <strong title={nomeDoc}>{nomeDoc}</strong>
                        <small>
                          {ehLinkExterno
                            ? 'Repositório Institucional (Memória IFRN)'
                            : 'Documento Técnico Original (PDF)'}
                        </small>
                      </div>
                      <a
                        className="detalhe-projeto__doc-link-botao"
                        href={urlDownload}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <span>{ehLinkExterno ? 'Acessar no Repositório' : 'Visualizar PDF'}</span>
                      </a>
                    </li>
                  )
                })}
              </ul>
            ) : (
              <p className="detalhe-projeto__aviso-vazio">
                Nenhum arquivo digital complementar vinculado a este registro no momento.
              </p>
            )}
          </section>

          {/* Citação Acadêmica ABNT */}
          <section className="detalhe-projeto__secao-bloco detalhe-projeto__secao-citacao">
            <div className="detalhe-projeto__bloco-header">
              <Icone nome="docentes-detalhe" />
              <h2>Referência da produção</h2>
            </div>
            <div className="detalhe-projeto__caixa-citacao">
              <code>{citacaoABNT}</code>
              <button
                type="button"
                className="botao-secundario botao--pequeno detalhe-projeto__btn-copiar"
                onClick={copiarCitacao}
                title="Copiar referência para a área de transferência"
              >
                {citacaoCopiada ? 'Copiado!' : 'Copiar referência'}
              </button>
            </div>
          </section>
        </div>

        {/* Coluna Lateral: Orientador, Autores e Curso */}
        <aside
          className="detalhe-projeto__coluna-lateral"
          aria-label="Equipe e Informações do Projeto"
        >
          {/* Card: Orientação Docente */}
          <div className="detalhe-projeto__card-sidebar">
            <h3 className="detalhe-projeto__sidebar-titulo">Orientação docente</h3>
            {orientadorInfo ? (
              <a
                className="detalhe-projeto__membro-card"
                href={`#professor/${orientadorInfo.id}`}
                title={`Ver perfil docente de ${orientadorInfo.nome}`}
              >
                <div className="detalhe-projeto__membro-avatar detalhe-projeto__membro-avatar--prof">
                  {orientadorInfo.nome ? orientadorInfo.nome.charAt(0).toUpperCase() : 'P'}
                </div>
                <div className="detalhe-projeto__membro-dados">
                  <strong>{orientadorInfo.nome}</strong>
                  <span className="detalhe-projeto__membro-papel">
                    {orientadorInfo.titulacao
                      ? `Professor · ${formatarTitulacao(orientadorInfo.titulacao)}`
                      : 'Docente orientador'}
                  </span>
                  <span className="detalhe-projeto__membro-link-acao">Ver perfil docente →</span>
                </div>
              </a>
            ) : (
              <div className="detalhe-projeto__membro-card">
                <div className="detalhe-projeto__membro-avatar detalhe-projeto__membro-avatar--prof">
                  P
                </div>
                <div className="detalhe-projeto__membro-dados">
                  <strong>Orientador não informado</strong>
                  <span className="detalhe-projeto__membro-papel">
                    Consulte a equipe responsável pelo projeto.
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Card: Autores Discentes */}
          <div className="detalhe-projeto__card-sidebar">
            <h3 className="detalhe-projeto__sidebar-titulo">Autoria ({autores.length})</h3>
            <div className="detalhe-projeto__autores-lista">
              {autores.map((autor, idx) => {
                const nomeAutor = typeof autor === 'string' ? autor : autor.nome
                const emailAutor = typeof autor === 'object' ? autor.email : ''

                return (
                  <div key={idx} className="detalhe-projeto__membro-card">
                    <div className="detalhe-projeto__membro-avatar detalhe-projeto__membro-avatar--aluno">
                      {nomeAutor ? nomeAutor.charAt(0).toUpperCase() : 'A'}
                    </div>
                    <div className="detalhe-projeto__membro-dados">
                      <strong>{nomeAutor}</strong>
                      <span className="detalhe-projeto__membro-papel">Autor</span>
                      {emailAutor && (
                        <small className="detalhe-projeto__membro-email">{emailAutor}</small>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </aside>
      </div>
    </main>
  )
}
