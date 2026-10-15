import { useState } from 'react'
import './submissao.css'

const formularioInicial = {
  nome: '',
  email: '',
  curso: '',
  orientador: '',
  tipo: '',
  titulo: '',
  resumo: '',
  objetivos: '',
  informacoesEspecificas: '',
  disciplinas: [],
  autores: [],
  documentos: {},
  arquivosComplementares: [],
  aceitaPublicacao: false,
}

const etapas = ['Identificação', 'Projeto', 'Equipe', 'Documentos']

const nomesTiposProjeto = {
  'Projeto Integrador': 'Projeto Integrador',
  TCC: 'TCC',
  Pesquisa: 'Projeto de Pesquisa',
  Extensão: 'Projeto de Extensão',
}

const tiposProjeto = {
  'Projeto Integrador': {
    descricao: 'Integra conhecimentos do curso em uma solução aplicada.',
    campoEspecifico: 'Requisitos, escopo e solução proposta',
    documentos: [
      { id: 'requisitos', nome: 'Documento de requisitos', obrigatorio: true },
      { id: 'relatorio', nome: 'Relatório técnico ou documentação do projeto', obrigatorio: true },
      { id: 'anexos', nome: 'Anexos complementares', obrigatorio: false, multiplo: true },
    ],
  },
  TCC: {
    descricao: 'Trabalho de conclusão com pesquisa, fundamentação e resultados.',
    campoEspecifico: 'Problema de pesquisa, metodologia e resultados esperados',
    documentos: [
      { id: 'preProjeto', nome: 'Pré-projeto ou projeto de pesquisa', obrigatorio: true },
      { id: 'trabalhoFinal', nome: 'Trabalho final do TCC', obrigatorio: true },
      { id: 'anexos', nome: 'Anexos complementares', obrigatorio: false, multiplo: true },
    ],
  },
  Pesquisa: {
    descricao: 'Investigação acadêmica com método e resultados documentados.',
    campoEspecifico: 'Método, hipótese e resultados da pesquisa',
    documentos: [
      { id: 'protocolo', nome: 'Projeto ou protocolo de pesquisa', obrigatorio: true },
      { id: 'relatorio', nome: 'Relatório de pesquisa', obrigatorio: true },
      { id: 'anexos', nome: 'Anexos complementares', obrigatorio: false, multiplo: true },
    ],
  },
  Extensão: {
    descricao: 'Ação acadêmica conectada às necessidades da comunidade.',
    campoEspecifico: 'Público atendido, impacto e execução da ação',
    documentos: [
      { id: 'plano', nome: 'Plano da ação de extensão', obrigatorio: true },
      { id: 'relatorio', nome: 'Relatório de execução', obrigatorio: true },
      { id: 'anexos', nome: 'Anexos complementares', obrigatorio: false, multiplo: true },
    ],
  },
}

export default function PaginaSubmissao() {
  const [formulario, definirFormulario] = useState(formularioInicial)
  const [etapa, definirEtapa] = useState(0)
  const [erro, definirErro] = useState('')
  const [enviado, definirEnviado] = useState(false)

  function alterar(campo, valor) {
    definirFormulario((anterior) => ({ ...anterior, [campo]: valor }))
    definirErro('')
  }

  function validarEtapa() {
    const obrigatorios = [
      etapa === 0 && ['nome', 'email', 'curso'],
      etapa === 1 && ['tipo', 'titulo', 'resumo', 'objetivos', 'informacoesEspecificas'],
      etapa === 2 && ['orientador'],
      etapa === 3 && [],
    ].find(Boolean)

    const camposFaltantes =
      obrigatorios?.filter((campo) => !formulario[campo] || !String(formulario[campo]).trim()) || []
    if (camposFaltantes.length) {
      const nomesCampos = {
        nome: 'nome completo',
        email: 'e-mail',
        curso: 'curso',
        tipo: 'tipo de produção',
        titulo: 'título',
        resumo: 'resumo',
        objetivos: 'objetivos e resultados',
        informacoesEspecificas: 'informações específicas do projeto',
        orientador: 'professor orientador',
      }
      definirErro(`Preencha: ${camposFaltantes.map((campo) => nomesCampos[campo]).join(', ')}.`)
      return false
    }
    const documentosObrigatorios =
      etapa === 3
        ? tiposProjeto[formulario.tipo]?.documentos.filter((documento) => documento.obrigatorio) ||
          []
        : []
    if (
      etapa === 3 &&
      documentosObrigatorios.some((documento) => !formulario.documentos[documento.id])
    ) {
      definirErro('Anexe todos os documentos obrigatórios para o tipo de projeto escolhido.')
      return false
    }
    if (etapa === 3 && !formulario.aceitaPublicacao) {
      definirErro('Confirme a autorização para publicação antes de continuar.')
      return false
    }
    return true
  }

  function avancar() {
    if (validarEtapa()) {
      definirErro('')
      definirEtapa((anterior) => Math.min(anterior + 1, etapas.length))
    }
  }

  function voltar() {
    definirErro('')
    definirEtapa((anterior) => Math.max(anterior - 1, 0))
  }

  function submeter(evento) {
    evento.preventDefault()
    if (validarEtapa()) definirEnviado(true)
  }

  function adicionarAutor() {
    alterar('autores', [...formulario.autores, { nome: '', email: '' }])
  }

  function alterarAutor(indice, campo, valor) {
    alterar(
      'autores',
      formulario.autores.map((autor, atual) =>
        atual === indice ? { ...autor, [campo]: valor } : autor,
      ),
    )
  }

  function adicionarDisciplina(valor) {
    const disciplina = valor.trim()
    if (disciplina && !formulario.disciplinas.includes(disciplina)) {
      alterar('disciplinas', [...formulario.disciplinas, disciplina])
    }
  }

  if (enviado) {
    return (
      <main className="limite pagina-submissao pagina-submissao--confirmacao" id="conteudo">
        <section className="submissao-confirmacao" aria-labelledby="titulo-confirmacao">
          <span className="submissao-confirmacao__selo" aria-hidden="true">
            ✓
          </span>
          <p className="pagina-submissao__rotulo">Submissão concluída</p>
          <h1 id="titulo-confirmacao">Submissão pronta para avaliação.</h1>
          <p>
            As informações foram organizadas e estão prontas para serem analisadas pelo professor
            orientador.
          </p>
          <div className="submissao-confirmacao__resumo">
            <strong>{formulario.titulo}</strong>
            <span>
              {nomesTiposProjeto[formulario.tipo]} · {formulario.nome} ·{' '}
              {Object.values(formulario.documentos)
                .flat()
                .map((arquivo) => arquivo.name)
                .join(', ')}
            </span>
          </div>
          <div className="submissao-confirmacao__acoes">
            <a className="botao-primario" href="#projetos">
              Ver projetos publicados
            </a>
            <button
              className="botao-secundario"
              type="button"
              onClick={() => {
                definirFormulario(formularioInicial)
                definirEtapa(0)
                definirEnviado(false)
              }}
            >
              Enviar outro projeto
            </button>
          </div>
        </section>
      </main>
    )
  }

  return (
    <main className="limite pagina-submissao" id="conteudo">
      <div className="pagina-submissao__introducao">
        <div>
          <p className="pagina-submissao__rotulo">Produção acadêmica</p>
          <h1>Compartilhe seu projeto</h1>
          <p>Organize a submissão em etapas e envie uma produção pronta para avaliação.</p>
        </div>
        <aside className="submissao-aviso">
          <strong>Fluxo em 4 etapas</strong>
          <span>Você pode revisar todas as informações antes da confirmação.</span>
        </aside>
      </div>

      <nav className="etapas-submissao" aria-label="Etapas da submissão">
        {etapas.map((nome, indice) => (
          <button
            key={nome}
            type="button"
            className={
              indice === etapa
                ? 'etapa etapa--atual'
                : indice < etapa
                  ? 'etapa etapa--feita'
                  : 'etapa'
            }
            onClick={() => indice < etapa && definirEtapa(indice)}
            aria-current={indice === etapa ? 'step' : undefined}
          >
            <span>{indice < etapa ? '✓' : indice + 1}</span>
            {nome}
          </button>
        ))}
      </nav>

      <form className="formulario-submissao" onSubmit={submeter} noValidate>
        {etapa === 0 && (
          <section className="formulario-submissao__secao" aria-labelledby="dados-identificacao">
            <div className="formulario-submissao__cabecalho">
              <span>01</span>
              <div>
                <h2 id="dados-identificacao">Identificação</h2>
                <p>Informe quem está iniciando a submissão e qual formação está relacionada.</p>
              </div>
            </div>
            <div className="formulario-submissao__grade">
              <label>
                Nome completo <span aria-hidden="true">*</span>
                <input
                  required
                  value={formulario.nome}
                  onChange={(e) => alterar('nome', e.target.value)}
                />
              </label>
              {formulario.tipo && (
                <label className="formulario-submissao__campo-largo">
                  {tiposProjeto[formulario.tipo].campoEspecifico} <span aria-hidden="true">*</span>
                  <textarea
                    required
                    rows="5"
                    value={formulario.informacoesEspecificas}
                    onChange={(e) => alterar('informacoesEspecificas', e.target.value)}
                  />
                </label>
              )}
              <label>
                E-mail <span aria-hidden="true">*</span>
                <input
                  required
                  type="email"
                  value={formulario.email}
                  onChange={(e) => alterar('email', e.target.value)}
                />
              </label>
              <label className="formulario-submissao__campo-largo">
                Curso <span aria-hidden="true">*</span>
                <input
                  required
                  value={formulario.curso}
                  onChange={(e) => alterar('curso', e.target.value)}
                />
              </label>
            </div>
          </section>
        )}

        {etapa === 1 && (
          <section className="formulario-submissao__secao" aria-labelledby="dados-projeto">
            <div className="formulario-submissao__cabecalho">
              <span>02</span>
              <div>
                <h2 id="dados-projeto">Projeto</h2>
                <p>Descreva a produção, seu objetivo e o resultado esperado.</p>
              </div>
            </div>
            <div className="formulario-submissao__grade">
              <label>
                Tipo de produção <span aria-hidden="true">*</span>
                <select
                  required
                  value={formulario.tipo}
                  onChange={(e) => alterar('tipo', e.target.value)}
                >
                  <option value="">Selecione uma opção</option>
                  {Object.keys(tiposProjeto).map((tipo) => (
                    <option key={tipo} value={tipo}>
                      {nomesTiposProjeto[tipo]}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                Título <span aria-hidden="true">*</span>
                <input
                  required
                  value={formulario.titulo}
                  onChange={(e) => alterar('titulo', e.target.value)}
                />
              </label>
              <label className="formulario-submissao__campo-largo">
                Resumo <span aria-hidden="true">*</span>
                <textarea
                  required
                  rows="5"
                  value={formulario.resumo}
                  onChange={(e) => alterar('resumo', e.target.value)}
                />
              </label>
              <label className="formulario-submissao__campo-largo">
                Objetivos e resultados <span aria-hidden="true">*</span>
                <textarea
                  required
                  rows="5"
                  value={formulario.objetivos}
                  onChange={(e) => alterar('objetivos', e.target.value)}
                />
              </label>
            </div>
          </section>
        )}

        {etapa === 2 && (
          <section className="formulario-submissao__secao" aria-labelledby="dados-equipe">
            <div className="formulario-submissao__cabecalho">
              <span>03</span>
              <div>
                <h2 id="dados-equipe">Equipe e orientação</h2>
                <p>Associe o orientador e os demais autores da produção.</p>
              </div>
            </div>
            <div className="formulario-submissao__grade">
              <label className="formulario-submissao__campo-largo">
                Professor orientador <span aria-hidden="true">*</span>
                <input
                  required
                  value={formulario.orientador}
                  onChange={(e) => alterar('orientador', e.target.value)}
                />
              </label>
              <label className="formulario-submissao__campo-largo">
                Adicionar disciplina
                <input
                  placeholder="Digite e pressione Enter"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault()
                      adicionarDisciplina(e.currentTarget.value)
                      e.currentTarget.value = ''
                    }
                  }}
                />
              </label>
              <div className="etiquetas-submissao formulario-submissao__campo-largo">
                {formulario.disciplinas.map((disciplina) => (
                  <button
                    key={disciplina}
                    type="button"
                    onClick={() =>
                      alterar(
                        'disciplinas',
                        formulario.disciplinas.filter((item) => item !== disciplina),
                      )
                    }
                  >
                    {disciplina} ×
                  </button>
                ))}
              </div>
              <div className="autores-submissao formulario-submissao__campo-largo">
                <div className="autores-submissao__cabecalho">
                  <strong>Coautores</strong>
                  <button type="button" className="botao-secundario" onClick={adicionarAutor}>
                    Adicionar coautor
                  </button>
                </div>
                {formulario.autores.map((autor, indice) => (
                  <div className="autores-submissao__linha" key={indice}>
                    <input
                      placeholder="Nome do coautor"
                      value={autor.nome}
                      onChange={(e) => alterarAutor(indice, 'nome', e.target.value)}
                    />
                    <input
                      placeholder="E-mail"
                      type="email"
                      value={autor.email}
                      onChange={(e) => alterarAutor(indice, 'email', e.target.value)}
                    />
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {etapa === 3 && (
          <section className="formulario-submissao__secao" aria-labelledby="dados-documentos">
            <div className="formulario-submissao__cabecalho">
              <span>04</span>
              <div>
                <h2 id="dados-documentos">Documentos e revisão</h2>
                <p>Anexe o material e confirme as condições de publicação.</p>
              </div>
            </div>
            <div className="documentos-submissao">
              {(tiposProjeto[formulario.tipo]?.documentos || []).map((documento) => {
                const arquivo = formulario.documentos[documento.id]
                return (
                  <label className="campo-arquivo" key={documento.id}>
                    <span className="campo-arquivo__icone" aria-hidden="true">
                      ↑
                    </span>
                    <strong>
                      {arquivo
                        ? Array.isArray(arquivo)
                          ? `${arquivo.length} arquivo(s)`
                          : arquivo.name
                        : documento.nome}
                    </strong>
                    <small>
                      {documento.obrigatorio ? 'Obrigatório' : 'Opcional'} ·{' '}
                      {documento.multiplo ? 'vários arquivos' : 'um PDF'}
                    </small>
                    <input
                      required={documento.obrigatorio}
                      type="file"
                      multiple={documento.multiplo}
                      accept={documento.multiplo ? undefined : 'application/pdf,.pdf'}
                      onChange={(e) =>
                        alterar('documentos', {
                          ...formulario.documentos,
                          [documento.id]: documento.multiplo
                            ? [...e.target.files]
                            : e.target.files?.[0] || null,
                        })
                      }
                    />
                  </label>
                )
              })}
            </div>
            <label
              className={`consentimento-submissao ${
                formulario.aceitaPublicacao ? 'consentimento-submissao--ativo' : ''
              }`}
            >
              <input
                type="checkbox"
                checked={formulario.aceitaPublicacao}
                onChange={(e) => alterar('aceitaPublicacao', e.target.checked)}
              />
              <span className="consentimento-submissao__texto">
                <strong>Autorizar publicação</strong>
                <span>
                  O projeto poderá ser publicado no portal somente se for aprovado pelo professor
                  orientador.
                </span>
              </span>
            </label>
          </section>
        )}

        {erro && (
          <p className="formulario-submissao__erro" role="alert">
            {erro}
          </p>
        )}
        <div className="formulario-submissao__rodape">
          <div className="formulario-submissao__acoes">
            {etapa > 0 && (
              <button className="botao-secundario" type="button" onClick={voltar}>
                Voltar
              </button>
            )}
            {etapa < etapas.length - 1 ? (
              <button className="botao-primario" type="button" onClick={avancar}>
                Continuar
              </button>
            ) : (
              <button className="botao-primario" type="submit">
                Confirmar submissão
              </button>
            )}
          </div>
        </div>
      </form>
    </main>
  )
}
