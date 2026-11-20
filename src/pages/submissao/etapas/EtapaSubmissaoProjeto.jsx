import EditorRico from '@/shared/componentes/EditorRico.jsx'
import { nomesTiposProjeto, tiposProjeto } from '../constantes.js'

export default function EtapaSubmissaoProjeto({ formulario, erros, alterar, erroDoCampo }) {
  return (
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
            data-testid="tipo-projeto-submissao"
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
            data-testid="titulo-projeto-submissao"
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
        <EditorRico
          id="campo-resumo"
          titulo="Resumo"
          ajuda="Apresente o problema, a proposta e o contexto do projeto em até 500 caracteres."
          placeholder="Ex.: O projeto busca resolver… Para isso, propõe…"
          valor={formulario.resumo}
          aoAlterar={(valor) => alterar('resumo', valor)}
          erro={erros.resumo}
          idErro={erroDoCampo('resumo')}
          alturaMinima={110}
          limite={500}
        />
        <EditorRico
          id="campo-objetivos"
          titulo="Objetivos e resultados"
          ajuda="Use verbos de ação e indique o que será feito e qual resultado poderá ser observado."
          placeholder="Ex.: Desenvolver…; avaliar…; entregar…"
          valor={formulario.objetivos}
          aoAlterar={(valor) => alterar('objetivos', valor)}
          erro={erros.objetivos}
          idErro={erroDoCampo('objetivos')}
          alturaMinima={130}
        />
        {formulario.tipo && (
          <EditorRico
            id="campo-informacoes-especificas"
            titulo={tiposProjeto[formulario.tipo].campoEspecifico}
            ajuda={
              formulario.tipo === 'Extensão'
                ? 'Indique o público atendido, as atividades, os parceiros e o impacto esperado.'
                : formulario.tipo === 'Pesquisa'
                  ? 'Descreva o método, a hipótese ou pergunta e como os resultados serão analisados.'
                  : formulario.tipo === 'TCC'
                    ? 'Explique o problema de pesquisa, a metodologia e os resultados esperados.'
                    : 'Liste os requisitos principais, delimite o escopo e explique a solução proposta.'
            }
            placeholder="Organize as informações em tópicos ou parágrafos curtos."
            valor={formulario.informacoesEspecificas}
            aoAlterar={(valor) => alterar('informacoesEspecificas', valor)}
            erro={erros.informacoesEspecificas}
            idErro={erroDoCampo('informacoesEspecificas')}
            alturaMinima={130}
          />
        )}
      </div>
    </section>
  )
}
