import { Retrato } from '@/shared/componentes/FotoDaConta.jsx'
import { useEffect, useState } from 'react'
import Icone from '@/shared/componentes/Icone.jsx'
import ItemProjeto from '@/shared/componentes/ItemProjeto.jsx'
import { listarCursos } from '@/api/cursos.js'
import { buscarProjetosPublicados } from '@/pages/projetos/servicos/buscarProjetosPublicados.js'
import './perfil-publico.css'

export default function PaginaPerfilAluno({ idAluno, conta }) {
  const [aluno, mudarAluno] = useState(null)
  const [cursoInfo, mudarCursoInfo] = useState(null)
  const [projetosAutor, mudarProjetosAutor] = useState([])
  const [carregando, mudarCarregando] = useState(true)

  useEffect(() => {
    let ativo = true
    const controle = new AbortController()

    async function carregar() {
      mudarCarregando(true)
      try {
        const [cursos, projetos] = await Promise.all([
          listarCursos(controle.signal).catch(() => []),
          buscarProjetosPublicados(controle.signal).catch(() => []),
        ])

        if (!ativo) return

        const autor = projetos.flatMap((projeto) => projeto.autoresDetalhados)
          .find((item) => item?.id != null && `autor-${item.id}` === idAluno)
        if (!autor) return
        const email = autor.email?.trim().toLowerCase()
        const trabalhos = projetos.filter((projeto) => projeto.autoresDetalhados.some((item) =>
          item?.id === autor.id || (email && item?.email?.trim().toLowerCase() === email),
        ))
        mudarAluno(autor)
        mudarProjetosAutor(trabalhos)
        const cursosIds = [...new Set(trabalhos.map((item) => item.cursoId).filter(Boolean))]
        if (cursosIds.length === 1) {
          mudarCursoInfo(cursos.find((item) => String(item.id) === String(cursosIds[0])))
        }
      } finally {
        if (ativo) mudarCarregando(false)
      }
    }

    carregar()
    return () => {
      ativo = false
      controle.abort()
    }
  }, [idAluno])

  useEffect(() => {
    if (aluno?.nome) {
      document.title = `${aluno.nome} — Portal de Cursos`
    }
  }, [aluno?.nome])

  if (carregando) {
    return (
      <main id="conteudo" className="limite pagina-perfil-discente">
        <div className="perfil-publico__status-box" role="status">
          <p>Carregando perfil discente…</p>
        </div>
      </main>
    )
  }

  if (!aluno) {
    return <main id="conteudo" className="limite pagina-perfil-discente"><h1>Perfil discente indisponível</h1></main>
  }
  const titular = aluno.email && conta?.email?.toLowerCase() === aluno.email.toLowerCase() ? conta : null
  const inicial = aluno?.nome ? aluno.nome.charAt(0).toUpperCase() : 'A'

  return (
    <main id="conteudo" className="limite pagina-perfil-discente">
      {/* Navegação de Trilha */}
      <nav className="detalhe-projeto__trilha" aria-label="Você está aqui">
        <a href="#inicio">Início</a>
        <span aria-hidden="true">/</span>
        <a href="#projetos">Acervo de Projetos</a>
        <span aria-hidden="true">/</span>
        <span aria-current="page" className="detalhe-projeto__trilha-atual">
          {titular?.nome || aluno.nome}
        </span>
      </nav>

      {/* Cartão de Identidade Discente */}
      <header className="perfil-publico__cabecalho perfil-publico__cabecalho--discente">
        <div className="perfil-publico__avatar-discente">
          <Retrato usuarioId={titular?.id}>{inicial}</Retrato>
        </div>
        <div className="perfil-publico__identidade">
          <span className="perfil-publico__eyebrow">
            Discente / autor
            {cursoInfo ? ` · ${cursoInfo.sigla || cursoInfo.acronimo || 'TADS'}` : ''}
          </span>
          <h1 className="perfil-publico__nome">{titular?.nome || aluno.nome}</h1>
          <p className="perfil-publico__email">{titular?.email || aluno.email}</p>
        </div>
      </header>

      {/* Grid de Informações e Produções */}
      <div className="perfil-publico__grid">
        {/* Coluna Lateral: Curso de Formação */}
        <aside className="perfil-publico__sidebar">
          <div className="perfil-publico__bloco">
            <h2>Curso das produções</h2>
            {cursoInfo ? (
              <div className="perfil-publico__curso-card">
                <strong>{cursoInfo.nome}</strong>
                <p>
                  {cursoInfo.descricao ||
                    'Curso das produções superior e tecnológica de excelência no IFRN.'}
                </p>
                <a
                  className="botao-secundario botao--pequeno"
                  href={`#curso/${cursoInfo.identificador || cursoInfo.id}`}
                >
                  Conhecer matriz curricular
                </a>
              </div>
            ) : (
              <p className="perfil-publico__descricao-bio">
                Curso não identificado.
              </p>
            )}
          </div>
        </aside>

        {/* Coluna Central: Produções Acadêmicas Desenvolvidas */}
        <section className="perfil-publico__conteudo">
          <div className="perfil-publico__cabecalho-secao">
            <div>
              <h2>Trabalhos e produções publicadas ({projetosAutor.length})</h2>
              <p>
                Produções científicas, projetos integradores e pesquisas desenvolvidas pelo
                estudante.
              </p>
            </div>
          </div>

          {projetosAutor.length > 0 ? (
            <ul className="lista-projetos">
              {projetosAutor.map((projeto) => (
                <li key={projeto.identificador}>
                  <ItemProjeto projeto={projeto} />
                </li>
              ))}
            </ul>
          ) : (
            <div className="perfil-publico__bloco-vazio">
              <Icone nome="grau-detalhe" />
              <p>Nenhuma produção acadêmica deste discente foi publicada publicamente ainda.</p>
            </div>
          )}
        </section>
      </div>
    </main>
  )
}
