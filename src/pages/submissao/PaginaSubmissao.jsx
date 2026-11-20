import { useEffect, useRef, useState } from 'react'
import { listarCursos } from '@/api/cursos.js'
import { listarDisciplinasPorCurso } from '@/api/disciplinas.js'
import { listarProfessores } from '@/api/professores.js'
import useEnvioProjeto from './useEnvioProjeto.js'
import SituacaoEnvio from './componentes/SituacaoEnvio.jsx'
import { enderecoPrivado } from '../../app/rotas.js'
import {
  TAMANHO_MAXIMO_DOCUMENTO,
  etapas,
  formularioInicial,
  nomesTiposProjeto,
  tiposProjeto,
} from './constantes.js'
import EtapaSubmissaoDocumentos from './etapas/EtapaSubmissaoDocumentos.jsx'
import EtapaSubmissaoEquipe from './etapas/EtapaSubmissaoEquipe.jsx'
import EtapaSubmissaoIdentificacao from './etapas/EtapaSubmissaoIdentificacao.jsx'
import EtapaSubmissaoProjeto from './etapas/EtapaSubmissaoProjeto.jsx'
import '@/shared/styles/painel-informativo.css'
import './submissao.css'

export default function PaginaSubmissao({ sessao, aoSubmeter }) {
  const [cursos, mudarCursos] = useState([])
  const [orientadores, mudarOrientadores] = useState([])
  const [disciplinasCurso, mudarDisciplinasCurso] = useState([])
  const [carregandoCadastros, mudarCarregandoCadastros] = useState(true)
  const [carregandoDisciplinas, mudarCarregandoDisciplinas] = useState(false)
  const [erroDisciplinas, mudarErroDisciplinas] = useState('')
  const [tentativaDisciplinas, mudarTentativaDisciplinas] = useState(0)
  const [avisoDisciplinas, mudarAvisoDisciplinas] = useState('')
  const [formulario, mudarFormulario] = useState(() => ({
    ...formularioInicial,
    nome: sessao?.usuario?.nome || '',
    email: sessao?.usuario?.email || '',
    curso: ['ALUNO', 'PROFESSOR', 'COORDENADOR'].includes(sessao?.tipoUsuario)
      ? sessao?.usuario?.cursoId || sessao?.usuario?.curso?.id || sessao?.usuario?.curso || ''
      : '',
    orientador:
      sessao?.tipoUsuario === 'PROFESSOR' || sessao?.tipoUsuario === 'COORDENADOR'
        ? sessao?.usuario?.nome || ''
        : '',
  }))
  const [etapa, mudarEtapa] = useState(0)
  const [erro, mudarErro] = useState('')
  const [erros, mudarErros] = useState({})
  const [enviado, mudarEnviado] = useState(false)
  const [enviando, mudarEnviando] = useState(false)
  const {
    envio,
    temPendencias,
    enviarProjeto,
    tentarEncaminhamento,
    tentarArquivo,
    liberarNovoCadastro,
    limparEnvio,
  } = useEnvioProjeto({
    sessao,
    aoSubmeter,
  })
  const resumoErros = useRef(null)
  const campoDisciplinas = useRef(null)

  useEffect(() => {
    const controller = new AbortController()
    Promise.allSettled([
      listarCursos(controller.signal, sessao?.token),
      listarProfessores(sessao?.token, {}, controller.signal),
    ])
      .then(([resultadoCursos, resultadoOrientadores]) => {
        if (controller.signal.aborted) return
        mudarCursos(resultadoCursos.status === 'fulfilled' ? resultadoCursos.value : [])
        mudarOrientadores(
          resultadoOrientadores.status === 'fulfilled' ? resultadoOrientadores.value : [],
        )
      })
      .finally(() => {
        if (!controller.signal.aborted) mudarCarregandoCadastros(false)
      })
    return () => controller.abort()
  }, [sessao?.token])

  useEffect(() => {
    if (!formulario.curso) return
    let ativo = true
    const controller = new AbortController()

    async function carregarDisciplinas() {
      mudarCarregandoDisciplinas(true)
      mudarErroDisciplinas('')
      mudarDisciplinasCurso([])
      try {
        const dados = await listarDisciplinasPorCurso(
          formulario.curso,
          sessao?.token,
          controller.signal,
        )
        if (ativo) {
          mudarDisciplinasCurso(Array.isArray(dados) ? dados : [])
        }
      } catch {
        if (ativo) {
          mudarDisciplinasCurso([])
          mudarErroDisciplinas('Não foi possível carregar as disciplinas deste curso.')
        }
      } finally {
        if (ativo) {
          mudarCarregandoDisciplinas(false)
        }
      }
    }

    carregarDisciplinas()

    return () => {
      ativo = false
      controller.abort()
    }
  }, [formulario.curso, sessao?.token, tentativaDisciplinas])

  function alterar(campo, valor) {
    const trocouCurso = campo === 'curso' && String(valor) !== String(formulario.curso)
    if (trocouCurso) {
      mudarAvisoDisciplinas(
        formulario.disciplinas.length
          ? 'O curso mudou. As disciplinas anteriores foram removidas. Selecione as do novo curso na etapa Equipe.'
          : '',
      )
    }
    mudarFormulario((anterior) => ({
      ...anterior,
      [campo]: valor,
      ...(trocouCurso ? { disciplinas: [] } : {}),
    }))
    mudarErro('')
    mudarErros((anteriores) => ({ ...anteriores, [campo]: undefined }))
  }

  function registrarErros(proximosErros, mensagem = 'Revise os campos destacados para continuar.') {
    mudarErros(proximosErros)
    mudarErro(mensagem)
    window.requestAnimationFrame(() => {
      const campo = proximosErros.disciplinas ? campoDisciplinas.current : null
      if (campo && !campo.disabled) campo.focus()
      else resumoErros.current?.focus()
    })
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

  function listaOrientadores(cursoId) {
    const curso = cursos.find((item) => String(item.id) === String(cursoId))
    return orientadores.filter(
      (orientador) =>
        !curso?.id || !orientador.cursoId || String(orientador.cursoId) === String(curso.id),
    )
  }

  function validarEtapa() {
    const ehTCC = formulario.tipo === 'TCC'
    const ehDocente = ['PROFESSOR', 'COORDENADOR'].includes(sessao?.tipoUsuario)
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
      if (!formulario.projetoSemAlunos) {
        if (!ehDocente && formulario.autores.length > 0) {
          const autoresInvalidos = formulario.autores.some(
            (autor) => !autor.nome.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(autor.email.trim()),
          )
          if (autoresInvalidos) {
            registrarErros({}, 'Informe nome e e-mail válidos para cada integrante discente.')
            return false
          }
        } else if (ehDocente && formulario.autores.length === 0) {
          registrarErros(
            {},
            'Adicione pelo menos um estudante autor ou marque a opção "Projeto de iniciativa docente (sem alunos autores)".',
          )
          return false
        } else if (ehDocente && formulario.autores.length > 0) {
          const autoresInvalidos = formulario.autores.some(
            (autor) => !autor.nome.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(autor.email.trim()),
          )
          if (autoresInvalidos) {
            registrarErros({}, 'Informe nome e e-mail válidos para cada autor discente.')
            return false
          }
        }
      }
    }
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
      mudarErro('')
      mudarErros({})
      mudarEtapa((anterior) => Math.min(anterior + 1, etapas.length - 1))
    }
  }

  function voltar() {
    mudarErro('')
    mudarErros({})
    mudarEtapa((anterior) => Math.max(anterior - 1, 0))
  }

  async function submeter(evento) {
    evento.preventDefault()
    if (enviando) return
    if (!validarEtapa()) return
    const cursoProjeto = cursos.find(
      (item) =>
        String(item.id) === String(formulario.curso) ||
        String(item.identificador) === String(formulario.curso),
    )
    const disciplinasSelecionadas = formulario.disciplinas.map((nome) =>
      disciplinasCurso.find(
        (disciplina) =>
          disciplina.nome === nome &&
          Number.isSafeInteger(disciplina.id) &&
          disciplina.id > 0 &&
          String(disciplina.cursoId) === String(cursoProjeto?.id),
      ),
    )
    if (
      carregandoDisciplinas ||
      disciplinasSelecionadas.length === 0 ||
      disciplinasSelecionadas.some((disciplina) => !disciplina)
    ) {
      mudarEtapa(2)
      registrarErros({
        disciplinas: carregandoDisciplinas
          ? 'Aguarde o carregamento das disciplinas e selecione uma para continuar.'
          : 'Selecione pelo menos uma disciplina cadastrada no curso para continuar.',
      })
      return
    }
    const autoresLista = formulario.autores
      .filter((autor) => autor.nome.trim())
      .map((autor) => ({ nome: autor.nome.trim(), email: autor.email.trim() }))
    const ehTCC = formulario.tipo === 'TCC'

    const mapasTipoProjeto = {
      TCC: 'TCC',
      'Projeto Integrador': 'PROJETO_INTEGRADOR',
      Pesquisa: 'PROJETO_PESQUISA',
      Extensão: 'PROJETO_EXTENSAO',
    }

    const autoresParaSubmissao =
      sessao?.tipoUsuario === 'ALUNO'
        ? [{ nome: formulario.nome.trim(), email: formulario.email.trim() }, ...autoresLista]
        : autoresLista

    const submissaoLocal = {
      identificador: crypto.randomUUID(),
      cursoId: cursoProjeto?.id,
      identificadorCurso: cursoProjeto?.identificador,
      titulo: formulario.titulo.trim(),
      tipo: formulario.tipo,
      curso: cursoProjeto?.sigla || formulario.curso,
      cursoCompleto: cursoProjeto?.nome || formulario.curso,
      autor: formulario.nome.trim(),
      autores: autoresParaSubmissao,
      orientador: formulario.orientador,
      orientadorId:
        orientadores.find((o) => o.nome === formulario.orientador)?.id ||
        orientadores.find((o) => o.nome === formulario.orientador)?.professorId ||
        null,
      enviadoEm: new Intl.DateTimeFormat('pt-BR', {
        dateStyle: 'short',
        timeStyle: 'short',
      }).format(new Date()),
      status: sessao?.tipoUsuario === 'ALUNO' ? 'Aguardando Orientador' : 'Aguardando Coordenação',
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
    }

    const orientadorObj = orientadores.find((o) => o.nome === formulario.orientador)
    const orientadorId =
      orientadorObj?.id || orientadorObj?.professorId || orientadorObj?.identificador || null

    const listaProfessoresDto = []
    if (orientadorId) {
      listaProfessoresDto.push({ professorId: Number(orientadorId), papel: 'ORIENTADOR' })
    }
    if (Array.isArray(formulario.professoresParticipantes)) {
      formulario.professoresParticipantes.forEach((nomeProf) => {
        const pObj = orientadores.find((o) => o.nome === nomeProf)
        const pId = pObj?.id || pObj?.professorId || pObj?.identificador || null
        if (pId && Number(pId) !== Number(orientadorId)) {
          listaProfessoresDto.push({ professorId: Number(pId), papel: 'PARTICIPANTE' })
        }
      })
    }

    const disciplinaIds = disciplinasSelecionadas.map((disciplina) => disciplina.id)
    const hoje = new Date()
    const dataInicio = hoje.toISOString().split('T')[0]
    const dataFim = new Date(hoje.getFullYear() + 1, hoje.getMonth(), hoje.getDate())
      .toISOString()
      .split('T')[0]
    const documentosDto = ehTCC
      ? [
          {
            nomeArquivo: 'link-memoria.txt',
            tipoDocumento: 'LINK_MEMORIA',
            localizacao: formulario.linkMemoria.trim(),
          },
        ]
      : []

    // No backend, a lista de autores não pode ser vazia (@NotEmpty).
    // Se for projeto docente sem alunos, colocamos o professor orientador/submissor como autor responsável:
    let autoresParaDto = autoresParaSubmissao
    if (formulario.projetoSemAlunos || autoresParaDto.length === 0) {
      autoresParaDto = [
        {
          nome: formulario.nome.trim() || formulario.orientador || 'Docente Responsável',
          email: formulario.email.trim() || 'docente@escolar.ifrn.edu.br',
        },
      ]
    }

    const dto = {
      cursoId: cursoProjeto?.id ? Number(cursoProjeto.id) : null,
      campusId: cursoProjeto?.campusId ? Number(cursoProjeto.campusId) : null,
      autores: autoresParaDto,
      disciplinaIds,
      nome: formulario.titulo.trim(),
      descricao: [
        `Objetivos e resultados:\n${formulario.objetivos.trim()}`,
        formulario.informacoesEspecificas.trim()
          ? [
              `${tiposProjeto[formulario.tipo]?.campoEspecifico || 'Escopo e informações específicas'}:`,
              formulario.informacoesEspecificas.trim(),
            ].join('\n')
          : '',
      ]
        .filter(Boolean)
        .join('\n\n'),
      resumo: formulario.resumo.trim(),
      tipoProjeto: mapasTipoProjeto[formulario.tipo] || formulario.tipo,
      dataInicio,
      dataFim,
      professores: listaProfessoresDto,
      documentos: documentosDto.length > 0 ? documentosDto : null,
    }

    if (!sessao?.token || !dto.cursoId || !dto.campusId || dto.professores.length === 0) {
      mudarErro(
        'Não foi possível identificar sua sessão, curso, campus ou professor orientador. Confira os dados e tente novamente.',
      )
      return
    }

    mudarEnviando(true)
    try {
      const confirmou = await enviarProjeto({
        dto,
        submissaoLocal,
        orientador: orientadorObj,
        arquivos:
          formulario.tipo === 'TCC'
            ? []
            : Object.values(formulario.documentos).flat().filter(Boolean),
      })
      if (confirmou) mudarEnviado(true)
    } catch (falha) {
      mudarErro(falha.message)
    } finally {
      mudarEnviando(false)
    }
  }

  function alterarDocumentos(documento, arquivos) {
    const listaArquivos = documento.multiplo ? [...arquivos] : [arquivos?.[0]].filter(Boolean)
    if (listaArquivos.length === 0) {
      mudarFormulario((anterior) => {
        const novosDocumentos = { ...anterior.documentos }
        delete novosDocumentos[documento.id]
        return { ...anterior, documentos: novosDocumentos }
      })
      return
    }
    const erroEncontrado = listaArquivos.map(validarArquivo).find(Boolean)
    if (erroEncontrado) {
      registrarErros({ [documento.id]: erroEncontrado })
      return
    }
    mudarErros((anteriores) => {
      const novos = { ...anteriores }
      delete novos[documento.id]
      return novos
    })
    alterar('documentos', {
      ...formulario.documentos,
      [documento.id]: documento.multiplo ? listaArquivos : listaArquivos[0] || null,
    })
  }

  function adicionarAutor() {
    alterar('autores', [...formulario.autores, { nome: '', email: '' }])
  }

  function removerAutor(indice) {
    alterar(
      'autores',
      formulario.autores.filter((_, i) => i !== indice),
    )
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
    const cadastrada = disciplinasCurso.some(
      (item) =>
        item.nome === disciplina &&
        Number.isSafeInteger(item.id) &&
        item.id > 0 &&
        String(item.cursoId) === String(formulario.curso),
    )
    if (cadastrada && !formulario.disciplinas.includes(disciplina)) {
      alterar('disciplinas', [...formulario.disciplinas, disciplina])
    }
  }

  if (enviado) {
    const destinoPainel =
      sessao?.tipoUsuario === 'COORDENADOR'
        ? enderecoPrivado('coordenacao/submissoes')
        : sessao?.tipoUsuario === 'PROFESSOR'
          ? enderecoPrivado('professor/feed')
          : enderecoPrivado('aluno/painel')

    return (
      <main className="limite pagina-submissao pagina-submissao--confirmacao" id="conteudo">
        <section className="submissao-confirmacao" aria-labelledby="titulo-confirmacao">
          <span className="submissao-confirmacao__selo" aria-hidden="true">
            ✓
          </span>
          <h1 id="titulo-confirmacao">{temPendencias ? 'Projeto salvo.' : 'Projeto enviado.'}</h1>
          <p>
            {temPendencias
              ? 'Conclua as etapas abaixo para finalizar o envio.'
              : 'Acompanhe a avaliação pelo painel.'}
          </p>
          <SituacaoEnvio
            compacto
            envio={envio}
            temPendencias={temPendencias}
            tentarEncaminhamento={tentarEncaminhamento}
            tentarArquivo={tentarArquivo}
            destinoPainel={destinoPainel}
          />
          <div className="submissao-confirmacao__resumo">
            <strong>{formulario.titulo}</strong>
            <span>
              {nomesTiposProjeto[formulario.tipo]} · {formulario.nome}
            </span>
          </div>
          <div className="submissao-confirmacao__acoes">
            <a
              className="botao-primario"
              href={destinoPainel}
              target={temPendencias ? '_blank' : undefined}
              rel={temPendencias ? 'noreferrer' : undefined}
            >
              Acompanhar submissão
            </a>
            <button
              data-testid="submissao-novo-projeto"
              className="botao-secundario"
              type="button"
              onClick={() => {
                mudarFormulario({
                  ...formularioInicial,
                  nome: sessao?.usuario?.nome || '',
                  email: sessao?.usuario?.email || '',
                  curso: ['ALUNO', 'PROFESSOR', 'COORDENADOR'].includes(sessao?.tipoUsuario)
                    ? sessao?.usuario?.cursoId ||
                      sessao?.usuario?.curso?.id ||
                      sessao?.usuario?.curso ||
                      ''
                    : '',
                })
                mudarEtapa(0)
                mudarEnviado(false)
                limparEnvio()
              }}
              disabled={enviando || Boolean(temPendencias)}
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
        <section
          className="submissao-confirmacao submissao-acesso"
          aria-labelledby="titulo-acesso-submissao"
        >
          <div className="submissao-acesso__conteudo">
            <h1 id="titulo-acesso-submissao">Seu projeto merece um lugar para avançar.</h1>
            <p className="submissao-acesso__descricao">
              Entre no Portal de Cursos para preparar a submissão, vincular o orientador e
              acompanhar cada etapa da avaliação.
            </p>

            <div className="submissao-acesso__acoes">
              <a
                className="botao-primario"
                href={`${enderecoPrivado('login')}?retorno=${encodeURIComponent('submeter')}`}
              >
                Entrar no portal
              </a>
              <a
                className="botao-secundario"
                href={`${enderecoPrivado('aluno/cadastro')}?retorno=${encodeURIComponent('submeter')}`}
              >
                Criar conta de aluno
              </a>
            </div>
          </div>

          <aside className="submissao-acesso__guia" aria-label="Como funciona a submissão">
            <header className="submissao-acesso__guia-cabecalho">
              <span className="submissao-acesso__guia-etiqueta">Roteiro de submissão</span>
            </header>
            <div className="submissao-acesso__guia-introducao">
              <h2>Do rascunho à avaliação.</h2>
            </div>
            <ol>
              <li>
                <span>01</span>
                <p>
                  <strong>Identifique o projeto</strong>
                  <small>Informe curso, autores e orientador.</small>
                </p>
              </li>
              <li>
                <span>02</span>
                <p>
                  <strong>Envie a documentação</strong>
                  <small>Adicione descrição e arquivos necessários.</small>
                </p>
              </li>
              <li>
                <span>03</span>
                <p>
                  <strong>Acompanhe a avaliação</strong>
                  <small>Receba as decisões no painel da sua conta.</small>
                </p>
              </li>
            </ol>
            <p className="submissao-acesso__perfis">
              Submissões disponíveis para contas institucionais.
            </p>
          </aside>
        </section>
      </main>
    )
  }

  const autorSessao = sessao.tipoUsuario === 'ALUNO'

  return (
    <main className="limite pagina-submissao" id="conteudo">
      <div className="pagina-submissao__introducao">
        <div>
          <h1>Compartilhe seu projeto</h1>
          <p>
            {sessao.tipoUsuario === 'ALUNO'
              ? 'Preencha as quatro etapas e envie seu trabalho ao professor orientador. Se ele aprovar, a coordenação do curso decide sobre a publicação no portal.'
              : 'Preencha as quatro etapas e envie seu projeto diretamente à coordenação do curso para avaliação e possível publicação.'}
          </p>
        </div>
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
            onClick={() => indice < etapa && mudarEtapa(indice)}
            disabled={indice > etapa}
            aria-current={indice === etapa ? 'step' : undefined}
          >
            <span>{indice < etapa ? '✓' : indice + 1}</span>
            {nome}
          </button>
        ))}
      </nav>

      <form className="formulario-submissao" onSubmit={submeter} noValidate>
        {avisoDisciplinas && <p role="status">{avisoDisciplinas}</p>}
        {envio.cadastro.estado !== 'pendente' && (
          <SituacaoEnvio envio={envio} temPendencias={temPendencias} />
        )}
        {envio.cadastro.estado === 'incerto' && (
          <div>
            <a
              className="botao-secundario"
              href={enderecoPrivado(
                sessao.tipoUsuario === 'ALUNO' ? 'aluno/painel' : 'professor/feed',
              )}
              target="_blank"
              rel="noreferrer"
            >
              Conferir meu painel em outra aba
            </a>
            <button
              type="button"
              className="botao-secundario"
              onClick={() => {
                liberarNovoCadastro()
                mudarErro('')
              }}
            >
              Conferi o painel e quero tentar novamente
            </button>
          </div>
        )}
        {etapa === 0 && (
          <EtapaSubmissaoIdentificacao
            cursos={cursos}
            carregandoCadastros={carregandoCadastros}
            formulario={formulario}
            erros={erros}
            autorSessao={autorSessao}
            alterar={alterar}
            erroDoCampo={erroDoCampo}
          />
        )}

        {etapa === 1 && (
          <EtapaSubmissaoProjeto
            formulario={formulario}
            erros={erros}
            alterar={alterar}
            erroDoCampo={erroDoCampo}
          />
        )}

        {etapa === 2 && (
          <EtapaSubmissaoEquipe
            formulario={formulario}
            erros={erros}
            alterar={alterar}
            erroDoCampo={erroDoCampo}
            listaOrientadores={listaOrientadores}
            adicionarAutor={adicionarAutor}
            removerAutor={removerAutor}
            alterarAutor={alterarAutor}
            adicionarDisciplina={adicionarDisciplina}
            disciplinasDisponiveis={formulario.curso ? disciplinasCurso : []}
            carregandoDisciplinas={carregandoDisciplinas}
            erroDisciplinas={erroDisciplinas}
            tentarDisciplinas={() => mudarTentativaDisciplinas((valor) => valor + 1)}
            campoDisciplinas={campoDisciplinas}
            sessao={sessao}
          />
        )}

        {etapa === 3 && (
          <EtapaSubmissaoDocumentos
            formulario={formulario}
            erros={erros}
            alterar={alterar}
            erroDoCampo={erroDoCampo}
            alterarDocumentos={alterarDocumentos}
          />
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
              <button
                data-testid="submissao-continuar"
                className="botao-primario"
                type="button"
                onClick={avancar}
              >
                Continuar para{' '}
                {etapa === 0 ? 'o projeto' : etapa === 1 ? 'a equipe' : 'os documentos'}
              </button>
            ) : (
              <button
                data-testid="submissao-enviar"
                className="botao-primario"
                type="submit"
                disabled={
                  enviando || envio.cadastro.estado === 'incerto' || Boolean(envio.projetoId)
                }
              >
                {enviando ? 'Salvando projeto…' : 'Enviar projeto'}
              </button>
            )}
          </div>
        </div>
      </form>
    </main>
  )
}
