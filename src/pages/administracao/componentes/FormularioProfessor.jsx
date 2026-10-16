import { useState } from 'react'

export default function FormularioProfessor({ aoSalvar, aoCancelar, ocupado, erro }) {
  const [dados, definirDados] = useState({
    nome: '',
    email: '',
    username: '',
    senha: '',
    cursoId: '',
    titulacao: 'MESTRADO',
    descricao: '',
  })
  const campos = [
    ['nome', 'Nome', 'text'],
    ['email', 'E-mail', 'email'],
    ['username', 'Nome de usuário', 'text'],
    ['senha', 'Senha inicial', 'password'],
    ['cursoId', 'ID do curso', 'number'],
  ]
  function campo(chave, valor) {
    definirDados((atual) => ({ ...atual, [chave]: valor }))
  }
  return (
    <form
      className="gestao-formulario"
      onSubmit={(evento) => {
        evento.preventDefault()
        aoSalvar({
          usuario: {
            nome: dados.nome.trim(),
            email: dados.email.trim(),
            username: dados.username.trim(),
            senha: dados.senha,
          },
          cursoId: Number(dados.cursoId),
          titulacao: dados.titulacao,
          descricao: dados.descricao.trim(),
        })
      }}
      aria-busy={ocupado}
    >
      <h2>Novo professor</h2>
      <div className="gestao-campos">
        {campos.map(([chave, rotulo, tipo]) => (
          <label key={chave}>
            {rotulo}
            <input
              type={tipo}
              required
              value={dados[chave]}
              onChange={(e) => campo(chave, e.target.value)}
              min={tipo === 'number' ? 1 : undefined}
              minLength={chave === 'senha' ? 8 : chave === 'username' ? 3 : undefined}
              maxLength={chave === 'email' ? 150 : chave === 'username' ? 50 : 100}
              autoComplete={chave === 'senha' ? 'new-password' : 'off'}
              disabled={ocupado}
            />
          </label>
        ))}
        <label>
          Titulação
          <select
            value={dados.titulacao}
            onChange={(e) => campo('titulacao', e.target.value)}
            disabled={ocupado}
          >
            {['GRADUACAO', 'ESPECIALIZACAO', 'MESTRADO', 'DOUTORADO', 'POS_DOUTORADO'].map(
              (valor) => (
                <option key={valor}>{valor}</option>
              ),
            )}
          </select>
        </label>
        <label className="gestao-campo-largo">
          Apresentação
          <textarea
            required
            maxLength={500}
            rows={3}
            value={dados.descricao}
            onChange={(e) => campo('descricao', e.target.value)}
            disabled={ocupado}
          />
        </label>
      </div>
      <p className="gestao-nota">
        Use o identificador numérico do curso cadastrado no serviço acadêmico.
      </p>
      {erro && (
        <p className="gestao-aviso" role="alert">
          {erro}
        </p>
      )}
      <div className="gestao-acoes">
        <button type="submit" className="botao-primario" disabled={ocupado}>
          {ocupado ? 'Cadastrando…' : 'Cadastrar professor'}
        </button>
        <button type="button" className="botao-secundario" onClick={aoCancelar} disabled={ocupado}>
          Cancelar
        </button>
      </div>
    </form>
  )
}
