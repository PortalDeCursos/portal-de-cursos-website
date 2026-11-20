export default function SituacaoEnvio({ envio, tentarEncaminhamento }) {
  return (
    <section className="situacao-envio" aria-labelledby="titulo-situacao-envio">
      <h2 id="titulo-situacao-envio">Situação do envio</h2>
      {envio.projetoId && <p>Projeto cadastrado com o número {envio.projetoId}.</p>}
      <ul className="situacao-envio__lista">
        <li>
          <strong>Cadastro</strong>
          <p role="status">{envio.cadastro.mensagem}</p>
        </li>
        <li>
          <strong>Encaminhamento</strong>
          <p role="status">{envio.encaminhamento.mensagem}</p>
          {['falhou', 'enviando'].includes(envio.encaminhamento.estado) && tentarEncaminhamento && (
            <button
              type="button"
              className="botao-secundario"
              aria-label="Tentar novamente o encaminhamento"
              disabled={envio.encaminhamento.estado === 'enviando'}
              onClick={tentarEncaminhamento}
            >
              {envio.encaminhamento.estado === 'enviando'
                ? 'Conferindo encaminhamento…'
                : 'Tentar novamente'}
            </button>
          )}
        </li>
        {envio.arquivos.map((item, indice) => (
          <li key={indice}>
            <strong>{item.arquivo.name}</strong>
            <p role="status">{item.mensagem}</p>
          </li>
        ))}
        <li>
          <strong>Notificação</strong>
          <p role="status">{envio.notificacao.mensagem}</p>
        </li>
      </ul>
    </section>
  )
}
