import { useEffect, useState } from 'react'
import { buscarCoordenadorPorId } from '@/api/coordenadores.js'
import './visao-geral.css'

export default function VisaoGeral({ curso }) {
  const [coordenador, mudarCoordenador] = useState(null)

  useEffect(() => {
    let ativo = true
    const controle = new AbortController()
    mudarCoordenador(null)

    if (curso?.coordenadorId) {
      buscarCoordenadorPorId(null, curso.coordenadorId, controle.signal)
        .then((registro) => {
          if (!ativo) return
          const professor = registro?.professor
          mudarCoordenador({ nome: professor?.usuario?.nome, professorId: professor?.id })
        })
        .catch(() => {})
    }

    return () => {
      ativo = false
      controle.abort()
    }
  }, [curso?.coordenadorId])

  return (
    <section className="visao-curso" aria-labelledby="titulo-visao-geral">
      <div>
        <h2 id="titulo-visao-geral">Sobre o curso</h2>
        <p>{curso.descricao}</p>
      </div>

      {coordenador?.nome && coordenador.professorId && (
        <aside className="visao-curso__coordenador-bloco">
          <h3>Coordenação do curso</h3>
          <a
            href={`#professor/${coordenador.professorId || coordenador.id}`}
            aria-label={`Ver perfil de ${coordenador.nome}`}
          >
            <strong>{coordenador.nome}</strong>
            <span>Ver perfil docente</span>
          </a>
        </aside>
      )}
    </section>
  )
}
