import { createContext, useContext, useEffect, useState } from 'react'
import { buscarFotoUsuario } from '@/api/fotos.js'

const ContextoFoto = createContext(null)

export function FotosDaSessao({ sessao, children }) {
  const usuario = sessao?.usuario
  const token = sessao?.token
  const id = usuario?.id
  const [foto, mudarFoto] = useState(null)
  const [url, mudarUrl] = useState('')
  const [estado, mudarEstado] = useState('carregando')
  const [tentativa, mudarTentativa] = useState(0)

  useEffect(() => {
    if (!id || !token) return
    const controle = new AbortController()
    buscarFotoUsuario(id, controle.signal, token)
      .then((imagem) => {
        if (controle.signal.aborted) return
        mudarFoto(imagem)
        mudarEstado('pronto')
      })
      .catch((erro) => {
        if (!controle.signal.aborted) mudarEstado(erro.status === 404 ? 'pronto' : 'indisponivel')
      })
    return () => controle.abort()
  }, [id, token, tentativa])

  useEffect(() => {
    if (!foto) return
    const endereco = URL.createObjectURL(foto)
    mudarUrl(endereco)
    return () => URL.revokeObjectURL(endereco)
  }, [foto])

  return (
    <ContextoFoto.Provider
      value={{
        usuario,
        foto,
        url,
        mudarFoto,
        estado,
        mudarEstado,
        repetir: () => mudarTentativa((n) => n + 1),
      }}
    >
      {children}
    </ContextoFoto.Provider>
  )
}

export function useFotoDaConta() {
  return useContext(ContextoFoto)
}

export function Retrato({ usuarioId, email, children }) {
  const conta = useFotoDaConta()
  const titular = conta?.usuario
  const mesmaConta =
    usuarioId != null
      ? String(usuarioId) === String(titular?.id)
      : email?.trim() && email.trim().toLowerCase() === titular?.email?.trim().toLowerCase()
  return mesmaConta && conta?.url ? (
    <img className="retrato-conta" src={conta.url} alt="" />
  ) : (
    children
  )
}
