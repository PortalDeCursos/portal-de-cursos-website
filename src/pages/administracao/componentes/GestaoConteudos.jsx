import { Fragment, useCallback, useEffect, useRef, useState } from 'react'
import { api } from '../../../api/index.js'
import { listarProfessores } from '../servicos/gerenciarProfessores.js'
import ConfirmacaoGestao from './ConfirmacaoGestao.jsx'

const configuracoes = {
  cursos: {
    singular: 'curso',
    titulo: 'Cursos',
    descricao: 'Organize a apresentação e as informações das formações.',
    campos: [
      ['nome', 'Nome do curso'],
      ['sigla', 'Sigla'],
      ['cargaHoraria', 'Carga horária (horas)'],
      ['disciplinasObrigatorias', 'Matérias obrigatórias'],
      ['disciplinasOptativas', 'Matérias optativas'],
      ['descricao', 'Descrição', 'textarea'],
      ['grau', 'Tipo de formação', ['Subsequente', 'Tecnologia', 'Bacharelado', 'Licenciatura']],
      ['duracao', 'Duração (semestres)'],
      ['modalidade', 'Formato das aulas', ['Presencial', 'A distância', 'Híbrida']],
      ['turno', 'Período das aulas', ['Matutino', 'Vespertino', 'Noturno', 'Matutino e vespertino']],
      ['campusId', 'Unidade', 'campus'],
      ['areaId', 'Área de estudo', 'areas'],
    ],
  },
  disciplinas: {
    singular: 'matéria',
    titulo: 'Matérias',
    descricao: 'Organize as disciplinas e a matriz do curso.',
    campos: [
      ['nome', 'Nome da matéria'],
      ['codigo', 'Código da matéria'],
      ['cargaHoraria', 'Carga horária (horas)'],
      ['semestre', 'Semestre em que acontece', [
        ['PRIMEIRO', '1º semestre'], ['SEGUNDO', '2º semestre'], ['TERCEIRO', '3º semestre'],
        ['QUARTO', '4º semestre'], ['QUINTO', '5º semestre'], ['SEXTO', '6º semestre'],
        ['SETIMO', '7º semestre'], ['OITAVO', '8º semestre'], ['NONO', '9º semestre'], ['DECIMO', '10º semestre'],
      ].map(([valor, rotulo]) => ({ valor, rotulo }))],
      ['descricao', 'Descrição', 'textarea'],
      ['cursoId', 'Curso', 'cursos'],
      ['obrigatoria', 'Tipo', [{ valor: 'true', rotulo: 'Obrigatória' }, { valor: 'false', rotulo: 'Optativa' }]],
    ],
  },
  projetos: {
    singular: 'projeto',
    titulo: 'Projetos',
    descricao: 'Revise as produções acadêmicas apresentadas no portal.',
    campos: [
      ['nome', 'Título'],
      ['resumo', 'Resumo', 'optional'],
      ['descricao', 'Descrição', 'textarea'],
      ['tipo', 'Tipo de produção', ['TCC', 'Projeto integrador', 'Pesquisa', 'Extensão']],
      ['cursoId', 'Curso', 'cursos'],
      ['professorIds', 'Professores orientadores', 'professores'],
      ['alunoIds', 'Alunos participantes', 'alunos'],
      ['disciplinaIds', 'Disciplinas relacionadas', 'disciplinas'],
    ],
  },
}

const explicacoesCampos = {
  cursos: {
    nome: 'Escreva o nome completo que aparecerá para estudantes. Ex.: Técnico em Informática.',
    sigla: 'Use uma abreviação curta para identificar o curso. Ex.: TADS.',
    cargaHoraria: 'Informe o total de horas do curso, somente com números. Ex.: 2400.',
    disciplinasObrigatorias: 'Quantas matérias obrigatórias fazem parte do curso. Se ainda não souber, informe 0.',
    disciplinasOptativas: 'Quantas matérias opcionais fazem parte do curso. Se ainda não souber, informe 0.',
    descricao: 'Conte, em poucas frases, o que se aprende e para quem o curso é indicado.',
    grau: 'Escolha o tipo de formação oferecida.',
    duracao: 'Informe quantos semestres são necessários para concluir. Ex.: 6 semestres (cerca de 3 anos).',
    modalidade: 'Indique se as aulas são presenciais, a distância ou combinam os dois formatos.',
    turno: 'Escolha os períodos em que as aulas acontecem.',
    campusId: 'Escolha a unidade onde o curso é oferecido.',
    areaId: 'Escolha a área de estudo mais próxima do conteúdo do curso.',
  },
  disciplinas: {
    nome: 'Escreva o nome da matéria como os estudantes a conhecem.',
    codigo: 'Informe o código usado para identificar esta matéria. Ex.: INF101.',
    cargaHoraria: 'Informe quantas horas de aula a matéria tem, somente com números. Ex.: 60.',
    semestre: 'Escolha em qual semestre do curso a matéria costuma ser oferecida.',
    descricao: 'Resuma os principais assuntos estudados nesta matéria.',
    cursoId: 'Escolha a formação à qual esta matéria pertence.',
    obrigatoria: 'Obrigatória: todos os estudantes precisam cursá-la. Optativa: é uma opção de escolha.',
  },
  projetos: {
    nome: 'Escreva o título do trabalho.',
    resumo: 'Faça uma apresentação curta do trabalho. Este campo é opcional.',
    descricao: 'Explique o objetivo e o conteúdo do trabalho.',
    tipo: 'Escolha a categoria que melhor descreve o trabalho.',
    cursoId: 'Escolha a formação relacionada ao trabalho.',
    professorIds: 'Selecione os professores que orientam o trabalho. Use Ctrl ou Command para escolher mais de um.',
    alunoIds: 'Selecione os estudantes participantes. Use Ctrl ou Command para escolher mais de um.',
    disciplinaIds: 'Selecione as matérias relacionadas. Use Ctrl ou Command para escolher mais de uma.',
  },
}

const gruposFormulario = {
  cursos: [
    {
      titulo: 'Sobre a formação',
      descricao: 'Nome e informações principais que ajudam estudantes a reconhecer o curso.',
      campos: ['nome', 'sigla', 'grau', 'duracao'],
    },
    {
      titulo: 'Como o curso funciona',
      descricao: 'Local, horários e informações importantes para quem quer estudar aqui.',
      campos: [
        'modalidade',
        'turno',
        'cargaHoraria',
        'disciplinasObrigatorias',
        'disciplinasOptativas',
        'campusId',
        'areaId',
        'descricao',
      ],
    },
  ],
  disciplinas: [
    {
      titulo: 'Sobre a matéria',
      descricao: 'Nome, código, duração das aulas e semestre em que ela acontece.',
      campos: ['nome', 'codigo', 'cargaHoraria', 'semestre', 'descricao'],
    },
    {
      titulo: 'Formação e tipo da matéria',
      descricao: 'Escolha a formação e diga se a matéria é obrigatória ou optativa.',
      campos: ['cursoId', 'obrigatoria'],
    },
  ],
  projetos: [
    {
      titulo: 'Sobre o projeto',
      descricao: 'Apresente o trabalho e sua área.',
      campos: ['nome', 'tipo', 'resumo', 'descricao'],
    },
    {
      titulo: 'Vínculo acadêmico',
      descricao: 'Curso e disciplinas relacionadas.',
      campos: ['cursoId', 'disciplinaIds'],
    },
    {
      titulo: 'Equipe do projeto',
      descricao: 'Um ou mais professores e os alunos participantes, se houver.',
      campos: ['professorIds', 'alunoIds'],
    },
  ],
}

function EditorConteudo({
  item,
  configuracao,
  aoSalvar,
  aoCancelar,
  curso,
  cursoId,
  bloquearCurso,
  dominio,
  professores = [],
  alunos = [],
  cursos = [],
  disciplinas = [],
  campus = [],
  areas = [],
  salvando = false,
}) {
  const formulario = useRef(null)
  const [dados, definirDados] = useState(() =>
    Object.fromEntries(
      configuracao.campos.map(([chave, , opcoes]) => {
        if (item?.[chave] !== undefined && item?.[chave] !== null) return [chave, item[chave]]
        if (['alunos', 'disciplinas', 'professores'].includes(opcoes)) return [chave, []]
        if (chave === 'cursoId') return [chave, String(curso?.identificador || cursoId || '')]
        if (chave === 'coordenadorId') return [chave, '']
        if (chave === 'obrigatoria') return [chave, item?.[chave] === false ? 'false' : 'true']
        if (['campusId', 'areaId'].includes(chave)) return [chave, '']
        return [chave, Array.isArray(opcoes) ? (typeof opcoes[0] === 'object' ? opcoes[0].valor : opcoes[0]) : '']
      }),
    ),
  )
  useEffect(() => {
    const botaoDeOrigem = document.activeElement
    formulario.current?.querySelector('h2')?.focus()
    return () => {
      if (botaoDeOrigem?.isConnected) botaoDeOrigem.focus()
    }
  }, [])
  return (
    <form
      ref={formulario}
      className="gestao-formulario"
      onSubmit={(evento) => {
        evento.preventDefault()
        aoSalvar({
          ...item,
          ...Object.fromEntries(
            Object.entries(dados).map(([chave, valor]) => [
              chave,
              typeof valor === 'string' ? valor.trim() : valor,
            ]),
          ),
        })
      }}
    >
      <h2 tabIndex={-1}>
        {item ? 'Editar' : 'Novo'} {configuracao.singular}
      </h2>
      <p className="gestao-formulario__orientacao">Os campos com * precisam ser preenchidos. Leia a explicação abaixo de cada campo se tiver dúvida.</p>
      <div className="gestao-relacao" aria-label="Relações deste registro">
        <span>
          {dominio === 'cursos' ? 'Curso' : dominio === 'disciplinas' ? 'Curso' : 'Projeto'}
        </span>
        <span aria-hidden="true">→</span>
        <span>
          {dominio === 'cursos'
            ? 'Oferta acadêmica'
            : dominio === 'disciplinas'
              ? 'Classificação'
              : 'Disciplinas, professores e alunos opcionais'}
        </span>
        {dominio === 'projetos' && (
          <>
            <span aria-hidden="true">→</span>
            <span>Professores</span>
          </>
        )}
      </div>
      <div className="gestao-relacao__resumo" aria-live="polite">
        {dominio === 'cursos' && (
          <>
            <span>
              {
                disciplinas.filter(
                  (disciplina) =>
                    String(disciplina.cursoId ?? disciplina.identificadorCurso ?? '') ===
                    String(item?.identificador ?? item?.id ?? ''),
                ).length || item?.componentes || 0
              }{' '}
              matérias incluídas
            </span>
          </>
        )}
        {dominio !== 'cursos' && (
          <span>
            {cursos.find(
              (itemCurso) =>
                String(['disciplinas', 'projetos'].includes(dominio) ? itemCurso.id : itemCurso.identificador || itemCurso.id) === String(dados.cursoId) ||
                (dominio === 'projetos' && String(itemCurso.identificador) === String(dados.identificadorCurso)),
            )?.nome || 'Curso ainda não selecionado'}
          </span>
        )}
        {dominio === 'projetos' && (
          <>
            <span>
              {(dados.disciplinaIds || []).length} disciplina
              {(dados.disciplinaIds || []).length === 1 ? '' : 's'}
            </span>
            <span>
              {(dados.alunoIds || []).length} aluno
              {(dados.alunoIds || []).length === 1 ? '' : 's'} participante
              {(dados.alunoIds || []).length === 1 ? '' : 's'}
            </span>
            <span>
              {(dados.professorIds || []).length} professor
              {(dados.professorIds || []).length === 1 ? '' : 'es'} orientador
              {(dados.professorIds || []).length === 1 ? '' : 'es'}
            </span>
          </>
        )}
      </div>
      {gruposFormulario[dominio].map((grupo) => (
        <section className="gestao-formulario__grupo" key={grupo.titulo}>
          <header>
            <h3>{grupo.titulo}</h3>
            <p>{grupo.descricao}</p>
          </header>
          <div className="gestao-campos">
            {grupo.campos
              .map((campo) => configuracao.campos.find(([chave]) => chave === campo))
              .map(([chave, rotulo, opcoes]) => {
                const idCampo = `${dominio}-${chave}`
                const idAjuda = `${idCampo}-ajuda`
                const obrigatorio = dominio === 'cursos' || dominio === 'disciplinas'
                  ? true
                  : opcoes !== 'optional' && (!['alunos', 'disciplinas', 'professores'].includes(opcoes) || (dominio === 'projetos' && opcoes === 'professores'))
                const explicacao = explicacoesCampos[dominio]?.[chave]
                return (
                <div key={chave} className={opcoes === 'textarea' ? 'gestao-campo gestao-campo-largo' : 'gestao-campo'}>
                  <label htmlFor={idCampo}>{rotulo}{obrigatorio ? ' *' : ' (opcional)'}</label>
                  {['campus', 'areas'].includes(opcoes) ? (
                    <select id={idCampo} aria-describedby={idAjuda} required value={dados[chave]} onChange={(e) => definirDados({ ...dados, [chave]: e.target.value })}>
                      <option value="">Selecione {opcoes === 'campus' ? 'um campus' : 'uma área'}</option>
                      {(opcoes === 'campus' ? campus : areas).map((registro) => <option key={registro.id} value={String(registro.id)}>{registro.nome}</option>)}
                    </select>
                  ) : opcoes === 'cursos' ? (
                    <select
                      id={idCampo}
                      aria-describedby={idAjuda}
                      required
                      value={dados[chave]}
                      disabled={chave === 'cursoId' && bloquearCurso}
                      onChange={(e) => definirDados({
                        ...dados,
                        [chave]: e.target.value,
                        ...(chave === 'cursoId' && dominio === 'projetos'
                          ? { alunoIds: [], disciplinaIds: [] }
                          : {}),
                      })}
                    >
                      <option value="">Selecione um curso</option>
                      {cursos.map((itemCurso) => (
                        <option
                          key={itemCurso.id || itemCurso.identificador}
                          value={String(['disciplinas', 'projetos'].includes(dominio) ? itemCurso.id : itemCurso.identificador || itemCurso.id)}
                        >
                          {itemCurso.nome} · {itemCurso.sigla}
                        </option>
                      ))}
                    </select>
                  ) : ['alunos', 'disciplinas', 'professores'].includes(opcoes) ? (
                    <>
                      <select
                        id={idCampo}
                        aria-describedby={idAjuda}
                        multiple
                        size={Math.min(
                          Math.max(
                            (opcoes === 'alunos'
                              ? alunos
                              : opcoes === 'disciplinas'
                                ? disciplinas
                                : professores
                            ).length,
                            3,
                          ),
                          6,
                        )}
                        value={dados[chave]}
                        required={dominio === 'projetos' && opcoes === 'professores'}
                        onChange={(e) =>
                          definirDados({
                            ...dados,
                            [chave]: Array.from(e.target.selectedOptions, (option) => option.value),
                          })
                        }
                      >
                        {(opcoes === 'alunos'
                          ? alunos
                          : opcoes === 'disciplinas'
                            ? disciplinas
                            : professores
                        )
                          .filter((registro) => {
                            if (!['disciplinas', 'alunos'].includes(opcoes) || !dados.cursoId) return true
                            const idCursoDisciplina = registro.cursoId ?? registro.curso?.id ?? registro.identificadorCurso
                            return String(idCursoDisciplina ?? '') === String(dados.cursoId)
                          })
                          .map((registro) => (
                            <option
                              key={registro.id || registro.identificador}
                              value={String(registro.id || registro.identificador)}
                            >
                              {registro.nome || registro.titulo}{' '}
                              {registro.email ? `· ${registro.email}` : ''}
                            </option>
                          ))}
                      </select>
                      <small className="gestao-campo-ajuda">
                        {opcoes === 'alunos'
                          ? alunos.length
                            ? 'A lista mostra estudantes vinculados ao curso escolhido.'
                            : 'Nenhuma conta de aluno foi encontrada.'
                          : opcoes === 'disciplinas'
                            ? disciplinas.length
                              ? 'As disciplinas são filtradas pelo curso selecionado.'
                              : 'Cadastre disciplinas para criar este vínculo.'
                            : professores.length
                              ? dominio === 'projetos'
                                ? 'Selecione um ou mais professores para orientar o projeto.'
                                : 'Selecione os professores que ministram esta disciplina.'
                              : 'Nenhum professor disponível.'}
                      </small>
                    </>
                  ) : opcoes === 'orientador' ? (
                    <select
                      id={idCampo}
                      aria-describedby={idAjuda}
                      value={dados[chave]}
                      onChange={(e) => definirDados({ ...dados, [chave]: e.target.value })}
                    >
                      <option value="">Selecione um professor</option>
                      {professores.map((professor) => (
                        <option key={professor.id} value={String(professor.id)}>
                          {professor.nome} · {professor.email}
                        </option>
                      ))}
                    </select>
                  ) : opcoes === 'coordenador' ? (
                    <select
                      id={idCampo}
                      aria-describedby={idAjuda}
                      required={!bloquearCurso && professores.length > 0}
                      value={dados[chave]}
                      disabled={bloquearCurso}
                      onChange={(e) =>
                        definirDados({
                          ...dados,
                          [chave]: e.target.value,
                          professorIds: [
                            ...new Set([...(dados.professorIds || []), e.target.value]),
                          ],
                        })
                      }
                    >
                      <option value="">Selecione um professor</option>
                      {professores.map((professor) => (
                        <option key={professor.id} value={professor.id}>
                          {professor.nome} · {professor.email}
                        </option>
                      ))}
                    </select>
                  ) : Array.isArray(opcoes) ? (
                    <select required
                      id={idCampo}
                      aria-describedby={idAjuda}
                      value={dados[chave]}
                      onChange={(e) => definirDados({ ...dados, [chave]: e.target.value })}
                    >
                      {opcoes.map((opcao) => (
                        <option key={typeof opcao === 'object' ? opcao.valor : opcao} value={typeof opcao === 'object' ? opcao.valor : opcao}>{typeof opcao === 'object' ? opcao.rotulo : opcao}</option>
                      ))}
                    </select>
                  ) : opcoes === 'textarea' ? (
                    <textarea
                      id={idCampo}
                      aria-describedby={idAjuda}
                      rows={4}
                      required
                      maxLength={1500}
                      value={dados[chave]}
                      onChange={(e) => definirDados({ ...dados, [chave]: e.target.value })}
                    />
                  ) : (
                    <input
                      id={idCampo}
                      aria-describedby={idAjuda}
                      required={opcoes !== 'optional'}
                      type={
                        [
                          'cargaHoraria',
                          'disciplinasObrigatorias',
                          'disciplinasOptativas',
                        ].includes(chave)
                          ? 'number'
                          : 'text'
                      }
                      min={['cargaHoraria', 'disciplinasObrigatorias', 'disciplinasOptativas'].includes(chave) ? 0 : undefined}
                      maxLength={200}
                      value={dados[chave]}
                      readOnly={chave === 'curso' && bloquearCurso}
                      onChange={(e) => definirDados({ ...dados, [chave]: e.target.value })}
                    />
                  )}
                  {explicacao && <small className="gestao-campo-ajuda" id={idAjuda}>{explicacao}</small>}
                </div>
              )})}
          </div>
        </section>
      ))}
      <div className="gestao-acoes">
        <button className="botao-primario" type="submit" disabled={salvando}>
          {salvando ? 'Salvando…' : item ? 'Salvar alterações' : dominio === 'projetos' ? 'Salvar projeto como rascunho' : `Cadastrar ${configuracao.singular}`}
        </button>
        <button className="botao-secundario" type="button" onClick={aoCancelar}>
          Cancelar
        </button>
      </div>
    </form>
  )
}

export default function GestaoConteudos({
  dominio,
  itens,
  aoAlterar,
  cursoId,
  curso,
  cursos = [],
  disciplinas = [],
  somenteEdicao = false,
  token,
}) {
  const configuracao = configuracoes[dominio]
  const [busca, definirBusca] = useState('')
  const [editor, definirEditor] = useState(null)
  const [exclusao, definirExclusao] = useState(null)
  const [mensagem, definirMensagem] = useState('')
  const [professores, definirProfessores] = useState([])
  const [alunos, definirAlunos] = useState([])
  const [registrosApi, definirRegistrosApi] = useState([])
  const [cursosApi, definirCursosApi] = useState([])
  const [disciplinasApi, definirDisciplinasApi] = useState([])
  const [campus, definirCampus] = useState([])
  const [areas, definirAreas] = useState([])
  const [carregando, definirCarregando] = useState(['cursos', 'disciplinas'].includes(dominio))
  const [salvando, definirSalvando] = useState(false)
  const persistido = ['cursos', 'disciplinas'].includes(dominio)
  const carregarPersistidos = useCallback(async (sinal) => {
    definirCarregando(true)
    try {
      if (dominio === 'cursos') {
        const [lista, listaCampus, listaAreas] = await Promise.all([api.cursos.listar(sinal), api.cursos.listarCampus(sinal), api.cursos.listarAreas(sinal)])
        definirRegistrosApi(lista)
        definirCursosApi(lista)
        definirCampus(listaCampus)
        definirAreas(listaAreas)
      } else {
        const listaCursos = await api.cursos.listar(sinal)
        const listas = await Promise.all(listaCursos.map((item) => api.disciplinas.listarPorCurso(item.id, token, sinal)))
        const listaDisciplinas = listas.flat().map((item) => {
          const relacionado = listaCursos.find((cursoItem) => String(cursoItem.id) === String(item.cursoId))
          return { ...item, curso: relacionado?.sigla || relacionado?.nome, cursoNome: relacionado?.nome }
        })
        definirCursosApi(listaCursos)
        definirDisciplinasApi(listaDisciplinas)
        definirRegistrosApi(listaDisciplinas)
      }
    } catch (falha) {
      if (!sinal?.aborted) definirMensagem(falha.message || 'Não foi possível carregar os registros da API.')
    } finally {
      if (!sinal?.aborted) definirCarregando(false)
    }
  }, [dominio, token])
  useEffect(() => {
    if (!persistido) return
    const controller = new AbortController()
    queueMicrotask(() => carregarPersistidos(controller.signal))
    return () => controller.abort()
  }, [carregarPersistidos, persistido])
  useEffect(() => {
    if (dominio !== 'projetos') return
    const controller = new AbortController()
    async function carregarVinculos() {
      definirCarregando(true)
      try {
        const listaCursos = await api.cursos.listar(controller.signal)
        const listasDisciplinas = await Promise.all(
          listaCursos.map((item) => api.disciplinas.listarPorCurso(item.id, token, controller.signal)),
        )
        if (controller.signal.aborted) return
        definirCursosApi(listaCursos)
        definirDisciplinasApi(listasDisciplinas.flat())
      } catch (falha) {
        if (!controller.signal.aborted) {
          definirMensagem(falha.message || 'Não foi possível carregar cursos e matérias para vincular ao projeto.')
        }
      } finally {
        if (!controller.signal.aborted) definirCarregando(false)
      }
    }
    carregarVinculos()
    return () => controller.abort()
  }, [dominio, token])
  const itensAtuais = persistido ? registrosApi : itens
  const cursosDisponiveis = persistido || dominio === 'projetos' ? cursosApi : cursos
  const disciplinasDisponiveis = persistido || dominio === 'projetos' ? disciplinasApi : disciplinas
  useEffect(() => {
    if (!['cursos', 'disciplinas', 'projetos'].includes(dominio) || !token) return
    const controller = new AbortController()
    listarProfessores(token, controller.signal)
      .then(definirProfessores)
      .catch(() => definirProfessores([]))
    if (dominio === 'projetos') {
      api.alunos
        .listar(token, {}, controller.signal)
        .then((registros) =>
          definirAlunos(
            Array.isArray(registros)
              ? registros.map((aluno) => ({
                  ...aluno.usuario,
                  id: aluno.id,
                  alunoId: aluno.id,
                  cursoId: aluno.cursoId ?? aluno.curso?.id,
                }))
              : [],
          ),
        )
        .catch(() => definirAlunos([]))
    }
    return () => controller.abort()
  }, [dominio, token])
  const doCurso = (item) => {
    if (!cursoId) return true
    if (dominio === 'cursos') return [item.id, item.identificador].some((referencia) => String(referencia) === String(cursoId))
    if (String(item.identificadorCurso ?? item.cursoId ?? '') === String(cursoId)) return true
    return Boolean(curso && [curso.sigla, curso.nome].includes(item.curso))
  }
  const itensPermitidos = itensAtuais.filter(doCurso)
  const resultados = itensPermitidos.filter((item) =>
    `${item.nome} ${item.sigla || item.curso || ''}`
      .toLocaleLowerCase('pt-BR')
      .includes(busca.trim().toLocaleLowerCase('pt-BR')),
  )
  async function salvar(dados) {
    if (persistido) {
      definirSalvando(true)
      definirMensagem('')
      try {
        const enums = { grau: { Tecnologia: 'TECNOLOGO', Bacharelado: 'BACHARELADO', Licenciatura: 'LICENCIATURA', Subsequente: 'SUBSEQUENTE' }, modalidade: { Presencial: 'PRESENCIAL', 'A distância': 'EAD', Híbrida: 'HIBRIDO' }, turno: { Matutino: 'MATUTINO', Vespertino: 'VESPERTINO', Noturno: 'NOTURNO', 'Matutino e vespertino': 'MATUTINO_VESPERTINO' } }
        if (dominio === 'cursos') {
          const payload = { nome: dados.nome, acronimo: dados.sigla, grau: enums.grau[dados.grau], duracao: dados.duracao, turno: enums.turno[dados.turno], modalidade: enums.modalidade[dados.modalidade], cargaHoraria: Number(dados.cargaHoraria), qtdDisciplinasObrigatorias: Number(dados.disciplinasObrigatorias), qtdDisciplinasOptativas: Number(dados.disciplinasOptativas), descricao: dados.descricao, campusId: Number(dados.campusId), areaId: Number(dados.areaId) }
          if (dados.id) await api.cursos.atualizar(token, dados.id, payload)
          else await api.cursos.cadastrar(token, payload)
        } else {
          const payload = { cursoId: Number(dados.cursoId), nome: dados.nome, codigo: dados.codigo, cargaHoraria: Number(dados.cargaHoraria), semestre: dados.semestre, descricao: dados.descricao, obrigatoria: dados.obrigatoria === 'true' || dados.obrigatoria === true }
          if (dados.id) await api.disciplinas.atualizar(token, dados.id, payload)
          else await api.disciplinas.cadastrar(token, payload)
        }
        await carregarPersistidos()
        definirEditor(null)
        definirMensagem(`${configuracao.singular[0].toLocaleUpperCase('pt-BR')}${configuracao.singular.slice(1)} salvo com sucesso.`)
      } catch (falha) {
        definirMensagem(falha.message || `Não foi possível salvar ${configuracao.singular}.`)
      } finally {
        definirSalvando(false)
      }
      return
    }
    const alunoPorId = new Map(alunos.map((aluno) => [String(aluno.id), aluno]))
    const professorPorId = new Map(
      professores.map((professor) => [String(professor.id), professor]),
    )
    const orientador = professorPorId.get(String(dados.professorIds?.[0]))
    const coordenador = professorPorId.get(String(dados.coordenadorId))
    const cursoSelecionado = cursos.find(
      (itemCurso) => String(['disciplinas', 'projetos'].includes(dominio) ? itemCurso.id : itemCurso.identificador || itemCurso.id) === String(dados.cursoId),
    )
    const autores = (dados.alunoIds || [])
      .map((id) => alunoPorId.get(String(id))?.nome)
      .filter(Boolean)
      .join(', ')
    const registro = {
      ...dados,
      ...(dados.alunoIds?.length ? { autores } : {}),
      ...(orientador ? { orientador: orientador.nome } : {}),
      ...(coordenador ? { coordenador: coordenador.nome } : {}),
      ...(cursoSelecionado
        ? {
            cursoId: cursoSelecionado.id,
            identificadorCurso: cursoSelecionado.identificador || cursoSelecionado.id,
            curso: cursoSelecionado.sigla || cursoSelecionado.nome,
          }
        : {}),
      ...(dados.disciplinaIds
        ? {
            disciplinas: dados.disciplinaIds
              .map(
                (id) =>
                  disciplinas.find(
                    (disciplina) =>
                      String(disciplina.id || disciplina.identificador) === String(id),
                  )?.nome,
              )
              .filter(Boolean),
          }
        : {}),
      ...(dados.professorIds
        ? {
            professores: dados.professorIds
              .map((id) => professorPorId.get(String(id))?.nome)
              .filter(Boolean),
          }
        : {}),
      identificador: dados.identificador || crypto.randomUUID(),
    }
    aoAlterar(
      dados.identificador
        ? itens.map((atual) => (atual.identificador === dados.identificador ? registro : atual))
        : [
            ...itens,
            {
              ...registro,
              ...(curso ? { identificadorCurso: curso.identificador } : cursoId ? { cursoId } : {}),
            },
          ],
    )
    definirEditor(null)
    definirMensagem('Projeto salvo nesta sessão. Para guardar depois ou publicar, ainda falta ligar a página ao serviço de projetos.')
  }
  function renderizarEditor(registro) {
    const itemEditor = registro?.novo
      ? null
      : persistido && dominio === 'cursos'
        ? {
            ...registro,
            sigla: registro.acronimo,
            cargaHoraria: String(registro.cargaHorariaValor),
            disciplinasObrigatorias: String(registro.qtdDisciplinasObrigatorias),
            disciplinasOptativas: String(registro.qtdDisciplinasOptativas),
            campusId: String(registro.campusId),
            areaId: String(registro.areaId),
          }
        : dominio === 'projetos'
          ? {
              ...registro,
              cursoId: registro.cursoId ?? cursosApi.find((itemCurso) => String(itemCurso.identificador) === String(registro.identificadorCurso))?.id ?? '',
            }
          : registro
    return (
      <EditorConteudo
        key={registro?.identificador || registro?.id || 'novo'}
        item={itemEditor}
        configuracao={configuracao}
        curso={curso}
        cursoId={cursoId}
        bloquearCurso={Boolean(cursoId)}
        dominio={dominio}
        professores={professores}
        alunos={alunos}
        cursos={cursosDisponiveis}
        disciplinas={disciplinasDisponiveis}
        campus={campus}
        areas={areas}
        salvando={salvando}
        aoSalvar={salvar}
        aoCancelar={() => definirEditor(null)}
      />
    )
  }
  async function confirmarExclusao() {
    if (salvando || !exclusao) return
    if (persistido) {
      definirSalvando(true)
      let excluido = false
      try {
        if (dominio === 'cursos') await api.cursos.excluir(token, exclusao.id)
        else await api.disciplinas.excluir(token, exclusao.id)
        await carregarPersistidos()
        definirMensagem('Registro excluído com sucesso.')
        excluido = true
      } catch (falha) {
        definirMensagem(falha.message || 'Não foi possível excluir o registro.')
      } finally {
        definirSalvando(false)
        if (excluido) definirExclusao(null)
      }
      return
    }
    aoAlterar(itens.filter((item) => item.identificador !== exclusao.identificador))
    definirMensagem('Item removido do rascunho.')
    definirExclusao(null)
  }
  return (
    <>
      <header className="painel-titulo">
        <div>
          <h1>{configuracao.titulo}</h1>
          <p>{configuracao.descricao}</p>
        </div>
        {!somenteEdicao && (
          <>
          {persistido && <button className="botao-secundario" onClick={() => carregarPersistidos()} disabled={carregando}>{carregando ? 'Atualizando…' : 'Atualizar lista'}</button>}
          <button
            className="botao-primario"
            onClick={() => {
              definirEditor((atual) => (atual?.novo ? null : { novo: true }))
              definirExclusao(null)
              definirMensagem('')
            }}
            aria-expanded={Boolean(editor?.novo)}
            aria-controls="gestao-editor-novo"
          >
            {editor?.novo ? 'Fechar cadastro' : dominio === 'disciplinas' ? 'Nova matéria' : `Novo ${configuracao.singular}`}
          </button>
          </>
        )}
      </header>
      {dominio === 'projetos' && <p className="gestao-nota">Os projetos ficam só nesta sessão. Ainda falta ligar a página ao serviço de projetos para guardá-los e publicá-los.</p>}
      {mensagem && (
        <p className="gestao-aviso" role="status">
          {mensagem}
        </p>
      )}
      {editor?.novo && <div className="gestao-expansao gestao-expansao--novo" id="gestao-editor-novo">{renderizarEditor(editor)}</div>}
      <section className="painel-secao">
        <label className="gestao-busca">
          Buscar {configuracao.singular}
          <input
            type="search"
            placeholder="Nome ou curso"
            value={busca}
            onChange={(e) => definirBusca(e.target.value)}
          />
        </label>
        <div
          className="tabela-submissoes"
          role="region"
          aria-label={configuracao.titulo}
          tabIndex={0}
        >
          <table>
            <thead>
              <tr>
                <th scope="col">
                  {dominio === 'cursos'
                    ? 'Curso'
                    : dominio === 'disciplinas'
                      ? 'Matéria'
                      : 'Projeto'}
                </th>
                <th scope="col">
                  {dominio === 'cursos'
                    ? 'Modalidade'
                    : dominio === 'disciplinas'
                      ? 'Código'
                      : 'Tipo'}
                </th>
                <th scope="col">
                  {dominio === 'cursos'
                    ? 'Turno'
                    : dominio === 'disciplinas'
                      ? 'Semestre'
                      : 'Status'}
                </th>
                <th scope="col">Ações</th>
              </tr>
            </thead>
            <tbody>
              {resultados.map((item) => {
                const chaveItem = String(item.identificador || item.id)
                const expandidoId = `gestao-expansao-${dominio}-${chaveItem}`
                const editando = editor && !editor.novo && String(editor.identificador || editor.id) === chaveItem
                const confirmando = exclusao && String(exclusao.identificador || exclusao.id) === chaveItem
                const tituloExclusao = `titulo-excluir-${dominio}-${chaveItem.replace(/[^a-z0-9_-]/gi, '-')}`
                return (
                <Fragment key={chaveItem}>
                <tr>
                  <th scope="row">
                    {item.nome}
                    <span>{item.sigla || item.curso}</span>
                  </th>
                  <td>{item.modalidade || item.codigo || item.tipo}</td>
                  <td>{item.turno || (item.semestreNumero ? `${item.semestreNumero}º semestre` : item.status)}</td>
                  <td>
                    <div className="gestao-acoes">
                      <button
                        aria-expanded={Boolean(editando)}
                        aria-controls={expandidoId}
                        onClick={() => {
                          definirEditor(editando ? null : item)
                          definirExclusao(null)
                          definirMensagem('')
                        }}
                      >
                        Editar<span className="somente-leitores"> {item.nome}</span>
                      </button>
                      {!somenteEdicao && (
                        <button
                          className="gestao-excluir"
                          aria-expanded={Boolean(confirmando)}
                          aria-controls={expandidoId}
                          onClick={() => {
                            definirExclusao(confirmando ? null : item)
                            definirEditor(null)
                          }}
                        >
                          Remover<span className="somente-leitores"> {item.nome}</span>
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
                {editando && (
                  <tr className="gestao-linha-expandida">
                    <td colSpan={4} id={expandidoId}>{renderizarEditor(editor)}</td>
                  </tr>
                )}
                {confirmando && (
                  <tr className="gestao-linha-expandida">
                    <td colSpan={4} id={expandidoId}>
                      <ConfirmacaoGestao rotulo={tituloExclusao}>
                        <h2 id={tituloExclusao}>{persistido ? 'Excluir' : 'Remover'} {exclusao.nome}?</h2>
                        <p>{persistido ? 'Este registro será excluído. Essa ação não pode ser desfeita.' : 'Este item será removido dos rascunhos desta sessão.'}</p>
                        {mensagem && <p role="alert">{mensagem}</p>}
                        <div className="gestao-acoes">
                          <button className="botao-secundario" onClick={() => { definirExclusao(null); definirMensagem('') }} disabled={salvando}>Manter {configuracao.singular}</button>
                          <button className="gestao-excluir" onClick={confirmarExclusao} disabled={salvando}>{salvando ? 'Excluindo…' : 'Confirmar exclusão'}</button>
                        </div>
                      </ConfirmacaoGestao>
                    </td>
                  </tr>
                )}
                </Fragment>
              )})}
            </tbody>
          </table>
        </div>
        {carregando && <p className="gestao-aviso" role="status">Carregando registros do serviço…</p>}
        {!carregando && !resultados.length && (
          <p className="painel-vazio">
            Nenhum registro encontrado.{' '}
            {busca ? 'Tente outro termo.' : `Cadastre um ${configuracao.singular} para começar.`}
          </p>
        )}
      </section>
    </>
  )
}
