import { useState } from 'react'

export default function SituacaoEnvio({
  envio,
  tentarEncaminhamento,
  tentarArquivo,
  destinoPainel,
  temPendencias,
  compacto = false,
}) {
  const [confirmacoes, mudarConfirmacoes] = useState({})

  const listaEtapas = (
    <ul className="situacao-envio__lista">
      <li data-estado={envio.cadastro.estado}>
        <strong>Cadastro</strong>
        <p role="status">{envio.cadastro.mensagem}</p>
      </li>
      <li data-estado={envio.encaminhamento.estado}>
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
        <li key={indice} data-estado={item.estado}>
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
      <li data-estado={envio.notificacao.estado}>
        <strong>Notificação</strong>
        <p role="status">{envio.notificacao.mensagem}</p>
      </li>
    </ul>
  )

  return (
    <section
      className={compacto ? 'situacao-envio situacao-envio--compacta' : 'situacao-envio'}
      aria-labelledby="titulo-situacao-envio"
    >
      <h2 id="titulo-situacao-envio" className={compacto ? 'somente-leitores' : undefined}>
        Situação do envio
      </h2>
      {!compacto && envio.projetoId && (
        <p className="situacao-envio__projeto">Projeto nº {envio.projetoId}</p>
      )}
      {compacto && envio.notificacao.estado === 'falhou' && (
        <p className="situacao-envio__aviso" role="status">
          Seu projeto está salvo. O aviso por e-mail não foi confirmado. Acompanhe pelo painel.
        </p>
      )}
      {temPendencias && (
        <p role="status">
          Não feche esta página até concluir as etapas pendentes. Os arquivos selecionados ficam
          disponíveis para nova tentativa enquanto esta página estiver aberta.
        </p>
      )}
      {compacto ? (
        <details className="situacao-envio__detalhes" open={Boolean(temPendencias)}>
          <summary>Detalhes do envio</summary>
          <p className="situacao-envio__projeto">Projeto nº {envio.projetoId}</p>
          {listaEtapas}
        </details>
      ) : (
        listaEtapas
      )}
    </section>
  )
}
