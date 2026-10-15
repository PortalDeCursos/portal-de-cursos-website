import Icone from '../../../../compartilhados/componentes/icone/Icone.jsx'

export default function ConviteSubmissao() {
  return (<section className="convite" aria-labelledby="titulo-convite"><div><p className="convite__rotulo"><Icone nome="pesquisa" />Produção acadêmica</p><h2 id="titulo-convite">Seu projeto também pode fazer parte.</h2><p>Envie sua produção acadêmica em PDF. Após a avaliação do orientador, os projetos aprovados ficam disponíveis para consulta pública.</p><small>Não é necessário ter uma conta para enviar.</small></div><a className="botao-primario" href="#submeter"><Icone nome="adicionar" />Submeter projeto</a></section>)
}
