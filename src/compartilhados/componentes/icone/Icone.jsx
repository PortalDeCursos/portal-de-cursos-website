const arquivos = import.meta.glob('../../../recursos/icones/*.svg', { eager: true, query: '?url', import: 'default' })

export default function Icone({ nome, classe = '' }) {
  return <img className={`icone icone--${nome} ${classe}`} src={arquivos[`../../../recursos/icones/${nome}.svg`]} alt="" aria-hidden="true" />
}
