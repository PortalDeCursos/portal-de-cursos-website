import { useCallback, useRef, useState } from 'react'

export function useAcao(executar) {
  const [enviando, definirEnviando] = useState(false)
  const [erro, definirErro] = useState('')
  const emAndamento = useRef(false)

  const disparar = useCallback(
    async (...args) => {
      if (emAndamento.current) return null
      emAndamento.current = true
      definirEnviando(true)
      definirErro('')
      try {
        return await executar(...args)
      } catch (falha) {
        definirErro(falha?.message || 'Não foi possível concluir esta ação agora.')
        throw falha
      } finally {
        emAndamento.current = false
        definirEnviando(false)
      }
    },
    [executar],
  )

  const limparErro = useCallback(() => definirErro(''), [])

  return { disparar, enviando, erro, limparErro }
}
