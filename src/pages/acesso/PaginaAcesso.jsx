import { useEffect, useRef, useState } from 'react'
import { autenticarConta } from './servicos/autenticarConta.js'
import { basePortal } from '../../app/rotas.js'
import './acesso.css'
import logoPortal from '../../assets/marca/logo-portal.png'

export default function PaginaAcesso({
  aoEntrar,
  sessaoExpirada = false,
  tipoAcesso = 'PROFESSOR',
}) {
  const eAdmin = tipoAcesso === 'ADMIN'
  const [identificacao, definirIdentificacao] = useState('')
  const [senha, definirSenha] = useState('')
  const [mostrarSenha, definirMostrarSenha] = useState(false)
  const [enviando, definirEnviando] = useState(false)
  const [erro, definirErro] = useState('')
  const [erros, definirErros] = useState({})
  const requisicao = useRef(null)
  const campoIdentificacao = useRef(null)
  const campoSenha = useRef(null)
  const aviso = useRef(null)
  const ocupado = useRef(false)
  useEffect(() => () => requisicao.current?.abort(), [])

  async function entrar(evento) {
    evento.preventDefault()
    if (ocupado.current) return
    const invalidos = {}
    if (!identificacao.trim()) invalidos.identificacao = 'Informe seu e-mail.'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(identificacao.trim()))
      invalidos.identificacao = 'Informe um e-mail válido.'
    if (!senha) invalidos.senha = 'Informe sua senha.'
    definirErros(invalidos)
    definirErro('')
    if (Object.keys(invalidos).length) {
      if (invalidos.identificacao) campoIdentificacao.current.focus()
      else campoSenha.current.focus()
      return
    }
    ocupado.current = true
    definirEnviando(true)
    const controle = new AbortController()
    requisicao.current = controle
    const limite = window.setTimeout(() => controle.abort('tempo-esgotado'), 15000)
    try {
      const sessao = await autenticarConta(identificacao.trim(), senha, controle.signal)
      if (!controle.signal.aborted) {
        if (eAdmin && sessao.tipoUsuario !== 'ADMIN') {
          definirErro(
            'Esta conta possui perfil de Professor e não tem acesso administrativo. Utilize a Área do Professor.',
          )
          definirSenha('')
          window.requestAnimationFrame(() => aviso.current?.focus())
          return
        }
        definirSenha('')
        aoEntrar(sessao)
      }
    } catch (falha) {
      if (controle.signal.aborted && controle.signal.reason !== 'tempo-esgotado') return
      definirErro(
        controle.signal.aborted
          ? 'O serviço demorou para responder. Tente novamente.'
          : falha.message,
      )
      definirSenha('')
      window.requestAnimationFrame(() => aviso.current?.focus())
    } finally {
      window.clearTimeout(limite)
      ocupado.current = false
      if (requisicao.current === controle && !controle.signal.aborted) definirEnviando(false)
      if (controle.signal.reason === 'tempo-esgotado') definirEnviando(false)
    }
  }

  return (
    <main id="conteudo" className="limite pagina-acesso">
      <div
        className={`acesso-painel ${eAdmin ? 'acesso-painel--admin' : 'acesso-painel--professor'}`}
      >
        <aside
          className="acesso-identidade"
          aria-label={eAdmin ? 'Administração do Portal' : 'Área do Professor'}
        >
          <div className="acesso-marca">
            <span className="acesso-marca__simbolo">
              <img src={logoPortal} alt="" width="48" height="48" />
            </span>
            <span>{eAdmin ? 'Portal · Gestão' : 'Portal de Cursos'}</span>
          </div>
          <div className="acesso-identidade__mensagem">
            {eAdmin ? (
              <>
                <p>
                  Painel da <br />
                  Administração.
                </p>
                <span>Gestão institucional de cursos, docentes, projetos e configurações.</span>
              </>
            ) : (
              <>
                <p>
                  Área do <br />
                  Professor.
                </p>
                <span>
                  Um espaço dedicado para orientar ideias, avaliar submissões e acompanhar projetos.
                </span>
              </>
            )}
          </div>
          <span className="acesso-identidade__assinatura">
            {eAdmin ? 'Gestão · Governança · Coordenação' : 'Ensino · Projetos · Conhecimento'}
          </span>
        </aside>
        <section className="acesso-formulario" aria-labelledby="titulo-entrar">
          <div className="acesso-cabecalho-form">
            <span className="acesso-distintivo">
              {eAdmin ? 'Acesso Administrativo' : 'Área Docente'}
            </span>
            <h1 id="titulo-entrar">{eAdmin ? 'Acesso Administrativo' : 'Área do Professor'}</h1>
            <p>
              {eAdmin
                ? 'Entre com suas credenciais de gestão institucional.'
                : 'Entre com seu e-mail institucional de professor.'}
            </p>
          </div>
          {sessaoExpirada && (
            <p className="acesso-aviso" role="status">
              Sua sessão expirou. Entre novamente para continuar.
            </p>
          )}
          <form onSubmit={entrar} noValidate aria-busy={enviando}>
            <div className="acesso-campo">
              <label htmlFor="identificacao">E-mail</label>
              <input
                ref={campoIdentificacao}
                id="identificacao"
                type="email"
                inputMode="email"
                name="username"
                autoComplete="username"
                value={identificacao}
                onChange={(e) => definirIdentificacao(e.target.value)}
                autoCapitalize="none"
                spellCheck={false}
                required
                maxLength={254}
                readOnly={enviando}
                aria-invalid={Boolean(erros.identificacao)}
                aria-describedby={erros.identificacao ? 'erro-identificacao' : undefined}
              />
              {erros.identificacao && (
                <p className="acesso-erro-campo" id="erro-identificacao">
                  {erros.identificacao}
                </p>
              )}
            </div>
            <div className="acesso-campo">
              <label htmlFor="senha">Senha</label>
              <div className="acesso-senha">
                <input
                  ref={campoSenha}
                  id="senha"
                  name="password"
                  type={mostrarSenha ? 'text' : 'password'}
                  autoComplete="current-password"
                  value={senha}
                  onChange={(e) => definirSenha(e.target.value)}
                  required
                  readOnly={enviando}
                  aria-invalid={Boolean(erros.senha)}
                  aria-describedby={erros.senha ? 'erro-senha' : undefined}
                />
                <button
                  type="button"
                  onClick={() => definirMostrarSenha(!mostrarSenha)}
                  aria-controls="senha"
                  aria-pressed={mostrarSenha}
                  aria-label="Mostrar senha"
                >
                  {mostrarSenha ? 'Ocultar' : 'Mostrar'}
                </button>
              </div>
              {erros.senha && (
                <p className="acesso-erro-campo" id="erro-senha">
                  {erros.senha}
                </p>
              )}
            </div>
            {erro && (
              <p ref={aviso} className="acesso-aviso" role="alert" tabIndex={-1}>
                {erro}
              </p>
            )}
            <button className="botao-primario acesso-entrar" type="submit" disabled={enviando}>
              {enviando
                ? 'Entrando…'
                : eAdmin
                  ? 'Entrar na Administração'
                  : 'Entrar como Professor'}
            </button>
            <span className="somente-leitores" role="status">
              {enviando ? 'Verificando seus dados de acesso.' : ''}
            </span>
          </form>
          <div className="acesso-voltar-portal">
            <a href={basePortal} className="acesso-voltar-link">
              ← Voltar ao Portal de Cursos
            </a>
          </div>
          <p className="acesso-ajuda">
            {eAdmin
              ? 'Dúvidas sobre privilégios de acesso? Consulte a equipe técnica.'
              : 'Precisa de ajuda? Procure a coordenação ou a administração do portal.'}
          </p>
        </section>
      </div>
    </main>
  )
}
