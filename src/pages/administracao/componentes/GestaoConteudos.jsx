import { useState } from 'react'
import ConfirmacaoGestao from './ConfirmacaoGestao.jsx'

const configuracoes = {
  cursos: {
    singular: 'curso',
    titulo: 'Cursos',
    descricao: 'Organize a apresentação e as informações das formações.',
    campos: [
      ['nome', 'Nome do curso'],
      ['sigla', 'Sigla'],
      ['descricao', 'Descrição', 'textarea'],
      ['grau', 'Grau', ['Tecnologia', 'Bacharelado', 'Licenciatura']],
      ['duracao', 'Duração'],
      ['modalidade', 'Modalidade', ['Presencial', 'A distância', 'Híbrido']],
      ['turno', 'Turno', ['Matutino', 'Vespertino', 'Noturno', 'Integral']],
    ],
  },
  projetos: {
    singular: 'projeto',
    titulo: 'Projetos',
    descricao: 'Revise as produções acadêmicas apresentadas no portal.',
    campos: [
      ['nome', 'Título'],
      ['descricao', 'Resumo', 'textarea'],
      ['tipo', 'Tipo de produção', ['TCC', 'Projeto integrador', 'Pesquisa', 'Extensão']],
      ['curso', 'Curso'],
      ['autores', 'Autores'],
      ['orientador', 'Orientador'],
      ['status', 'Situação', ['Aprovado', 'Em análise', 'Recusado']],
    ],
  },
}

function EditorConteudo({ item, configuracao, aoSalvar, aoCancelar }) {
  const [dados, definirDados] = useState(() =>
    Object.fromEntries(
      configuracao.campos.map(([chave, , opcoes]) => [
        chave,
        item?.[chave] || (Array.isArray(opcoes) ? opcoes[0] : ''),
      ]),
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
            Object.entries(dados).map(([chave, valor]) => [chave, valor.trim()]),
          ),
        })
      }}
    >
      <h2>
        {item ? 'Editar' : 'Novo'} {configuracao.singular}
      </h2>
      <div className="gestao-campos">
        {configuracao.campos.map(([chave, rotulo, opcoes]) => (
          <label key={chave} className={opcoes === 'textarea' ? 'gestao-campo-largo' : ''}>
            {rotulo}
            {Array.isArray(opcoes) ? (
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
                required
                maxLength={200}
                value={dados[chave]}
                onChange={(e) => definirDados({ ...dados, [chave]: e.target.value })}
              />
            )}
          </label>
        ))}
      </div>
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

export default function GestaoConteudos({ dominio, itens, aoAlterar }) {
  const configuracao = configuracoes[dominio]
  const [busca, definirBusca] = useState('')
  const [editor, definirEditor] = useState(null)
  const [exclusao, definirExclusao] = useState(null)
  const [mensagem, definirMensagem] = useState('')
  const resultados = itens.filter((item) =>
    `${item.nome} ${item.sigla || item.curso || ''}`
      .toLocaleLowerCase('pt-BR')
      .includes(busca.trim().toLocaleLowerCase('pt-BR')),
  )
  function salvar(dados) {
    const registro = { ...dados, identificador: dados.identificador || crypto.randomUUID() }
    aoAlterar(
      dados.identificador
        ? itens.map((atual) => (atual.identificador === dados.identificador ? registro : atual))
        : [...itens, registro],
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
      {editor && (
        <EditorConteudo
          key={editor.identificador || 'novo'}
          item={editor.novo ? null : editor}
          configuracao={configuracao}
          aoSalvar={salvar}
          aoCancelar={() => definirEditor(null)}
        />
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
                <th scope="col">{dominio === 'cursos' ? 'Curso' : 'Projeto'}</th>
                <th scope="col">{dominio === 'cursos' ? 'Modalidade' : 'Tipo'}</th>
                <th scope="col">{dominio === 'cursos' ? 'Turno' : 'Situação'}</th>
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
                  <td>{item.modalidade || item.tipo}</td>
                  <td>{item.turno || item.status}</td>
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
                      <button
                        className="gestao-excluir"
                        onClick={() => {
                          definirExclusao(item)
                          definirEditor(null)
                        }}
                      >
                        Remover<span className="somente-leitores"> {item.nome}</span>
                      </button>
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
