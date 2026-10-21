import { basePortal, enderecoPrivado } from '../../app/rotas.js'
import { cursos } from '../../data/cursos.js'
import TabelaSubmissoes from '../painel/componentes/TabelaSubmissoes.jsx'
import GestaoConteudos from '../administracao/componentes/GestaoConteudos.jsx'
import GestaoProfessores from '../administracao/componentes/GestaoProfessores.jsx'
import '../painel/painel.css'
import '../administracao/administracao.css'

function pertenceAoCurso(item, cursoId, curso) {
  if (String(item.identificadorCurso ?? item.cursoId ?? '') === String(cursoId)) return true
  return Boolean(curso && [curso.sigla, curso.nome].includes(item.curso))
}

export default function PaginaCoordenacao({ secao, sessao, rascunhos, aoAlterar, submissoes }) {
  const cursoId = sessao.usuario.cursoId
  const referenciaCurso = sessao.usuario.curso
  const curso = cursos.find((item) =>
    [item.identificador, item.id, item.sigla, item.nome].some((valor) =>
      [
        cursoId,
        referenciaCurso?.id,
        referenciaCurso?.identificador,
        referenciaCurso?.sigla,
        referenciaCurso?.nome,
      ]
        .filter(Boolean)
        .some((referencia) => String(referencia) === String(valor)),
    ),
  )
  const idsDoCurso = [
    cursoId,
    referenciaCurso?.id,
    referenciaCurso?.identificador,
    curso?.id,
    curso?.identificador,
  ].filter((id) => id !== undefined && id !== null)
  const cursosDaCoordenacao = rascunhos.cursos.filter((item) =>
    idsDoCurso.some((id) => String(item.id ?? item.identificador) === String(id)),
  )
  const projetosDoCurso = rascunhos.projetos.filter((item) =>
    idsDoCurso.some((id) => pertenceAoCurso(item, id, curso)),
  )
  const submissoesDoCurso = submissoes.filter((item) =>
    idsDoCurso.some((id) => pertenceAoCurso(item, id, curso)),
  )

  if (secao === 'curso')
    return (
      <main id="conteudo" className="pagina-painel">
        {cursosDaCoordenacao.length ? (
          <GestaoConteudos
            dominio="cursos"
            itens={rascunhos.cursos}
            aoAlterar={(itens) => aoAlterar('cursos', itens)}
            cursoId={curso?.identificador || cursoId}
            token={sessao.token}
            somenteEdicao
          />
        ) : (
          <p className="painel-vazio" role="status">
            O curso vinculado à sua conta não está disponível para edição neste ambiente.
          </p>
        )}
      </main>
    )

  if (secao === 'professores')
    return (
      <main id="conteudo" className="pagina-painel">
        <GestaoProfessores token={sessao.token} cursoId={cursoId} />
      </main>
    )

  if (secao === 'disciplinas')
    return (
      <main id="conteudo" className="pagina-painel">
        <GestaoConteudos
          dominio="disciplinas"
          itens={rascunhos.disciplinas}
          cursos={cursosDaCoordenacao}
          disciplinas={rascunhos.disciplinas}
          token={sessao.token}
          aoAlterar={(itens) => aoAlterar('disciplinas', itens)}
          cursoId={curso?.identificador || cursoId}
          curso={curso}
        />
      </main>
    )

  if (secao === 'projetos')
    return (
      <main id="conteudo" className="pagina-painel">
        <GestaoConteudos
          dominio="projetos"
          itens={rascunhos.projetos}
          cursos={cursosDaCoordenacao}
          disciplinas={rascunhos.disciplinas}
          token={sessao.token}
          aoAlterar={(itens) => aoAlterar('projetos', itens)}
          cursoId={curso?.identificador || cursoId}
          curso={curso}
        />
      </main>
    )

  if (secao === 'submissoes')
    return (
      <main id="conteudo" className="pagina-painel">
        <header className="painel-titulo">
          <div>
            <h1>Submissões do meu curso</h1>
            <p>Avalie as submissões aceitas pelos orientadores e gerencie as do seu curso.</p>
          </div>
        </header>
        <section className="painel-secao">
          <TabelaSubmissoes
            itens={submissoesDoCurso}
            baseDetalhes={enderecoPrivado('coordenacao/submissao')}
          />
        </section>
      </main>
    )

  return (
    <main id="conteudo" className="pagina-painel">
      <header className="painel-titulo">
        <div>
          <h1>Coordenação do curso</h1>
          <p>{curso?.nome || `Curso vinculado à conta ${cursoId}`}</p>
        </div>
      </header>
      <div className="administracao-atalhos">
        {[
          ['curso', 'Meu curso', 'Atualize as informações do curso coordenado.'],
          ['disciplinas', 'Disciplinas', 'Gerencie a matriz curricular do curso.'],
          ['professores', 'Professores', 'Gerencie os docentes vinculados ao curso.'],
          ['projetos', 'Projetos', `${projetosDoCurso.length} projetos do curso.`],
        ].map(([destino, titulo, descricao]) => (
          <a key={destino} href={enderecoPrivado(`coordenacao/${destino}`)}>
            <h2>{titulo}</h2>
            <p>{descricao}</p>
            <span>
              Gerenciar {titulo.toLowerCase()} <span aria-hidden="true">→</span>
            </span>
          </a>
        ))}
        <a href={`${basePortal}#submeter`}>
          <h2>Submeter projeto</h2>
          <p>Envie um projeto do curso diretamente para avaliação da coordenação.</p>
          <span>
            Iniciar submissão <span aria-hidden="true">→</span>
          </span>
        </a>
      </div>
      <section className="painel-secao">
        <header>
          <div>
            <h2>Submissões do curso</h2>
            <p>
              {submissoesDoCurso.length} submissões do curso, incluindo as aceitas pelos
              orientadores e as que aguardam sua decisão.
            </p>
          </div>
          <a href={enderecoPrivado('coordenacao/submissoes')}>
            Ver todas <span aria-hidden="true">→</span>
          </a>
        </header>
        <TabelaSubmissoes
          itens={submissoesDoCurso}
          baseDetalhes={enderecoPrivado('coordenacao/submissao')}
        />
      </section>
      <p className="gestao-nota">
        As alterações de cadastro e as decisões desta tela ficam nesta sessão até a integração com
        os serviços acadêmicos. A coordenação recebe aviso por e-mail após o aceite do orientador
        quando o serviço de notificações estiver conectado.
      </p>
    </main>
  )
}
