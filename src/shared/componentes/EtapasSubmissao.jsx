import './etapas-submissao.css'

const passos = [
  { titulo: 'Aluno', descricao: 'Prepara as informações e envia o projeto.' },
  {
    titulo: 'Professor orientador',
    descricao: 'Analisa o projeto e registra a avaliação inicial.',
  },
  {
    titulo: 'Coordenador do curso',
    descricao: 'Realiza a avaliação final e decide sobre a publicação.',
  },
]

export default function EtapasSubmissao({
  status,
  compact = false,
  vertical = false,
  enviadoEm = '',
  parecer = '',
}) {
  const concluido = ['Aprovado', 'Publicado'].includes(status)
  const atual = ['Aprovado pelo orientador', 'Aguardando Coordenação', 'Em análise'].includes(
    status,
  )
    ? 2
    : ['Aguardando Orientador', 'Recusado pelo orientador'].includes(status)
      ? 1
      : status === 'Publicação recusada'
        ? 2
        : status === 'Precisa de revisão'
          ? 0
          : 0
  const devolvido = [
    'Recusado pelo orientador',
    'Publicação recusada',
    'Precisa de revisão',
  ].includes(status)

  const classesLista = [
    'etapas',
    compact && 'etapas--compactas',
    vertical && 'etapas--vertical',
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <ol className={classesLista} aria-label="Fluxo de avaliação da submissão">
      {passos.map((passo, indice) => {
        const feito = concluido || indice < atual
        const emAndamento = !concluido && indice === atual
        const passoDevolvido = emAndamento && devolvido
        const estado = feito
          ? vertical
            ? 'Concluído'
            : 'Etapa concluída'
          : emAndamento
            ? devolvido
              ? vertical
                ? 'Devolvido'
                : 'Devolvido ao aluno'
              : indice === 0
                ? 'Em preparação'
                : 'Em avaliação'
            : vertical
              ? 'Aguardando'
              : 'Aguardando etapa anterior'

        const detalheReal = vertical
          ? indice === 0 && enviadoEm
            ? `Enviado em ${enviadoEm}`
            : passoDevolvido
              ? parecer || 'Aguardando ajustes'
              : ''
          : !compact
            ? passo.descricao
            : ''

        return (
          <li
            key={passo.titulo}
            className={`etapas__passo${
              feito
                ? ' etapas__passo--concluido'
                : passoDevolvido
                  ? ' etapas__passo--atual etapas__passo--devolvido'
                  : emAndamento
                    ? ' etapas__passo--atual'
                    : ''
            }`}
            aria-current={emAndamento ? 'step' : undefined}
          >
            <span className="etapas__marcador" aria-hidden="true">
              {feito ? '✓' : passoDevolvido ? '!' : indice + 1}
            </span>
            <div className="etapas__conteudo">
              <div className="etapas__cabecalho">
                <strong>{passo.titulo}</strong>
                <span className="etapas__estado">{estado}</span>
              </div>
              {detalheReal && <span className="etapas__descricao">{detalheReal}</span>}
            </div>
          </li>
        )
      })}
    </ol>
  )
}
