import { useCallback, useEffect, useRef, useState } from 'react'

export function useConsulta(buscar, dependencias = [], { ativo = true } = {}) {
  const [dados, definirDados] = useState(null)
  const [carregando, definirCarregando] = useState(ativo)
  const [erro, definirErro] = useState('')
  const [versao, definirVersao] = useState(0)
  const buscarRef = useRef(buscar)
  buscarRef.current = buscar

  const recarregar = useCallback(() => {
    definirVersao((v) => v + 1)
  }, [])

  const chaveDependencias = JSON.stringify(dependencias)

  useEffect(() => {
    if (!ativo) {
      definirCarregando(false)
      return
    }
    const controle = new AbortController()
    definirCarregando(true)
    definirErro('')

    Promise.resolve(buscarRef.current(controle.signal))
      .then((resultado) => {
        if (!controle.signal.aborted) definirDados(resultado)
      })
      .catch((falha) => {
        if (falha?.name === 'AbortError' || controle.signal.aborted) return
        definirErro(falha?.message || 'Não foi possível carregar os dados agora.')
      })
      .finally(() => {
        if (!controle.signal.aborted) definirCarregando(false)
      })

    return () => controle.abort()
  }, [ativo, versao, chaveDependencias])

  return { dados, carregando, erro, recarregar }
}
