import Icone from '../../../../compartilhados/componentes/icone/Icone.jsx'
import laboratorio from '../../../../recursos/imagens/laboratorio-formacao.png'
import './visao-geral.css'

export default function VisaoGeral({ curso }) {
  return <div className="visao-curso">
    <div className="visao-curso__introducao">
      <article className="bloco-detalhe visao-curso__apresentacao"><p className="visao-curso__rotulo">Matriz acadêmica · Formação</p><h2>{curso.tituloApresentacao || curso.nome}</h2>{(curso.apresentacao || [curso.descricao]).map(paragrafo => <p key={paragrafo}>{paragrafo}</p>)}<dl className="visao-curso__numeros"><div><dt>Duração da formação</dt><dd>{curso.duracao}</dd></div><div><dt>Áreas de estudo</dt><dd>{(curso.areas || []).length} eixos</dd></div><div><dt>Modalidade</dt><dd>{curso.modalidade}</dd></div></dl></article>
      <aside className="bloco-detalhe visao-curso__laboratorio"><figure><img src={laboratorio} alt="Estudantes trabalhando em computadores em um laboratório de tecnologia" /><figcaption>Ambiente de formação em tecnologia • imagem ilustrativa</figcaption></figure><div><h2>Infraestrutura computacional</h2><p>Espaços de aprendizagem para conectar fundamentos teóricos a projetos aplicados, desenvolvimento de software e experimentação tecnológica.</p></div></aside>
    </div>
    <div className="visao-curso__formacao">
      <section className="bloco-detalhe"><div className="visao-curso__titulo"><span><Icone nome="areas-detalhe" /></span><div><h2>Áreas principais de estudo</h2><p>Eixos temáticos desenvolvidos no ciclo formativo</p></div></div><ul className="visao-curso__areas">{(curso.areas || []).map(area => <li key={area.nome}><Icone nome={area.icone} /><div><h3>{area.nome}</h3><p>{area.descricao}</p></div></li>)}</ul></section>
      <section className="bloco-detalhe"><div className="visao-curso__titulo"><span><Icone nome="mercado-detalhe" /></span><div><h2>Atuação profissional e mercado</h2><p>Possibilidades de atuação ao longo da carreira</p></div></div><div className="visao-curso__atuacoes">{(curso.atuacoes || []).map(atuacao => <article key={atuacao.nome}><h3>{atuacao.nome}</h3><p>{atuacao.descricao}</p></article>)}</div><div className="visao-curso__pratica"><h3>Da formação à produção acadêmica</h3><p>Explore os projetos aprovados do curso e conheça trabalhos desenvolvidos pelos estudantes.</p><a href={`#curso/${curso.identificador}/projetos`}>Conhecer projetos do curso →</a></div></section>
    </div>
  </div>
}
