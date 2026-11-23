import { useEffect, useRef, useState } from 'react'
import { chamarApi, pegarBaseApi } from '@/api/cliente.js'

import { useFotoDaConta } from '@/shared/componentes/FotoDaConta.jsx'

export default function FotoPerfil({ usuario, token }) {
  const { foto, mudarFoto, estado, mudarEstado, repetir } = useFotoDaConta()
  const seletor = useRef(null)
  const [arquivo, mudarArquivo] = useState(null)
  const [imagem, mudarImagem] = useState('')
  const [erro, mudarErro] = useState('')
  const [mensagem, mudarMensagem] = useState('')
  const base = pegarBaseApi('usuarios') + '/fotos'
  const id = usuario.id

  useEffect(() => {
    const blob = arquivo ?? foto
    if (!blob) return
    const url = URL.createObjectURL(blob)
    mudarImagem(url)
    return () => URL.revokeObjectURL(url)
  }, [arquivo, foto])

  function selecionar(evento) {
    const escolhido = evento.target.files[0]
    evento.target.value = ''
    if (!escolhido) return
    mudarMensagem('')
    if (escolhido.type !== 'image/png' || escolhido.size > 1024 * 1024) {
      mudarErro('Escolha uma imagem PNG de até 1 MB.')
      return
    }
    mudarErro('')
    mudarArquivo(escolhido)
  }

  async function salvar() {
    if (!arquivo || estado !== 'pronto') return
    mudarEstado('salvando')
    mudarErro('')
    mudarMensagem('')
    const corpo = new FormData()
    corpo.append('usuarioId', String(id))
    corpo.append('foto', arquivo)
    try {
      await chamarApi(base, { token, corpo, metodo: foto ? 'PUT' : 'POST' })
      mudarFoto(arquivo)
      mudarArquivo(null)
      mudarMensagem('Foto de perfil salva.')
    } catch (falha) {
      mudarErro(falha.message || 'Não foi possível salvar a foto.')
    } finally {
      mudarEstado('pronto')
    }
  }

  return (
    <section className="perfil-foto" data-sem-revelacao aria-labelledby="titulo-foto-perfil">
      <div className="perfil-foto__avatar">
        {imagem ? (
          <img src={imagem} alt="Foto de perfil" />
        ) : (
          <span aria-hidden="true">{usuario.nome?.trim().charAt(0).toUpperCase() || '?'}</span>
        )}
      </div>
      <div>
        <h2 id="titulo-foto-perfil">Foto de perfil</h2>
        <p id="formato-foto">PNG de até 1 MB.</p>
        <input ref={seletor} type="file" accept="image/png" onChange={selecionar} hidden />
        <button
          type="button"
          aria-describedby="formato-foto"
          disabled={estado !== 'pronto'}
          onClick={() => seletor.current?.click()}
        >
          {arquivo ? 'Escolher outra foto' : foto ? 'Trocar foto' : 'Escolher foto'}
        </button>
        {arquivo && <p className="perfil-foto__arquivo">Prévia de {arquivo.name}</p>}
        {arquivo && (
          <div className="perfil-foto__acoes">
            <button
              className="botao-primario"
              type="button"
              onClick={salvar}
              disabled={estado !== 'pronto'}
            >
              {estado === 'salvando' ? 'Salvando…' : 'Salvar foto'}
            </button>
            <button
              type="button"
              disabled={estado === 'salvando'}
              onClick={() => {
                mudarArquivo(null)
                mudarErro('')
              }}
            >
              Cancelar
            </button>
          </div>
        )}
        <p role="status">{mensagem || (estado === 'carregando' && id ? 'Carregando foto…' : '')}</p>
        {(erro || estado === 'indisponivel' || !id) && (
          <p className="perfil-foto__erro" role="alert">
            {erro || 'Não foi possível carregar a foto.'}
          </p>
        )}
        {estado === 'indisponivel' && (
          <button
            type="button"
            onClick={() => {
              mudarEstado('carregando')
              repetir()
            }}
          >
            Tentar novamente
          </button>
        )}
      </div>
    </section>
  )
}
