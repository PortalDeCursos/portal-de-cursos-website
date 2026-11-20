import { useState } from 'react'

export default function SituacaoEnvio({
  envio,
  tentarEncaminhamento,
  tentarArquivo,
  destinoPainel,
  temPendencias,
}) {
  const [confirmacoes, mudarConfirmacoes] = useState({})

  return (
    <section className="situacao-envio" aria-labelledby="titulo-situacao-envio">
      <h2 id="titulo-situacao-envio">Situação do envio</h2>
      {envio.projetoId && <p>Projeto cadastrado com o número {envio.projetoId}.</p>}
      {temPendencias && (
        <p role="status">
          Não feche esta página até concluir as etapas pendentes. Os arquivos selecionados ficam
          disponíveis para nova tentativa enquanto esta página estiver aberta.
        </p>
      )}
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
            {item.estado === 'incerto' && tentarArquivo && (
              <div>
                <a href={destinoPainel} target="_blank" rel="noreferrer">
                  Conferir anexos do projeto no painel em outra aba
                </a>
                <label className="situacao-envio__confirmacao">
                  <input
                    type="checkbox"
                    checked={Boolean(confirmacoes[indice])}
                    onChange={(evento) =>
                      mudarConfirmacoes((anteriores) => ({
                        ...anteriores,
                        [indice]: evento.target.checked,
                      }))
                    }
                  />
                  Conferi o painel e confirmo que este arquivo precisa ser reenviado.
                </label>
              </div>
            )}
            {['falhou', 'incerto', 'enviando'].includes(item.estado) && tentarArquivo && (
              <button
                type="button"
                className="botao-secundario"
                aria-label={`Tentar novamente o arquivo ${item.arquivo.name}`}
                disabled={
                  item.estado === 'enviando' || (item.estado === 'incerto' && !confirmacoes[indice])
                }
                onClick={() => {
                  const confirmou = Boolean(confirmacoes[indice])
                  mudarConfirmacoes((anteriores) => ({ ...anteriores, [indice]: false }))
                  tentarArquivo(indice, confirmou)
                }}
              >
                {item.estado === 'enviando' ? 'Enviando arquivo…' : 'Tentar novamente'}
              </button>
            )}
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
