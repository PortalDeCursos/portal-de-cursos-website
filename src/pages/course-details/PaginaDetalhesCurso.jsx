import { useEffect, useState } from 'react'
import Icone from '../../shared/components/icon/Icone.jsx'
import { projetos } from '../../data/projetos.js'
import { consultarDetalhesCurso } from './services/consultarDetalhesCurso.js'
import ResumoCurso from './components/course-summary/ResumoCurso.jsx'
import AbasCurso from './components/course-tabs/AbasCurso.jsx'
import VisaoGeral from './components/overview/VisaoGeral.jsx'
import ProjetosCurso from './components/course-projects/ProjetosCurso.jsx'
import CarregamentoDetalhe from './components/detail-loading/CarregamentoDetalhe.jsx'
import InformacoesAcademicas from './components/academic-information/InformacoesAcademicas.jsx'
import './detalhes-curso.css'

const abasValidas = ['visao-geral', 'grade-curricular', 'professores', 'projetos']

export default function PaginaDetalhesCurso({
  identificador,
  aba = 'visao-geral',
  projetosPublicados = projetos,
}) {
  const [consulta, definirConsulta] = useState({ estado: 'carregando', curso: null, erro: null })
  const [tentativa, definirTentativa] = useState(0)
  const selecionada = abasValidas.includes(aba) ? aba : 'visao-geral'

  useEffect(() => {
    const controle = new AbortController()
    consultarDetalhesCurso(identificador, controle.signal)
      .then((curso) => definirConsulta({ estado: 'pronto', curso, erro: null }))
      .catch((erro) => {
        if (erro.name !== 'AbortError') definirConsulta({ estado: 'erro', curso: null, erro })
      })
    return () => controle.abort()
  }, [identificador, tentativa])

  useEffect(() => {
    if (consulta.curso) document.title = `${consulta.curso.nome} — Portal de Cursos`
  }, [consulta.curso])

  function selecionarAba(destino) {
    window.location.hash = `curso/${identificador}${destino === 'visao-geral' ? '' : `/${destino}`}`
  }
  function tentarNovamente() {
    definirConsulta({ estado: 'carregando', curso: null, erro: null })
    definirTentativa((valor) => valor + 1)
  }
  const aprovados = projetosPublicados.filter(
    (projeto) => projeto.identificadorCurso === identificador && projeto.status === 'Aprovado',
  )
  const { curso } = consulta

  return (
    <main id="conteudo" className="limite pagina-detalhe-curso">
      <nav className="detalhe-curso__caminho" aria-label="Você está aqui">
        <a href="#inicio">Início</a>
        <Icone nome="caminho-detalhe" />
        <a href="#cursos">Cursos</a>
        <Icone nome="caminho-detalhe" />
        <span aria-current="page">{curso?.sigla || 'Detalhes do curso'}</span>
      </nav>
      {consulta.estado === 'carregando' && <CarregamentoDetalhe />}
      {consulta.estado === 'erro' && (
        <section className="bloco-detalhe detalhe-curso__erro" role="alert">
          <h1>
            {consulta.erro.codigo === 404
              ? 'Curso não encontrado'
              : 'Não foi possível carregar o curso'}
          </h1>
          <p>
            {consulta.erro.codigo === 404
              ? 'O curso solicitado não está disponível no catálogo.'
              : 'Houve uma falha ao consultar as informações. Tente novamente.'}
          </p>
          <div>
            {consulta.erro.codigo !== 404 && (
              <button className="botao-primario" onClick={tentarNovamente}>
                Tentar novamente
              </button>
            )}
            <a className="botao-secundario" href="#cursos">
              Voltar aos cursos
            </a>
          </div>
        </section>
      )}
      {consulta.estado === 'pronto' && (
        <>
          <ResumoCurso curso={curso} />
          <AbasCurso
            selecionada={selecionada}
            selecionar={selecionarAba}
            totalProjetos={aprovados.length}
          />
          <div
            role="tabpanel"
            id={`painel-curso-${selecionada}`}
            aria-labelledby={`aba-curso-${selecionada}`}
            tabIndex={0}
          >
            {selecionada === 'visao-geral' && <VisaoGeral curso={curso} />}
            {selecionada === 'projetos' && <ProjetosCurso curso={curso} projetos={aprovados} />}
            {['grade-curricular', 'professores'].includes(selecionada) && (
              <InformacoesAcademicas curso={curso} aba={selecionada} />
            )}
          </div>
          <p className="detalhe-curso__nota">Informações acadêmicas do curso.</p>
        </>
      )}
    </main>
  )
}
