import Icone from '../icon/Icone.jsx'

export default function Ligacao({ destino, children, classe = '', icone = 'seta' }) {
  return (
    <a className={`ligacao ${classe}`} href={destino}>
      {children}
      <Icone nome={icone} />
    </a>
  )
}
