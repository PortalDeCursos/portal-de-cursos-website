import Icone from '../../../../compartilhados/componentes/icone/Icone.jsx'
import Ligacao from '../../../../compartilhados/componentes/ligacao/Ligacao.jsx'
import '../../../../compartilhados/estilos/projetos.css'

function Documento({ destaque = false, ultimo = false }) {
  return <div className="ilustracao__documento"><Icone nome={destaque ? 'documento-destaque' : 'documento'} /><div className="ilustracao__linhas"><Icone nome="linha-longa" /><Icone nome="linha-media" />{!ultimo && <Icone nome="linha-curta" />}</div></div>
}

export default function DestaqueProjeto({ projeto }) {
  return <article className="destaque-projeto"><div className="destaque-projeto__topo"><span className="etiqueta">{projeto.tipo}</span><span className="situacao">Aprovado</span></div>
    <div><h2>{projeto.nome}</h2><p>Uma vitrine da formação e das produções acadêmicas.</p></div>
    <dl><div><dt>Curso</dt><dd>{projeto.cursoCompleto}</dd></div><div><dt>Autores</dt><dd>{projeto.autores}</dd></div><div><dt>Orientador</dt><dd>{projeto.orientador}</dd></div></dl>
    <div className="ilustracao" aria-hidden="true"><div className="ilustracao__rede"><Documento /><span className="ilustracao__conexao"><Icone nome="conexao" /><Icone nome="ponto" /></span><Documento destaque /><span className="ilustracao__conexao"><Icone nome="conexao" /><Icone nome="ponto" /></span><Documento ultimo /></div></div>
    <Ligacao destino={`#projeto/${projeto.identificador}`}>Conhecer este projeto</Ligacao>
  </article>
}
