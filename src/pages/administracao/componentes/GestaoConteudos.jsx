import { useEffect, useState } from 'react'
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
      ['cargaHoraria', 'Carga horária', 'optional'],
      ['disciplinasObrigatorias', 'Disciplinas obrigatórias', 'optional'],
      ['disciplinasOptativas', 'Disciplinas optativas', 'optional'],
      ['professorIds', 'Professores do curso', 'professores'],
      ['coordenadorId', 'Professor coordenador', 'coordenador'],
      ['descricao', 'Descrição', 'textarea'],
      ['grau', 'Grau', ['Tecnologia', 'Bacharelado', 'Licenciatura']],
      ['duracao', 'Duração'],
      ['modalidade', 'Modalidade', ['Presencial', 'A distância', 'Híbrido']],
      ['turno', 'Turno', ['Matutino', 'Vespertino', 'Noturno', 'Integral']],
    ],
  },
  disciplinas: {
    singular: 'disciplina',
    titulo: 'Disciplinas',
    descricao: 'Organize as disciplinas e a matriz do curso.',
    campos: [
      ['nome', 'Nome da disciplina'],
      ['codigo', 'Código'],
      ['cargaHoraria', 'Carga horária'],
      ['semestre', 'Semestre de oferta'],
      ['descricao', 'Descrição', 'textarea'],
      ['cursoId', 'Curso', 'cursos'],
      ['professorIds', 'Professores da disciplina', 'professores'],
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

const gruposFormulario = {
  cursos: [
    {
      titulo: 'Identificação',
      descricao: 'Nome e características da formação.',
      campos: ['nome', 'sigla', 'grau', 'duracao'],
    },
    {
      titulo: 'Oferta acadêmica',
      descricao: 'Como e quando o curso é oferecido.',
      campos: [
        'modalidade',
        'turno',
        'cargaHoraria',
        'disciplinasObrigatorias',
        'disciplinasOptativas',
        'descricao',
      ],
    },
    {
      titulo: 'Equipe do curso',
      descricao: 'Professores que atuam no curso e sua coordenação.',
      campos: ['professorIds', 'coordenadorId'],
    },
  ],
  disciplinas: [
    {
      titulo: 'Identificação',
      descricao: 'Dados acadêmicos e oferta da disciplina.',
      campos: ['nome', 'codigo', 'cargaHoraria', 'semestre', 'descricao'],
    },
    {
      titulo: 'Vínculos',
      descricao: 'Curso responsável e docentes que ministram a disciplina.',
      campos: ['cursoId', 'professorIds'],
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
}) {
  const [dados, definirDados] = useState(() =>
    Object.fromEntries(
      configuracao.campos.map(([chave, , opcoes]) => {
        if (item?.[chave] !== undefined && item?.[chave] !== null) return [chave, item[chave]]
        if (['alunos', 'disciplinas', 'professores'].includes(opcoes)) return [chave, []]
        if (chave === 'cursoId') return [chave, String(curso?.identificador || cursoId || '')]
        if (chave === 'coordenadorId') return [chave, '']
        return [chave, Array.isArray(opcoes) ? opcoes[0] : '']
      }),
    ),
  )
  return (
    <form
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
      <h2>
        {item ? 'Editar' : 'Novo'} {configuracao.singular}
      </h2>
      <div className="gestao-relacao" aria-label="Relações deste registro">
        <span>
          {dominio === 'cursos' ? 'Curso' : dominio === 'disciplinas' ? 'Curso' : 'Projeto'}
        </span>
        <span aria-hidden="true">→</span>
        <span>
          {dominio === 'cursos'
            ? 'Disciplinas e coordenador'
            : dominio === 'disciplinas'
              ? 'Professores'
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
                ).length
              }{' '}
              disciplinas vinculadas
            </span>
            <span>
              {professores.find((professor) => String(professor.id) === String(dados.coordenadorId))
                ?.nome || 'Coordenador não selecionado'}
            </span>
          </>
        )}
        {dominio !== 'cursos' && (
          <span>
            {cursos.find(
              (itemCurso) =>
                String(itemCurso.identificador || itemCurso.id) === String(dados.cursoId),
            )?.nome || 'Curso ainda não selecionado'}
          </span>
        )}
        {dominio === 'disciplinas' && (
          <span>
            {(dados.professorIds || []).length} professor
            {(dados.professorIds || []).length === 1 ? '' : 'es'} vinculado
            {(dados.professorIds || []).length === 1 ? '' : 's'}
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
              .map(([chave, rotulo, opcoes]) => (
                <label key={chave} className={opcoes === 'textarea' ? 'gestao-campo-largo' : ''}>
                  {rotulo}
                  {opcoes === 'cursos' ? (
                    <select
                      required
                      value={dados[chave]}
                      disabled={chave === 'cursoId' && bloquearCurso}
                      onChange={(e) => definirDados({ ...dados, [chave]: e.target.value })}
                    >
                      <option value="">Selecione um curso</option>
                      {cursos.map((itemCurso) => (
                        <option
                          key={itemCurso.identificador || itemCurso.id}
                          value={String(itemCurso.identificador || itemCurso.id)}
                        >
                          {itemCurso.nome} · {itemCurso.sigla}
                        </option>
                      ))}
                    </select>
                  ) : ['alunos', 'disciplinas', 'professores'].includes(opcoes) ? (
                    <>
                      <select
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
                            if (opcoes !== 'disciplinas' || !dados.cursoId) return true
                            const idCursoDisciplina =
                              registro.cursoId ?? registro.identificadorCurso
                            return (
                              !idCursoDisciplina ||
                              String(idCursoDisciplina) === String(dados.cursoId)
                            )
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
                            ? 'Selecione os estudantes que participam deste projeto.'
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
                    <select
                      value={dados[chave]}
                      onChange={(e) => definirDados({ ...dados, [chave]: e.target.value })}
                    >
                      {opcoes.map((opcao) => (
                        <option key={opcao}>{opcao}</option>
                      ))}
                    </select>
                  ) : opcoes === 'textarea' ? (
                    <textarea
                      rows={4}
                      required
                      maxLength={1500}
                      value={dados[chave]}
                      onChange={(e) => definirDados({ ...dados, [chave]: e.target.value })}
                    />
                  ) : (
                    <input
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
                      maxLength={200}
                      value={dados[chave]}
                      readOnly={chave === 'curso' && bloquearCurso}
                      onChange={(e) => definirDados({ ...dados, [chave]: e.target.value })}
                    />
                  )}
                </label>
              ))}
          </div>
        </section>
      ))}
      <div className="gestao-acoes">
        <button className="botao-primario" type="submit">
          Salvar rascunho
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
  useEffect(() => {
    if (!['cursos', 'disciplinas', 'projetos'].includes(dominio) || !token) return
    const controller = new AbortController()
    listarProfessores(token, controller.signal)
      .then(definirProfessores)
      .catch(() => definirProfessores([]))
    if (dominio === 'projetos') {
      api.usuarios
        .consultarUsuarios(token, controller.signal)
        .then((usuarios) =>
          definirAlunos(
            Array.isArray(usuarios)
              ? usuarios.filter((usuario) => usuario.tipoUsuario === 'ALUNO')
              : [],
          ),
        )
        .catch(() => definirAlunos([]))
    }
    return () => controller.abort()
  }, [dominio, token])
  const doCurso = (item) => {
    if (!cursoId) return true
    if (dominio === 'cursos') return String(item.identificador) === String(cursoId)
    if (String(item.identificadorCurso ?? item.cursoId ?? '') === String(cursoId)) return true
    return Boolean(curso && [curso.sigla, curso.nome].includes(item.curso))
  }
  const itensPermitidos = itens.filter(doCurso)
  const resultados = itensPermitidos.filter((item) =>
    `${item.nome} ${item.sigla || item.curso || ''}`
      .toLocaleLowerCase('pt-BR')
      .includes(busca.trim().toLocaleLowerCase('pt-BR')),
  )
  function salvar(dados) {
    const alunoPorId = new Map(alunos.map((aluno) => [String(aluno.id), aluno]))
    const professorPorId = new Map(
      professores.map((professor) => [String(professor.id), professor]),
    )
    const orientador = professorPorId.get(String(dados.professorIds?.[0]))
    const coordenador = professorPorId.get(String(dados.coordenadorId))
    const cursoSelecionado = cursos.find(
      (itemCurso) => String(itemCurso.identificador || itemCurso.id) === String(dados.cursoId),
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
    definirMensagem('Rascunho salvo nesta sessão. O site publicado permanece como está.')
  }
  return (
    <>
      <header className="painel-titulo">
        <div>
          <h1>{configuracao.titulo}</h1>
          <p>{configuracao.descricao}</p>
        </div>
        {!somenteEdicao && (
          <button
            className="botao-primario"
            onClick={() => {
              definirEditor({ novo: true })
              definirExclusao(null)
              definirMensagem('')
            }}
          >
            Novo {configuracao.singular}
          </button>
        )}
      </header>
      <p className="gestao-nota">
        Edição de rascunhos nesta sessão. A publicação aguarda integração com o serviço de {dominio}
        .
      </p>
      {mensagem && (
        <p className="gestao-aviso" role="status">
          {mensagem}
        </p>
      )}
      {editor && dominio === 'cursos' && token && professores.length === 0 ? (
        <p className="gestao-aviso" role="status">
          Não foi possível carregar os professores. Recarregue a lista antes de cadastrar um curso e
          designar um coordenador.
        </p>
      ) : (
        editor && (
          <EditorConteudo
            key={editor.identificador || 'novo'}
            item={editor.novo ? null : editor}
            configuracao={configuracao}
            curso={curso}
            cursoId={cursoId}
            bloquearCurso={Boolean(cursoId)}
            dominio={dominio}
            professores={professores}
            alunos={alunos}
            cursos={cursos}
            disciplinas={disciplinas}
            aoSalvar={salvar}
            aoCancelar={() => definirEditor(null)}
          />
        )
      )}
      {exclusao && (
        <ConfirmacaoGestao rotulo="titulo-descartar">
          <h2 id="titulo-descartar">Remover {exclusao.nome} do rascunho?</h2>
          <p>A remoção afeta somente a versão de trabalho desta sessão.</p>
          <div className="gestao-acoes">
            <button className="botao-secundario" onClick={() => definirExclusao(null)}>
              Manter {configuracao.singular}
            </button>
            <button
              className="gestao-excluir"
              onClick={() => {
                aoAlterar(itens.filter((item) => item.identificador !== exclusao.identificador))
                definirExclusao(null)
                definirMensagem('Item removido do rascunho.')
              }}
            >
              Confirmar remoção
            </button>
          </div>
        </ConfirmacaoGestao>
      )}
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
                      ? 'Disciplina'
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
              {resultados.map((item) => (
                <tr key={item.identificador}>
                  <th scope="row">
                    {item.nome}
                    <span>{item.sigla || item.curso}</span>
                  </th>
                  <td>{item.modalidade || item.codigo || item.tipo}</td>
                  <td>{item.turno || item.semestre || item.status}</td>
                  <td>
                    <div className="gestao-acoes">
                      <button
                        onClick={() => {
                          definirEditor(item)
                          definirExclusao(null)
                          definirMensagem('')
                        }}
                      >
                        Editar<span className="somente-leitores"> {item.nome}</span>
                      </button>
                      {!somenteEdicao && (
                        <button
                          className="gestao-excluir"
                          onClick={() => {
                            definirExclusao(item)
                            definirEditor(null)
                          }}
                        >
                          Remover<span className="somente-leitores"> {item.nome}</span>
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {!resultados.length && (
          <p className="painel-vazio">
            Nenhum registro encontrado.{' '}
            {busca ? 'Tente outro termo.' : `Cadastre um ${configuracao.singular} para começar.`}
          </p>
        )}
      </section>
    </>
  )
}
