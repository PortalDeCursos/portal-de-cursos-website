import { useEffect, useRef, useState } from 'react'
import { basePortal } from '../../app/rotas.js'
import logoPortal from '../../assets/marca/logo-portal.png'
import { api } from '../../api/index.js'
import '../acesso/acesso.css'
import './cadastro-aluno.css'

export default function PaginaCadastroAluno() {
  const [cursosDisponiveis, definirCursosDisponiveis] = useState([])
  const [carregandoCursos, definirCarregandoCursos] = useState(true)
  const [erroCursos, definirErroCursos] = useState('')
  const [form, definirForm] = useState({
    nome: '',
    email: '',
    curso: '',
    senha: '',
    confirmarSenha: '',
  })
  const [erros, definirErros] = useState({})
  const [erro, definirErro] = useState('')
  const [enviando, definirEnviando] = useState(false)
  const [mostrarSenha, definirMostrarSenha] = useState(false)
  const resumoErros = useRef(null)

  useEffect(() => {
    const controller = new AbortController()
    api.cursos
      .listar(controller.signal)
      .then(definirCursosDisponiveis)
      .catch(() => {
        if (!controller.signal.aborted) definirErroCursos('Não foi possível carregar os cursos agora.')
      })
      .finally(() => {
        if (!controller.signal.aborted) definirCarregandoCursos(false)
      })
    return () => controller.abort()
  }, [])

  function alterar(campo, valor) {
    definirForm((anterior) => ({ ...anterior, [campo]: valor }))
    definirErros((anteriores) => ({ ...anteriores, [campo]: undefined }))
    definirErro('')
  }

  function validar() {
    const novosErros = {}
    if (!form.nome.trim()) novosErros.nome = 'Informe seu nome completo.'
    if (!form.email.trim()) novosErros.email = 'Informe seu e-mail.'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim()))
      novosErros.email = 'Informe um e-mail válido.'
    if (!form.curso) novosErros.curso = 'Selecione o seu curso.'
    if (!form.senha) novosErros.senha = 'Defina uma senha.'
    else if (form.senha.length < 6) novosErros.senha = 'A senha deve ter pelo menos 6 caracteres.'
    if (!form.confirmarSenha) novosErros.confirmarSenha = 'Confirme sua senha.'
    else if (form.senha !== form.confirmarSenha)
      novosErros.confirmarSenha = 'As senhas não coincidem.'
    return novosErros
  }

  async function cadastrar(evento) {
    evento.preventDefault()
    const novosErros = validar()
    if (Object.keys(novosErros).length) {
      definirErros(novosErros)
      definirErro('Revise os campos destacados para continuar.')
      window.requestAnimationFrame(() => resumoErros.current?.focus())
      return
    }
    definirEnviando(true)
    definirErro(
      'O cadastro de alunos ainda não está conectado ao serviço de contas. Seus dados não foram enviados nem uma conta foi criada.',
    )
    definirEnviando(false)
    window.requestAnimationFrame(() => resumoErros.current?.focus())
  }

  return (
    <main id="conteudo" className="limite pagina-acesso">
      <div className="acesso-painel acesso-painel--unificado">
        <aside className="acesso-identidade" aria-label="Portal de Cursos">
          <div className="acesso-marca">
            <span className="acesso-marca__simbolo">
              <img src={logoPortal} alt="" width="48" height="48" />
            </span>
            <span>Portal de Cursos</span>
          </div>
          <div className="acesso-identidade__mensagem">
            <p>
              Sua jornada. <br />
              Seus projetos.
            </p>
            <span>Registre sua produção acadêmica e acompanhe cada etapa da avaliação.</span>
          </div>
          <span className="acesso-identidade__assinatura">
            Produção · Conhecimento · Publicação
          </span>
        </aside>
        <section className="acesso-formulario" aria-labelledby="titulo-cadastro">
          <div className="acesso-cabecalho-form">
            <span className="acesso-distintivo">Cadastro de aluno</span>
            <h1 id="titulo-cadastro">Crie sua conta</h1>
            <p>Informe seus dados para acompanhar e enviar projetos pelo portal.</p>
          </div>
          {erro && (
            <p ref={resumoErros} className="acesso-aviso" role="alert" tabIndex={-1}>
              {erro}
            </p>
          )}
          <form onSubmit={cadastrar} noValidate aria-busy={enviando}>
            <div className="acesso-campo">
              <label htmlFor="aluno-nome">Nome completo</label>
              <input
                id="aluno-nome"
                type="text"
                autoComplete="name"
                value={form.nome}
                onChange={(e) => alterar('nome', e.target.value)}
                required
                maxLength={120}
                readOnly={enviando}
                aria-invalid={Boolean(erros.nome)}
                aria-describedby={erros.nome ? 'erro-aluno-nome' : undefined}
                placeholder="Seu nome completo"
              />
              {erros.nome && (
                <p className="acesso-erro-campo" id="erro-aluno-nome">
                  {erros.nome}
                </p>
              )}
            </div>
            <div className="acesso-campo">
              <label htmlFor="aluno-email">E-mail</label>
              <input
                id="aluno-email"
                type="email"
                inputMode="email"
                autoComplete="email"
                value={form.email}
                onChange={(e) => alterar('email', e.target.value)}
                required
                maxLength={254}
                readOnly={enviando}
                aria-invalid={Boolean(erros.email)}
                aria-describedby={erros.email ? 'erro-aluno-email' : undefined}
                placeholder="voce@email.com"
              />
              {erros.email && (
                <p className="acesso-erro-campo" id="erro-aluno-email">
                  {erros.email}
                </p>
              )}
            </div>
            <div className="acesso-campo">
              <label htmlFor="aluno-curso">Curso</label>
              <select
                id="aluno-curso"
                value={form.curso}
                onChange={(e) => alterar('curso', e.target.value)}
                required
                disabled={enviando || carregandoCursos || !cursosDisponiveis.length}
                aria-invalid={Boolean(erros.curso)}
                aria-describedby={erros.curso ? 'erro-aluno-curso' : undefined}
              >
                <option value="">{carregandoCursos ? 'Carregando cursos…' : 'Selecione seu curso'}</option>
                {cursosDisponiveis.map((c) => (
                  <option key={c.id} value={String(c.id)}>
                    {c.nome}{c.sigla ? ` · ${c.sigla}` : ''}
                  </option>
                ))}
              </select>
              {erroCursos && <p className="acesso-erro-campo" role="status">{erroCursos}</p>}
              {erros.curso && (
                <p className="acesso-erro-campo" id="erro-aluno-curso">
                  {erros.curso}
                </p>
              )}
            </div>
            <div className="acesso-campo">
              <label htmlFor="aluno-senha">Senha</label>
              <div className="acesso-senha">
                <input
                  id="aluno-senha"
                  name="password"
                  type={mostrarSenha ? 'text' : 'password'}
                  autoComplete="new-password"
                  value={form.senha}
                  onChange={(e) => alterar('senha', e.target.value)}
                  required
                  readOnly={enviando}
                  aria-invalid={Boolean(erros.senha)}
                  aria-describedby={erros.senha ? 'erro-aluno-senha' : undefined}
                />
                <button
                  type="button"
                  onClick={() => definirMostrarSenha(!mostrarSenha)}
                  aria-controls="aluno-senha"
                  aria-pressed={mostrarSenha}
                  aria-label="Mostrar senha"
                >
                  {mostrarSenha ? 'Ocultar' : 'Mostrar'}
                </button>
              </div>
              {erros.senha && (
                <p className="acesso-erro-campo" id="erro-aluno-senha">
                  {erros.senha}
                </p>
              )}
            </div>
            <div className="acesso-campo">
              <label htmlFor="aluno-confirmar-senha">Confirmar senha</label>
              <input
                id="aluno-confirmar-senha"
                type={mostrarSenha ? 'text' : 'password'}
                autoComplete="new-password"
                value={form.confirmarSenha}
                onChange={(e) => alterar('confirmarSenha', e.target.value)}
                required
                readOnly={enviando}
                aria-invalid={Boolean(erros.confirmarSenha)}
                aria-describedby={erros.confirmarSenha ? 'erro-aluno-confirmar-senha' : undefined}
              />
              {erros.confirmarSenha && (
                <p className="acesso-erro-campo" id="erro-aluno-confirmar-senha">
                  {erros.confirmarSenha}
                </p>
              )}
            </div>
            <button
              id="btn-cadastrar-aluno"
              className="botao-primario acesso-entrar"
              type="submit"
              disabled={enviando}
            >
              {enviando ? 'Criando conta…' : 'Criar conta'}
            </button>
            <span className="somente-leitores" role="status">
              {enviando ? 'Criando sua conta, aguarde.' : ''}
            </span>
          </form>
          <div className="acesso-voltar-portal">
            <a href={`${basePortal}#inicio`} className="acesso-voltar-link">
              ← Voltar ao Portal de Cursos
            </a>
          </div>
          <p className="acesso-ajuda">
            Já possui uma conta? <a href={`${basePortal}login`}>Acesse o portal</a>.
          </p>
        </section>
      </div>
    </main>
  )
}
