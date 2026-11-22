function esperar(intervalo, sinal) {
  return new Promise((resolve, reject) => {
    function cancelar() {
      clearTimeout(temporizador)
      reject(sinal.reason || new DOMException('Consulta cancelada.', 'AbortError'))
    }
    const temporizador = setTimeout(() => {
      sinal?.removeEventListener('abort', cancelar)
      resolve()
    }, intervalo)
    if (sinal?.aborted) cancelar()
    else sinal?.addEventListener('abort', cancelar, { once: true })
  })
}

export async function repetirConsulta(consultar, { metodo = 'GET', sinal, intervalo = 300 } = {}) {
  for (let tentativa = 0; ; tentativa += 1) {
    sinal?.throwIfAborted()
    try {
      return await consultar()
    } catch (falha) {
      const recuperavel = [0, 408, 429, 500, 502, 503, 504].includes(falha.status)
      if (metodo.toUpperCase() !== 'GET' || !recuperavel || tentativa >= 2 || sinal?.aborted) {
        throw falha
      }
      await esperar(intervalo * 2 ** tentativa, sinal)
    }
  }
}
