const arquivos = import.meta.glob('../../assets/icones/*.svg', {
  eager: true,
  query: '?url',
  import: 'default',
})

export default function Icone({ nome, classe = '' }) {
  return (
    <img
      className={`icone icone--${nome} ${classe}`}
      src={arquivos[`../../assets/icones/${nome}.svg`]}
      alt=""
      aria-hidden="true"
    />
  )
}
