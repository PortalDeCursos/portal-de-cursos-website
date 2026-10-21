import { useRef, useState } from 'react'
import { cursos } from '../../data/cursos.js'
import { projetos } from '../../data/projetos.js'
import { submissoes } from '../../data/submissoes.js'
import { enderecoPrivado } from '../../app/rotas.js'
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
  linkMemoria: '',
  arquivosComplementares: [],
  aceitaPublicacao: false,
}

const etapas = ['Identificação', 'Projeto', 'Equipe', 'Documentos']
const TAMANHO_MAXIMO_DOCUMENTO = 10 * 1024 * 1024

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
    usaLinkMemoria: true,
    documentos: [],
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

export default function PaginaSubmissao({ sessao, aoSubmeter }) {
  const [formulario, definirFormulario] = useState(() => ({
    ...formularioInicial,
    nome: sessao?.usuario?.nome || '',
    email: sessao?.usuario?.email || '',
    curso:
      sessao?.tipoUsuario === 'ALUNO'
        ? sessao?.usuario?.cursoId || sessao?.usuario?.curso || ''
        : '',
  }))
  const [etapa, definirEtapa] = useState(0)
  const [erro, definirErro] = useState('')
  const [erros, definirErros] = useState({})
  const [enviado, definirEnviado] = useState(false)
  const resumoErros = useRef(null)

  function alterar(campo, valor) {
    definirFormulario((anterior) => ({ ...anterior, [campo]: valor }))
    definirErro('')
    definirErros((anteriores) => ({ ...anteriores, [campo]: undefined }))
  }

  function registrarErros(proximosErros, mensagem = 'Revise os campos destacados para continuar.') {
    definirErros(proximosErros)
    definirErro(mensagem)
    window.requestAnimationFrame(() => resumoErros.current?.focus())
  }

  function erroDoCampo(campo) {
    return erros[campo] ? `erro-${campo}` : undefined
  }

  function validarArquivo(arquivo) {
    const arquivoPdf = arquivo?.type === 'application/pdf' || /\.pdf$/i.test(arquivo?.name || '')
    if (!arquivoPdf) return 'Envie um arquivo PDF.'
    if (arquivo.size > TAMANHO_MAXIMO_DOCUMENTO) return 'O PDF deve ter no máximo 10 MB.'
    return ''
  }

  function listaOrientadores(curso) {
    const relacionados = submissoes
      .filter((submissao) => submissao.curso === curso)
      .map((submissao) => submissao.orientador)
    const doCurso = cursos.find((item) => item.sigla === curso || item.nome === curso)
    const doProjeto = projetos
      .filter((projeto) => projeto.curso === curso || projeto.curso === doCurso?.nome)
      .map((projeto) => projeto.orientador)
    return [...new Set([...relacionados, ...doProjeto].filter(Boolean))]
  }

  function validarEtapa() {
    const ehTCC = formulario.tipo === 'TCC'
    const camposEtapa1 = ehTCC
      ? ['tipo', 'titulo', 'resumo', 'objetivos']
      : ['tipo', 'titulo', 'resumo', 'objetivos', 'informacoesEspecificas']
    const obrigatorios = [
      etapa === 0 && ['nome', 'email', 'curso'],
      etapa === 1 && camposEtapa1,
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
      registrarErros(
        Object.fromEntries(
          camposFaltantes.map((campo) => [campo, `Informe ${nomesCampos[campo]}.`]),
        ),
      )
      return false
    }
    if (etapa === 2) {
      const autoresInvalidos = formulario.autores.some(
        (autor) => !autor.nome.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(autor.email.trim()),
      )
      if (autoresInvalidos) {
        registrarErros({}, 'Informe nome e e-mail válidos para cada integrante.')
        return false
      }
    }
    if (
      etapa === 1 &&
      projetos.some(
        (projeto) =>
          projeto.titulo?.trim().toLowerCase() === formulario.titulo.trim().toLowerCase(),
      )
    ) {
      registrarErros({
        titulo: 'Já existe um projeto com este título. Escolha um título diferente.',
      })
      return false
    }
    // TCC: valida link do Memória
    if (etapa === 3 && ehTCC) {
      const link = formulario.linkMemoria.trim()
      if (!link) {
        registrarErros(
          { linkMemoria: 'Informe o link do repositório Memória.' },
          'Informe o link do repositório Memória para continuar.',
        )
        return false
      }
      try {
        new URL(link)
      } catch {
        registrarErros(
          { linkMemoria: 'Informe uma URL válida (ex.: https://memoria.ifsc.edu.br/...).' },
          'A URL informada é inválida.',
        )
        return false
      }
    }
    const documentosObrigatorios =
      etapa === 3 && !ehTCC
        ? tiposProjeto[formulario.tipo]?.documentos.filter((documento) => documento.obrigatorio) ||
          []
        : []
    if (
      etapa === 3 &&
      !ehTCC &&
      documentosObrigatorios.some((documento) => !formulario.documentos[documento.id])
    ) {
      registrarErros(
        Object.fromEntries(
          documentosObrigatorios
            .filter((documento) => !formulario.documentos[documento.id])
            .map((documento) => [documento.id, `Anexe ${documento.nome}.`]),
        ),
        'Anexe os documentos obrigatórios para continuar.',
      )
      return false
    }
    if (etapa === 3 && !formulario.aceitaPublicacao) {
      registrarErros(
        { aceitaPublicacao: 'Confirme a autorização de publicação para continuar.' },
        'Confirme a autorização de publicação para continuar.',
      )
      return false
    }
    return true
  }

  function avancar() {
    if (validarEtapa()) {
      definirErro('')
      definirErros({})
      definirEtapa((anterior) => Math.min(anterior + 1, etapas.length - 1))
    }
  }

  function voltar() {
    definirErro('')
    definirErros({})
    definirEtapa((anterior) => Math.max(anterior - 1, 0))
  }

  function submeter(evento) {
    evento.preventDefault()
    if (!validarEtapa()) return
    const cursoProjeto = cursos.find(
      (item) =>
        item.sigla === formulario.curso ||
        item.nome === formulario.curso ||
        String(item.identificador) === String(formulario.curso),
    )
    const autores = formulario.autores
      .filter((autor) => autor.nome.trim())
      .map((autor) => ({ nome: autor.nome.trim(), email: autor.email.trim() }))
    const ehTCC = formulario.tipo === 'TCC'
    aoSubmeter?.({
      identificador: crypto.randomUUID(),
      identificadorCurso: cursoProjeto?.identificador,
      titulo: formulario.titulo.trim(),
      tipo: formulario.tipo,
      curso: cursoProjeto?.sigla || formulario.curso,
      cursoCompleto: cursoProjeto?.nome || formulario.curso,
      autor: formulario.nome.trim(),
      autores:
        sessao?.tipoUsuario === 'ALUNO'
          ? [{ nome: formulario.nome.trim(), email: formulario.email.trim() }, ...autores]
          : autores,
      orientador: formulario.orientador,
      enviadoEm: new Intl.DateTimeFormat('pt-BR', {
        dateStyle: 'short',
        timeStyle: 'short',
      }).format(new Date()),
      status: sessao?.tipoUsuario === 'ALUNO' ? 'Aguardando Orientador' : 'Em análise',
      email: formulario.email.trim(),
      disciplinas: [...formulario.disciplinas],
      resumo: formulario.resumo.trim(),
      objetivo: formulario.objetivos.trim(),
      ...(ehTCC
        ? { linkMemoria: formulario.linkMemoria.trim(), documentos: [] }
        : {
            documentos: Object.values(formulario.documentos)
              .flat()
              .filter(Boolean)
              .map((arquivo) => arquivo.name),
          }),
      tipoAutor: sessao?.tipoUsuario || 'ALUNO',
    })
    definirEnviado(true)
  }

  function alterarDocumentos(documento, arquivos) {
    const listaArquivos = documento.multiplo ? [...arquivos] : [arquivos?.[0]].filter(Boolean)
    const arquivoInvalido = listaArquivos.find(validarArquivo)
    if (arquivoInvalido) {
      registrarErros({ [documento.id]: validarArquivo(arquivoInvalido) })
      return
    }
    alterar('documentos', {
      ...formulario.documentos,
      [documento.id]: documento.multiplo ? listaArquivos : listaArquivos[0] || null,
    })
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
            {sessao?.tipoUsuario === 'PROFESSOR' || sessao?.tipoUsuario === 'COORDENADOR'
              ? 'A submissão foi encaminhada para avaliação do coordenador do curso.'
              : 'A submissão aguarda a avaliação do professor orientador. Após o aceite, seguirá para o coordenador do curso. O aviso por e-mail depende da integração de notificações.'}
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
                definirFormulario({
                  ...formularioInicial,
                  nome: sessao?.usuario?.nome || '',
                  email: sessao?.usuario?.email || '',
                  curso:
                    sessao?.tipoUsuario === 'ALUNO'
                      ? sessao?.usuario?.cursoId || sessao?.usuario?.curso || ''
                      : '',
                })
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

  if (sessao?.tipoUsuario === 'ADMIN') {
    return (
      <main className="limite pagina-submissao" id="conteudo">
        <section className="submissao-confirmacao" aria-labelledby="titulo-sem-envio">
          <p className="pagina-submissao__rotulo">Acesso de consulta</p>
          <h1 id="titulo-sem-envio">A administração não submete nem avalia projetos.</h1>
          <p>Você pode acompanhar todas as submissões na área administrativa.</p>
          <a className="botao-primario" href={enderecoPrivado('administracao/submissoes')}>
            Ver submissões
          </a>
        </section>
      </main>
    )
  }

  if (!sessao || !['ALUNO', 'PROFESSOR', 'COORDENADOR'].includes(sessao.tipoUsuario)) {
    return (
      <main className="limite pagina-submissao" id="conteudo">
        <section className="submissao-confirmacao" aria-labelledby="titulo-acesso-submissao">
          <p className="pagina-submissao__rotulo">Acesso necessário</p>
          <h1 id="titulo-acesso-submissao">Entre para submeter um projeto.</h1>
          <p>
            O envio de projetos está disponível para alunos, professores e coordenadores
            autenticados.
          </p>
          <a className="botao-primario" href={enderecoPrivado('aluno/cadastro')}>
            Criar conta de aluno
          </a>
          <a className="botao-secundario" href={enderecoPrivado('login')}>
            Entrar no portal
          </a>
        </section>
      </main>
    )
  }

  const autorSessao = sessao.tipoUsuario === 'ALUNO'

  return (
    <main className="limite pagina-submissao" id="conteudo">
      <div className="pagina-submissao__introducao">
        <div>
          <p className="pagina-submissao__rotulo">Produção acadêmica</p>
          <h1>Compartilhe seu projeto</h1>
          <p>
            Preencha quatro etapas rápidas e envie seu projeto para avaliação do{' '}
            {sessao?.tipoUsuario === 'PROFESSOR' || sessao?.tipoUsuario === 'COORDENADOR'
              ? 'coordenador do curso'
              : 'professor orientador'}
            .
          </p>
        </div>
        <aside className="submissao-aviso">
          <strong>4 etapas antes do envio</strong>
          <span>Seus dados, projeto, equipe e documentos. Você revisa tudo antes de enviar.</span>
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
                <p>Diga quem você é e a qual curso o projeto pertence.</p>
              </div>
            </div>
            <div className="formulario-submissao__grade">
              <label>
                Nome completo <span aria-hidden="true">*</span>
                <input
                  required
                  aria-invalid={Boolean(erros.nome)}
                  aria-describedby={erroDoCampo('nome')}
                  placeholder="Seu nome completo"
                  value={formulario.nome}
                  readOnly={autorSessao}
                  onChange={(e) => alterar('nome', e.target.value)}
                />
                {erros.nome && (
                  <small id="erro-nome" className="formulario-submissao__erro-campo">
                    {erros.nome}
                  </small>
                )}
              </label>
              <label>
                E-mail <span aria-hidden="true">*</span>
                <input
                  required
                  type="email"
                  aria-invalid={Boolean(erros.email)}
                  aria-describedby={erroDoCampo('email')}
                  placeholder="voce@email.com"
                  value={formulario.email}
                  readOnly={autorSessao}
                  onChange={(e) => alterar('email', e.target.value)}
                />
                {erros.email && (
                  <small id="erro-email" className="formulario-submissao__erro-campo">
                    {erros.email}
                  </small>
                )}
              </label>
              <label className="formulario-submissao__campo-largo">
                Curso <span aria-hidden="true">*</span>
                <select
                  required
                  aria-invalid={Boolean(erros.curso)}
                  aria-describedby={erroDoCampo('curso')}
                  value={formulario.curso}
                  disabled={autorSessao}
                  onChange={(e) => {
                    alterar('curso', e.target.value)
                    alterar('orientador', '')
                  }}
                >
                  <option value="">Selecione o curso</option>
                  {cursos.map((curso) => (
                    <option key={curso.identificador} value={curso.sigla}>
                      {curso.nome}
                    </option>
                  ))}
                </select>
                {erros.curso && (
                  <small id="erro-curso" className="formulario-submissao__erro-campo">
                    {erros.curso}
                  </small>
                )}
              </label>
              <p className="formulario-submissao__privacidade formulario-submissao__campo-largo">
                Usamos seu nome e e-mail somente para identificar sua submissão e permitir o contato
                sobre a avaliação.
              </p>
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
                  aria-invalid={Boolean(erros.tipo)}
                  aria-describedby={erroDoCampo('tipo')}
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
                {erros.tipo && (
                  <small id="erro-tipo" className="formulario-submissao__erro-campo">
                    {erros.tipo}
                  </small>
                )}
              </label>
              <label>
                Título <span aria-hidden="true">*</span>
                <input
                  required
                  aria-invalid={Boolean(erros.titulo)}
                  aria-describedby={erroDoCampo('titulo')}
                  placeholder="Título do projeto"
                  value={formulario.titulo}
                  onChange={(e) => alterar('titulo', e.target.value)}
                />
                {erros.titulo && (
                  <small id="erro-titulo" className="formulario-submissao__erro-campo">
                    {erros.titulo}
                  </small>
                )}
              </label>
              <label className="formulario-submissao__campo-largo">
                Resumo <span aria-hidden="true">*</span>
                <textarea
                  required
                  aria-invalid={Boolean(erros.resumo)}
                  aria-describedby={erroDoCampo('resumo')}
                  placeholder="Apresente o problema, a proposta e o contexto do projeto."
                  rows="5"
                  value={formulario.resumo}
                  onChange={(e) => alterar('resumo', e.target.value)}
                />
                {erros.resumo && (
                  <small id="erro-resumo" className="formulario-submissao__erro-campo">
                    {erros.resumo}
                  </small>
                )}
              </label>
              <label className="formulario-submissao__campo-largo">
                Objetivos e resultados <span aria-hidden="true">*</span>
                <textarea
                  required
                  aria-invalid={Boolean(erros.objetivos)}
                  aria-describedby={erroDoCampo('objetivos')}
                  placeholder="Quais resultados o projeto pretende alcançar?"
                  rows="5"
                  value={formulario.objetivos}
                  onChange={(e) => alterar('objetivos', e.target.value)}
                />
                {erros.objetivos && (
                  <small id="erro-objetivos" className="formulario-submissao__erro-campo">
                    {erros.objetivos}
                  </small>
                )}
              </label>
              {formulario.tipo && (
                <label className="formulario-submissao__campo-largo">
                  {tiposProjeto[formulario.tipo].campoEspecifico} <span aria-hidden="true">*</span>
                  <textarea
                    required
                    aria-invalid={Boolean(erros.informacoesEspecificas)}
                    aria-describedby={erroDoCampo('informacoesEspecificas')}
                    rows="5"
                    value={formulario.informacoesEspecificas}
                    onChange={(e) => alterar('informacoesEspecificas', e.target.value)}
                  />
                  {erros.informacoesEspecificas && (
                    <small
                      id="erro-informacoesEspecificas"
                      className="formulario-submissao__erro-campo"
                    >
                      {erros.informacoesEspecificas}
                    </small>
                  )}
                </label>
              )}
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
                <select
                  required
                  disabled={!formulario.curso}
                  aria-invalid={Boolean(erros.orientador)}
                  aria-describedby={erroDoCampo('orientador')}
                  value={formulario.orientador}
                  onChange={(e) => alterar('orientador', e.target.value)}
                >
                  <option value="">
                    {formulario.curso
                      ? 'Selecione o professor orientador'
                      : 'Selecione o curso primeiro'}
                  </option>
                  {listaOrientadores(formulario.curso).map((orientador) => (
                    <option key={orientador} value={orientador}>
                      {orientador}
                    </option>
                  ))}
                </select>
                {formulario.curso && !listaOrientadores(formulario.curso).length && (
                  <small className="formulario-submissao__erro-campo">
                    Não há professor disponível para este curso no momento.
                  </small>
                )}
                {erros.orientador && (
                  <small id="erro-orientador" className="formulario-submissao__erro-campo">
                    {erros.orientador}
                  </small>
                )}
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
                      aria-label={`Nome do coautor ${indice + 1}`}
                      value={autor.nome}
                      onChange={(e) => alterarAutor(indice, 'nome', e.target.value)}
                    />
                    <input
                      placeholder="E-mail"
                      type="email"
                      aria-label={`E-mail do coautor ${indice + 1}`}
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
                <p>
                  {formulario.tipo === 'TCC'
                    ? 'Informe o link do repositório e confirme a publicação.'
                    : 'Anexe o material e confirme as condições de publicação.'}
                </p>
              </div>
            </div>
            {formulario.tipo === 'TCC' ? (
              <div className="formulario-submissao__grade">
                <label className="formulario-submissao__campo-largo">
                  Link do repositório Memória <span aria-hidden="true">*</span>
                  <input
                    required
                    type="url"
                    aria-invalid={Boolean(erros.linkMemoria)}
                    aria-describedby={erroDoCampo('linkMemoria')}
                    placeholder="https://memoria.ifsc.edu.br/..."
                    value={formulario.linkMemoria}
                    onChange={(e) => alterar('linkMemoria', e.target.value)}
                  />
                  {erros.linkMemoria && (
                    <small id="erro-linkMemoria" className="formulario-submissao__erro-campo">
                      {erros.linkMemoria}
                    </small>
                  )}
                </label>
                <p className="formulario-submissao__privacidade formulario-submissao__campo-largo">
                  O TCC deve estar depositado no repositório institucional Memória antes do envio.
                  Informe a URL pública do trabalho.
                </p>
              </div>
            ) : (
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
                        accept="application/pdf,.pdf"
                        aria-invalid={Boolean(erros[documento.id])}
                        aria-describedby={erroDoCampo(documento.id)}
                        onChange={(e) => alterarDocumentos(documento, e.target.files)}
                      />
                      {erros[documento.id] && (
                        <small
                          id={`erro-${documento.id}`}
                          className="formulario-submissao__erro-campo"
                        >
                          {erros[documento.id]}
                        </small>
                      )}
                    </label>
                  )
                })}
              </div>
            )}
            <label
              className={`consentimento-submissao ${
                formulario.aceitaPublicacao ? 'consentimento-submissao--ativo' : ''
              }`}
            >
              <input
                type="checkbox"
                checked={formulario.aceitaPublicacao}
                aria-describedby={erroDoCampo('aceitaPublicacao')}
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
            {erros.aceitaPublicacao && (
              <small id="erro-aceitaPublicacao" className="formulario-submissao__erro-campo">
                {erros.aceitaPublicacao}
              </small>
            )}
          </section>
        )}

        {erro && (
          <p className="formulario-submissao__erro" ref={resumoErros} role="alert" tabIndex="-1">
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
                Continuar para{' '}
                {etapa === 0 ? 'o projeto' : etapa === 1 ? 'a equipe' : 'os documentos'}
              </button>
            ) : (
              <button className="botao-primario" type="submit">
                Enviar projeto
              </button>
            )}
          </div>
        </div>
      </form>
    </main>
  )
}
