import { useState } from 'react'
import Icone from '../../../../shared/components/icon/Icone.jsx'
import ItemProjeto from '../../../../shared/components/project-item/ItemProjeto.jsx'
import './projetos-curso.css'

const tipos = ['Todos', 'TCC', 'Projeto integrador', 'Pesquisa', 'Extensão']

export default function ProjetosCurso({ curso, projetos }) {
  const [tipo, definirTipo] = useState('Todos')
  const publicados = projetos.filter((projeto) => tipo === 'Todos' || projeto.tipo === tipo)

  return (
    <div className="projetos-curso">
      <div className="projetos-curso__cabecalho">
        <div>
          <h2>Repositório de produções do curso</h2>
          <p>Produção científica, monográfica e tecnológica de estudantes orientados.</p>
        </div>
        <div className="projetos-curso__tipos" role="group" aria-label="Filtrar projetos por tipo">
          {tipos.map((opcao) => (
            <button key={opcao} aria-pressed={tipo === opcao} onClick={() => definirTipo(opcao)}>
              {opcao}
              {opcao === 'Todos' && <span>{projetos.length}</span>}
            </button>
          ))}
        </div>
      </div>
      <p className="projetos-curso__aviso">
        <Icone nome="aviso-projetos-detalhe" />
        Apenas produções aceitas pelo orientador e aprovadas pelo coordenador ficam disponíveis para
        consulta pública.
      </p>
      <p className="somente-leitores" role="status" aria-live="polite">
        {publicados.length} projetos encontrados.
      </p>
      {publicados.length ? (
        <div className="lista-projetos">
          {publicados.map((projeto) => (
            <ItemProjeto key={projeto.identificador} projeto={projeto} />
          ))}
        </div>
      ) : (
        <section className="projetos-curso__vazio" aria-labelledby="titulo-projetos-vazios">
          <span className="projetos-curso__simbolo">
            <Icone nome="vazio-projetos-detalhe" />
          </span>
          <h3 id="titulo-projetos-vazios">
            Nenhum projeto publicado para este curso no momento
            {tipo !== 'Todos' && <small>Tipo selecionado: {tipo}</small>}
          </h3>
          <p>
            Os trabalhos acadêmicos de estudantes de {curso.sigla} serão exibidos aqui após a
            avaliação do orientador e a aprovação do coordenador.
          </p>
          <div className="projetos-curso__acoes">
            <a className="botao-secundario" href="#biblioteca">
              <Icone nome="biblioteca-detalhe" />
              Conhecer biblioteca geral de projetos
            </a>
            <a className="botao-primario" href="#submeter">
              <Icone nome="submeter-detalhe" />
              Submeter um projeto
            </a>
          </div>
          {tipo !== 'Todos' && (
            <button className="projetos-curso__redefinir" onClick={() => definirTipo('Todos')}>
              Mostrar todos os tipos
            </button>
          )}
        </section>
      )}
      <div className="projetos-curso__orientacoes">
        {[
          [
            'criterios-detalhe',
            'Critérios de publicação',
            'Os projetos de alunos seguem pelo orientador e pelo coordenador; envios de professores seguem direto ao coordenador.',
          ],
          [
            'diretrizes-detalhe',
            'Diretrizes de submissão',
            'Informe os autores, curso, orientador e disciplinas relacionadas e anexe o trabalho em PDF.',
          ],
          [
            'duvidas-detalhe',
            'Dúvidas frequentes',
            'Estudantes e professores podem compartilhar trabalhos de conclusão, projetos integradores, de pesquisa e de extensão.',
          ],
        ].map(([icone, titulo, texto]) => (
          <article className="bloco-detalhe" key={titulo}>
            <span>
              <Icone nome={icone} />
            </span>
            <h3>{titulo}</h3>
            <p>{texto}</p>
          </article>
        ))}
      </div>
    </div>
  )
}
